'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Network = 'mainnet' | 'testnet' | 'demo';

interface DemoState {
  network: Network;
  balance: number;
  price: number;
  address: string | null;
}

interface DemoContextType {
  state: DemoState;
  setNetwork: (network: Network) => void;
  connectWallet: () => void;
  disconnectWallet: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<DemoState>({
    network: 'demo',
    balance: 0,
    price: 0.0614,
    address: null,
  });

  const setNetwork = (network: Network) => {
    setState(prev => ({ ...prev, network }));
  };

  const connectWallet = () => {
    setState(prev => ({
      ...prev,
      address: '0x71C...9A23',
      balance: 1000000, // Mock balance
    }));
  };

  const disconnectWallet = () => {
    setState(prev => ({ ...prev, address: null, balance: 0 }));
  };

  return (
    <DemoContext.Provider value={{ state, setNetwork, connectWallet, disconnectWallet }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemo = () => {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within a DemoProvider');
  return context;
};
