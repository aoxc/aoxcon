import {
  Component,
  inject,
  viewChild,
  ElementRef,
  OnDestroy,
  signal,
  afterNextRender,
  PLATFORM_ID,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { App } from '../../app';
import { NetworkService } from '../../network.service';
import { AIService } from '../../ai.service';
import { LanguageService } from '../../language.service';
import { NetworkCardComponent } from './widgets/network-card';
import * as d3 from 'd3';

interface ChartData { x: number; y: number; }

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NetworkCardComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnDestroy {
  public readonly app = inject(App);
  public readonly networkService = inject(NetworkService);
  public readonly aiService = inject(AIService);
  public readonly langService = inject(LanguageService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly chartContainer = viewChild<ElementRef>('chartContainer');
  private resizeObserver: ResizeObserver | null = null;

  public readonly relayContractName = signal('AoxVaultModule');
  public readonly relayBytecode = signal('0x6080604052...');
  public readonly relayNetworks = signal('aoxchain,evm,solana');
  public readonly relayMode = signal<'local-first' | 'remote-first'>('local-first');
  public readonly relayResult = signal('');

  constructor() {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) this.startNeuralInterface();
    });
  }

  private startNeuralInterface(): void {
    const element = this.chartContainer()?.nativeElement as HTMLElement;
    if (!element) return;

    this.initChart();
    this.resizeObserver = new ResizeObserver(() => window.requestAnimationFrame(() => this.initChart()));
    this.resizeObserver.observe(element);
  }

  public async queueDeployment(): Promise<void> {
    const targets = this.relayNetworks().split(',').map((item) => item.trim()).filter(Boolean);
    const ok = await this.networkService.queueRelayDeployment({
      contractName: this.relayContractName(),
      bytecode: this.relayBytecode(),
      targetNetworks: targets,
      rpcMode: this.relayMode(),
    });

    this.relayResult.set(ok ? 'Relay deployment queued securely.' : 'Deployment queue failed. Check backend auth/token.');
  }

  public ngOnDestroy(): void {
    if (this.resizeObserver) this.resizeObserver.disconnect();
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

    const data: ChartData[] = Array.from({ length: 40 }, (_, i) => ({ x: i, y: 98.2 + Math.random() * 1.6 }));
    const x = d3.scaleLinear().domain([0, 39]).range([0, width]);
    const y = d3.scaleLinear().domain([97, 100.5]).range([height, 0]);

    const line = d3.line<ChartData>().x((d) => x(d.x)).y((d) => y(d.y)).curve(d3.curveMonotoneX);

    svg.append('path').datum(data).attr('fill', 'none').attr('stroke', 'var(--color-sui)').attr('stroke-width', 2.5).attr('d', line);
  }
}
