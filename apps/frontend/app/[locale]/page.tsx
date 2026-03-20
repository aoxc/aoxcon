'use client';

import React, { useState } from 'react';
import {useTranslations} from 'next-intl';
import Sidebar from '@/components/Sidebar';
import Nexus from '@/components/Nexus';
import SynapseControl from '@/components/SynapseControl';
import WalletView from '@/components/WalletView';
import StakeView from '@/components/StakeView';
import BridgeView from '@/components/BridgeView';
import ExplorerView from '@/components/ExplorerView';
import GovernanceView from '@/components/GovernanceView';
import ValidatorsView from '@/components/ValidatorsView';
import SecurityView from '@/components/SecurityView';
import DeveloperView from '@/components/DeveloperView';
import SettingsView from '@/components/SettingsView';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LandingPage from '@/components/LandingPage';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const t = useTranslations('nav');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Nexus />;
      case 'network':
        return <SynapseControl />;
      case 'wallet':
        return <WalletView />;
      case 'staking':
        return <StakeView />;
      case 'bridge':
        return <BridgeView />;
      case 'explorer':
        return <ExplorerView />;
      case 'governance':
        return <GovernanceView />;
      case 'validators':
        return <ValidatorsView />;
      case 'security':
        return <SecurityView />;
      case 'developers':
        return <DeveloperView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Nexus />;
    }
  };

  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <div className="flex flex-1">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "md:ml-64" : "ml-0"
        )}>
          <Header 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          <div className="flex-1 w-full relative flex flex-col overflow-x-hidden p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
