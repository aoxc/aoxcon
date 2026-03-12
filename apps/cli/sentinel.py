import hashlib
import json
import os
import shlex
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import click
import requests
from requests import Response
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()


ASCII_LOGO = r"""
   █████╗  ██████╗ ██╗  ██╗ ██████╗ ██████╗ ███╗   ██╗
  ██╔══██╗██╔═══██╗╚██╗██╔╝██╔════╝██╔═══██╗████╗  ██║
  ███████║██║   ██║ ╚███╔╝ ██║     ██║   ██║██╔██╗ ██║
  ██╔══██║██║   ██║ ██╔██╗ ██║     ██║   ██║██║╚██╗██║
  ██║  ██║╚██████╔╝██╔╝ ██╗╚██████╗╚██████╔╝██║ ╚████║
  ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝
"""


@dataclass(frozen=True)
class SentinelConfig:
    backend_url: str
    sentinel_token: str
    strict_mode: bool
    audit_log_path: Path
    role: str


def load_config() -> SentinelConfig:
    backend_url = os.getenv("AOXC_SENTINEL_URL", "http://localhost:5000/api/v1").rstrip("/")
    strict_mode = os.getenv("AOXC_STRICT_MODE", "1") != "0"
    token = os.getenv("AOXC_SENTINEL_TOKEN", "")
    role = os.getenv("AOXC_ROLE", "observer")
    log_path = Path(os.getenv("AOXC_AUDIT_LOG", "./apps/cli/.sentinel_audit.log"))
    return SentinelConfig(
        backend_url=backend_url,
        sentinel_token=token,
        strict_mode=strict_mode,
        audit_log_path=log_path,
        role=role,
    )


CFG = load_config()

ROLE_PERMISSIONS = {
    "observer": {"status", "preflight", "audit", "repos", "help-center", "logo"},
    "operator": {"status", "preflight", "audit", "dispatch", "repos", "prompt", "shell", "help-center", "logo"},
    "admin": {"*"},
}

DANGEROUS_ACTIONS = {"drain", "upgrade-admin", "raw-exec", "delete-repo", "force-sign"}


class AuditChain:
    def __init__(self, path: Path):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def _last_hash(self) -> str:
        if not self.path.exists() or self.path.stat().st_size == 0:
            return "GENESIS"
        with self.path.open("rb") as fh:
            lines = fh.read().splitlines()
            if not lines:
                return "GENESIS"
            try:
                payload = json.loads(lines[-1].decode("utf-8"))
            except Exception:
                return "CORRUPT"
            return payload.get("entry_hash", "CORRUPT")

    def append(self, event: str, detail: Dict[str, Any]) -> None:
        previous = self._last_hash()
        entry = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "event": event,
            "detail": detail,
            "prev_hash": previous,
        }
        canonical = json.dumps(entry, sort_keys=True, separators=(",", ":")).encode("utf-8")
        entry["entry_hash"] = hashlib.sha256(canonical).hexdigest()
        with self.path.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(entry, ensure_ascii=False) + "\n")


AUDIT = AuditChain(CFG.audit_log_path)


def require_permission(command_name: str) -> None:
    allowed = ROLE_PERMISSIONS.get(CFG.role, set())
    if "*" not in allowed and command_name not in allowed:
        AUDIT.append("authz_denied", {"role": CFG.role, "command": command_name})
        raise click.ClickException(
            f"Role '{CFG.role}' cannot run '{command_name}'. Set AOXC_ROLE=operator/admin when authorized."
        )


def masked_token(token: str) -> str:
    if not token:
        return "not-set"
    if len(token) < 8:
        return "***"
    return f"{token[:3]}...{token[-3:]}"


def build_headers() -> Dict[str, str]:
    headers = {"Content-Type": "application/json", "User-Agent": "aoxcon-sentinel/3.0"}
    if CFG.sentinel_token:
        headers["x-sentinel-token"] = CFG.sentinel_token
    return headers


def call_backend(method: str, path: str, payload: Optional[Dict[str, Any]] = None, timeout: int = 10) -> Response:
    url = f"{CFG.backend_url}{path}"
    session = requests.Session()
    try:
        if method == "GET":
            response = session.get(url, headers=build_headers(), timeout=timeout)
        else:
            response = session.post(url, headers=build_headers(), data=json.dumps(payload or {}), timeout=timeout)
    except requests.RequestException as exc:
        AUDIT.append("request_error", {"method": method, "path": path, "error": str(exc)})
        raise click.ClickException(f"Backend unreachable: {exc}") from exc

    AUDIT.append("request", {"method": method, "path": path, "status": response.status_code})
    return response


def print_banner() -> None:
    console.print(
        Panel.fit(
            f"[bold cyan]{ASCII_LOGO}[/bold cyan]\n"
            "[bold white]AOXC Sentinel CLI / Mainnet Hardened Console[/bold white]\n"
            f"Backend: [green]{CFG.backend_url}[/green]  |  Role: [magenta]{CFG.role}[/magenta]  |  Strict: [yellow]{CFG.strict_mode}[/yellow]\n"
            f"Token: [blue]{masked_token(CFG.sentinel_token)}[/blue]  |  AuditLog: [white]{CFG.audit_log_path}[/white]",
            title="NEURAL OPERATIONS TERMINAL",
            border_style="bright_blue",
        )
    )


@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx: click.Context) -> None:
    """AOXC ultra-operational CLI with role controls, audit chain, and interactive command console."""
    if ctx.invoked_subcommand is None:
        print_banner()
        console.print("[bold]Hızlı başlangıç:[/bold] sentinel.py help-center")


@cli.command(name="logo")
def logo_cmd() -> None:
    """Render startup logo and active runtime profile."""
    require_permission("logo")
    print_banner()


@cli.command()
def status() -> None:
    """Check backend health and show operational endpoint state."""
    require_permission("status")
    resp = call_backend("GET", "/health", timeout=8)
    if not resp.ok:
        raise click.ClickException(f"Health check failed ({resp.status_code}): {resp.text[:200]}")

    data = resp.json()
    table = Table(title="AOXC Mainnet Status")
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="white")
    table.add_row("status", str(data.get("status", "unknown")))
    table.add_row("service", str(data.get("service", "sentinel-api")))
    table.add_row("version", str(data.get("version", "v1")))
    table.add_row("backend", CFG.backend_url)
    table.add_row("strict_mode", str(CFG.strict_mode))
    table.add_row("role", CFG.role)
    console.print(table)


@cli.command()
def preflight() -> None:
    """Run one-shot operator preflight for backend readiness and auth wiring."""
    require_permission("preflight")
    table = Table(title="AOXC Preflight / Security")
    table.add_column("Check", style="cyan")
    table.add_column("Result", style="white")

    table.add_row("Backend URL", CFG.backend_url)
    table.add_row("Token configured", "yes" if CFG.sentinel_token else "no")
    table.add_row("Token masked", masked_token(CFG.sentinel_token))
    table.add_row("Role", CFG.role)
    table.add_row("Strict mode", str(CFG.strict_mode))
    table.add_row("Audit log", str(CFG.audit_log_path))

    try:
        resp = call_backend("GET", "/health", timeout=10)
        table.add_row("Health endpoint", f"{resp.status_code} ({'ok' if resp.ok else 'fail'})")
    except click.ClickException as exc:
        table.add_row("Health endpoint", f"fail ({exc})")

    console.print(table)


@cli.command()
@click.argument("tx_hash")
@click.option("--context", default="", help="Optional context text for AI analysis")
def audit(tx_hash: str, context: str) -> None:
    """Run AI-assisted audit for a transaction hash against backend sentinel service."""
    require_permission("audit")
    payload = {"prompt": f"Audit transaction {tx_hash}", "context": context}
    resp = call_backend("POST", "/sentinel/analyze", payload=payload, timeout=12)
    if not resp.ok:
        raise click.ClickException(f"Audit failed ({resp.status_code}): {resp.text[:250]}")

    data = resp.json()
    table = Table(title="Sentinel Analysis")
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="white")
    for key in ["risk", "action", "reason", "provider"]:
        table.add_row(key, str(data.get(key)))
    console.print(table)


@cli.command()
@click.argument("target")
@click.argument("action")
@click.option("--payload", default="{}", help="JSON payload")
def dispatch(target: str, action: str, payload: str) -> None:
    """Dispatch action to backend with strict safeguards for mainnet usage."""
    require_permission("dispatch")
    if CFG.strict_mode and action in DANGEROUS_ACTIONS:
        raise click.ClickException(f"Action '{action}' blocked in strict mode.")

    try:
        parsed_payload = json.loads(payload)
    except json.JSONDecodeError as exc:
        raise click.ClickException(f"Invalid JSON payload: {exc}") from exc

    request_payload = {"target": target, "action": action, "payload": parsed_payload}
    resp = call_backend("POST", "/dispatch", payload=request_payload, timeout=15)
    if not resp.ok:
        raise click.ClickException(f"Dispatch failed ({resp.status_code}): {resp.text[:250]}")

    console.print(Panel.fit(resp.text[:800], title="Dispatch Result", border_style="green"))


@cli.command()
@click.argument("operation", type=click.Choice(["list", "health", "sync"]))
@click.option("--repo", default="all", help="Repository id or 'all'")
def repos(operation: str, repo: str) -> None:
    """Manage multi-repository operations through unified backend endpoint."""
    require_permission("repos")
    payload = {"operation": operation, "repo": repo}
    resp = call_backend("POST", "/repos/manage", payload=payload, timeout=14)
    if not resp.ok:
        raise click.ClickException(f"Repo operation failed ({resp.status_code}): {resp.text[:250]}")
    console.print(Panel.fit(resp.text[:800], title=f"Repos/{operation}", border_style="cyan"))


@cli.command()
@click.argument("instruction")
@click.option("--scope", default="global", help="Prompt scope (repo/global/mainnet)")
def prompt(instruction: str, scope: str) -> None:
    """Submit AI prompt intents with audit trail and explicit scope control."""
    require_permission("prompt")
    payload = {"instruction": instruction, "scope": scope}
    resp = call_backend("POST", "/prompts/submit", payload=payload, timeout=15)
    if not resp.ok:
        raise click.ClickException(f"Prompt submit failed ({resp.status_code}): {resp.text[:250]}")
    console.print(Panel.fit(resp.text[:800], title="Prompt Dispatch", border_style="magenta"))


@cli.command(name="help-center")
def help_center() -> None:
    """Show command matrix and hardened operational guidance."""
    require_permission("help-center")
    table = Table(title="AOXC Help Center")
    table.add_column("Command", style="cyan")
    table.add_column("Purpose", style="white")
    table.add_row("status", "Backend health, service/version profile")
    table.add_row("preflight", "Security and runtime readiness checks")
    table.add_row("audit <tx_hash>", "AI risk analysis for transaction")
    table.add_row("dispatch <target> <action>", "Unified operational routing")
    table.add_row("repos <list|health|sync>", "Multi-repository orchestration")
    table.add_row("prompt <instruction>", "Instruction submission gateway")
    table.add_row("shell", "Interactive terminal window mode")
    table.add_row("logo", "Render startup mainnet banner")
    console.print(table)
    console.print("[yellow]Not:[/yellow] Strict mode açıkken tehlikeli aksiyonlar engellenir.")


@cli.command()
def shell() -> None:
    """Open interactive terminal window for advanced command orchestration."""
    require_permission("shell")
    print_banner()
    console.print("[bold green]Interactive mode[/bold green] | Çıkış: exit")
    while True:
        try:
            raw = console.input("[bold cyan]aoxcon> [/bold cyan]")
        except (EOFError, KeyboardInterrupt):
            console.print("\n[yellow]Terminal kapatıldı.[/yellow]")
            break

        cmd = raw.strip()
        if not cmd:
            continue
        if cmd in {"exit", "quit"}:
            break

        AUDIT.append("shell_command", {"raw": cmd})
        if "&&" in cmd or ";" in cmd:
            console.print("[red]Komut zinciri güvenlik nedeniyle engellendi.[/red]")
            continue

        args = shlex.split(cmd)
        if not args:
            continue

        try:
            cli.main(args=args, prog_name="sentinel", standalone_mode=False)
        except SystemExit:
            pass
        except click.ClickException as exc:
            console.print(f"[red]{exc}[/red]")
        except Exception as exc:  # last-resort visibility
            AUDIT.append("shell_error", {"error": str(exc)})
            console.print(f"[red]Komut hatası: {exc}[/red]")


if __name__ == "__main__":
    try:
        cli()
    except click.ClickException as exc:
        console.print(f"[red]{exc}[/red]")
        sys.exit(2)
