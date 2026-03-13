import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NetworkService } from '../../network.service';

/**
 * AOXCON SYSTEM TELEMETRY FOOTER
 * - Real-time block tracking via NetworkService Signals
 * - Optimized for high-frequency updates using OnPush strategy
 */

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
  // Performance: Sadece sinyaller değiştiğinde render edilir, CPU tasarrufu sağlar.
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class FooterComponent {
  // --- INJECTIONS ---
  public readonly networkService = inject(NetworkService);

  // --- STATE ---
  readonly currentYear = new Date().getFullYear();

  /**
   * Note: Footer, global sinyallere (xLayerData, suiData, cardanoData) 
   * doğrudan bağlı olduğu için ekstra bir 'refresh' mantığına ihtiyaç duymaz.
   * NetworkService her güncellendiğinde footer otomatik olarak tepki verir.
   */
}
