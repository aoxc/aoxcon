import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AIService } from './ai.service';

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
  private platformId = inject(PLATFORM_ID);
  private aiService = inject(AIService);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // --- STATE ---
  private state = signal<WalletState>({
    connected: false,
    type: null,
    address: null,
    balance: null,
    visible: true
  });

  wallet = computed(() => this.state());

  constructor() {
    if (this.isBrowser) {
      this.autoConnect();
      this.listenToWalletEvents();
    }
  }

  /**
   * 🛰️ REAL CONNECT ENGINE
   * Cüzdan tipine göre ilgili tarayıcı eklentisini tetikler.
   */
  async connect(type: WalletType) {
    if (!this.isBrowser) return;

    try {
      this.aiService.addLog('Wallet-Core', `Initiating ${type.toUpperCase()} handshake...`, 'info');
      
      let address = '';
      let balance = '0.00';

      if (type === 'evm') {
        const anyWindow = window as any;
        if (!anyWindow.ethereum) throw new Error('MetaMask not found');
        
        // MetaMask/EVM Request
        const accounts = await anyWindow.ethereum.request({ method: 'eth_requestAccounts' });
        address = accounts[0];
        balance = 'Synced (EVM)'; // İleride viem.getBytecode ile gerçek bakiye çekilecek
      } 
      else if (type === 'move') {
        const anyWindow = window as any;
        if (!anyWindow.suiWallet) throw new Error('Sui Wallet not found');
        
        // Sui Connection
        const connection = await anyWindow.suiWallet.requestPermissions();
        const accounts = await anyWindow.suiWallet.getAccounts();
        address = accounts[0];
        balance = 'Synced (SUI)';
      }

      this.state.set({
        connected: true,
        type,
        address,
        balance,
        visible: true
      });

      localStorage.setItem('aoxc_wallet_type', type);
      this.aiService.addLog('Sync-Master', `Sovereign node linked: ${address.substring(0,6)}...`, 'info');

    } catch (error: any) {
      this.aiService.addLog('System-Core', `Connection refused: ${error.message}`, 'critical');
      throw error;
    }
  }

  /**
   * 🔒 SECURITY: Auto-reconnect & Event Listeners
   */
  private async autoConnect() {
    const savedType = localStorage.getItem('aoxc_wallet_type') as WalletType;
    if (savedType) {
      // Güvenlik gereği session tazelemek için reconnect denemesi yapılabilir.
    }
  }

  private listenToWalletEvents() {
    const anyWindow = window as any;
    if (anyWindow.ethereum) {
      anyWindow.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) this.disconnect();
        else this.state.update(s => ({ ...s, address: accounts[0] }));
      });
    }
  }

  disconnect() {
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

  toggleVisibility() {
    this.state.update(s => ({ ...s, visible: !s.visible }));
  }
}
