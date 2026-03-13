import { 
  Component, 
  inject, 
  viewChild, 
  ElementRef, 
  OnDestroy, 
  signal, 
  // FIX: 'computed' kaldırıldı, çünkü kullanılmıyor. @typescript-eslint/no-unused-vars
  afterNextRender, 
  PLATFORM_ID,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DecimalPipe } from '@angular/common';
import { App } from '../../app';
import { NetworkService } from '../../network.service';
import { AIService } from '../../ai.service';
import { LanguageService } from '../../language.service';
import { NetworkCardComponent } from './widgets/network-card'; 
import * as d3 from 'd3';

interface ChartData {
  x: number;
  y: number;
}

/**
 * SOVEREIGN DASHBOARD ENGINE
 * High-performance telemetry visualization using D3.js and Angular Signals.
 * Cleaned for Audit Compliance.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NetworkCardComponent],
  providers: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy {
  // --- CORE SERVICES ---
  public readonly app = inject(App);
  public readonly networkService = inject(NetworkService);
  public readonly aiService = inject(AIService);
  public readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);

  // --- VIEW QUERIES ---
  private readonly chartContainer = viewChild<ElementRef>('chartContainer');

  // --- SIGNALS ---
  public readonly activeSubTab = signal<'general' | 'dao' | 'staking' | 'neural'>('general');

  // Not: Eğer activeAgentsCount gibi bir computed değer kullanacaksanız 
  // 'computed' importunu geri eklemelisiniz. Şu anki kodunuzda bulunmuyor.

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.startNeuralInterface();
      }
    });
  }

  private startNeuralInterface(): void {
    const element = this.chartContainer()?.nativeElement as HTMLElement;
    if (!element) return;

    this.initChart();

    this.resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(() => this.initChart());
    });
    
    this.resizeObserver.observe(element);
    console.info('🧠 [AOXC-NEURAL]: Dashboard visualization engine synchronized.');
  }

  public setSubTab(tab: 'general' | 'dao' | 'staking' | 'neural'): void {
    this.activeSubTab.set(tab);
  }

  public ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initChart(): void {
    const element = this.chartContainer()?.nativeElement as HTMLElement;
    if (!element) return;

    d3.select(element).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 40 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('overflow', 'visible')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data: ChartData[] = Array.from({ length: 40 }, (_, i) => ({
      x: i,
      y: 98.2 + Math.random() * 1.6
    }));

    const x = d3.scaleLinear().domain([0, 39]).range([0, width]);
    const y = d3.scaleLinear().domain([97, 100.5]).range([height, 0]);

    const line = d3.line<ChartData>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-sui)')
      .attr('stroke-width', 2.5)
      .attr('d', line);
  }
}
