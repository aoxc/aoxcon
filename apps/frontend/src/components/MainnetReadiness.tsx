import React from 'react';
import { BadgeCheck, CircleDashed, FileCheck2, Rocket, Shield } from 'lucide-react';
import { BadgeCheck, CircleDashed, FileCheck2, Shield, Rocket } from 'lucide-react';
import { BadgeCheck, CircleDashed, FileCheck2 } from 'lucide-react';

const checklist = [
  'Smart contract unit/integration test coverage > %90',
  'Static analysis + SAST (Slither, Mythril, Semgrep) tamamlandı',
  '3rd-party bağımsız audit raporu yayınlandı',
  'Bug bounty (Immunefi/HackenProof) aktif',
  'Multi-sig + timelock ve acil durdurma prosedürü test edildi',
  'X Layer / Sui / Cardano üzerinde gerçek mainnet smoke testleri geçti',
  'Monitoring + alerting (RPC latency, failover, incident runbook) aktif',
  'Explorer transaction linkleri, legal ve support sayfaları canlı doğrulandı'
  'Explorer transaction linkleri, legal ve support sayfaları canlı doğrulandı',
  'Gerçek linkler, explorer tx linkleri ve legal sayfalar doğrulandı',
];

export const MainnetReadiness: React.FC = () => {
  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <Rocket size={16} className="text-cyan-300" />
          <h2 className="text-base sm:text-lg font-black uppercase tracking-[0.15em] text-white">Mainnet Audit Readiness</h2>
        </div>
        <p className="text-xs sm:text-sm text-white/70 mt-2">
          Daha ferah, kutu tipli operasyon görünümü. Aşağıdaki maddeler tamamlandığında mainnet geçişi çok daha güvenli olur.
        </p>
        <p className="text-xs sm:text-sm text-white/70 mt-2">Daha ferah, kutu tipli operasyon görünümü. Aşağıdaki maddeler tamamlandığında mainnet geçişi çok daha güvenli olur.</p>
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-6 space-y-5">
      <header>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-[0.2em] text-white">Mainnet Audit Readiness</h2>
        <p className="text-xs text-white/50 mt-1">Bu kontrol listesi tamamlandığında ürününüz audit-level ve production-level güvene yaklaşır.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {checklist.map((item, index) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-[#101a2d]/85 p-3.5">
            {index < 4 ? (
              <BadgeCheck size={15} className="text-emerald-400 mt-0.5" />
            ) : (
              <CircleDashed size={15} className="text-amber-400 mt-0.5" />
            )}
            <p className="text-xs text-white/85 leading-relaxed">{item}</p>
            {index < 4 ? <BadgeCheck size={15} className="text-emerald-400 mt-0.5" /> : <CircleDashed size={15} className="text-amber-400 mt-0.5" />}
            <p className="text-xs text-white/85 leading-relaxed">{item}</p>
          <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            {index < 3 ? <BadgeCheck size={15} className="text-emerald-400 mt-0.5" /> : <CircleDashed size={15} className="text-amber-400 mt-0.5" />}
            <p className="text-xs text-white/80 leading-relaxed">{item}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-cyan-200 text-sm font-semibold">
          <Shield size={15} /> Security baseline references
        </div>
        <a
          href="https://owasp.org/www-project-smart-contract-top-10/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/50 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/20"
        >
          <FileCheck2 size={14} /> OWASP Smart Contract Top 10
        </a>
      </div>
      <a
        href="https://owasp.org/www-project-smart-contract-top-10/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-500/10"
      >
        <FileCheck2 size={14} /> OWASP Smart Contract Top 10
      </a>
    </section>
  );
};
