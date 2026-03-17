'use client';

import React from 'react';
import {
  Brain,
  CheckCircle2,
  ExternalLink,
  FileCode2,
  GitBranch,
  GitPullRequest,
  ShieldCheck,
  Vote,
  Workflow,
} from 'lucide-react';

const repositories = [
  {
    name: 'aoxcon',
    role: 'Control Plane & Operations',
    detail:
      'Policy flow, lifecycle orchestration, approval tracking, and operational visibility for all contract modules.',
    url: 'https://github.com/aoxc/aoxcon',
  },
  {
    name: 'aoxcore-xlayer',
    role: 'EVM Execution Module',
    detail:
      'Solidity execution layer for EVM-compatible deployments. Primary domain: X Layer.',
    url: 'https://github.com/aoxc/aoxcore-xlayer',
  },
  {
    name: 'aoxcore-sui',
    role: 'Move / Object-State Module',
    detail:
      'Object-centric contract execution, state transitions, and storage-oriented workflows for Move VM semantics.',
    url: 'https://github.com/aoxc/aoxcore-sui',
  },
  {
    name: 'aoxcore-cardano',
    role: 'UTXO Validation Module',
    detail:
      'Validation-first contract and transaction controls aligned with UTXO-style execution constraints.',
    url: 'https://github.com/aoxc/aoxcore-cardano',
  },
];

const approvedContracts = [
  {
    id: 'AOXC-EVM-001',
    module: 'EVM Execution Module',
    version: 'v2.4.1',
    state: 'Approved',
    audit: '2/2 Passed',
    proposal: 'GOV-221',
  },
  {
    id: 'AOXC-MOVE-014',
    module: 'Move / Object-State Module',
    version: 'v1.9.3',
    state: 'Approved',
    audit: '3/3 Passed',
    proposal: 'GOV-227',
  },
  {
    id: 'AOXC-UTXO-007',
    module: 'UTXO Validation Module',
    version: 'v1.5.0',
    state: 'Approved',
    audit: '2/2 Passed',
    proposal: 'GOV-233',
  },
];

const approvalPipeline = [
  { step: 'Spec Lock', owner: 'Architecture Council', status: 'Complete' },
  { step: 'AI Risk Review', owner: 'Sentinel AI', status: 'Complete' },
  { step: 'Security Audit', owner: 'CoreSec Team', status: 'Complete' },
  { step: 'Governance Vote', owner: 'DAO Voters', status: 'Active' },
  { step: 'Runtime Promotion', owner: 'Ops Control Plane', status: 'Queued' },
];

export default function DeveloperView() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h2 className="text-4xl font-display font-bold uppercase tracking-tighter">Contract Command Pro</h2>
        <p className="text-white/50 max-w-4xl">
          Onaylı sözleşmelerin yaşam döngüsünü yönetin: öneri, denetim, oylama, onay ve yayınlama. Modüller ağ adına göre değil VM yürütme modeline göre yönetilir.
        </p>
      </header>

      <section className="aox-widget p-6 md:p-8 space-y-5">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-aox-blue" />
          <h3 className="font-display text-xl font-bold">GitHub-Linked Ecosystem Repositories</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repositories.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-black/40 p-5 hover:border-aox-blue/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-mono text-xs text-aox-blue">{repo.name}</p>
                <ExternalLink className="w-4 h-4 text-white/40" />
              </div>
              <p className="font-semibold mb-1">{repo.role}</p>
              <p className="text-sm text-white/50 leading-relaxed">{repo.detail}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 aox-widget p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-aox-green" />
            <h3 className="font-display text-xl font-bold">Approved Contract Registry</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/40 border-b border-white/10">
                  <th className="py-3 pr-4">Contract ID</th>
                  <th className="py-3 pr-4">VM Module</th>
                  <th className="py-3 pr-4">Version</th>
                  <th className="py-3 pr-4">Audit</th>
                  <th className="py-3 pr-4">Governance</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedContracts.map((item) => (
                  <tr key={item.id} className="border-b border-white/5">
                    <td className="py-3 pr-4 font-mono text-xs text-aox-blue">{item.id}</td>
                    <td className="py-3 pr-4">{item.module}</td>
                    <td className="py-3 pr-4">{item.version}</td>
                    <td className="py-3 pr-4">{item.audit}</td>
                    <td className="py-3 pr-4 font-mono text-xs">{item.proposal}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 rounded bg-aox-green/10 text-aox-green text-xs border border-aox-green/30">
                        {item.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="aox-widget p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Workflow className="w-5 h-5 text-aox-gold" />
            <h3 className="font-display text-xl font-bold">Approval Flow</h3>
          </div>
          <div className="space-y-3">
            {approvalPipeline.map((phase) => (
              <div key={phase.step} className="p-3 rounded-lg bg-black/40 border border-white/10">
                <p className="font-semibold text-sm">{phase.step}</p>
                <p className="text-xs text-white/40">Owner: {phase.owner}</p>
                <p className="text-xs mt-1 font-mono">{phase.status}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aox-widget p-6 md:p-8">
          <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
            <Vote className="w-5 h-5 text-aox-blue" />
            Development Voting Ops
          </h3>
          <p className="text-sm text-white/50 mb-4">
            Sözleşme yükseltmeleri sadece governance oylaması sonrası production’a çıkar. Onaylanan paketler otomatik olarak deployment backlog’una alınır.
          </p>
          <div className="text-xs font-mono space-y-2 text-white/70">
            <p>• Minimum quorum: 67%</p>
            <p>• Security veto window: 24h</p>
            <p>• Rollout policy: canary → phased → full</p>
          </div>
        </div>

        <div className="aox-widget p-6 md:p-8 border-aox-blue/30">
          <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2 text-aox-blue">
            <Brain className="w-5 h-5" />
            AI Contract Co-Pilot
          </h3>
          <p className="text-sm text-white/50 mb-4">
            AI katmanı PR diff, ABI değişimi, storage layout drift, erişim kontrolü ve oylama etkisini değerlendirir; merge öncesi risk skoru üretir.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-black/40 border border-white/10">
              <p className="text-white/40">Risk Score</p>
              <p className="text-lg font-bold">Low</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10">
              <p className="text-white/40">Auto Checks</p>
              <p className="text-lg font-bold">12/12</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10">
              <p className="text-white/40">Pending PR</p>
              <p className="text-lg font-bold">3</p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/10">
              <p className="text-white/40">Hotfix Gate</p>
              <p className="text-lg font-bold">Enabled</p>
            </div>
          </div>
        </div>
      </section>

      <section className="aox-widget p-6 md:p-8">
        <h3 className="font-display text-xl font-bold mb-3 flex items-center gap-2">
          <GitPullRequest className="w-5 h-5 text-aox-green" />
          Direct GitHub Operations
        </h3>
        <p className="text-sm text-white/50 mb-4">
          Tüm sözleşme güncellemeleri AOXC organizasyonundaki ilgili repoya PR olarak açılır ve onay politikalarıyla kontrol edilir.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="https://github.com/aoxc" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-widest">Open AOXC Org</a>
          <a href="https://github.com/aoxc/aoxcon" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">aoxcon</a>
          <a href="https://github.com/aoxc/aoxcore-xlayer" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">EVM Module</a>
          <a href="https://github.com/aoxc/aoxcore-sui" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">Move Module</a>
          <a href="https://github.com/aoxc/aoxcore-cardano" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest">UTXO Module</a>
        </div>
      </section>
    </div>
  );
}
