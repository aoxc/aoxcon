'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Play, 
  Square, 
  Settings2, 
  Terminal, 
  Github, 
  Cpu, 
  ShieldCheck, 
  BrainCircuit, 
  Users,
  RefreshCcw,
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const releases = [
  { version: 'v1.2.4-stable', date: '2026-03-10', status: 'Latest' },
  { version: 'v1.2.3-stable', date: '2026-02-28', status: 'Legacy' },
  { version: 'v1.3.0-beta', date: '2026-03-15', status: 'Experimental' },
];

const nodeModes = [
  { 
    id: 'validator', 
    name: 'Validator Node', 
    icon: ShieldCheck, 
    color: 'text-aox-blue',
    desc: 'Participate in consensus and secure the network. Requires 100k AOXC stake.'
  },
  { 
    id: 'dao', 
    name: 'DAO Governance', 
    icon: Users, 
    color: 'text-aox-gold',
    desc: 'Run a proposal-aware node for voting and community orchestration.'
  },
  { 
    id: 'ai', 
    name: 'AI Synapse Node', 
    icon: BrainCircuit, 
    color: 'text-aox-green',
    desc: 'Contribute compute power to the neural layer and earn synapse rewards.'
  },
];

export default function NodeManager() {
  const [selectedVersion, setSelectedVersion] = useState(releases[0].version);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [activeMode, setActiveMode] = useState('validator');
  const [logs, setLogs] = useState<string[]>([]);

  const handleDownload = () => {
    setIsDownloading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsDownloading(false);
        setIsDownloaded(true);
      }
      setDownloadProgress(progress);
    }, 300);
  };

  const toggleNode = () => {
    if (isRunning) {
      setIsRunning(false);
      addLog('Node shutdown sequence initiated...');
      addLog('Local RPC server stopped.');
    } else {
      setIsRunning(true);
      addLog(`Starting AOXChain Node ${selectedVersion}...`);
      addLog(`Mode: ${activeMode.toUpperCase()}`);
      addLog('Initializing P2P discovery...');
      addLog('Connecting to Mainnet bootnodes...');
      addLog('Local RPC listening on localhost:2626');
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold leading-[1.1] tracking-tighter uppercase break-words">Node Forge</h2>
        <p className="text-white/50 max-w-2xl text-sm break-words">Download, configure, and run your local AOXCORE node. Sync with the global chain or contribute compute.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Release Selection & Download */}
          <div className="aox-widget relative overflow-hidden">
            <div className="aox-card-inner !p-8">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Github className="w-32 h-32" />
              </div>
              
              <h3 className="text-display-md !text-xl mb-6 flex items-center gap-2">
                <Download className="w-5 h-5 text-aox-blue" />
                Binary Management
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {releases.map((rel) => (
                    <button
                      key={rel.version}
                      onClick={() => setSelectedVersion(rel.version)}
                      className={cn(
                        "p-4 rounded-xl border transition-all text-left group",
                        selectedVersion === rel.version 
                          ? "bg-aox-blue/10 border-aox-blue" 
                          : "bg-white/5 border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold">{rel.version}</span>
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded",
                          rel.status === 'Latest' ? "bg-aox-green/20 text-aox-green" : "bg-white/10 text-white/40"
                        )}>
                          {rel.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/40 font-mono">{rel.date}</p>
                    </button>
                  ))}
                </div>

                {!isDownloaded ? (
                  <div className="space-y-4">
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full py-4 bg-aox-blue text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(0,112,243,0.4)] transition-all disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCcw className="w-5 h-5 animate-spin" />
                          Downloading {Math.floor(downloadProgress)}%
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          Download {selectedVersion}
                        </>
                      )}
                    </button>
                    {isDownloading && (
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-aox-blue"
                          initial={{ width: 0 }}
                          animate={{ width: `${downloadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-aox-green/5 border border-aox-green/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-aox-green" />
                      <div>
                        <p className="text-sm font-bold">{selectedVersion} Ready</p>
                        <p className="text-[10px] text-white/40">Binary verified and checksum matched.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsDownloaded(false)}
                      className="text-[10px] font-mono text-white/30 hover:text-white transition-colors"
                    >
                      Re-download
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-4">
            <h3 className="text-display-md !text-xl">Operation Mode</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nodeModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => !isRunning && setActiveMode(mode.id)}
                  className={cn(
                    "aox-widget text-left transition-all relative group",
                    activeMode === mode.id ? "border-white/40 bg-white/5" : "hover:border-white/20",
                    isRunning && activeMode !== mode.id && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="aox-card-inner !p-6">
                    <mode.icon className={cn("w-8 h-8 mb-4", mode.color)} />
                    <h4 className="font-bold mb-2 uppercase tracking-tight">{mode.name}</h4>
                    <p className="text-[10px] text-white/50 leading-relaxed">{mode.desc}</p>
                    {activeMode === mode.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Node Control */}
          <div className="aox-widget">
            <div className="aox-card-inner !p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-display-md !text-xl">Node Control</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Manage local instance lifecycle</p>
                </div>
                <button
                  onClick={toggleNode}
                  disabled={!isDownloaded}
                  className={cn(
                    "px-8 py-3 rounded-xl font-bold flex items-center gap-3 transition-all uppercase tracking-widest text-xs",
                    isRunning 
                      ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white" 
                      : "bg-aox-green text-black hover:shadow-[0_0_20px_rgba(0,255,65,0.4)] disabled:opacity-50"
                  )}
                >
                  {isRunning ? (
                    <>
                      <Square className="w-5 h-5 fill-current" />
                      Stop Node
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 fill-current" />
                      Start Node
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Status</p>
                  <p className={cn("text-sm font-bold", isRunning ? "text-aox-green" : "text-white/20")}>
                    {isRunning ? 'RUNNING' : 'OFFLINE'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Peers</p>
                  <p className="text-sm font-bold">{isRunning ? '24 Connected' : '0'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Block Height</p>
                  <p className="text-sm font-bold">{isRunning ? '1,245,892' : '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">CPU Usage</p>
                  <p className="text-sm font-bold">{isRunning ? '12.4%' : '0%'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Console / Logs */}
        <div className="space-y-8">
          <div className="aox-widget flex flex-col h-[600px] overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-white/40" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Node Console</span>
              </div>
              <button 
                onClick={() => setLogs([])}
                className="text-[10px] font-mono text-white/30 hover:text-white transition-colors uppercase tracking-widest"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10">
              {logs.length === 0 && (
                <p className="text-white/20 italic">Waiting for node activity...</p>
              )}
              {logs.map((log, i) => (
                <div key={i} className="text-white/60">
                  <span className="text-aox-green mr-2">➜</span>
                  {log}
                </div>
              ))}
            </div>
            <div className="p-4 bg-black/40 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-aox-green font-mono text-xs">$</span>
                <input 
                  type="text" 
                  placeholder="Enter node command..."
                  className="bg-transparent border-none outline-none text-xs font-mono w-full text-white/80"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addLog(`Executing: ${(e.target as HTMLInputElement).value}`);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="aox-widget bg-aox-gold/5 border-aox-gold/20">
            <div className="aox-card-inner !p-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-aox-gold mt-0.5" />
                <div className="space-y-2">
                  <p className="text-xs font-bold text-aox-gold uppercase tracking-widest">Hardware Warning</p>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Validator mode requires at least 16GB RAM and 500GB NVMe storage for optimal performance. Current system detected: 8GB RAM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
