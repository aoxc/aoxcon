'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Terminal, Activity, Zap, Brain, Play, Square, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const efficiencyData = [
  { name: 'A#401', value: 94 },
  { name: 'A#402', value: 88 },
  { name: 'A#403', value: 97 },
  { name: 'A#404', value: 82 },
  { name: 'A#405', value: 91 },
];

const initialLogs = [
  "System initialized. Synapse Layer v2.4.0",
  "Connecting to aoxchain-synapse WebSocket...",
  "Agent #402: Arbitrage opportunity detected between X Layer and Sui.",
  "Agent #402: Executing cross-chain swap sequence...",
  "Agent #403: Learning from Plutus contract patterns...",
  "Agent #401: Optimizing gas usage for EVM batch transactions.",
  "Neural network sync complete. 42 active synapses.",
];

export default function SynapseControl() {
  const [logs, setLogs] = useState<string[]>(initialLogs);
  const [isExecuting, setIsExecuting] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [command, setCommand] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isExecuting) return;

    const interval = setInterval(() => {
      const newLog = `Agent #${Math.floor(Math.random() * 100 + 400)}: ${
        [
          "Analyzing liquidity pools...",
          "Predicting market volatility...",
          "Verifying smart contract integrity...",
          "Optimizing neural weights...",
          "Executing autonomous trade...",
          "Scanning for security vulnerabilities..."
        ][Math.floor(Math.random() * 6)]
      }`;
      setLogs(prev => [...prev.slice(-15), newLog]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isExecuting]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const newLog = `> ${command}`;
    setLogs(prev => [...prev.slice(-15), newLog]);
    
    // Simulate response
    setTimeout(() => {
      let response = '';
      const cmd = command.toLowerCase().trim();
      if (cmd === '/ping') response = 'System: Pong. Latency 14ms.';
      else if (cmd === '/status') response = 'System: All 42 synapses operational. Network stable.';
      else if (cmd === '/deploy') response = 'System: Deployment initiated on X Layer...';
      else if (cmd === '/clear') {
        setLogs(["Terminal cleared."]);
        setCommand('');
        return;
      }
      else response = `System: Command not recognized: ${command}`;
      
      setLogs(prev => [...prev.slice(-15), response]);
    }, 600);

    setCommand('');
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">SYNAPSE CONTROL</h2>
          <p className="text-white/50 max-w-2xl text-sm break-words">Autonomous AI Agents managing multichain operations via aoxchain-synapse.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsExecuting(!isExecuting)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-xs uppercase tracking-widest",
              isExecuting 
                ? "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20" 
                : "bg-aox-green/10 text-aox-green border border-aox-green/20 hover:bg-aox-green/20"
            )}
          >
            {isExecuting ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isExecuting ? "HALT AGENTS" : "RESUME AGENTS"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="aox-widget">
              <div className="aox-card-inner">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-5 h-5 text-aox-green" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Learning Rate</h4>
                </div>
                <div className="text-3xl font-display font-bold">0.0042</div>
                <p className="text-[10px] text-aox-green mt-2 font-mono uppercase tracking-widest">+12% from last epoch</p>
              </div>
            </div>
            <div className="aox-widget">
              <div className="aox-card-inner">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-aox-gold" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Executions</h4>
                </div>
                <div className="text-3xl font-display font-bold">1,482</div>
                <p className="text-[10px] text-white/40 mt-2 font-mono uppercase tracking-widest">Last 24 hours</p>
              </div>
            </div>
            <div className="aox-widget">
              <div className="aox-card-inner">
                <div className="flex items-center gap-3 mb-4">
                  <Activity className="w-5 h-5 text-aox-blue" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Gas Saved</h4>
                </div>
                <div className="text-3xl font-display font-bold">14.8 ETH</div>
                <p className="text-[10px] text-aox-green mt-2 font-mono uppercase tracking-widest">AI Optimization active</p>
              </div>
            </div>
          </div>

          <div className="aox-widget">
            <div className="aox-card-inner">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">Agent Efficiency Graph</h3>
                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <RefreshCcw className="w-4 h-4 text-white/40" />
                </button>
              </div>
              <div className="h-[300px] w-full">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={efficiencyData}>
                      <XAxis 
                        dataKey="name" 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#ffffff20" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {efficiencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value > 90 ? '#00FF41' : '#0070F3'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="aox-widget flex flex-col overflow-hidden border-aox-green/20">
          <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-aox-green" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Neural Feed</span>
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-aox-gold/50" />
              <div className="w-2 h-2 rounded-full bg-aox-green/50" />
            </div>
          </div>
          <div 
            ref={scrollRef}
            className="flex-1 p-6 font-mono text-[10px] space-y-2 overflow-y-auto bg-black/40 scroll-smooth"
          >
            <AnimatePresence mode="popLayout">
              {logs.map((log, i) => (
                <motion.div
                  key={log + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-3"
                >
                  <span className="text-white/20">[{new Date().toLocaleTimeString()}]</span>
                  <span className={cn(
                    log.includes('Agent') ? "text-aox-green" : "text-white/60",
                    log.includes('Executing') && "font-bold text-aox-gold"
                  )}>
                    {log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {isExecuting && (
              <motion.div 
                animate={{ opacity: [0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-4 bg-aox-green inline-block ml-1"
              />
            )}
          </div>
          <form onSubmit={handleCommandSubmit} className="p-4 bg-black/60 border-t border-white/10 flex items-center gap-3">
            <span className="text-aox-green font-mono text-xs">{'>'}</span>
            <input 
              type="text" 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command (e.g., /status, /ping, /clear)"
              className="bg-transparent border-none outline-none text-xs font-mono text-white w-full placeholder:text-white/20"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
