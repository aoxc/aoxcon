import { 
  Component, 
  inject, 
  output, 
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { LanguageService } from '../../language.service';
import { AIService } from '../../ai.service';

/**
 * SOVEREIGN SIDEBAR COMPONENT
 * Manages core navigation and infrastructure telemetry display.
 * Performance: ChangeDetectionStrategy.OnPush enabled for optimal neural overhead.
 */
@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-left.html',
  styleUrl: './sidebar-left.css',
  // FIX: Satisfies @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLeftComponent {
  // --- INJECTIONS ---
  public readonly app = inject(App);
  public readonly langService = inject(LanguageService);
  public readonly aiService = inject(AIService); 
  
  // --- OUTPUTS ---
  public readonly tabChange = output<'overview' | 'networks' | 'ai-builder' | 'dao'>();

  /**
   * Updates global navigation state and emits transition events.
   * @param tab Target sovereign layer or module
   */
  public setTab(tab: 'overview' | 'networks' | 'ai-builder' | 'dao'): void {
    this.app.setTab(tab); 
    this.tabChange.emit(tab);
  }

  /**
   * Orchestrates infrastructure network switching.
   * @param network Target chain protocol (EVM, MOVE, PLUTUS)
   */
  public setNetwork(network: 'evm' | 'move' | 'plutus'): void {
    this.app.setNetwork(network);
    this.app.setTab('networks'); 
  }
}
