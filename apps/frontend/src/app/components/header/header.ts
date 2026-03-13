import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { WalletService, WalletType } from '../../wallet.service';
import { AIService } from '../../ai.service';
import { LanguageService, LanguageCode } from '../../language.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  // Service Injection
  public app = inject(App);
  public walletService = inject(WalletService);
  public aiService = inject(AIService);
  public langService = inject(LanguageService);

  // UI State Signals (Dropdownların açık/kapalı durumu)
  showWalletModal = signal(false);
  showSearchDropdown = signal(false);
  showAISelector = signal(false);
  showLangSelector = signal(false);
  selectedSearchNetwork = signal<string>('All Networks');

  // Computed: Cüzdan tipinin baş harfi (E, M, P)
  walletInitial = computed(() => {
    const wallet = this.walletService.wallet();
    return (wallet.connected && wallet.type) ? wallet.type.charAt(0).toUpperCase() : 'N';
  });

  networks = ['All Networks', 'EVM Engine', 'Move Module', 'Plutus Ledger'];

  // --- METODLAR (Tetikleyiciler) ---

  toggleLangSelector() { this.showLangSelector.update(v => !v); }
  toggleAISelector() { this.showAISelector.update(v => !v); }
  toggleSearchDropdown() { this.showSearchDropdown.update(v => !v); }
  toggleWalletModal() { this.showWalletModal.update(v => !v); }

  selectLanguage(langCode: string) {
    this.langService.setLanguage(langCode as LanguageCode);
    this.showLangSelector.set(false);
  }

  selectSearchNetwork(net: string) {
    this.selectedSearchNetwork.set(net);
    this.showSearchDropdown.set(false);
  }

  selectAIModel(modelId: string) {
    this.aiService.selectModel(modelId);
    this.showAISelector.set(false);
  }

  async connectWallet(type: string) {
    try {
      await this.walletService.connect(type as WalletType);
      this.showWalletModal.set(false);
    } catch (err) {
      console.error('Wallet connection failed', err);
    }
  }
}
