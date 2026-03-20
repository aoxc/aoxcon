'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRightLeft,
  BadgeCheck,
  Coins,
  Loader2,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import {
  createPublicClient,
  createWalletClient,
  custom,
  defineChain,
  formatUnits,
  getAddress,
  http,
  isAddress,
  parseUnits,
} from 'viem';
import type { Address, EIP1193Provider } from 'viem';
import { getNetworkProfile } from '@/lib/network';

type TxKind = 'approveStake' | 'stake' | 'approveRewards' | 'fundRewards';

type PositionTuple = {
  principal: bigint;
  startedAt: bigint;
  claimedBps: number;
};

type PoolSnapshot = {
  owner: Address;
  stakingToken: Address;
  rewardReserve: bigint;
  totalStaked: bigint;
  pendingReward: bigint;
  nextCheckpointAt: bigint;
  position: PositionTuple;
  allowance: bigint;
  balance: bigint;
};

type ReviewItem = {
  label: string;
  ok: boolean;
  detail: string;
};

const xLayerProfile = getNetworkProfile('xlayer');
const X_LAYER_CHAIN = defineChain({
  id: xLayerProfile.chainId ?? 196,
  name: xLayerProfile.label,
  network: 'xlayer',
  nativeCurrency: {
    name: xLayerProfile.nativeCurrencySymbol,
    symbol: xLayerProfile.nativeCurrencySymbol,
    decimals: 18,
  },
  rpcUrls: {
    default: { http: xLayerProfile.rpcEndpoints },
    public: { http: xLayerProfile.rpcEndpoints },
  },
  blockExplorers: xLayerProfile.explorerUrl
    ? {
        default: {
          name: 'XLayer Explorer',
          url: xLayerProfile.explorerUrl,
        },
      }
    : undefined,
});

const DEFAULT_TOKEN = getAddress(xLayerProfile.tokenAddress ?? '0xeB9580c3946BB47d73AAE1d4f7A94148B554b2F4');
const DEFAULT_POOL = getAddress('0x0AFEAD9a25f33c4BA6965668D9084B1368842F3a');
const DEFAULT_STAKE = '1000';
const DEFAULT_REWARD = '1000';

const erc20Abi = [
  {
    type: 'function',
    name: 'approve',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'allowance',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

const stakingAbi = [
  {
    type: 'function',
    name: 'stake',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'fundRewards',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'amount', type: 'uint256' }],
    outputs: [],
  },
  {
    type: 'function',
    name: 'positionOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'principal', type: 'uint256' },
          { name: 'startedAt', type: 'uint64' },
          { name: 'claimedBps', type: 'uint16' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'pendingRewardOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'nextCheckpointAtOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'rewardReserve',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalStaked',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'stakingToken',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'owner',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
] as const;

function getInjectedProvider(): EIP1193Provider | null {
  if (typeof window === 'undefined') return null;
  const scopedWindow = window as typeof window & {
    okxwallet?: { ethereum?: EIP1193Provider };
    ethereum?: EIP1193Provider;
  };
  return scopedWindow.okxwallet?.ethereum ?? scopedWindow.ethereum ?? null;
}

function formatTokenAmount(value?: bigint | null, decimals = 18, maximumFractionDigits = 4): string {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(Number(formatUnits(value, decimals)));
}

function formatDate(value?: bigint | null): string {
  if (!value || value === BigInt(0)) return '—';
  return new Date(Number(value) * 1000).toLocaleString();
}

function parseAmount(value: string): bigint | null {
  try {
    if (!value.trim()) return null;
    return parseUnits(value.trim().replace(/,/g, ''), 18);
  } catch {
    return null;
  }
}

function trimHash(hash: string | null): string {
  if (!hash) return 'No transaction yet';
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export default function StakeView() {
  const [tokenAddress, setTokenAddress] = useState<string>(DEFAULT_TOKEN);
  const [poolAddress, setPoolAddress] = useState<string>(DEFAULT_POOL);
  const [stakeAmount, setStakeAmount] = useState(DEFAULT_STAKE);
  const [rewardAmount, setRewardAmount] = useState(DEFAULT_REWARD);
  const [account, setAccount] = useState<Address | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [walletName, setWalletName] = useState('Disconnected');
  const [status, setStatus] = useState('XWallet / OKX Wallet hazır. İşlem öncesi kontrat ve ağ kontrolü yapılır.');
  const [readout, setReadout] = useState('Henüz zincir verisi okunmadı.');
  const [txStatus, setTxStatus] = useState('Henüz işlem gönderilmedi.');
  const [snapshot, setSnapshot] = useState<PoolSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<TxKind | null>(null);

  const publicClient = useMemo(
    () => createPublicClient({ chain: X_LAYER_CHAIN, transport: http(xLayerProfile.rpcEndpoints[0]) }),
    [],
  );

  const validatedToken = useMemo(() => (isAddress(tokenAddress) ? getAddress(tokenAddress) : null), [tokenAddress]);
  const validatedPool = useMemo(() => (isAddress(poolAddress) ? getAddress(poolAddress) : null), [poolAddress]);
  const parsedStakeAmount = useMemo(() => parseAmount(stakeAmount), [stakeAmount]);
  const parsedRewardAmount = useMemo(() => parseAmount(rewardAmount), [rewardAmount]);

  const reviewItems = useMemo<ReviewItem[]>(() => {
    const isCorrectChain = chainId === X_LAYER_CHAIN.id;
    const tokenMatchesPool = snapshot?.stakingToken ? snapshot.stakingToken === validatedToken : false;
    return [
      {
        label: 'Injected wallet',
        ok: Boolean(getInjectedProvider()),
        detail: getInjectedProvider() ? 'OKX/XWallet benzeri EIP-1193 sağlayıcı tespit edildi.' : 'Tarayıcıda injected wallet bulunamadı.',
      },
      {
        label: 'Network lock',
        ok: isCorrectChain,
        detail: isCorrectChain ? `X Layer (${X_LAYER_CHAIN.id}) üzerinde bağlısınız.` : `Cüzdan ${X_LAYER_CHAIN.id} zincirine geçirilmelidir.`,
      },
      {
        label: 'Address hygiene',
        ok: Boolean(validatedToken && validatedPool),
        detail: validatedToken && validatedPool ? 'Token ve havuz adresleri checksum doğrulamasından geçti.' : 'Geçerli token ve havuz adresi girin.',
      },
      {
        label: 'Pool ↔ token match',
        ok: Boolean(tokenMatchesPool),
        detail: tokenMatchesPool ? 'stakingToken() sonucu arayüz token adresiyle eşleşiyor.' : 'Pool stakingToken() verisi ile arayüz token adresi henüz eşleşmiyor.',
      },
      {
        label: 'Allowance posture',
        ok: snapshot ? snapshot.allowance >= (parsedStakeAmount ?? BigInt(0)) : false,
        detail: snapshot ? `Mevcut allowance: ${formatTokenAmount(snapshot.allowance)} AOXC.` : 'Allowance okunmadı.',
      },
    ];
  }, [chainId, parsedStakeAmount, snapshot, validatedPool, validatedToken]);

  const refreshWalletState = useCallback(async () => {
    if (!account || !validatedToken || !validatedPool) {
      setReadout('Bağlantı kurun ve geçerli adresleri girin.');
      return;
    }
    setLoading(true);
    try {
      const [owner, stakingToken, rewardReserve, totalStaked, pendingReward, nextCheckpointAt, position, allowance, balance] =
        await Promise.all([
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'owner' }),
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'stakingToken' }),
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'rewardReserve' }),
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'totalStaked' }),
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'pendingRewardOf', args: [account] }),
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'nextCheckpointAtOf', args: [account] }),
          publicClient.readContract({ address: validatedPool, abi: stakingAbi, functionName: 'positionOf', args: [account] }),
          publicClient.readContract({ address: validatedToken, abi: erc20Abi, functionName: 'allowance', args: [account, validatedPool] }),
          publicClient.readContract({ address: validatedToken, abi: erc20Abi, functionName: 'balanceOf', args: [account] }),
        ]);

      const nextSnapshot: PoolSnapshot = {
        owner,
        stakingToken,
        rewardReserve,
        totalStaked,
        pendingReward,
        nextCheckpointAt,
        position: {
          principal: position.principal,
          startedAt: BigInt(position.startedAt),
          claimedBps: Number(position.claimedBps),
        },
        allowance,
        balance,
      };

      setSnapshot(nextSnapshot);
      setReadout(
        `Owner ${owner.slice(0, 6)}…${owner.slice(-4)} | Reserve ${formatTokenAmount(rewardReserve)} AOXC | Total staked ${formatTokenAmount(totalStaked)} AOXC`,
      );
      setStatus('Zincir durumu başarıyla güncellendi. Simülasyon için gerekli veriler hazır.');
    } catch (error) {
      setReadout(`Okuma hatası: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [account, publicClient, validatedPool, validatedToken]);

  useEffect(() => {
    const provider = getInjectedProvider();
    if (!provider || typeof provider.request !== 'function') return;

    const sync = async () => {
      try {
        const [accounts, chainHex] = await Promise.all([
          provider.request({ method: 'eth_accounts' }) as Promise<string[]>,
          provider.request({ method: 'eth_chainId' }) as Promise<string>,
        ]);
        setAccount(accounts?.[0] ? getAddress(accounts[0]) : null);
        setChainId(chainHex ? Number(chainHex) : null);
        setWalletName(provider === (window as typeof window & { okxwallet?: { ethereum?: EIP1193Provider } }).okxwallet?.ethereum ? 'OKX Wallet' : 'Injected Wallet');
      } catch {
        // noop
      }
    };

    sync();

    const handleAccountsChanged = (accounts: unknown) => {
      const next = Array.isArray(accounts) && accounts[0] ? getAddress(String(accounts[0])) : null;
      setAccount(next);
    };
    const handleChainChanged = (nextChainId: unknown) => setChainId(Number(nextChainId));

    provider.on?.('accountsChanged', handleAccountsChanged);
    provider.on?.('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (account && validatedPool && validatedToken) {
      void refreshWalletState();
    }
  }, [account, validatedPool, validatedToken, refreshWalletState]);

  const connectWallet = async () => {
    const provider = getInjectedProvider();
    if (!provider || typeof provider.request !== 'function') {
      setStatus('XWallet / OKX Wallet bulunamadı. Tarayıcı eklentisini yükleyin.');
      return;
    }

    try {
      const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
      const activeAccount = accounts?.[0] ? getAddress(accounts[0]) : null;
      const networkHex = (await provider.request({ method: 'eth_chainId' })) as string;
      setAccount(activeAccount);
      setChainId(Number(networkHex));
      setWalletName(provider === (window as typeof window & { okxwallet?: { ethereum?: EIP1193Provider } }).okxwallet?.ethereum ? 'OKX Wallet' : 'Injected Wallet');
      setStatus(activeAccount ? `Bağlandı: ${activeAccount}` : 'Cüzdan bağlandı ancak hesap alınamadı.');
    } catch (error) {
      setStatus(`Bağlantı başarısız: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const switchToXLayer = async () => {
    const provider = getInjectedProvider();
    if (!provider || typeof provider.request !== 'function') {
      setStatus('Ağ değiştirmek için injected wallet gerekiyor.');
      return;
    }

    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${X_LAYER_CHAIN.id.toString(16)}` }],
      });
      setChainId(X_LAYER_CHAIN.id);
      setStatus('Cüzdan X Layer ağına geçirildi.');
    } catch (error) {
      setStatus(`Ağ geçişi başarısız: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const runTx = async (kind: TxKind) => {
    if (!account || !validatedToken || !validatedPool) {
      setTxStatus('İşlem öncesi cüzdan bağlantısı ve adres doğrulaması gerekli.');
      return;
    }
    if (chainId !== X_LAYER_CHAIN.id) {
      setTxStatus(`İşlem reddedildi: önce X Layer (${X_LAYER_CHAIN.id}) ağına geçin.`);
      return;
    }
    const provider = getInjectedProvider();
    if (!provider) {
      setTxStatus('Injected wallet bulunamadı.');
      return;
    }

    const walletClient = createWalletClient({ account, chain: X_LAYER_CHAIN, transport: custom(provider) });
    const amount = kind === 'approveStake' || kind === 'stake' ? parsedStakeAmount : parsedRewardAmount;
    if (!amount || amount <= BigInt(0)) {
      setTxStatus('Tutar sıfırdan büyük ve parse edilebilir olmalı.');
      return;
    }

    try {
      setActionLoading(kind);
      if (kind === 'approveStake' || kind === 'approveRewards') {
        const simulation = await publicClient.simulateContract({
          account,
          address: validatedToken,
          abi: erc20Abi,
          functionName: 'approve',
          args: [validatedPool, amount],
        });
        const hash = await walletClient.writeContract(simulation.request);
        setTxStatus(`İşlem gönderildi: ${trimHash(hash)}`);
        await publicClient.waitForTransactionReceipt({ hash });
        setTxStatus(`İşlem onaylandı: ${trimHash(hash)}`);
      } else {
        const simulation = await publicClient.simulateContract({
          account,
          address: validatedPool,
          abi: stakingAbi,
          functionName: kind === 'stake' ? 'stake' : 'fundRewards',
          args: [amount],
        });
        const hash = await walletClient.writeContract(simulation.request);
        setTxStatus(`İşlem gönderildi: ${trimHash(hash)}`);
        await publicClient.waitForTransactionReceipt({ hash });
        setTxStatus(`İşlem onaylandı: ${trimHash(hash)}`);
      }
      
      await refreshWalletState();
    } catch (error) {
      setTxStatus(`İşlem başarısız: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const isOwner = snapshot && account ? snapshot.owner.toLowerCase() === account.toLowerCase() : false;

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-aox-green/20 bg-aox-green/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.3em] text-aox-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            XWallet Secure Staking
          </div>
          <h2 className="mt-4 text-4xl font-display font-bold uppercase tracking-tighter">AOXC Staking Console</h2>
          <p className="mt-2 max-w-3xl text-sm text-white/60">
            X Layer üzerinde OKX Wallet / injected wallet ile çalışan, işlem öncesi adres hijyeni, ağ kilidi ve kontrat
            simülasyonu yapan profesyonel staking arayüzü.
          </p>
        </div>

        <div className="aox-widget flex flex-col gap-2 p-4 text-xs text-white/60 lg:min-w-80">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono uppercase tracking-[0.25em] text-white/40">Wallet</span>
            <span className="font-semibold text-white">{walletName}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono uppercase tracking-[0.25em] text-white/40">Account</span>
            <span className="font-mono text-white">{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono uppercase tracking-[0.25em] text-white/40">Chain</span>
            <span className={chainId === X_LAYER_CHAIN.id ? 'text-aox-green' : 'text-amber-300'}>{chainId ?? '—'}</span>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="aox-widget p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-aox-blue" />
            <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Connection & Controls</h3>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-white/60">
              <span>AOXC Token</span>
              <input value={tokenAddress} onChange={(e) => setTokenAddress(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm outline-none transition focus:border-aox-blue/40" />
            </label>
            <label className="space-y-2 text-sm text-white/60">
              <span>Staking Pool</span>
              <input value={poolAddress} onChange={(e) => setPoolAddress(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm outline-none transition focus:border-aox-blue/40" />
            </label>
            <label className="space-y-2 text-sm text-white/60">
              <span>Stake Amount (AOXC)</span>
              <input value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-aox-blue/40" />
            </label>
            <label className="space-y-2 text-sm text-white/60">
              <span>Reward Reserve Amount (AOXC)</span>
              <input value={rewardAmount} onChange={(e) => setRewardAmount(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-aox-blue/40" />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={connectWallet} className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-black transition hover:bg-white/90">Connect XWallet</button>
            <button onClick={switchToXLayer} className="rounded-xl border border-aox-blue/30 bg-aox-blue/10 px-4 py-3 text-sm font-bold text-aox-blue transition hover:bg-aox-blue/15">Switch to X Layer</button>
            <button onClick={() => void refreshWalletState()} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10">{loading ? 'Refreshing...' : 'Refresh State'}</button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-0.5 h-4 w-4 text-aox-green" />
              <p>{status}</p>
            </div>
          </div>
        </div>

        <div className="aox-widget p-6 md:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-aox-green" />
            <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Pre-flight Audit Checklist</h3>
          </div>
          <div className="mt-6 space-y-3">
            {reviewItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-white">{item.label}</span>
                  <span className={item.ok ? 'text-aox-green' : 'text-amber-300'}>{item.ok ? 'PASS' : 'CHECK'}</span>
                </div>
                <p className="mt-2 text-xs text-white/55">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="aox-widget p-6 md:p-8">
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-aox-gold" />
            <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white">On-chain Snapshot</h3>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              ['AOXC balance', `${formatTokenAmount(snapshot?.balance)} AOXC`],
              ['Allowance', `${formatTokenAmount(snapshot?.allowance)} AOXC`],
              ['Principal', `${formatTokenAmount(snapshot?.position.principal)} AOXC`],
              ['Pending reward', `${formatTokenAmount(snapshot?.pendingReward)} AOXC`],
              ['Reward reserve', `${formatTokenAmount(snapshot?.rewardReserve)} AOXC`],
              ['Total staked', `${formatTokenAmount(snapshot?.totalStaked)} AOXC`],
              ['Checkpoint', formatDate(snapshot?.nextCheckpointAt)],
              ['Position start', formatDate(snapshot?.position.startedAt)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">{label}</div>
                <div className="mt-2 text-lg font-semibold text-white">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/60">
            <p className="font-mono">{readout}</p>
          </div>
        </div>

        <div className="aox-widget p-6 md:p-8">
          <div className="flex items-center gap-3">
            <ArrowRightLeft className="h-5 w-5 text-aox-blue" />
            <h3 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Protected Actions</h3>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <button disabled={Boolean(actionLoading)} onClick={() => void runTx('approveStake')} className="rounded-2xl border border-aox-green/20 bg-aox-green/10 p-4 text-left transition enabled:hover:bg-aox-green/15 disabled:cursor-not-allowed disabled:opacity-60">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-white">Approve Stake Amount</span>
                {actionLoading === 'approveStake' && <Loader2 className="h-4 w-4 animate-spin text-aox-green" />}
              </div>
              <p className="mt-2 text-xs text-white/60">Tam stake tutarı kadar allowance yazar; sınırsız approval kullanmaz.</p>
            </button>

            <button disabled={Boolean(actionLoading)} onClick={() => void runTx('stake')} className="rounded-2xl border border-aox-blue/20 bg-aox-blue/10 p-4 text-left transition enabled:hover:bg-aox-blue/15 disabled:cursor-not-allowed disabled:opacity-60">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-white">Stake</span>
                {actionLoading === 'stake' && <Loader2 className="h-4 w-4 animate-spin text-aox-blue" />}
              </div>
              <p className="mt-2 text-xs text-white/60">Yazmadan önce simulateContract ile revert ön kontrolü yapılır.</p>
            </button>

            <button disabled={Boolean(actionLoading)} onClick={() => void runTx('approveRewards')} className="rounded-2xl border border-aox-green/20 bg-aox-green/10 p-4 text-left transition enabled:hover:bg-aox-green/15 disabled:cursor-not-allowed disabled:opacity-60">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-white">Approve Reward Amount</span>
                {actionLoading === 'approveRewards' && <Loader2 className="h-4 w-4 animate-spin text-aox-green" />}
              </div>
              <p className="mt-2 text-xs text-white/60">Reward reserve fonlaması için yalnızca gerekli miktarda approval verir.</p>
            </button>

            <button disabled={Boolean(actionLoading) || !isOwner} onClick={() => void runTx('fundRewards')} className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-left transition enabled:hover:bg-amber-400/15 disabled:cursor-not-allowed disabled:opacity-60">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-white">Fund Rewards</span>
                {actionLoading === 'fundRewards' && <Loader2 className="h-4 w-4 animate-spin text-amber-300" />}
              </div>
              <p className="mt-2 text-xs text-white/60">Owner hesabına kilitlidir. Yetkisiz fonlama çağrısı arayüzde engellenir.</p>
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
              <div className="space-y-2">
                <p>{txStatus}</p>
                <p className="text-xs text-white/45">
                  Owner kontrolü: {isOwner ? 'aktif hesap havuz owner adresi ile eşleşiyor.' : 'fundRewards yalnızca owner için etkinleşir.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
