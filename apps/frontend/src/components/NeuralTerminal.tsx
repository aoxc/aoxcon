import React, { useState, useRef, useEffect } from 'react'
import { useAoxcStore } from '../store/useAoxcStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, ChevronUp, ChevronDown, Command, ShieldCheck, Activity } from 'lucide-react'
import { cn } from '../lib/utils'

export const NeuralTerminal = () => {

  const { logs, addLog, networkStatus, blockNumber, gasEfficiency, networkLoad } = useAoxcStore()

  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {

    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }

    if (isExpanded) {
      inputRef.current?.focus()
    }

  }, [logs, isExpanded])

  const handleCommand = (e: React.FormEvent) => {

    e.preventDefault()

    const cmd = input.trim().toLowerCase()

    if (!cmd) return

    addLog(`TERMINAL_CMD: ${cmd}`, 'info')

    switch (cmd) {

      case '/help':
        addLog('AVAILABLE: /status /netinfo /scan /clear', 'ai')
        break

      case '/status':
        addLog(`STATUS ${networkStatus} | BLOCK ${blockNumber}`, 'ai')
        break

      case '/netinfo':
        addLog(`XLAYER_LOAD ${networkLoad} | GAS_EFF ${gasEfficiency}%`, 'success')
        break

      case '/scan':
        addLog('SENTINEL_SCAN_STARTED', 'warning')

        setTimeout(() => {
          addLog(`SCAN_COMPLETE: ${blockNumber} blocks verified`, 'success')
        }, 1200)

        break

      case '/clear':
        addLog('TERMINAL_BUFFER_FLUSHED', 'info')
        break

      default:
        addLog(`UNKNOWN_COMMAND ${cmd}`, 'error')

    }

    setInput('')
  }

  return (
    <motion.div
      animate={{ height: isExpanded ? 340 : 36 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className={cn(
        "border-t border-cyan-500/20 bg-[#020202]/95 backdrop-blur-xl flex flex-col font-mono text-[10px] overflow-hidden",
        isExpanded ? "absolute bottom-0 left-0 right-0" : "relative"
      )}
    >

      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-9 flex items-center px-6 cursor-pointer border-b border-white/5"
      >

        <div className="flex items-center gap-3 text-cyan-500 font-black uppercase tracking-[0.2em]">
          <Terminal size={14}/>
          Neural_Console
        </div>

        <div className="ml-auto flex items-center gap-6 text-white/30">

          <StatusIndicator icon={Activity} label="LOAD" value={networkLoad}/>
          <StatusIndicator icon={ShieldCheck} label="GUARD" value="SAFE"/>

          {isExpanded ? <ChevronDown size={14}/> : <ChevronUp size={14}/>}

        </div>

      </div>

      {isExpanded && (

        <div className="flex flex-col flex-1">

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-2">

            {[...logs].reverse().map(log => (

              <div key={log.id} className="flex gap-4">

                <span className="text-white/20 tabular-nums">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>

                <span className={cn(
                  log.type === 'error' && 'text-rose-500',
                  log.type === 'success' && 'text-emerald-400',
                  log.type === 'warning' && 'text-amber-400',
                  log.type === 'ai' && 'text-cyan-400',
                  log.type === 'info' && 'text-white/70'
                )}>
                  {log.message}
                </span>

              </div>

            ))}

          </div>

          <form onSubmit={handleCommand} className="p-4 border-t border-white/5 flex items-center gap-4">

            <Command size={14} className="text-cyan-500"/>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-cyan-200 text-[11px]"
              placeholder="enter command..."
            />

          </form>

        </div>

      )}

    </motion.div>
  )
}

const StatusIndicator = ({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType
  label: string
  value: string
}) => (
  <div className="flex items-center gap-2">
    <Icon size={12}/>
    <span>{label}: {value}</span>
  </div>
)
