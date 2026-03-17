'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Wallet, 
  Vote, 
  MessageSquare, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  TrendingUp, 
  Gavel, 
  Settings2,
  Activity,
  Award,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const proposals = [
  {
    id: 'AOXC-12',
    title: 'Integrate Cardano Mesh SDK for Cross-Chain Liquidity',
    status: 'Active',
    votes: { yes: 72, no: 12, abstain: 16 },
    timeLeft: '2d 14h',
    author: '0x71...2a9',
    category: 'Technical',
    description: 'This proposal aims to integrate the Mesh SDK to enable seamless liquidity flow between AOXCHAIN and Cardano, utilizing the Neural Bridge architecture.'
  },
  {
    id: 'AOXC-11',
    title: 'Increase Synapse Layer Learning Rate to 0.005',
    status: 'Passed',
    votes: { yes: 94, no: 2, abstain: 4 },
    timeLeft: 'Ended',
    author: '0x12...f83',
    category: 'AI Config',
    description: 'Optimizing the neural layer for faster convergence in decentralized training tasks.'
  },
  {
    id: 'AOXC-10',
    title: 'Treasury Allocation for Q2 Community Grants',
    status: 'Active',
    votes: { yes: 45, no: 38, abstain: 17 },
    timeLeft: '12h 5m',
    author: '0x99...b12',
    category: 'Treasury',
    description: 'Allocating 500,000 AOXC for community-driven projects and ecosystem development.'
  }
];

const networkParams = [
  { name: 'Base Gas Fee', value: '10 Gwei', change: 'Proposing 12 Gwei' },
  { name: 'Epoch Length', value: '24 Hours', change: 'Stable' },
  { name: 'Slashing Penalty', value: '5%', change: 'Proposing 7%' },
  { name: 'Staking APR', value: '12.4%', change: 'Dynamic' },
];

const validators = [
  { name: 'Cortex-01', stake: '1.2M AOXC', uptime: '99.98%', rewards: '450 AOXC/day', status: 'Active' },
  { name: 'Neural-Node', stake: '850K AOXC', uptime: '99.95%', rewards: '320 AOXC/day', status: 'Active' },
  { name: 'Sui-Sync', stake: '500K AOXC', uptime: '98.20%', rewards: '180 AOXC/day', status: 'Warning' },
];

export default function HighCouncil() {
  const [activeView, setActiveView] = useState<'governance' | 'validators' | 'treasury'>('governance');

  return (
    <div className="py-2 space-y-12">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-aox-gold/20 rounded-xl glow-gold shrink-0">
            <Gavel className="w-8 h-8 text-aox-gold" />
          </div>
          <div className="space-y-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">The High Council</h1>
            <p className="text-[10px] sm:text-xs font-mono text-aox-gold uppercase tracking-[0.3em] break-words">Sovereign Governance Layer</p>
          </div>
        </div>
        <p className="text-white/50 max-w-2xl text-sm leading-relaxed break-words">
          Orchestrating the network&apos;s evolution through decentralized consensus. Manage parameters, oversee validators, and govern the multichain treasury.
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-white/5 pb-6">
        {[
          { id: 'governance', label: 'Governance', icon: Vote, color: 'bg-aox-blue' },
          { id: 'validators', label: 'Validator Hub', icon: ShieldAlert, color: 'bg-aox-green' },
          { id: 'treasury', label: 'Treasury', icon: Wallet, color: 'bg-aox-gold' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest border border-white/5",
              activeView === tab.id 
                ? `${tab.color} text-white shadow-lg` 
                : "text-white/40 hover:text-white hover:bg-white/5"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <div className="xl:col-span-2 space-y-12">
          <AnimatePresence mode="wait">
            {activeView === 'governance' && (
              <motion.div
                key="gov"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Active Proposals</h3>
                  <button className="aox-button bg-aox-blue text-white hover:glow-blue flex items-center gap-2">
                    Propose <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {proposals.map((proposal, i) => (
                    <div key={proposal.id} className="aox-widget group">
                      <div className="aox-card-inner">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-mono px-3 py-1 rounded bg-aox-blue/10 text-aox-blue border border-aox-blue/20 uppercase tracking-widest">
                                {proposal.id}
                              </span>
                              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">
                                {proposal.category}
                              </span>
                            </div>
                            <h4 className="text-2xl font-bold group-hover:text-aox-blue transition-colors tracking-tight">{proposal.title}</h4>
                            <p className="text-sm text-white/50 max-w-xl leading-relaxed">{proposal.description}</p>
                          </div>
                          <div className={cn(
                            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                            proposal.status === 'Active' ? "bg-aox-green/10 text-aox-green border-aox-green/20" : "bg-white/5 text-white/40 border-white/10"
                          )}>
                            {proposal.status}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end">
                          <div className="space-y-4">
                            <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                              <span>Consensus</span>
                              <span className="text-white">{proposal.votes.yes}% Yes</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex">
                              <div className="h-full bg-aox-green" style={{ width: `${proposal.votes.yes}%` }} />
                              <div className="h-full bg-red-500/50" style={{ width: `${proposal.votes.no}%` }} />
                              <div className="h-full bg-white/10" style={{ width: `${proposal.votes.abstain}%` }} />
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-white/20 uppercase tracking-widest">
                              <span>Y: {proposal.votes.yes}%</span>
                              <span>N: {proposal.votes.no}%</span>
                              <span>A: {proposal.votes.abstain}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-12">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Horizon</span>
                              <div className="flex items-center gap-2 text-sm font-bold">
                                <Clock className="w-4 h-4 text-aox-blue" />
                                {proposal.timeLeft}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Architect</span>
                              <span className="text-sm font-bold font-mono text-white/80">{proposal.author}</span>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3">
                            <button className="aox-button bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                              Inspect
                            </button>
                            <button className="aox-button bg-aox-blue text-white hover:glow-blue">
                              Commit Vote
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeView === 'validators' && (
              <motion.div
                key="val"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Active Nodes', value: '128 / 150', progress: 85, color: 'bg-aox-green' },
                    { label: 'Total Staked', value: '42.5M AOXC', sub: '+1.2M this epoch', color: 'bg-aox-blue' },
                    { label: 'Network Health', value: '99.98%', sub: 'Avg. Latency: 1.2s', color: 'bg-aox-green' },
                  ].map((stat, i) => (
                    <div key={i} className="aox-widget">
                      <div className="aox-card-inner space-y-4">
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</p>
                        <div className="text-display-md">{stat.value}</div>
                        {stat.progress ? (
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={cn("h-full", stat.color)} style={{ width: `${stat.progress}%` }} />
                          </div>
                        ) : (
                          <p className="text-[10px] text-aox-green font-mono uppercase tracking-widest">{stat.sub}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="aox-widget overflow-hidden">
                  <div className="aox-card-inner !p-0">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                      <h4 className="font-bold uppercase tracking-widest text-sm">Validator Performance</h4>
                      <button className="text-[10px] font-mono text-white/40 hover:text-white transition-colors uppercase tracking-widest">Telemetry Export</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                            <th className="p-8">Validator</th>
                            <th className="p-8">Total Stake</th>
                            <th className="p-8">Uptime</th>
                            <th className="p-8">Rewards</th>
                            <th className="p-8 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {validators.map((v, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                              <td className="p-8">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-aox-blue/30 transition-colors">
                                    <Activity className="w-5 h-5 text-aox-blue" />
                                  </div>
                                  <span className="font-bold tracking-tight">{v.name}</span>
                                </div>
                              </td>
                              <td className="p-8 font-mono text-sm text-white/80">{v.stake}</td>
                              <td className="p-8 font-mono text-sm text-white/80">{v.uptime}</td>
                              <td className="p-8 font-mono text-sm text-aox-green">{v.rewards}</td>
                              <td className="p-8 text-right">
                                <span className={cn(
                                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                  v.status === 'Active' ? "bg-aox-green/10 text-aox-green border-aox-green/20" : "bg-aox-gold/10 text-aox-gold border-aox-gold/20"
                                )}>
                                  {v.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeView === 'treasury' && (
              <motion.div
                key="tre"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="aox-widget overflow-hidden bg-gradient-to-br from-aox-gold/10 to-transparent">
                  <div className="aox-card-inner relative min-h-[300px] flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                      <Wallet className="w-64 h-64" />
                    </div>
                    <div className="relative z-10 space-y-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">DAO Treasury Orchestration</p>
                        <h3 className="text-display-lg">$12,482,901.42</h3>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { label: 'EVM Assets', value: '$8.2M' },
                          { label: 'Move Assets', value: '$3.1M' },
                          { label: 'Cardano Assets', value: '$1.1M' },
                        ].map((asset, i) => (
                          <div key={i} className="px-6 py-3 rounded-xl bg-black/40 border border-white/5">
                            <p className="text-[9px] text-white/40 font-mono uppercase tracking-widest mb-1">{asset.label}</p>
                            <p className="font-bold text-lg">{asset.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="aox-widget">
                    <div className="aox-card-inner space-y-8">
                      <h4 className="font-display text-lg font-bold uppercase tracking-tight flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-aox-green" />
                        Inflow / Outflow
                      </h4>
                      <div className="space-y-6">
                        {[
                          { label: 'Monthly Revenue', value: '+$420,000', color: 'text-aox-green' },
                          { label: 'Grant Payouts', value: '-$125,000', color: 'text-red-400' },
                          { label: 'Staking Rewards', value: '-$250,000', color: 'text-red-400' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-white/40 uppercase tracking-widest font-mono text-[10px]">{item.label}</span>
                            <span className={cn("text-sm font-bold font-mono", item.color)}>{item.value}</span>
                          </div>
                        ))}
                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-sm font-bold uppercase tracking-widest">Net Position</span>
                          <span className="text-sm font-bold text-aox-green font-mono">+$45,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="aox-widget">
                    <div className="aox-card-inner space-y-8">
                      <h4 className="font-display text-lg font-bold uppercase tracking-tight flex items-center gap-3">
                        <Lock className="w-5 h-5 text-aox-gold" />
                        Locked Assets
                      </h4>
                      <div className="space-y-6">
                        {[
                          { label: 'Ecosystem Fund', value: '5.0M AOXC' },
                          { label: 'Team Vesting', value: '2.5M AOXC' },
                          { label: 'Liquidity Reserve', value: '1.2M AOXC' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-sm text-white/40 uppercase tracking-widest font-mono text-[10px]">{item.label}</span>
                            <span className="text-sm font-bold font-mono">{item.value}</span>
                          </div>
                        ))}
                        <button className="aox-button w-full mt-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white">
                          Vesting Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <div className="aox-widget border-aox-gold/20">
            <div className="aox-card-inner space-y-8">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-aox-gold" />
                Network Params
              </h3>
              <div className="space-y-6">
                {networkParams.map((param, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
                      <span>{param.name}</span>
                      <span className="text-white">{param.value}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest",
                        param.change === 'Stable' ? "text-white/20" : "text-aox-gold"
                      )}>
                        {param.change}
                      </span>
                      {param.change !== 'Stable' && (
                        <button className="text-[10px] font-bold text-aox-gold hover:underline uppercase tracking-widest">Vote</button>
                      )}
                    </div>
                  </div>
                ))}
                <button className="aox-button w-full mt-4 bg-aox-gold text-black hover:glow-gold font-bold">
                  Propose Change
                </button>
              </div>
            </div>
          </div>

          <div className="aox-widget">
            <div className="aox-card-inner space-y-8">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight flex items-center gap-3">
                <Award className="w-5 h-5 text-aox-green" />
                Council Status
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'My Voting Power', value: '12,450 VP' },
                  { label: 'Quorum Threshold', value: '33.4%' },
                  { label: 'Active Delegates', value: '1,245' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{item.label}</span>
                    <span className="text-sm font-bold font-mono">{item.value}</span>
                  </div>
                ))}
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-aox-green/5 border border-aox-green/20">
                    <CheckCircle2 className="w-5 h-5 text-aox-green" />
                    <span className="text-[10px] font-bold text-aox-green uppercase tracking-[0.2em]">Eligible to Vote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="aox-widget">
            <div className="aox-card-inner space-y-8">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight">Recent Activity</h3>
              <div className="space-y-6">
                {[
                  { user: '0x12...a9', action: 'Voted YES on AOX-12', time: '2m ago' },
                  { user: '0x88...f2', action: 'Proposed parameter change', time: '15m ago' },
                  { user: '0x45...c1', action: 'Claimed validator rewards', time: '1h ago' },
                ].map((act, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-aox-blue glow-blue" />
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-bold tracking-tight">{act.action}</p>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{act.user} • {act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
