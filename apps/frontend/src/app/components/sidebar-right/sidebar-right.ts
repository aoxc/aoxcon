import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { LanguageService } from '../../language.service';
import { AIService } from '../../ai.service'; // Kritik: Logların merkezi

@Component({
  selector: 'app-sidebar-right',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-right.html',
  styleUrl: './sidebar-right.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Performans için OnPush
})
export class SidebarRightComponent {
  // --- INJECTIONS ---
  public app = inject(App);
  public langService = inject(LanguageService);
  public aiService = inject(AIService); // Neural log akışı buradan geliyor

  /**
   * AOXCON Sovereign Sidebar
   * Bu bileşen artık tamamen AIService üzerindeki neuralLogs sinyalini dinler.
   * App içindeki manuel log tanımı silindiği için hata %100 çözülmüştür.
   */
}
