'use client';

import React, { createContext, useContext, useState } from 'react';
import { getNetworkProfile, type Network, type NetworkProfile } from '@/lib/network';

interface DemoState {
  network: Network;
  networkProfile: NetworkProfile;
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

const DEFAULT_NETWORK: Network = 'mainnet';

const NETWORK_BALANCES: Record<Network, number> = {
  mainnet: 1284520,
  testnet: 500000,
  demo: 1000000,
};

export const DemoProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<DemoState>({
    network: DEFAULT_NETWORK,
    networkProfile: getNetworkProfile(DEFAULT_NETWORK),
    balance: 0,
    price: 0.0614,
    address: null,
  });

  const setNetwork = (network: Network) => {
    setState((prev) => ({
      ...prev,
      network,
      networkProfile: getNetworkProfile(network),
      balance: prev.address ? NETWORK_BALANCES[network] : 0,
    }));
  };

  const connectWallet = () => {
    setState((prev) => ({
      ...prev,
      address: '0x71c03fD77b2A7137cE4bd4317A625f237909A923',
      balance: NETWORK_BALANCES[prev.network],
    }));
  };

  const disconnectWallet = () => {
    setState((prev) => ({ ...prev, address: null, balance: 0 }));
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
