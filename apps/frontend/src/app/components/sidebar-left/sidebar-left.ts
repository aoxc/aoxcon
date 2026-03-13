import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { App } from '../../app';
import { LanguageService } from '../../language.service';
import { AIService } from '../../ai.service'; // Ekledik

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-left.html',
  styleUrl: './sidebar-left.css'
})
export class SidebarLeftComponent {
  app = inject(App);
  langService = inject(LanguageService);
  aiService = inject(AIService); // Dinamik yük verisi için
  
  tabChange = output<'overview' | 'networks' | 'ai-builder' | 'dao'>();

  setTab(tab: 'overview' | 'networks' | 'ai-builder' | 'dao') {
    this.app.setTab(tab); // App state'i güncelle
    this.tabChange.emit(tab);
  }

  setNetwork(network: 'evm' | 'move' | 'plutus') {
    this.app.setNetwork(network);
    this.app.setTab('networks'); // Network seçilince otomatik tab geçişi
  }
}
