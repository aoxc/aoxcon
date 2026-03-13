import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NetworkData } from '../../../network.service';

@Component({
  selector: 'app-network-card',
  standalone: true,
  imports: [CommonModule],
  providers: [DecimalPipe],
  template: `
    <div class="glass-panel p-6 hover:translate-y-[-4px] transition-all border-white/5">
      <div class="flex items-center gap-3 mb-4 text-white">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-white/5">
          <i class="fa-solid" [class.fa-bolt]="data.id === 'evm'" [class.fa-droplet]="data.id === 'move'" [class.fa-coins]="data.id === 'plutus'"></i>
        </div>
        <span class="text-[10px] font-black uppercase tracking-widest">{{ data.name }}</span>
      </div>
      <div class="space-y-3">
        <div class="flex justify-between text-[10px] font-bold uppercase text-white/40">
          <span>TPS</span>
          <span class="font-mono text-white">{{ data.tps | number }}</span>
        </div>
        <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-[var(--color-sui)]" [style.width.%]="(data.tps / 5000) * 100"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NetworkCardComponent {
  @Input({ required: true }) data!: NetworkData;
}
