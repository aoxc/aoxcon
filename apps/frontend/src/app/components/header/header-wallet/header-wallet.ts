import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WalletService } from '../../../wallet.service';
import { LanguageService } from '../../../language.service';

@Component({
  selector: 'app-header-wallet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-wallet.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderWalletComponent {
  public walletService = inject(WalletService);
  public langService = inject(LanguageService);

  public walletInitial = computed(() => {
    const w = this.walletService.wallet();
    return (w.connected && w.type) ? w.type.charAt(0).toUpperCase() : 'N';
  });
}
