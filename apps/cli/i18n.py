import json
from pathlib import Path
from typing import Dict


class Localizer:
    def __init__(self, locales_dir: Path, default_lang: str = "en"):
        self.locales_dir = locales_dir
        self.default_lang = default_lang
        self._cache: Dict[str, Dict[str, str]] = {}

    def available_languages(self) -> Dict[str, str]:
        langs: Dict[str, str] = {}
        if not self.locales_dir.exists():
            return langs
        for file in sorted(self.locales_dir.glob("*.json")):
            code = file.stem
            data = self._load(code)
            langs[code] = data.get("__language_name", code)
        return langs

    def _load(self, lang: str) -> Dict[str, str]:
        if lang in self._cache:
            return self._cache[lang]
        file = self.locales_dir / f"{lang}.json"
        if not file.exists():
            self._cache[lang] = {}
            return self._cache[lang]
        self._cache[lang] = json.loads(file.read_text(encoding="utf-8"))
        return self._cache[lang]

    def resolve_lang(self, requested: str) -> str:
        requested = (requested or self.default_lang).lower()
        available = self.available_languages()
        if requested in available:
            return requested
        short = requested.split("-")[0]
        if short in available:
            return short
        return self.default_lang

    def t(self, key: str, lang: str, **kwargs) -> str:
        resolved = self.resolve_lang(lang)
        value = self._load(resolved).get(key)
        if value is None:
            value = self._load(self.default_lang).get(key, key)
        return value.format(**kwargs)
