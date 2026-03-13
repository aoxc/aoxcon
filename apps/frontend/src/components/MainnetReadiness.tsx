import React from 'react';
import { BadgeCheck, CircleDashed, FileCheck2 } from 'lucide-react';

const checklist = [
  'Smart contract unit/integration test coverage > %90',
  'Static analysis + SAST (Slither, Mythril, Semgrep) tamamlandı',
  '3rd-party bağımsız audit raporu yayınlandı',
  'Bug bounty (Immunefi/HackenProof) aktif',
  'Multi-sig + timelock ve acil durdurma prosedürü test edildi',
  'X Layer / Sui / Cardano üzerinde gerçek mainnet smoke testleri geçti',
  'Monitoring + alerting (RPC latency, failover, incident runbook) aktif',
  'Gerçek linkler, explorer tx linkleri ve legal sayfalar doğrulandı',
];

export const MainnetReadiness: React.FC = () => {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-6 space-y-5">
      <header>
        <h2 className="text-sm sm:text-base font-black uppercase tracking-[0.2em] text-white">Mainnet Audit Readiness</h2>
        <p className="text-xs text-white/50 mt-1">Bu kontrol listesi tamamlandığında ürününüz audit-level ve production-level güvene yaklaşır.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {checklist.map((item, index) => (
          <div key={item} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            {index < 3 ? <BadgeCheck size={15} className="text-emerald-400 mt-0.5" /> : <CircleDashed size={15} className="text-amber-400 mt-0.5" />}
            <p className="text-xs text-white/80 leading-relaxed">{item}</p>
          </div>
        ))}
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
