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
import { AIService } from './ai.service';

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
  
  private refreshInterval: any;

  // --- UI STATE ---
  readonly activeTab = signal<'overview' | 'networks' | 'ai-builder' | 'dao'>('overview');
  readonly activeNetwork = signal<'evm' | 'move' | 'plutus' | null>(null);
  
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
     * Sadece tarayıcıda çalışarak ağ verilerini ve ajan loglarını yönetir.
     */
    if (isPlatformBrowser(this.platformId)) {
      this.initBackgroundProcess();
    }
  }

  private initBackgroundProcess() {
    // İlk açılış logu
    this.aiService.addLog('System-Core', 'Neural-Nexus Interface initialized.', 'success' as any);

    // Global Sync Cycle: Her 30 saniyede bir ağ denetimi ve rastgele simülasyon logu
    this.refreshInterval = setInterval(() => {
      this.networkService.refreshAll();
      this.generateNeuralTraffic();
    }, 30000);
  }

  // --- ACTIONS ---

  setTab(tab: 'overview' | 'networks' | 'ai-builder' | 'dao') {
    this.activeTab.set(tab);
    if (tab !== 'networks') this.activeNetwork.set(null);
  }

  setNetwork(network: 'evm' | 'move' | 'plutus') {
    this.activeNetwork.set(network);
    this.activeTab.set('networks');
  }

  /**
   * 🛰️ NEURAL TRAFFIC SIMULATOR
   * Sistemin "yaşadığını" gösteren rastgele ajan aktiviteleri üretir.
   */
  private generateNeuralTraffic() {
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
    
    // Logları merkezi AIService'e gönderiyoruz
    this.aiService.addLog(randomModule, randomMsg, 'info');
  }

  ngOnDestroy() {
    // Audit: Memory leak önleme
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
