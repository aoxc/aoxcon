import { 
  ChangeDetectionStrategy, 
  Component, 
  inject, 
  signal, 
  effect, 
  OnDestroy, 
  PLATFORM_ID 
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { NetworkService } from './network.service';
import { ThemeService, NetworkTheme } from './theme.service';
import { AIService, type LogSeverity } from './ai.service'; // LogSeverity tipini import ettik

// Components
import { HeaderComponent } from './components/header/header';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left';
import { SidebarRightComponent } from './components/sidebar-right/sidebar-right';
import { FooterComponent } from './components/footer/footer';
import { DashboardComponent } from './components/dashboard/dashboard';

/**
 * AOXCON Sovereign Infrastructure - Root Node
 * 🛡️ Orchestrates: Routing, Theme State, and Neural Log Synchronization
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    SidebarLeftComponent, 
    SidebarRightComponent, 
    FooterComponent, 
    DashboardComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  // --- INJECTIONS ---
  private readonly platformId = inject(PLATFORM_ID);
  public readonly networkService = inject(NetworkService);
  public readonly themeService = inject(ThemeService);
  public readonly aiService = inject(AIService);
  
  // FIX: Unexpected any -> Replaced with safe Node.js/Browser timeout type
  private refreshInterval: ReturnType<typeof setInterval> | undefined;

  // --- UI STATE ---
  public readonly activeTab = signal<'overview' | 'networks' | 'ai-builder' | 'dao'>('overview');
  public readonly activeNetwork = signal<string | null>(null);
  
  constructor() {
    /**
     * THEME SYNCHRONIZER
     * Sekme veya ağ değişimine göre global temayı anlık olarak tetikler.
     */
    effect(() => {
      const tab = this.activeTab();
      const network = this.activeNetwork();
      
      if (tab === 'networks' && network) {
        this.themeService.setTheme(network as NetworkTheme);
      } else {
        this.themeService.setTheme('default');
      }
    });

    /**
     * INITIALIZATION & BACKGROUND JOBS
     */
    if (isPlatformBrowser(this.platformId)) {
      this.initBackgroundProcess();
    }
  }

  private initBackgroundProcess(): void {
    // FIX: 'success' as any -> Typed with LogSeverity
    this.aiService.addLog('System-Core', 'Neural-Nexus Interface initialized.', 'success' as LogSeverity);

    // Global Sync Cycle
    this.refreshInterval = setInterval(() => {
      this.networkService.refreshAll();
      this.generateNeuralTraffic();
    }, 30000);
  }

  // --- ACTIONS ---

  public setTab(tab: 'overview' | 'networks' | 'ai-builder' | 'dao'): void {
    this.activeTab.set(tab);
    if (tab !== 'networks') {
      this.activeNetwork.set(null);
    }
  }

  public setNetwork(network: string): void {
    this.activeNetwork.set(network);
    this.activeTab.set('networks');
  }

  /**
   * 🛰️ NEURAL TRAFFIC SIMULATOR
   */
  private generateNeuralTraffic(): void {
    const modules = ['AI-Sentinel', 'DAO-Core', 'DApp-Engine', 'Neural-Nexus', 'Synapse-Core'];
    const messages = [
      'Neural weights optimized for EVM Engine',
      'Cross-chain state verified by AI',
      'DAO proposal AOX-042 quorum reached',
      'AI DApp template generated for Move Module',
      'Security audit passed: 0 vulnerabilities',
      'Sovereign-Vault integrity verified'
    ];
    
    const randomModule = modules[Math.floor(Math.random() * modules.length)];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    this.aiService.addLog(randomModule, randomMsg, 'info' as LogSeverity);
  }

  public ngOnDestroy(): void {
    // Audit: Memory leak prevention
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
