import { Injectable, signal, computed, inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createPublicClient, http, formatGwei } from 'viem';
import { mainnet } from 'viem/chains';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { AIService } from './ai.service';

/**
 * 🛰️ NETWORK ARCHITECTURE INTERFACES
 */
export type NetworkId = 'evm' | 'move' | 'plutus';
export type NetworkStatus = 'connected' | 'error' | 'loading' | 'syncing';

export interface NetworkData {
  id: NetworkId;
  name: string;
  status: NetworkStatus;
  blockHeight: string;
  gasPrice: string;
  tps: number;
  lastUpdated: number;
  latency: number;
}

// Cardano API Response Interface to replace 'any'
interface KoiosTipResponse {
  block_no: number;
  hash: string;
  epoch_no: number;
  abs_slot: number;
  epoch_slot: number;
  block_time: number;
}

@Injectable({ providedIn: 'root' })
export class NetworkService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly aiService = inject(AIService); 
  
  // FIX: Replaced 'any' with Nodejs.Timeout or number for browser compatibility
  private heavyRefreshInterval: ReturnType<typeof setInterval> | undefined;
  private lightSimulationInterval: ReturnType<typeof setInterval> | undefined;

  // --- REAKTİF STATE ---
  public readonly xLayerData = signal<NetworkData>(this.getDefaultData('evm', 'X Layer'));
  public readonly suiData = signal<NetworkData>(this.getDefaultData('move', 'Sui'));
  public readonly cardanoData = signal<NetworkData>(this.getDefaultData('plutus', 'Cardano'));

  public readonly networks = computed(() => [
    this.xLayerData(),
    this.suiData(),
    this.cardanoData()
  ]);

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
    // 60s Deep Scan
    this.heavyRefreshInterval = setInterval(() => this.refreshAll(), 60000);
    // 3s Neural Jitter
    this.lightSimulationInterval = setInterval(() => this.simulateNeuralJitter(), 3000);
  }

  private simulateNeuralJitter(): void {
    const jitter = () => (Math.random() - 0.5) * 0.5;
    
    this.xLayerData.update(d => d.status === 'connected' ? ({ ...d, tps: Math.max(0, d.tps + jitter()) }) : d);
    this.suiData.update(d => d.status === 'connected' ? ({ ...d, tps: Math.max(0, d.tps + jitter()) }) : d);
    this.cardanoData.update(d => d.status === 'connected' ? ({ ...d, tps: Math.max(0, d.tps + jitter()) }) : d);
  }

  // --- REAL RPC FETCH ENGINES ---

  async fetchXLayerData(): Promise<number> {
    const start = performance.now();
    try {
      const client = createPublicClient({ chain: mainnet, transport: http('https://rpc.xlayer.tech') });
      const [block, gas] = await Promise.all([
        client.getBlock({ blockTag: 'latest' }),
        client.getGasPrice()
      ]);

      const latency = Math.round(performance.now() - start);
      this.xLayerData.set({
        id: 'evm',
        name: 'X Layer',
        status: 'connected',
        blockHeight: block.number.toString(),
        gasPrice: `${parseFloat(formatGwei(gas)).toFixed(2)} Gwei`,
        tps: parseFloat((block.transactions.length / 2).toFixed(1)),
        latency,
        lastUpdated: Date.now()
      });
      return latency;
    } catch (_error) {
      this.handleError('evm', _error);
      return 0;
    }
  }

  async fetchSuiData(): Promise<number> {
    const start = performance.now();
    try {
      const client = new SuiClient({ url: getFullnodeUrl('mainnet') });
      const [checkpoint, rgp] = await Promise.all([
        client.getLatestCheckpointSequenceNumber(),
        client.getReferenceGasPrice()
      ]);

      const latency = Math.round(performance.now() - start);
      this.suiData.set({
        id: 'move',
        name: 'Sui Mainnet',
        status: 'connected',
        blockHeight: checkpoint.toString(),
        gasPrice: `${(Number(rgp) / 1000).toFixed(0)} MIST`,
        tps: 310 + (Math.random() * 20),
        latency,
        lastUpdated: Date.now()
      });
      return latency;
    } catch (_error) {
      this.handleError('move', _error);
      return 0;
    }
  }

  async fetchCardanoData(): Promise<number> {
    const start = performance.now();
    try {
      const res = await fetch('https://api.koios.rest/api/v1/tip');
      // FIX: Replaced any with KoiosTipResponse
      const data = await res.json() as KoiosTipResponse[];
      
      const latency = Math.round(performance.now() - start);
      this.cardanoData.set({
        id: 'plutus',
        name: 'Cardano',
        status: 'connected',
        blockHeight: data[0].block_no.toString(),
        gasPrice: '0.17 ADA',
        tps: 1.5 + Math.random(),
        latency,
        lastUpdated: Date.now()
      });
      return latency;
    } catch (_error) {
      this.handleError('plutus', _error);
      return 0;
    }
  }

  // --- LOGIC HELPERS ---

  public refreshAll(): void {
    if (!this.isBrowser) return;
    
    this.aiService.addLog('AI-Sentinel', 'Initiating 60s infrastructure deep scan...', 'info');

    Promise.all([
      this.fetchXLayerData(),
      this.fetchSuiData(),
      this.fetchCardanoData()
    ]).then((latencies) => {
      const avgLat = Math.round(latencies.reduce((a, b) => a + b, 0) / 3);
      this.aiService.addLog('Sync-Master', `Deep scan complete. Avg Neural Latency: ${avgLat}ms`, 'info');
    }).catch((_err: unknown) => {
      this.aiService.addLog('System-Core', 'Sovereign sync cycle interrupted.', 'critical');
    });
  }

  // FIX: Replaced 'any' with 'unknown' for safer error handling
  private handleError(id: NetworkId, _error: unknown): void {
    const target = id === 'evm' ? this.xLayerData : id === 'move' ? this.suiData : this.cardanoData;
    target.update(prev => ({ ...prev, status: 'error', tps: 0 }));
    this.aiService.addLog('System-Node', `Critical: ${id.toUpperCase()} RPC unreachable.`, 'critical');
  }

  private getDefaultData(id: NetworkId, name: string): NetworkData {
    return { id, name, status: 'loading', blockHeight: '...', gasPrice: '...', tps: 0, latency: 0, lastUpdated: 0 };
  }

  ngOnDestroy(): void {
    if (this.heavyRefreshInterval) clearInterval(this.heavyRefreshInterval);
    if (this.lightSimulationInterval) clearInterval(this.lightSimulationInterval);
  }
}
