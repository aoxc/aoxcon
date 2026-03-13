import { 
  Component, 
  inject, 
  viewChild, 
  ElementRef, 
  OnDestroy, 
  signal, 
  computed, 
  afterNextRender, 
  PLATFORM_ID 
} from '@angular/core';
import { CommonModule, isPlatformBrowser, DecimalPipe } from '@angular/common';
import { App } from '../../app';
import { NetworkService } from '../../network.service';
import { AIService } from '../../ai.service';
import { LanguageService } from '../../language.service';
import * as d3 from 'd3';

interface ChartData {
  x: number;
  y: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnDestroy {
  // Audit: Modern Inject Pattern
  public app = inject(App);
  public networkService = inject(NetworkService);
  public aiService = inject(AIService);
  public langService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);

  // View Queries
  readonly chartContainer = viewChild<ElementRef>('chartContainer');

  // Signals
  activeSubTab = signal<'general' | 'dao' | 'staking' | 'neural'>('general');

  // Computed State
  activeAgentsCount = computed(() => 
    this.aiService.agents().filter(a => a.selected).length
  );

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    /**
     * 🛡️ SOVEREIGN HYDRATION GUARD
     * afterNextRender: Sadece tarayıcıda çalışır. 
     * ResizeObserver ve D3 DOM işlemleri burada %100 güvenlidir.
     */
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.startNeuralInterface();
      }
    });
  }

  private startNeuralInterface() {
    const element = this.chartContainer()?.nativeElement;
    if (!element) return;

    // İlk grafik çizimi
    this.initChart();

    // ResizeObserver: Sunucuda tanımlı olmadığı için burada güvenle çağrılır
    this.resizeObserver = new ResizeObserver(() => {
      // Performans için requestAnimationFrame ile sarmalandı
      window.requestAnimationFrame(() => this.initChart());
    });
    
    this.resizeObserver.observe(element);
    console.info('🧠 [AOXC-NEURAL]: Chart engine synchronized with viewport.');
  }

  setSubTab(tab: 'general' | 'dao' | 'staking' | 'neural') {
    this.activeSubTab.set(tab);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initChart() {
    const element = this.chartContainer()?.nativeElement;
    if (!element) return;

    // Temizlik: Önceki SVG'leri uçur
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

    // Mock Data: Gerçekçi dalgalanma
    const data: ChartData[] = Array.from({ length: 40 }, (_, i) => ({
      x: i,
      y: 98.2 + Math.random() * 1.6
    }));

    const x = d3.scaleLinear().domain([0, 39]).range([0, width]);
    const y = d3.scaleLinear().domain([97, 100.5]).range([height, 0]);

    // Area & Line Generator (Sovereign Polish)
    const line = d3.line<ChartData>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveMonotoneX);

    const area = d3.area<ChartData>()
      .x(d => x(d.x))
      .y0(height)
      .y1(d => y(d.y))
      .curve(d3.curveMonotoneX);

    // Glow Gradient Definitions
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'neural-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'var(--color-sui)').attr('stop-opacity', 0.5);
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'var(--color-sui)').attr('stop-opacity', 0);

    // Çizim: Area
    svg.append('path')
      .datum(data)
      .attr('fill', 'url(#neural-gradient)')
      .attr('d', area);

    // Çizim: Main Line (Glow Effect)
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-sui)')
      .attr('stroke-width', 2.5)
      .attr('filter', 'drop-shadow(0 0 8px var(--color-sui))')
      .attr('d', line);

    // Veri Noktaları (Neural Nodes)
    svg.selectAll('.node')
      .data(data.filter((_, i) => i % 8 === 0))
      .enter()
      .append('circle')
      .attr('cx', d => x(d.x))
      .attr('cy', d => y(d.y))
      .attr('r', 3)
      .attr('fill', '#fff')
      .attr('filter', 'drop-shadow(0 0 5px #fff)');

    // Axes (Minimalist Infrastructure Style)
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(0))
      .attr('color', 'rgba(255,255,255,0.05)');

    svg.append('g')
      .call(d3.axisLeft(y).ticks(3).tickFormat(d => d + '%'))
      .attr('color', 'rgba(255,255,255,0.05)')
      .selectAll('text')
      .attr('fill', 'rgba(255,255,255,0.4)')
      .attr('font-size', '9px')
      .attr('font-weight', '900')
      .attr('font-family', 'JetBrains Mono, monospace');
  }
}
