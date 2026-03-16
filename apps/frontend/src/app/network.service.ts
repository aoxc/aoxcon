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

@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly aiService = inject(AIService);

  private heavyRefreshInterval: ReturnType<typeof setInterval> | undefined;
  private lightSimulationInterval: ReturnType<typeof setInterval> | undefined;

  public readonly networksData = signal<NetworkData[]>([
    this.getDefaultData('evm', 'EVM'),
    this.getDefaultData('aoxchain', 'AOXCHAIN'),
    this.getDefaultData('solana', 'Solana'),
    this.getDefaultData('btc', 'Bitcoin')
  ]);

  public readonly networks = computed(() => this.networksData());
  public readonly globalTPS = computed(() =>
    this.networks().reduce((acc, n) => acc + n.tps, 0)
  );

  constructor() {
    if (this.isBrowser) {
      this.initSovereignSync();
    }
  }

  private initSovereignSync(): void {
    this.refreshAll();
    this.heavyRefreshInterval = setInterval(() => this.refreshAll(), 60000);
    this.lightSimulationInterval = setInterval(() => this.simulateNeuralJitter(), 3000);
  }

  private simulateNeuralJitter(): void {
    const jitter = () => (Math.random() - 0.5) * 0.5;
    this.networksData.update((items) =>
      items.map((item) =>
        item.status === 'connected' ? { ...item, tps: Math.max(0, item.tps + jitter()) } : item
      )
    );
  }

  public refreshAll(): void {
    if (!this.isBrowser) return;

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
        const height = await response.text();
        blockHeight = height;
        gasPrice = 'sat/vB';
        tps = 7 + Math.random() * 2;
      }

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
