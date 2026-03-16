import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type NetworkTheme = 'default' | 'evm' | 'aoxchain' | 'solana' | 'btc';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'aoxc_neural_theme';

  readonly activeTheme = signal<NetworkTheme>('default');

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY) as NetworkTheme;
      if (savedTheme) {
        this.activeTheme.set(savedTheme);
      }
    }

    effect(() => {
      const theme = this.activeTheme();
      if (!this.isBrowser) return;
      this.applyThemeToDom(theme);
    });
  }

  setTheme(theme: NetworkTheme) {
    if (this.activeTheme() === theme) return;

    console.info(`🛡️ [AOXC-THEME]: Shifting neural aesthetic to ${theme.toUpperCase()}`);
    this.activeTheme.set(theme);

    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  private applyThemeToDom(theme: NetworkTheme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);

    const colorMap: Record<NetworkTheme, string> = {
      evm: 'var(--color-xlayer)',
      aoxchain: '#10b981',
      solana: '#14f195',
      btc: '#f7931a',
      default: 'var(--color-sui)'
    };

    const primaryColor = colorMap[theme] || colorMap.default;
    root.style.setProperty('--color-primary', primaryColor);

    this.updateMetaTheme(theme);
  }

  private updateMetaTheme(theme: NetworkTheme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    const metaMap: Record<NetworkTheme, string> = {
      evm: '#8b5cf6',
      aoxchain: '#10b981',
      solana: '#14f195',
      btc: '#f7931a',
      default: '#05070a'
    };
    metaThemeColor.setAttribute('content', metaMap[theme]);
  }
}
