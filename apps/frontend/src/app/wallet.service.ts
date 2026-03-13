import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AIService } from './ai.service';

/**
 * 🔒 WALLET INTERFACES
 * Audit-Grade type definitions for provider window objects.
 */
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<string[]>;
  on: (event: string, callback: (args: string[]) => void) => void;
}

interface SuiWalletProvider {
  requestPermissions: () => Promise<boolean>;
  getAccounts: () => Promise<string[]>;
}

/** Extending the global Window object for safety */
interface SovereignWindow extends Window {
  ethereum?: EthereumProvider;
  suiWallet?: SuiWalletProvider;
}

export type WalletType = 'evm' | 'move' | 'plutus';

export interface WalletState {
  connected: boolean;
  type: WalletType | null;
  address: string | null;
  balance: string | null;
  visible: boolean;
  chainId?: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly aiService = inject(AIService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // --- STATE ---
  private readonly state = signal<WalletState>({
    connected: false,
    type: null,
    address: null,
    balance: null,
    visible: true
  });

  public readonly wallet = computed(() => this.state());

  constructor() {
    if (this.isBrowser) {
      void this.autoConnect();
      this.listenToWalletEvents();
    }
  }

  /**
   * 🛰️ REAL CONNECT ENGINE
   * Triggers the relevant browser extension based on wallet type.
   */
  async connect(type: WalletType): Promise<void> {
    if (!this.isBrowser) return;

    const win = window as unknown as SovereignWindow;

    try {
      this.aiService.addLog('Wallet-Core', `Initiating ${type.toUpperCase()} handshake...`, 'info');
      
      let address = '';
      const balance = `Synced (${type.toUpperCase()})`;

      if (type === 'evm') {
        if (!win.ethereum) throw new Error('MetaMask not found');
        
        const accounts = await win.ethereum.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
      } 
      else if (type === 'move') {
        if (!win.suiWallet) throw new Error('Sui Wallet not found');
        
        // FIX: Removed unused 'connection' variable that caused lint error
        await win.suiWallet.requestPermissions();
        const accounts = await win.suiWallet.getAccounts();
        address = accounts[0];
      }

      this.state.set({
        connected: true,
        type,
        address,
        balance,
        visible: true
      });

      localStorage.setItem('aoxc_wallet_type', type);
      this.aiService.addLog('Sync-Master', `Sovereign node linked: ${address.substring(0, 6)}...`, 'info');

    } catch (_error) {
      const msg = _error instanceof Error ? _error.message : 'Unknown link error';
      this.aiService.addLog('System-Core', `Connection refused: ${msg}`, 'critical');
      throw _error;
    }
  }

  /**
   * 🔒 SECURITY: Event Listeners for provider changes
   */
  private async autoConnect(): Promise<void> {
    const savedType = localStorage.getItem('aoxc_wallet_type') as WalletType;
    if (savedType) {
      // Logic for session restoration can be added here
    }
  }

  private listenToWalletEvents(): void {
    const win = window as unknown as SovereignWindow;
    if (win.ethereum) {
      win.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) this.disconnect();
        else this.state.update(s => ({ ...s, address: accounts[0] }));
      });
    }
  }

  public disconnect(): void {
    localStorage.removeItem('aoxc_wallet_type');
    this.state.set({
      connected: false,
      type: null,
      address: null,
      balance: null,
      visible: true
    });
    this.aiService.addLog('System-Core', 'Sovereign node decoupled.', 'warning');
  }

  public toggleVisibility(): void {
    this.state.update(s => ({ ...s, visible: !s.visible }));
  }
}
