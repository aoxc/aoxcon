import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAoxcStore } from '../store/useAoxcStore';
import { GeminiSentinel } from '../services/geminiSentinel'; 
import { Send, Brain, Loader2, ShieldAlert, Cpu, Network } from 'lucide-react';
import { cn } from '../lib/utils';

export const AoxcanInterface = () => {
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiState, setAiState] = useState<'idle' | 'processing' | 'analyzing'>('idle');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addChatMessage, chatMessages, networkStatus, blockNumber, networkLoad, statusMatrix, analyticsData } = useAoxcStore();

  // Scroll işlemini memoize ederek performans kazandık
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isThinking, scrollToBottom]);

  // Sesli yanıt motoru - Geliştirilmiş
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Yapay zeka sesi hissi için değerler
    utterance.rate = 1.05;
    utterance.pitch = 0.85; 
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userMessage = input.trim();
    setInput('');
    
    // Kullanıcı mesajını store'a ekle
    addChatMessage(userMessage, 'user');
    setIsThinking(true);
    setAiState('processing');

    try {
      // DÜZELTME 1: String yerine konfigürasyon objesi gönderiyoruz
      const sentinel = new GeminiSentinel({ 
        backendUrl: import.meta.env.VITE_API_ENDPOINT 
      });

      // Multichain Context: Buraya Sui ve Cardano verileri de eklenmeli
      const systemContext = {
        blockNumber,
        networkLoad,
        networkStatus,
        statusMatrix,
        // Son analytics verisini göndererek AI'nın güncel trendi görmesini sağla
        latestMetrics: analyticsData?.[analyticsData.length - 1] || null,
        activeProtocols: ['X-LAYER', 'SUI', 'CARDANO']
      };

      setAiState('analyzing');
      
      // AI Yanıtını al
      const aiResponse = await sentinel.analyzeSystemState(
        JSON.stringify(systemContext), // Bağlamı string olarak gönder
        userMessage
      );

      // DÜZELTME 2: Güvenli tip dönüşümü (Type Casting) ile TS hatasını önlüyoruz
      const parsedResponse = aiResponse as { text?: string; message?: string; analysis?: string };
      const responseText = typeof aiResponse === 'string' 
        ? aiResponse 
        : parsedResponse.text || parsedResponse.message || parsedResponse.analysis || "Neural analysis complete.";
      
      addChatMessage(responseText, 'ai');
      speak(responseText);
      
    } catch (error) {
      console.error("[SENTINEL_ERROR]", error);
      const errorMsg = "Uplink unstable. Neural processor is re-routing through secure nodes...";
      addChatMessage(errorMsg, "ai");
      speak(errorMsg);
    } finally {
      setIsThinking(false);
      setAiState('idle');
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#080808]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      
      {/* Header */}
      <div className="shrink-0 p-6 border-b border-white/5 bg-gradient-to-r from-cyan-500/[0.03] via-transparent to-amber-500/[0.03] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={cn(
              "absolute inset-0 bg-cyan-500/20 rounded-2xl blur-lg transition-opacity",
              isThinking ? "opacity-100 animate-pulse" : "opacity-0"
            )} />
            <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center relative z-10">
              <Brain className={cn("text-cyan-500 transition-all duration-700", isThinking && "rotate-[360deg] scale-110")} size={24} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Sentinel_AI_v3</h3>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-cyan-500 animate-ping" />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[8px] font-mono text-cyan-500/50 uppercase tracking-widest flex items-center gap-1">
                <Network size={8} /> X-LYR / SUI / ADA
              </span>
              <span className="text-[8px] font-mono text-white/20">|</span>
              <span className="text-[8px] font-mono text-amber-500/50 uppercase tracking-widest">
                Thread: {aiState.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-tighter">
          <div className="flex items-center gap-2 border border-white/5 px-3 py-1.5 rounded-full bg-white/[0.02]">
            <ShieldAlert size={10} className="text-cyan-500" />
            SECURE_LINK
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.02),transparent)]">
        <AnimatePresence mode="popLayout">
          {chatMessages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={msg.id} 
              className={cn("flex flex-col", msg.role === 'user' ? "items-end" : "items-start")}
            >
              <div className={cn(
                "max-w-[80%] p-5 rounded-[1.5rem] text-[12px] font-mono leading-relaxed relative group",
                msg.role === 'user' 
                  ? "bg-cyan-600 text-black font-bold rounded-tr-none shadow-[0_10px_30px_rgba(6,182,212,0.2)]" 
                  : "bg-white/[0.03] border border-white/10 text-cyan-50/80 rounded-tl-none backdrop-blur-md"
              )}>
                {msg.content}
                <span className="absolute -bottom-5 text-[7px] text-white/10 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  {new Date(msg.timestamp).toLocaleTimeString()} // ID: {msg.id.slice(0,6)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isThinking && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center gap-4 text-cyan-500/60 bg-cyan-500/5 w-fit px-5 py-3 rounded-2xl border border-cyan-500/10"
          >
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">
              Sentinel is auditing hybrid state...
            </span>
          </motion.div>
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Section */}
      <div className="shrink-0 p-8 bg-[#020202]/80 border-t border-white/5 backdrop-blur-3xl">
        <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-center group">
          <div className="absolute left-5 text-cyan-500/40 group-focus-within:text-cyan-500 transition-colors">
            <Cpu size={16} />
          </div>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Invoke neural command or audit protocol..."
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-14 pr-16 text-[12px] font-mono text-white placeholder:text-white/10 focus:outline-none focus:border-cyan-500/30 focus:bg-white/[0.04] transition-all shadow-inner"
          />
          <button 
            type="submit" 
            disabled={isThinking || !input.trim()}
            className="absolute right-3 p-3 bg-cyan-500 text-black rounded-xl hover:bg-cyan-400 disabled:opacity-10 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            <Send size={18} />
          </button>
        </form>
        <div className="flex justify-center mt-4">
          <span className="text-[7px] text-white/10 uppercase tracking-[0.5em]">
            Neural Encryption Standard: AES-256-GCM
          </span>
        </div>
      </div>
    </div>
  );
};
