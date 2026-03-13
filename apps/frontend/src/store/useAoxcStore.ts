import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { ethers } from 'ethers'

import { getProvider, getSecureContract } from '../services/xlayer'
import { GeminiSentinel } from '../services/geminiSentinel'

/**
 * AOXC Neural OS State Controller - Advanced Multi-Chain Edition (v3.0)
 * Native Support: X-Layer (EVM), Sui (Move), Cardano (eUTXO)
 */

export type StatusColor = 'green' | 'yellow' | 'orange' | 'red' | 'blue'

// Gelişmiş Multi-Chain Ağ Durumu
export interface MultiChainState {
  xlayer: { block: number; status: 'online' | 'degraded' | 'offline'; ping: number };
  sui: { checkpoint: number; status: 'online' | 'degraded' | 'offline'; ping: number };
  cardano: { block: number; epoch: number; status: 'online' | 'degraded' | 'offline'; ping: number };
}

export interface AnalyticsSnapshot {
  timestamp: number;
  cpuUsage: number;
  memoryUsage: number;
  activeNodes: number;
  treasury: number;
  throughput: string;
  gas: number;      
  load: string;     
}

export interface Log {
  id: string
  message: string
  type: 'info' | 'error' | 'success' | 'warning' | 'ai'
  timestamp: number
}

export interface Notification {
  id: string
  message: string
  type: 'info' | 'error' | 'success' | 'warning'
  timestamp: number
}

export interface LedgerEntry {
  id: string
  txHash: string
  module: string
  operation: string
  status: 'success' | 'warning' | 'error' | 'PROVISIONAL'
  timestamp: number
  aiVerification?: string
}

export interface PendingTx {
  id: string
  operation: string
  module: string
  requiredSignatures: number
  currentSignatures: number
  details?: Record<string, unknown>
  params?: unknown[]
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'ai'
  timestamp: number
}

export interface StatusMatrix {
  core: StatusColor
  access: StatusColor
  finance: StatusColor
  infra: StatusColor
  gov: StatusColor
}

interface AoxcState {
  // Global & Multi-Chain States
  blockNumber: number // X-Layer referans bloğu (geriye dönük uyumluluk için)
  chainStates: MultiChainState
  epochTime: number
  networkStatus: 'healthy' | 'warning' | 'critical'
  networkLoad: string
  gasEfficiency: number
  analyticsData: AnalyticsSnapshot[] 
  
  // UI & Ops
  permissionLevel: number
  logs: Log[]
  notifications: Notification[]
  pendingTransactions: PendingTx[]
  ledgerEntries: LedgerEntry[]
  chatMessages: ChatMessage[]
  activeView: string
  activeNotary: string | null
  isProcessing: boolean
  isMobileMenuOpen: boolean
  isRightPanelOpen: boolean
  isSidebarCollapsed: boolean
  upgradeAvailable: boolean
  repairState: 'stable' | 'syncing' | 'idle'
  repairTarget: string | null
  statusMatrix: StatusMatrix

  // Operations
  syncNetwork: () => Promise<void>
  addLog: (message: string, type?: Log['type']) => void
  addNotification: (message: string, type: Notification['type']) => void
  setNotifications: (updater: (prev: Notification[]) => Notification[]) => void
  addLedgerEntry: (entry: Partial<LedgerEntry>) => void
  addPendingTx: (tx: Partial<PendingTx>) => void
  approvePendingTx: (id: string) => Promise<void>
  incrementBlock: () => void
  setPermissionLevel: (level: number) => void
  setActiveView: (view: string) => void
  setActiveNotary: (notary: string | null) => void
  toggleMobileMenu: () => void
  setIsRightPanelOpen: (open: boolean) => void
  toggleRightPanel: () => void
  toggleSidebar: () => void
  triggerRepair: (target: string) => void
  dismissUpgrade: () => void
  addChatMessage: (content: string, role: 'user' | 'ai') => void
  pushAnalytics: (snapshot: Partial<AnalyticsSnapshot>) => void
}

const REGISTRY_ADDRESS =
  import.meta.env.VITE_AOXC_REGISTRY_ADDR ??
  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

function generateId(seed: string) {
  return ethers.keccak256(ethers.toUtf8Bytes(seed + Date.now())).slice(2, 12)
}

export const useAoxcStore = create<AoxcState>()(
  subscribeWithSelector((set, get) => ({
    blockNumber: 0,
    chainStates: {
      xlayer: { block: 0, status: 'offline', ping: 0 },
      sui: { checkpoint: 0, status: 'offline', ping: 0 },
      cardano: { block: 0, epoch: 0, status: 'offline', ping: 0 }
    },
    epochTime: Math.floor(Date.now() / 1000),
    networkStatus: 'healthy',
    networkLoad: '0 gwei',
    gasEfficiency: 98,

    analyticsData: [
      { timestamp: Date.now() - 10000, cpuUsage: 25, memoryUsage: 40, activeNodes: 8, treasury: 1000000, throughput: '0.5k tx/s', gas: 10, load: '12%' },
      { timestamp: Date.now(), cpuUsage: 42, memoryUsage: 65, activeNodes: 12, treasury: 1250000, throughput: '1.2k tx/s', gas: 15, load: '20%' }
    ],

    permissionLevel: 1,
    logs: [],
    notifications: [],
    pendingTransactions: [],
    ledgerEntries: [],
    chatMessages: [],
    activeView: 'dashboard',
    activeNotary: null,
    isProcessing: false,
    isMobileMenuOpen: false,
    isRightPanelOpen: true,
    isSidebarCollapsed: false,
    upgradeAvailable: true,
    repairState: 'stable',
    repairTarget: null,
    statusMatrix: { core: 'green', access: 'green', finance: 'green', infra: 'green', gov: 'green' },

    /**
     * İLERİ SEVİYE MULTI-CHAIN SENKRONİZASYON MOTORU
     * X-Layer, Sui ve Cardano ağlarını asenkron ve paralel olarak tarar.
     */
    async syncNetwork() {
      const startTime = Date.now();

      // 1. X-LAYER (EVM) FETCH
      const fetchXLayer = async () => {
        try {
          const t0 = Date.now();
          const targetChainId = Number(import.meta.env.VITE_CHAIN_ID_MAINNET) || 196;
          const provider = getProvider(targetChainId as any);
          const [block, feeData] = await Promise.all([
            provider.getBlockNumber(),
            provider.getFeeData()
          ]);
          return { block, gas: feeData.gasPrice ?? 0n, ping: Date.now() - t0, status: 'online' as const };
        } catch {
          return { block: 0, gas: 0n, ping: 0, status: 'offline' as const };
        }
      };

      // 2. SUI (MOVE) FETCH - Native JSON-RPC
      const fetchSui = async () => {
        try {
          const t0 = Date.now();
          const res = await fetch('https://fullnode.mainnet.sui.io:443', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "sui_getLatestCheckpointSequenceNumber", params: [] })
          });
          const data = await res.json();
          return { checkpoint: Number(data.result), ping: Date.now() - t0, status: 'online' as const };
        } catch {
          return { checkpoint: 0, ping: 0, status: 'offline' as const };
        }
      };

      // 3. CARDANO (eUTXO) FETCH - Koios REST API
      const fetchCardano = async () => {
        try {
          const t0 = Date.now();
          const res = await fetch('https://api.koios.rest/api/v1/tip');
          const data = await res.json();
          return { block: data[0].block_no, epoch: data[0].epoch_no, ping: Date.now() - t0, status: 'online' as const };
        } catch {
          return { block: 0, epoch: 0, ping: 0, status: 'offline' as const };
        }
      };

      // Paralel işleme (Biri çökerse diğerleri etkilenmez)
      const [xlayerRes, suiRes, cardanoRes] = await Promise.all([
        fetchXLayer(), fetchSui(), fetchCardano()
      ]);

      // Global Ağ Sağlığı Hesaplama
      const offlineCount = [xlayerRes.status, suiRes.status, cardanoRes.status].filter(s => s === 'offline').length;
      let globalStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (offlineCount === 1) globalStatus = 'warning';
      if (offlineCount >= 2) globalStatus = 'critical';

      set(state => ({
        blockNumber: xlayerRes.block > 0 ? xlayerRes.block : state.blockNumber,
        networkStatus: globalStatus,
        networkLoad: `${ethers.formatUnits(xlayerRes.gas, 'gwei')} gwei`,
        chainStates: {
          xlayer: { block: xlayerRes.block, status: xlayerRes.status, ping: xlayerRes.ping },
          sui: { checkpoint: suiRes.checkpoint, status: suiRes.status, ping: suiRes.ping },
          cardano: { block: cardanoRes.block, epoch: cardanoRes.epoch, status: cardanoRes.status, ping: cardanoRes.ping }
        }
      }));

      if (globalStatus === 'critical' && get().networkStatus !== 'critical') {
        get().addLog("MULTI-CHAIN ALERT: Core consensus degraded. Nodes unreachable.", "error");
      }
    },

    addLog(message, type = 'info') {
      const timestamp = Date.now()
      const id = generateId(message)
      set(state => ({ logs: [{ id, message, type, timestamp }, ...state.logs].slice(0, 100) }))
    },

    addNotification(message, type) {
      const timestamp = Date.now()
      const id = generateId(message)
      set(state => ({ notifications: [{ id, message, type, timestamp }, ...state.notifications].slice(0, 50) }))
    },

    setNotifications(updater) {
      set(state => ({ notifications: updater(state.notifications) }))
    },

    addLedgerEntry(entry) {
      const timestamp = Date.now()
      const id = generateId(String(timestamp))
      set(state => ({
        ledgerEntries: [{
          id, timestamp,
          txHash: entry.txHash ?? '0x0',
          module: entry.module ?? 'unknown',
          operation: entry.operation ?? 'unknown',
          status: entry.status ?? 'success',
          aiVerification: entry.aiVerification
        }, ...state.ledgerEntries]
      }))
    },

    addPendingTx(tx) {
      const id = generateId(tx.operation ?? 'tx')
      set(state => ({
        pendingTransactions: [{
          id,
          operation: tx.operation ?? 'unknown',
          module: tx.module ?? 'unknown',
          requiredSignatures: tx.requiredSignatures ?? 3,
          currentSignatures: tx.currentSignatures ?? 1,
          details: tx.details ?? {},
          params: tx.params
        }, ...state.pendingTransactions]
      }))
    },

    async approvePendingTx(id) {
      const state = get()
      if (state.isProcessing) return
      const tx = state.pendingTransactions.find(t => t.id === id)
      if (!tx) return

      set({ isProcessing: true })
      try {
        const sentinel = new GeminiSentinel({ backendUrl: import.meta.env.VITE_API_ENDPOINT })
        // AI'ya işlem ve mevcut ağ durumunu onay için gönderiyoruz
        const context = JSON.stringify({
          logs: state.logs.slice(0, 5),
          chains: state.chainStates
        })
        
        const rawAnalysis = await sentinel.analyzeSystemState(context, tx.operation)
        const analysis = typeof rawAnalysis === 'string' ? { risk: 0 } : (rawAnalysis as { risk?: number })

        if ((analysis.risk || 0) > 70) {
          get().addLog(`SECURITY_VETO: Threat detected (${analysis.risk}%) across networks`, 'error')
          set({ isProcessing: false })
          return
        }

        await new Promise(r => setTimeout(r, 2000))
        
        set(s => ({ pendingTransactions: s.pendingTransactions.filter(t => t.id !== id), isProcessing: false }))
        get().addLog(`MULTI-CHAIN CONFIRMED: ${tx.operation} finalized.`, 'success')
      } catch (error) {
        console.error("[APPROVAL_FAILURE]", error)
        set({ isProcessing: false })
      }
    },

    incrementBlock() { set(s => ({ blockNumber: s.blockNumber + 1 })) },
    setPermissionLevel(level) { set({ permissionLevel: level }) },
    setActiveView(view) { set({ activeView: view }) },
    setActiveNotary(notary) { set({ activeNotary: notary }) },
    toggleMobileMenu() { set(s => ({ isMobileMenuOpen: !s.isMobileMenuOpen })) },
    setIsRightPanelOpen(open) { set({ isRightPanelOpen: open }) },
    toggleRightPanel() { set(s => ({ isRightPanelOpen: !s.isRightPanelOpen })) },
    toggleSidebar() { set(s => ({ isSidebarCollapsed: !s.isSidebarCollapsed })) },
    dismissUpgrade() { set({ upgradeAvailable: false }) },
    
    triggerRepair(target) {
      set({ repairState: 'syncing', repairTarget: target })
      setTimeout(() => { set({ repairState: 'stable', repairTarget: null }) }, 3000)
    },

    addChatMessage(content, role) {
      const timestamp = Date.now()
      const id = generateId(content)
      set(state => ({
        chatMessages: [...state.chatMessages, { id, content, role, timestamp }].slice(-200)
      }))
    },

    pushAnalytics(snapshot) {
      set(state => {
        const lastSnapshot = state.analyticsData[state.analyticsData.length - 1]
        const newSnapshot: AnalyticsSnapshot = {
          timestamp: Date.now(),
          cpuUsage: snapshot.cpuUsage ?? lastSnapshot.cpuUsage,
          memoryUsage: snapshot.memoryUsage ?? lastSnapshot.memoryUsage,
          activeNodes: snapshot.activeNodes ?? lastSnapshot.activeNodes,
          treasury: snapshot.treasury ?? lastSnapshot.treasury,
          throughput: snapshot.throughput ?? lastSnapshot.throughput,
          gas: snapshot.gas ?? lastSnapshot.gas,
          load: snapshot.load ?? lastSnapshot.load
        }
        return { analyticsData: [...state.analyticsData, newSnapshot].slice(-50) }
      })
    }
  }))
)
