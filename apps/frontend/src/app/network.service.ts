import { Injectable, signal, computed, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AIService } from './ai.service';

export type NetworkStatus = 'connected' | 'error' | 'loading';

export interface NetworkData {
  id: string;
  name: string;
  status: NetworkStatus;
  blockHeight: string;
  gasPrice: string;
  tps: number;
  lastUpdated: number;
  latency: number;
}

export interface GovernanceProposal {
  id: string;
  title: string;
  status: string;
  yes: number;
  no: number;
  quorum: number;
  participation: number;
  endAt: number;
}

export interface RelayDeploymentPayload {
  contractName: string;
  bytecode: string;
  targetNetworks: string[];
  rpcMode: 'local-first' | 'remote-first';
}

export interface RelayDeployment {
  id: string;
  contractName: string;
  bytecodeHash: string;
  targetNetworks: string[];
  status: string;
  rpcMode: 'local-first' | 'remote-first';
  createdAt: number;
  security: { staticScan: string; reentrancyGuard: string; relayPolicy: string };
  steps: Array<{ index: number; network: string; status: string }>;
}

interface AoxchainStatusResponse {
  ok: boolean;
  rpc: string;
  chainId: string | null;
  blockNumber: number | null;
  latencyMs: number | null;
}

@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly aiService = inject(AIService);
  private readonly backendBase = 'http://localhost:5000/api/v1';

  private heavyRefreshInterval: ReturnType<typeof setInterval> | undefined;
  private lightSimulationInterval: ReturnType<typeof setInterval> | undefined;

  public readonly networksData = signal<NetworkData[]>([
    this.getDefaultData('aoxchain', 'AOXCHAIN'),
    this.getDefaultData('evm', 'EVM'),
    this.getDefaultData('evm', 'EVM'),
    this.getDefaultData('aoxchain', 'AOXCHAIN'),
    this.getDefaultData('solana', 'Solana'),
    this.getDefaultData('btc', 'Bitcoin')
  ]);

  public readonly proposals = signal<GovernanceProposal[]>([]);
  public readonly relayDeployments = signal<RelayDeployment[]>([]);

  public readonly networks = computed(() => this.networksData());
  public readonly globalTPS = computed(() => this.networks().reduce((acc, n) => acc + n.tps, 0));
  public readonly networks = computed(() => this.networksData());
  public readonly globalTPS = computed(() =>
    this.networks().reduce((acc, n) => acc + n.tps, 0)
  );

  constructor() {
    if (this.isBrowser) this.initSovereignSync();
  }

  private initSovereignSync(): void {
    this.refreshAll();
    this.refreshGovernanceAndRelay();
    this.heavyRefreshInterval = setInterval(() => {
      this.refreshAll();
      this.refreshGovernanceAndRelay();
    }, 60000);
    this.heavyRefreshInterval = setInterval(() => this.refreshAll(), 60000);
    this.lightSimulationInterval = setInterval(() => this.simulateNeuralJitter(), 3000);
  }

  private simulateNeuralJitter(): void {
    const jitter = () => (Math.random() - 0.5) * 0.5;
    this.networksData.update((items) => items.map((item) => item.status === 'connected' ? ({ ...item, tps: Math.max(0, item.tps + jitter()) }) : item));
    this.networksData.update((items) =>
      items.map((item) =>
        item.status === 'connected' ? { ...item, tps: Math.max(0, item.tps + jitter()) } : item
      )
    );
  }

  public refreshAll(): void {
    if (!this.isBrowser) return;
    this.aiService.addLog('AOX-Sync', 'Ağlar güncelleniyor (AOXCHAIN local-first)...', 'info');

    Promise.all([
      this.fetchAoxchainData(),
      this.fetchNetworkData('evm'),
      this.fetchNetworkData('solana'),
      this.fetchNetworkData('btc')
    ]).catch(() => this.aiService.addLog('System-Core', 'Sovereign sync cycle interrupted.', 'critical'));
  }

  public async refreshGovernanceAndRelay(): Promise<void> {
    await Promise.all([this.fetchGovernanceProposals(), this.fetchRelayDeployments()]);
  }

  public async fetchGovernanceProposals(): Promise<void> {
    try {
      const response = await fetch(`${this.backendBase}/aoxchain/governance/proposals`);
      const payload = await response.json() as { proposals: GovernanceProposal[] };
      this.proposals.set(payload.proposals || []);
    } catch {
      this.proposals.set([]);
    }
  }

  public async fetchRelayDeployments(): Promise<void> {
    try {
      const response = await fetch(`${this.backendBase}/aoxchain/deployments/relay`);
      if (!response.ok) return;
      const payload = await response.json() as { deployments: RelayDeployment[] };
      this.relayDeployments.set(payload.deployments || []);
    } catch {
      this.relayDeployments.set([]);
    }
  }

  public async queueRelayDeployment(input: RelayDeploymentPayload): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendBase}/aoxchain/deployments/relay`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) return false;
      await this.fetchRelayDeployments();
      return true;
    } catch {
      return false;
    }
  }

  public networkColor(id: string): string {
    const map: Record<string, string> = { evm: 'var(--color-xlayer)', aoxchain: '#10b981', solana: '#14f195', btc: '#f7931a' };


    this.aiService.addLog('AI-Sentinel', 'Initiating 60s infrastructure deep scan...', 'info');

    const jobs = [
      this.fetchNetworkData('evm'),
      this.fetchNetworkData('aoxchain'),
      this.fetchNetworkData('solana'),
      this.fetchNetworkData('btc')
    ];

    Promise.all(jobs)
      .then((latencies) => {
        const avgLat = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
        this.aiService.addLog('Sync-Master', `Deep scan complete. Avg Neural Latency: ${avgLat}ms`, 'info');
      })
      .catch(() => {
        this.aiService.addLog('System-Core', 'Sovereign sync cycle interrupted.', 'critical');
      });
  }

  public networkColor(id: string): string {
    const map: Record<string, string> = {
      evm: 'var(--color-xlayer)',
      aoxchain: '#10b981',
      solana: '#14f195',
      btc: '#f7931a'
    };
    return map[id] ?? 'var(--color-sui)';
  }

  public networkIcon(id: string): string {
    const map: Record<string, string> = { evm: 'fa-bolt-lightning', aoxchain: 'fa-link', solana: 'fa-s', btc: 'fa-bitcoin-sign' };
    return map[id] ?? 'fa-circle-nodes';
  }

  private async fetchAoxchainData(): Promise<void> {
    const start = performance.now();
    try {
      const statusResponse = await fetch(`${this.backendBase}/aoxchain/status?rpc=http://localhost:2626`);
      const status = await statusResponse.json() as AoxchainStatusResponse;

      this.updateNetwork('aoxchain', {
        status: status.ok ? 'connected' : 'error',
        blockHeight: status.blockNumber?.toString() ?? 'N/A',
        gasPrice: 'AOXC gas',
        tps: 45 + Math.random() * 15,
        latency: status.latencyMs ?? Math.round(performance.now() - start),
      });
    } catch {
      this.handleError('aoxchain');
    }
  }

  private async fetchNetworkData(id: string): Promise<void> {
    const map: Record<string, string> = {
      evm: 'fa-bolt-lightning',
      aoxchain: 'fa-link',
      solana: 'fa-s',
      btc: 'fa-bitcoin-sign'
    };
    return map[id] ?? 'fa-circle-nodes';
  }

  private async fetchNetworkData(id: string): Promise<number> {
    const start = performance.now();

    try {
      let blockHeight = '...';
      let gasPrice = 'N/A';
      let tps = 0;

      if (id === 'evm') {
        const response = await fetch('https://rpc.ankr.com/eth', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
        });
        const payload = await response.json() as { result?: string };
        blockHeight = payload.result ? parseInt(payload.result, 16).toString() : 'N/A';
        gasPrice = 'EVM gas';
      if (id === 'evm' || id === 'aoxchain') {
        const response = await fetch('https://rpc.ankr.com/eth', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_blockNumber',
            params: []
          })
        });
        const payload = (await response.json()) as { result?: string };
        blockHeight = payload.result ? parseInt(payload.result, 16).toString() : 'N/A';
        gasPrice = id === 'aoxchain' ? 'AOXC native' : 'EVM gas';
        tps = 12 + Math.random() * 10;
      }

      if (id === 'solana') {
        const response = await fetch('https://api.mainnet-beta.solana.com', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getSlot' })
        });
        const payload = await response.json() as { result?: number };
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getSlot' })
        });
        const payload = (await response.json()) as { result?: number };
        blockHeight = payload.result?.toString() ?? 'N/A';
        gasPrice = 'Priority fee';
        tps = 2200 + Math.random() * 150;
      }

      if (id === 'btc') {
        const response = await fetch('https://blockstream.info/api/blocks/tip/height');
        blockHeight = await response.text();
        const height = await response.text();
        blockHeight = height;
        gasPrice = 'sat/vB';
        tps = 7 + Math.random() * 2;
      }

      this.updateNetwork(id, {
        status: 'connected',
        blockHeight,
        gasPrice,
        tps,
        latency: Math.round(performance.now() - start),
      });
    } catch {
      this.handleError(id);
    }
  }

  private updateNetwork(id: string, patch: Partial<NetworkData>): void {
    this.networksData.update((items) => items.map((item) => item.id === id ? ({ ...item, ...patch, lastUpdated: Date.now() }) : item));
  }

  private handleError(id: string): void {
    this.updateNetwork(id, { status: 'error', tps: 0, latency: 0 });

  private handleError(id: string): void {
    this.updateNetwork(id, { status: 'error', tps: 0, latency: 0 });
      const latency = Math.round(performance.now() - start);

      this.networksData.update((items) =>
        items.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'connected',
                blockHeight,
                gasPrice,
                tps,
                latency,
                lastUpdated: Date.now()
              }
            : item
        )
      );

      return latency;
    } catch {
      this.handleError(id);
      return 0;
    }
  }

  private handleError(id: string): void {
    this.networksData.update((items) =>
      items.map((item) =>
        item.id === id ? { ...item, status: 'error', tps: 0, latency: 0 } : item
      )
    );
    this.aiService.addLog('System-Node', `Critical: ${id.toUpperCase()} RPC unreachable.`, 'critical');
  }

  private getDefaultData(id: string, name: string): NetworkData {
    return { id, name, status: 'loading', blockHeight: '...', gasPrice: '...', tps: 0, latency: 0, lastUpdated: 0 };

    return {
      id,
      name,
      status: 'loading',
      blockHeight: '...',
      gasPrice: '...',
      tps: 0,
      latency: 0,
      lastUpdated: 0
    };
  }

  ngOnDestroy(): void {
    if (this.heavyRefreshInterval) clearInterval(this.heavyRefreshInterval);
    if (this.lightSimulationInterval) clearInterval(this.lightSimulationInterval);
  }
}
