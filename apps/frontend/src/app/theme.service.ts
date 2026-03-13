import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type NetworkTheme = 'default' | 'evm' | 'move' | 'plutus';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly STORAGE_KEY = 'aoxc_neural_theme';

  // --- STATE ---
  readonly activeTheme = signal<NetworkTheme>('default');

  constructor() {
    /**
     * 🛰️ INITIALIZATION
     * Sayfa yüklendiğinde hafızadaki temayı geri çağırır.
     */
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem(this.STORAGE_KEY) as NetworkTheme;
      if (savedTheme) {
        this.activeTheme.set(savedTheme);
      }
    }

    /**
     * 🧠 NEURAL PROPAGATION EFFECT
     * Tema her değiştiğinde DOM ve CSS değişkenlerini senkronize eder.
     */
    effect(() => {
      const theme = this.activeTheme();
      if (!this.isBrowser) return;

      this.applyThemeToDom(theme);
    });
  }

  /**
   * Infrastructure Actions: Tema Değiştirici
   */
  setTheme(theme: NetworkTheme) {
    if (this.activeTheme() === theme) return; // Gereksiz tetiklemeyi önle

    console.info(`🛡️ [AOXC-THEME]: Shifting neural aesthetic to ${theme.toUpperCase()}`);
    this.activeTheme.set(theme);
    
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  private applyThemeToDom(theme: NetworkTheme) {
    const root = document.documentElement;
    
    // 1. Data Attribute Sync
    root.setAttribute('data-theme', theme);
    
    // 2. Neural Color Mapping
    const colorMap: Record<NetworkTheme, string> = {
      evm: 'var(--color-xlayer)',
      move: 'var(--color-sui)',
      plutus: 'var(--color-cardano)',
      default: 'var(--color-sui)'
    };

    const primaryColor = colorMap[theme] || colorMap.default;
    root.style.setProperty('--color-primary', primaryColor);

    // 3. Browser Chromatic Sync (Tab bar & Task switcher)
    this.updateMetaTheme(theme);
  }

  private updateMetaTheme(theme: NetworkTheme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;

    const metaMap: Record<NetworkTheme, string> = {
      evm: '#f3ba2f',   
      move: '#6fbcf0',  
      plutus: '#0033ad', 
      default: '#05070a' // Header background rengiyle uyumlu
    };
    metaThemeColor.setAttribute('content', metaMap[theme]);
  }
}
