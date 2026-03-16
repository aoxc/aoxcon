import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { WalletService, WalletType } from '../../wallet.service';
import { AIService } from '../../ai.service';
import { LanguageService, LanguageCode } from '../../language.service';
import { HeaderWalletComponent } from './header-wallet/header-wallet';

/**
 * SOVEREIGN HEADER ENGINE
 * Orchestrates global state, neural model selection, and multi-chain wallet links.
 * Optimization: ChangeDetectionStrategy.OnPush enabled.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, HeaderWalletComponent],
  templateUrl: './header.html',
  styleUrl: './header.css',
  // FIX: Satisfies @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  // --- CORE SERVICES ---
  public readonly app = inject(App);
  public readonly walletService = inject(WalletService);
  public readonly aiService = inject(AIService);
  public readonly langService = inject(LanguageService);

  // --- UI TELEMETRY SIGNALS ---
  public readonly showWalletModal = signal(false);
  public readonly showSearchDropdown = signal(false);
  public readonly showAISelector = signal(false);
  public readonly showLangSelector = signal(false);
  public readonly selectedSearchNetwork = signal<string>('All Networks');

  // --- COMPUTED STATES ---
  public readonly walletInitial = computed(() => {
    const wallet = this.walletService.wallet();
    return (wallet.connected && wallet.type) ? wallet.type.charAt(0).toUpperCase() : 'N';
  });

  public readonly networks: string[] = ['All Networks', 'EVM', 'AOXCHAIN', 'Solana', 'Bitcoin'];

  // --- INTERACTIVE METHODS ---

  public toggleLangSelector(): void { this.showLangSelector.update(v => !v); }
  public toggleAISelector(): void { this.showAISelector.update(v => !v); }
  public toggleSearchDropdown(): void { this.showSearchDropdown.update(v => !v); }
  public toggleWalletModal(): void { this.showWalletModal.update(v => !v); }

  public selectLanguage(langCode: string): void {
    this.langService.setLanguage(langCode as LanguageCode);
    this.showLangSelector.set(false);
  }

  public selectSearchNetwork(net: string): void {
    this.selectedSearchNetwork.set(net);
    this.showSearchDropdown.set(false);
  }

  public selectAIModel(modelId: string): void {
    this.aiService.selectModel(modelId);
    this.showAISelector.set(false);
  }

  public async connectWallet(type: string): Promise<void> {
    try {
      await this.walletService.connect(type as WalletType);
      this.showWalletModal.set(false);
    } catch (_error: unknown) {
      // FIX: Standard logging for infrastructure failures
      console.error('[AOXC-HANDSHAKE] Wallet link failed:', _error);
    }
  }
}
