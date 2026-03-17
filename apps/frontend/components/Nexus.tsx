'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Zap, Shield, Cpu, Activity, ExternalLink, Database, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AOXC_OKX_EXPLORER_URL, AOXC_OKX_TOKEN_URL } from '@/lib/network';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Nexus() {
  const [pings, setPings] = useState<{top: string, left: string}[]>([]);
  const [chartData, setChartData] = useState<{name: string, price: number}[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeframe, setTimeframe] = useState('1D');
  const [tokenData, setTokenData] = useState({
    price: '0.0000',
    change: '0.00%',
    marketCap: 'Live',
    volume: 'Live',
    holders: 'Explorer',
    circulating: 'On-chain',
    lastUpdate: 'Loading'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      setPings([...Array(5)].map(() => ({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`
      })));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 10000); // 10 seconds transition
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setIsLoading(true);
        // Fetch 24h Ticker Data from local proxy
        const tickerRes = await fetch('/api/ticker');
        if (!tickerRes.ok) throw new Error('Failed to fetch ticker');
        const tickerData = await tickerRes.json();

        const price = Number(tickerData.lastPrice);
        const change = Number(tickerData.priceChangePercent);
        const volume = Number(tickerData.quoteVolume);

        setTokenData(prev => ({
          ...prev,
          price: price.toFixed(6),
          change: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
          marketCap: 'Live via liquidity feed',
          volume: `$${(volume / 1000000).toFixed(2)}M`,
          holders: 'OKX Explorer',
          circulating: 'Read from on-chain',
          lastUpdate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }));

        // Fetch Chart Data (Klines) from local proxy
        let interval = '1h';
        let limit = 24;
        if (timeframe === '1H') { interval = '1m'; limit = 60; }
        if (timeframe === '1W') { interval = '4h'; limit = 42; }

        const klinesRes = await fetch(`/api/klines?interval=${interval}&limit=${limit}`);
        if (!klinesRes.ok) throw new Error('Failed to fetch chart');
        const klinesData = await klinesRes.json();
        const series = Array.isArray(klinesData) ? klinesData : [];

        const formattedChart = series.map((k: any) => {
          const date = new Date(k[0]);
          let name = '';
          if (timeframe === '1H') name = `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
          else if (timeframe === '1D') name = `${date.getHours()}:00`;
          else name = `${date.getDate()}/${date.getMonth()+1}`;

          return {
            name,
            price: Number.parseFloat(k[4])
          };
        });

        setChartData(formattedChart);
      } catch (e) {
        console.error("Failed to fetch real data", e);
        if (e instanceof TypeError) {
          console.error("Network error or CORS issue");
        }
        // Fallback to 0 / No Data if API fails
        setTokenData(prev => ({
          ...prev,
          price: prev.price,
          change: '0.00%',
          marketCap: 'Feed unavailable',
          volume: 'Feed unavailable',
          lastUpdate: 'Error'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealData();
    const interval = setInterval(fetchRealData, 15000); // Update every 15s
    return () => clearInterval(interval);
  }, [timeframe]);

  const slides = [
    {
      title: "AOXC Token",
      description: "The native fuel for sovereign intelligence. Orchestrating the multichain mesh through X Layer liquidity.",
      cta: null,
      bg: "bg-gradient-to-r from-aox-blue/20 to-transparent"
    },
    {
      title: "Buy AOXC",
      description: "Secure your position in the future of sovereign intelligence. Trade on X Layer with high liquidity.",
      cta: { label: "Buy on OKX Web3", link: AOXC_OKX_TOKEN_URL },
      bg: "bg-gradient-to-r from-aox-green/20 to-transparent"
    },
    {
      title: "Sync Status",
      description: "Real-time synchronization with X Layer mainnet. Sovereign intelligence nodes are active globally.",
      cta: { label: "Open OKX Explorer", link: AOXC_OKX_EXPLORER_URL },
      bg: "bg-gradient-to-r from-purple-500/20 to-transparent"
    }
  ];

  return (
    <div className="py-2 space-y-8 md:space-y-12">
      {/* Pro Banner Slider - Full Width & Integrated Price */}
      <section className="relative w-full">
        <div className="aox-widget overflow-hidden border-white/10 bg-black/40 relative min-h-[320px] md:min-h-[380px] flex flex-col md:flex-row items-stretch">
          {/* Slider Content */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-aox-green animate-pulse glow-green" />
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">System Active / AOXCHAIN</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter leading-none">
                    {slides[currentSlide].title}
                  </h1>
                  <p className="max-w-xl text-base md:text-lg text-white/60 leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {slides[currentSlide].cta && (
                    <motion.a 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={slides[currentSlide].cta?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-all shadow-xl shadow-white/10"
                    >
                      {slides[currentSlide].cta?.label}
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  )}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <Activity className="w-3 h-3" />
                    <span>Sync: {tokenData.lastUpdate}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-8 md:left-12 flex gap-2">
              {slides.map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={cn(
                    "h-1 transition-all duration-500 rounded-full",
                    currentSlide === i ? "w-8 bg-aox-blue" : "w-2 bg-white/10 hover:bg-white/20"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Integrated Price Section - Fixed Right Side */}
          <div className="w-full md:w-96 border-t md:border-t-0 md:border-l border-white/10 bg-white/[0.01] p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group/price">
            {/* Background Glow for Price */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-aox-blue/5 rounded-full blur-[100px] group-hover/price:bg-aox-blue/10 transition-colors duration-700" />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">AOXC / USD</p>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                    <Wifi className="w-2.5 h-2.5 text-aox-green" />
                    Live
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={tokenData.price}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl md:text-6xl font-display font-bold tracking-tighter text-white"
                  >
                    ${tokenData.price}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">24H Change</p>
                  <div className={cn(
                    "text-lg font-bold font-mono",
                    tokenData.change.startsWith('+') ? "text-aox-green" : "text-red-500"
                  )}>
                    {tokenData.change}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Volatility</p>
                  <div className="text-lg font-bold font-mono text-white/60">Low</div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-end">
                  <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Network Load</p>
                  <p className="text-[10px] font-mono text-aox-blue font-bold">65.2%</p>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65.2%" }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-aox-blue to-aox-green shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-white/10 uppercase tracking-tighter">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Background Animated Elements */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-aox-blue/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
          </div>
        </div>
      </section>

      {/* Technical Data Grid - Animated Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Market Cap', value: tokenData.marketCap, detail: 'Fully Diluted', glow: 'glow-blue', icon: Globe },
          { label: '24h Volume', value: tokenData.volume, detail: 'DEX + CEX', glow: 'glow-green', icon: Activity },
          { label: 'Holders', value: tokenData.holders, detail: 'Unique Wallets', glow: 'glow-gold', icon: Zap },
          { label: 'Circulating', value: tokenData.circulating, detail: '82% of Supply', glow: 'glow-blue', icon: Database },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={cn(
              "aox-widget p-6 flex flex-col justify-between h-full min-h-[140px] group cursor-pointer transition-all duration-300 hover:border-white/20",
              item.glow
            )}
          >
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">{item.label}</p>
              <item.icon className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl lg:text-3xl font-display font-bold leading-none tracking-tighter uppercase group-hover:text-aox-blue transition-colors">
                {item.value}
              </h3>
              <p className="text-[9px] text-white/20 font-mono uppercase tracking-widest">{item.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Chart Section - Takes 2/3 space */}
        <div className="xl:col-span-2 aox-widget overflow-hidden flex flex-col h-full min-h-[450px]">
          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">Price Trajectory</h3>
                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Real-time performance on X Layer</p>
              </div>
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 w-fit">
                {['1H', '1D', '1W'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setTimeframe(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[10px] font-mono transition-all",
                      t === timeframe ? "bg-white text-black font-bold shadow-xl" : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 min-h-[300px]">
              {mounted && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#ffffff20" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                      fontFamily="var(--font-mono)"
                    />
                    <YAxis 
                      stroke="#ffffff20" 
                      fontSize={9} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${Number(value).toFixed(4)}`}
                      dx={-10}
                      domain={['auto', 'auto']}
                      fontFamily="var(--font-mono)"
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#030711', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontSize: '11px' }}
                      cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                      formatter={(value: any) => [`$${Number(value).toFixed(6)}`, 'Price']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20 font-mono text-xs">
                  {isLoading ? 'Fetching on-chain data...' : 'No Data Available'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Infrastructure & Security - Takes 1/3 space */}
        <div className="space-y-6 flex flex-col h-full">
          <div className="aox-widget border-aox-blue/20 bg-aox-blue/5 flex-1 flex flex-col">
            <div className="p-6 flex flex-col h-full">
              <h3 className="font-display text-sm font-bold mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-aox-blue" />
                Infrastructure
              </h3>
              <div className="space-y-3 flex-1">
                {[
                  { label: 'Proxy Token', value: '0xeb95...6bb47d73aae1d4f7a94148b554b2f4', status: 'Active', color: 'text-aox-green' },
                  { label: 'Implementation', value: '0x97bdd1...1465b365', status: 'Verified', color: 'text-aox-blue' },
                  { label: 'Multi-sig', value: '0x20c0dd...9db8ca84', status: 'Secured', color: 'text-purple-400' },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">{item.label}</span>
                      <span className={cn("text-[9px] font-mono uppercase tracking-widest", item.color)}>{item.status}</span>
                    </div>
                    <code className="text-[10px] font-mono text-white/60 block truncate">{item.value}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="aox-widget flex-1 flex flex-col">
            <div className="p-6 flex flex-col h-full">
              <h3 className="font-display text-sm font-bold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-white/50" />
                Global Topology
              </h3>
              <div className="h-32 relative rounded-lg overflow-hidden bg-black/40 border border-white/5 flex-1">
                <div className="absolute inset-0 opacity-10 bg-[url('https://picsum.photos/seed/topology/800/600')] bg-cover bg-center grayscale invert" />
                {pings.map((ping, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-aox-green rounded-full glow-green"
                    style={{ top: ping.top, left: ping.left }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.2em]">1,284 Nodes</p>
                    <p className="text-[10px] font-bold tracking-tight">Global Mesh Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
