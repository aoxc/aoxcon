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
import { NetworkService } from '../../network.service';

@Component({
  selector: 'app-sidebar-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-left.html',
  styleUrl: './sidebar-left.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLeftComponent {
  public readonly app = inject(App);
  public readonly langService = inject(LanguageService);
  public readonly aiService = inject(AIService);
  public readonly networkService = inject(NetworkService);

  public readonly tabChange = output<'overview' | 'networks' | 'ai-builder' | 'dao'>();

  public setTab(tab: 'overview' | 'networks' | 'ai-builder' | 'dao'): void {
    this.app.setTab(tab);
    this.tabChange.emit(tab);
  }

  public setNetwork(network: string): void {
    this.app.setNetwork(network);
    this.app.setTab('networks');
  }
}
