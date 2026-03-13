import React from 'react';
import { Activity, ExternalLink, Link2, Radio, ShieldCheck } from 'lucide-react';
import { ExternalLink, Link2, Radio, ShieldCheck, Activity } from 'lucide-react';

import { ExternalLink, Link2, Radio, ShieldCheck } from 'lucide-react';

import { cn } from '../lib/utils';
import { useAoxcStore } from '../store/useAoxcStore';

const networks = [
  {
    key: 'xlayer',
    name: 'X Layer Mainnet',
    chainId: '196',
    docs: 'https://www.okx.com/web3/build/docs/waas/introduction-to-xlayer',
    explorer: 'https://www.oklink.com/xlayer',
    rpc: 'https://rpc.xlayer.tech',
    note: 'EVM Layer2 ekosistem işlemleri ve explorer doğrulaması.'
  },
  {
    key: 'sui',
    name: 'Sui Mainnet',
    chainId: 'sui-mainnet',
    docs: 'https://docs.sui.io',
    explorer: 'https://suivision.xyz',
    rpc: 'https://fullnode.mainnet.sui.io:443',
    note: 'Move tabanlı işlemler için checkpoint takibi.'
  },
  {
    key: 'cardano',
    name: 'Cardano Mainnet',
    chainId: '764824073',
    docs: 'https://docs.cardano.org',
    explorer: 'https://cardanoscan.io',
    rpc: 'https://api.koios.rest/api/v1/tip',
    note: 'UTxO temelli ağ için epoch/tip izleme.'
  }
  },
] as const;

export const NetworkHub: React.FC = () => {
  const { chainStates } = useAoxcStore();

  return (
    <section className="space-y-5">
      <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-black tracking-[0.12em] text-white uppercase">Mainnet Connectivity Hub</h2>
        <p className="text-xs sm:text-sm text-white/70 mt-2">
          Gerçek ağ linkleriyle doğrulama yapılır. UI tarafında istekler throttled çalışır; gereksiz RPC spam gönderilmez.
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
    <section className="space-y-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-sm font-black tracking-[0.18em] text-white uppercase">Mainnet Connectivity Hub</h2>
        <p className="text-xs text-white/50">Canlı X Layer, Sui ve Cardano bağlantıları + doğrulanmış mainnet linkleri.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {networks.map((network) => {
          const state = chainStates[network.key];
          const isOnline = state.status === 'online';

          return (
            <article key={network.key} className="rounded-2xl border border-white/10 bg-[#101a2d]/85 p-4 space-y-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{network.name}</h3>
                  <p className="text-[11px] text-white/50 mt-0.5">Chain ID: {network.chainId}</p>
                </div>

                <div
                  className={cn(
                    'inline-flex items-center gap-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border',
                    isOnline ? 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10' : 'text-rose-300 border-rose-400/40 bg-rose-500/10'
                  )}
                >
                <div className={cn('inline-flex items-center gap-2 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border', isOnline ? 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10' : 'text-rose-300 border-rose-400/40 bg-rose-500/10')}>
            <article key={network.key} className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">{network.name}</h3>
                  <p className="text-[11px] text-white/40">Chain: {network.chainId}</p>
                </div>

                <div className={cn('flex items-center gap-2 text-[10px] font-bold uppercase', isOnline ? 'text-emerald-400' : 'text-rose-400')}>
                  <span className={cn('h-2 w-2 rounded-full', isOnline ? 'bg-emerald-400' : 'bg-rose-400')} />
                  {state.status}
                </div>
              </div>

              <p className="text-xs text-white/65 leading-relaxed">{network.note}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="text-white/45 uppercase text-[9px]">Ping</p>
                  <p className="text-cyan-300 mt-1 font-semibold flex items-center gap-1">
                    <Radio size={11} />
                    {state.ping ? `${state.ping}ms` : 'N/A'}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="text-white/45 uppercase text-[9px]">Status</p>
                  <p className="text-white mt-1 font-semibold flex items-center gap-1">
                    <Activity size={11} />
                    {state.status}
                  </p>
                  <p className="text-cyan-300 mt-1 font-semibold flex items-center gap-1"><Radio size={11} />{state.ping ? `${state.ping}ms` : 'N/A'}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5">
                  <p className="text-white/45 uppercase text-[9px]">Status</p>
                  <p className="text-white mt-1 font-semibold flex items-center gap-1"><Activity size={11} />{state.status}</p>
                </div>
              </div>

              <div className="text-[11px] text-white/70 space-y-1">
                {'block' in state && (
                  <p>
                    Block: <span className="text-white">{state.block || 'N/A'}</span>
                  </p>
                )}
                {'checkpoint' in state && (
                  <p>
                    Checkpoint: <span className="text-white">{state.checkpoint || 'N/A'}</span>
                  </p>
                )}
                {'epoch' in state && (
                  <p>
                    Epoch: <span className="text-white">{state.epoch || 'N/A'}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-white/85 hover:border-cyan-400/70"
                  href={network.explorer}
                  target="_blank"
                  rel="noreferrer"
                >
                  Explorer <ExternalLink size={12} />
                </a>
                <a
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-white/85 hover:border-cyan-400/70"
                  href={network.docs}
                  target="_blank"
                  rel="noreferrer"
                >
                  Docs <ShieldCheck size={12} />
                </a>
                <a
                  className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-white/85 hover:border-cyan-400/70"
                  href={network.rpc}
                  target="_blank"
                  rel="noreferrer"
                >
                {'block' in state && <p>Block: <span className="text-white">{state.block || 'N/A'}</span></p>}
                {'checkpoint' in state && <p>Checkpoint: <span className="text-white">{state.checkpoint || 'N/A'}</span></p>}
                {'epoch' in state && <p>Epoch: <span className="text-white">{state.epoch || 'N/A'}</span></p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-white/85 hover:border-cyan-400/70" href={network.explorer} target="_blank" rel="noreferrer">Explorer <ExternalLink size={12} /></a>
                <a className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-white/85 hover:border-cyan-400/70" href={network.docs} target="_blank" rel="noreferrer">Docs <ShieldCheck size={12} /></a>
                <a className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-2 text-[11px] text-white/85 hover:border-cyan-400/70" href={network.rpc} target="_blank" rel="noreferrer">RPC <Link2 size={12} /></a>
              <div className="text-[11px] text-white/60 space-y-1">
                <p className="flex items-center gap-2"><Radio size={12} className="text-cyan-400" /> Ping: {state.ping ? `${state.ping}ms` : 'N/A'}</p>
                {'block' in state && <p>Block: {state.block || 'N/A'}</p>}
                {'checkpoint' in state && <p>Checkpoint: {state.checkpoint || 'N/A'}</p>}
                {'epoch' in state && <p>Epoch: {state.epoch || 'N/A'}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-[11px] text-white/80 hover:border-cyan-400/60" href={network.explorer} target="_blank" rel="noreferrer">
                  Explorer <ExternalLink size={12} />
                </a>
                <a className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-[11px] text-white/80 hover:border-cyan-400/60" href={network.docs} target="_blank" rel="noreferrer">
                  Docs <ShieldCheck size={12} />
                </a>
                <a className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-[11px] text-white/80 hover:border-cyan-400/60" href={network.rpc} target="_blank" rel="noreferrer">
                  RPC <Link2 size={12} />
                </a>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
