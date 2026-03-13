import React, { useState } from 'react'
import { useAoxcStore, PendingTx } from '../store/useAoxcStore'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  CheckCircle,
  Clock,
  UserCheck,
  AlertTriangle,
  Fingerprint,
  RefreshCw,
  Key,
  Database,
  Zap
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '../lib/utils'

/**
 * Audit-Grade Type Definitions
 */
interface TxPayload {
  method: string
  params: unknown[]
}

/**
 * Safely resolves a transaction payload for display.
 * TS2352 hatasını önlemek için unknown üzerinden güvenli cast uygulanmıştır.
 */
function resolvePayload(tx: PendingTx): TxPayload {
  // Store'daki 'details' alanını kontrol et
  if (tx.details && typeof tx.details === 'object' && 'method' in tx.details) {
    return (tx.details as unknown) as TxPayload
  }

  // Fallback: details yoksa ana alanlardan oluştur
  return {
    method: tx.operation,
    params: tx.params ?? []
  }
}

export const PendingSignatures = () => {
  const {
    pendingTransactions,
    approvePendingTx,
    isProcessing
  } = useAoxcStore()

  const { t } = useTranslation()
  const [localProcessing, setLocalProcessing] = useState<string | null>(null)

  const handleSign = async (id: string) => {
    if (isProcessing || localProcessing) return; // Re-entrancy protection
    
    setLocalProcessing(id)
    try {
      await approvePendingTx(id)
    } catch (error) {
      console.error("[AUDIT_LOG] Signature rejected/failed:", error)
    } finally {
      setLocalProcessing(null)
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#050505] relative">
      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-amber-500/[0.04] to-transparent pointer-events-none" />

      {/* HEADER */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md relative z-10">
        <div className="flex flex-col">
          <h2 className="font-mono text-[11px] font-black uppercase tracking-[0.4em] text-amber-500">
            {t('pending.title', 'Awaiting Consensus')}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <Key size={10} className="text-white/20"/>
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">
              Protocol Multi-sig v2.1 // Secure_Relay: ACTIVE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[7px] font-black text-white/20 uppercase tracking-widest">
              Network_Priority
            </span>
            <span className="text-[9px] font-bold text-amber-500/60 uppercase">
              High_Performance
            </span>
          </div>

          <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 px-5 py-2 rounded-2xl">
            <Shield size={14} className="text-amber-500"/>
            <span className="text-[10px] font-black text-amber-500 font-mono tracking-tighter">
              THRESHOLD: 3/5 SIGNERS
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-auto p-8 space-y-8 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {pendingTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-64 flex flex-col items-center justify-center text-white/10 gap-6 border border-dashed border-white/5 rounded-[3rem]"
            >
              <CheckCircle size={48} className="opacity-10"/>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] italic">
                {t('pending.empty', 'Zero Pending Authorizations')}
              </p>
            </motion.div>
          ) : (
            pendingTransactions.map((tx) => {
              const payload = resolvePayload(tx)
              let payloadString = ''

              try {
                payloadString = JSON.stringify(payload, null, 2)
              } catch {
                payloadString = '{"error": "CORRUPTED_PAYLOAD"}'
              }

              return (
                <motion.div
                  key={tx.id}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative bg-[#080808]/80 border border-white/5 rounded-[3rem] p-8 space-y-8 backdrop-blur-xl"
                >
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                          {tx.module === 'Finance'
                            ? <Zap size={18} className="text-amber-500"/>
                            : <Database size={18} className="text-amber-500"/>
                          }
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest">
                            {tx.module}_SUBSYSTEM
                          </span>
                          <h3 className="text-white font-black text-xl uppercase">
                            {tx.operation}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/40">
                        <Fingerprint size={14}/>
                        HASH_ID: <span className="font-mono">{tx.id.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* SIGNATURE STATUS INDICATOR */}
                    <div className="flex flex-col items-end gap-3">
                      <span className="text-[9px] text-white/30 uppercase tracking-[0.3em]">
                        Consensus_State
                      </span>
                      <div className="flex gap-2">
                        {Array.from({ length: tx.requiredSignatures }).map((_, i) => (
                          <div
                            key={i}
                            className={cn(
                              "w-3 h-3 rounded-full transition-all duration-500",
                              i < tx.currentSignatures
                                ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                : "bg-white/10"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PAYLOAD INSPECTOR */}
                  <div className="bg-black/60 p-6 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em]">
                      Raw_Transaction_Payload
                    </span>
                    <pre className="text-[11px] font-mono text-amber-200/40 mt-4 whitespace-pre-wrap break-all leading-relaxed">
                      {payloadString}
                    </pre>
                  </div>

                  {/* ACTION LAYER */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 text-amber-500/60">
                      <Clock size={16}/>
                      <span className="text-[11px] font-black uppercase tracking-tighter">
                        {tx.currentSignatures} OF {tx.requiredSignatures} SIGNED
                      </span>
                    </div>

                    <button
                      onClick={() => handleSign(tx.id)}
                      disabled={isProcessing || localProcessing === tx.id}
                      className={cn(
                        "relative flex items-center gap-3 px-8 py-3 rounded-xl text-[11px] font-black uppercase transition-all active:scale-95",
                        isProcessing || localProcessing === tx.id
                          ? "bg-white/5 text-white/20 cursor-not-allowed"
                          : "bg-amber-500 text-black hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                      )}
                    >
                      {localProcessing === tx.id ? (
                        <>
                          <RefreshCw size={16} className="animate-spin"/>
                          Committing_State...
                        </>
                      ) : (
                        <>
                          <UserCheck size={18}/>
                          {t('pending.sign_button', 'Authorize_Transaction')}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="p-5 bg-[#0a0a0a] border-t border-white/5 flex justify-center items-center gap-4">
        <AlertTriangle size={14} className="text-amber-500/40"/>
        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
          Neural OS // Forensic Audit Shield: ACTIVE
        </span>
      </div>
    </div>
  )
}
