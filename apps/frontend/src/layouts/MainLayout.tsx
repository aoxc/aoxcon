import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { cn } from '../lib/utils'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'
import { StatusMatrix } from '../components/StatusMatrix'

interface MainLayoutProps {
  children: React.ReactNode
  isOnline: boolean
  latency: number
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  isRightPanelOpen: boolean
  rightPanelContent: React.ReactNode
}

/**
 * AOXC Neural OS
 * Layout Architect v2.6
 */

const HEADER_HEIGHT = 64

const RIGHT_PANEL_TRANSITION = {
  type: 'spring',
  damping: 30,
  stiffness: 220,
} as const

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isOnline,
  latency,
  isMobileMenuOpen,
  toggleMobileMenu,
  isRightPanelOpen,
  rightPanelContent,
}) => {
  return (
    <div className="h-screen w-full bg-[#030303] text-white flex flex-col font-mono overflow-hidden relative selection:bg-primary/30">

      {/* HEADER */}
      <div className="shrink-0 relative z-[60]">
        <Header isOnline={isOnline} latency={latency} />
      </div>

      {/* BODY */}
      <div className="flex-1 min-h-0 flex relative overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:flex shrink-0 min-h-0 relative z-[40]">
          <Sidebar />
        </div>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.aside
                key="mobile-sidebar"
                initial={{ x: -320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -320, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed left-0 z-[50] md:hidden w-72"
                style={{
                  top: HEADER_HEIGHT,
                  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
                }}
              >
                <Sidebar />
              </motion.aside>

              <motion.button
                key="mobile-sidebar-overlay"
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed left-0 right-0 bottom-0 md:hidden z-[45] bg-black/80 backdrop-blur-md"
                style={{
                  top: HEADER_HEIGHT,
                }}
                onClick={toggleMobileMenu}
                aria-label="Close mobile sidebar"
              />
            </>
          )}
        </AnimatePresence>

        {/* MAIN SURFACE */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col bg-[#060606] relative border-l border-white/5 border-r border-white/5 overflow-hidden">

          {/* STATUS BAR */}
          <div className="shrink-0 relative z-[20]">
            <StatusMatrix isOnline={isOnline} latency={latency} />
          </div>

          {/* WORK AREA */}
          <div className="flex-1 min-h-0 flex relative overflow-hidden">

            {/* PRIMARY VIEW */}
            <section className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden relative">
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                {children}
              </div>
            </section>

            {/* RIGHT PANEL */}
            <AnimatePresence mode="wait">
              {isRightPanelOpen && (
                <motion.aside
                  key="right-panel"
                  initial={{ x: 384, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 384, opacity: 0 }}
                  transition={RIGHT_PANEL_TRANSITION}
                  className={cn(
                    'fixed right-0 bottom-0 z-[50] w-full sm:w-96 xl:hidden',
                    'bg-[#080808]/98 backdrop-blur-3xl border-l border-white/10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]'
                  )}
                  style={{
                    top: HEADER_HEIGHT,
                  }}
                >
                  <div className="h-full w-full flex flex-col overflow-hidden">
                    {rightPanelContent}
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

          </div>

          {/* FOOTER */}
          <div className="shrink-0 relative z-[10]">
            <Footer />
          </div>

        </main>

      </div>

      {/* GLOBAL FX */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/10 scanline pointer-events-none z-[90]" />

    </div>
  )
}
