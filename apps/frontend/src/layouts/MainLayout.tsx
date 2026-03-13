import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu } from 'lucide-react'
import { cn } from '../lib/utils'

// Core Modules
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { StatusMatrix } from '../components/StatusMatrix'

/**
 * @interface MainLayoutProps
 * @dev Defines the perimeter boundaries and dynamic states for the AOXC Neural OS layout.
 */
interface MainLayoutProps {
  children: React.ReactNode
  isOnline: boolean
  latency: number
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  isRightPanelOpen: boolean
  rightPanelContent: React.ReactNode
}

const HEADER_HEIGHT = 72 // Calibrated for optimal HUD visibility

const RIGHT_PANEL_TRANSITION = {
  type: 'spring',
  damping: 30,
  stiffness: 200,
  mass: 0.8
} as const

/**
 * @title AOXC Neural OS - Enterprise Layout Kernel
 * @notice Orchestrates the primary structural grid, ensuring absolute overflow containment 
 * and zero-latency visual rendering for continuous audit streams.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isOnline,
  latency,
  isMobileMenuOpen,
  toggleMobileMenu,
  isRightPanelOpen,
  rightPanelContent
}) => {

  return (
    // [ROOT CONTAINER]: Absolute viewport lockdown. Prevents unauthorized scroll leaks.
    <div className="h-screen w-full bg-[#020202] text-white flex flex-col font-mono overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* [TELEMETRY BACKGROUND]: Ambient grid and cryptographic visual indicators */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        {/* Deep space radial nodes */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full" />
        
        {/* Geometric Audit Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] opacity-30" />
        
        {/* Audit Watermarks (Subtle technical English in the background) */}
        <div className="absolute bottom-4 left-4 text-[8px] text-white/10 uppercase tracking-[0.4em] font-black rotate-[-90deg] origin-bottom-left">
          SYS_AUDIT_MODE: ENFORCED // KERNEL v3.2.1
        </div>
      </div>

      {/* [HEADER VECTOR]: Fixed primary navigation and global status */}
      <header className="shrink-0 z-[60] relative bg-black/40 backdrop-blur-md border-b border-white/5">
        <Header isOnline={isOnline} latency={latency} />
        <button
          onClick={toggleMobileMenu}
          className="md:hidden absolute left-3 top-1/2 -translate-y-1/2 z-[80] rounded-lg border border-white/20 bg-black/60 p-2 text-white/80"
          aria-label="Toggle navigation menu"
        >
          <Menu size={16} />
        </button>
      </header>

      {/* [APPLICATION ARCHITECTURE]: Flexbox allocation for modules */}
      <div className="flex flex-1 min-h-0 relative z-10">

        {/* [TACTICAL SIDEBAR - DESKTOP]: Rigid width, glassmorphism barrier */}
        <aside className="hidden md:flex flex-col w-64 shrink-0 z-[40] bg-black/60 backdrop-blur-xl border-r border-white/5 relative">
          <Sidebar />
          {/* Edge illumination for modular separation */}
          <div className="absolute right-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
        </aside>

        {/* [TACTICAL SIDEBAR - MOBILE OVERRIDE]: Framer Motion physics */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.aside
                key="mobile-sidebar"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed left-0 z-[70] md:hidden w-72 bg-black/90 backdrop-blur-2xl border-r border-cyan-500/20 shadow-[20px_0_50px_rgba(0,0,0,0.8)]"
                style={{ top: HEADER_HEIGHT, height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
              >
                <Sidebar />
              </motion.aside>
              <motion.div
                key="mobile-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md md:hidden z-[65]"
                style={{ top: HEADER_HEIGHT }}
                onClick={toggleMobileMenu}
              />
            </>
          )}
        </AnimatePresence>

        {/* [MAIN WORKSPACE NEXUS]: Center Stage + Diagnostics Right Panel */}
        <div className="flex flex-1 min-w-0 min-h-0 relative">

          {/* [PRIMARY AUDIT SURFACE]: The main functional column */}
          <main className="flex flex-1 min-w-0 min-h-0 flex-col relative z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]">
            
            {/* Real-time Status Matrix */}
            <div className="shrink-0 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-sm p-4 z-30 border-b border-white/5">
              <StatusMatrix isOnline={isOnline} latency={latency} />
            </div>

            {/* Scrollable Content Engine (WarRoom, Registry, etc.) */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide relative z-20 px-2 sm:px-4 py-4">
              {children}
            </div>

            {/* Terminal Footer */}
            <div className="shrink-0 bg-black/80 backdrop-blur-md border-t border-white/5 relative z-30">
              <Footer />
            </div>
          </main>

          {/* [DIAGNOSTICS PANEL - DESKTOP]: Threat Monitoring & Console Stream */}
          <AnimatePresence>
            {isRightPanelOpen && (
              <motion.aside
                key="right-panel"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 384, opacity: 1 }} // 384px enforces a strict diagnostic view
                exit={{ width: 0, opacity: 0 }}
                transition={RIGHT_PANEL_TRANSITION}
                className={cn(
                  "hidden xl:flex flex-col shrink-0 z-[30] relative",
                  "bg-black/60 backdrop-blur-2xl border-l border-white/5",
                  "shadow-[-30px_0_50px_rgba(0,0,0,0.3)]"
                )}
              >
                {/* Cryptographic separator line */}
                <div className="absolute left-0 top-0 w-[1px] h-full bg-gradient-to-b from-transparent via-rose-500/20 to-transparent" />
                
                {/* Strict dimensional control guarantees the System Alerts and 
                  Neural Console never break the primary layout geometry.
                */}
                <div className="flex flex-col w-[384px] h-full min-h-0 overflow-hidden">
                  {rightPanelContent}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* [GLOBAL FORENSIC SCANLINE]: CRT overlay for visual integrity */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.8)] scanline pointer-events-none z-[90]" />
    </div>
  )
}
