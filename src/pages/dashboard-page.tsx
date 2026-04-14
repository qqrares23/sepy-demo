"use client";

import { useState, useEffect } from "react";
import { TrendingUp, X, Send, ShoppingCart, ShieldCheck, Zap, ArrowUpRight, Wallet } from "lucide-react";
import { AreaChart, Area, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// ── Enhanced Market Simulation Hook ──────────────────────────────────────────

export function useMarketData() {
  const [prices, setPrices] = useState({
    BTC: 64281.20,
    ETH: 3412.85,
    SOL: 145.32,
    DOT: 7.24
  });
  
  const [portfolio, setPortfolio] = useState(128432.50);
  const [history, setHistory] = useState<any[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    // Initialize history with mock data
    const initialHistory = Array.from({ length: 20 }, (_, i) => ({
      time: i,
      value: 128000 + Math.random() * 1000,
    }));
    setHistory(initialHistory);

    const interval = setInterval(() => {
      setPrices(prev => ({
        BTC: prev.BTC + (Math.random() - 0.5) * 50,
        ETH: prev.ETH + (Math.random() - 0.5) * 10,
        SOL: prev.SOL + (Math.random() - 0.5) * 2,
        DOT: prev.DOT + (Math.random() - 0.5) * 0.1
      }));
      
      setPortfolio(prev => {
        const newValue = prev + (Math.random() - 0.5) * 100;
        setHistory(h => [...h.slice(1), { time: Date.now(), value: newValue }]);
        return newValue;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerTransaction = (amount: number, type: 'buy' | 'send' | 'stake') => {
    if (type === 'send') {
      setPortfolio(prev => prev - amount);
      setLastAction(`Transferred $${amount.toLocaleString()} to external vault.`);
    } else if (type === 'buy') {
      setPortfolio(prev => prev + amount);
      setLastAction(`Successfully acquired assets. Portfolio updated.`);
    } else {
      setLastAction(`Assets locked in staking vault at 12.4% APY.`);
    }
    setTimeout(() => setLastAction(null), 4000);
  };

  return { prices, portfolio, history, triggerTransaction, lastAction };
}

// ── Chart Component ─────────────────────────────────────────────────────────

function LiveAreaChart({ data, color = "#81ecff" }: { data: any[], color?: string }) {
  const config = { value: { label: "Value", color } } satisfies ChartConfig;
  return (
    <ChartContainer config={config} className="w-full h-full aspect-auto">
      <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Area 
          dataKey="value" 
          type="natural" 
          fill={`url(#fill-${color})`} 
          stroke={color} 
          strokeWidth={2} 
          isAnimationActive={false} 
        />
      </AreaChart>
    </ChartContainer>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { prices, portfolio, history, triggerTransaction, lastAction } = useMarketData();
  const [activeRange, setActiveRange] = useState("1D");
  
  // Modal States
  const [activeModal, setActiveModal] = useState<'send' | 'stake' | 'trade' | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  const markets = [
    { name: "Bitcoin", ticker: "BTC", price: prices.BTC, change: "+2.45%", up: true, cap: "$1.2T", color: "text-[#F7931A]", stroke: "#F7931A" },
    { name: "Ethereum", ticker: "ETH", price: prices.ETH, change: "-1.12%", up: false, cap: "$410.5B", color: "text-[#627EEA]", stroke: "#627EEA" },
    { name: "Solana", ticker: "SOL", price: prices.SOL, change: "+8.91%", up: true, cap: "$64.2B", color: "text-[#14F195]", stroke: "#14F195" },
    { name: "Polkadot", ticker: "DOT", price: prices.DOT, change: "+0.42%", up: true, cap: "$10.1B", color: "text-[#E6007A]", stroke: "#E6007A" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative">
      <style>{`
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Global Notification Toast */}
      {lastAction && (
        <div className="fixed bottom-8 right-8 z-[100] bg-[#69f6b8] text-[#003840] px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10">
          <ShieldCheck className="h-5 w-5" />
          {lastAction}
        </div>
      )}

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">Vault Overview</h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">Real-time monitoring of your cryptographic assets.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#1c2024] p-1 rounded-xl border border-white/5">
          {["1D", "1W", "1M", "ALL"].map((r) => (
            <button 
              key={r} 
              onClick={() => setActiveRange(r)} 
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeRange === r ? "bg-[#81ecff] text-[#003840]" : "text-[#a9abaf] hover:text-[#f8f9fe]"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#101417] rounded-3xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-[0.2em] text-[#a9abaf] uppercase">Net Portfolio Value</span>
            <div className="text-6xl font-headline font-bold text-[#f8f9fe] mt-4 tracking-tighter">
              ${portfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#69f6b8]/10 text-[#69f6b8] text-sm font-bold">
                <TrendingUp className="h-4 w-4" /> +12.4%
              </div>
              <span className="text-xs text-[#a9abaf] font-medium ml-2 uppercase tracking-widest italic">Live Node Sync Active</span>
            </div>
          </div>
          <div className="relative h-56 mt-8 w-full">
             <LiveAreaChart data={history} color="#81ecff" />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div 
            onClick={() => setActiveModal('send')}
            className="flex-1 bg-gradient-to-br from-[#81ecff] to-[#00d4ec] rounded-3xl p-8 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-transform shadow-xl shadow-[#81ecff]/10"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Send className="text-[#003840] h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-[#003840]">Send Assets</h3>
              <p className="text-[#003840]/70 text-sm mt-1">Instant P2P transfers</p>
            </div>
          </div>

          <div 
            onClick={() => setActiveModal('stake')}
            className="flex-1 bg-[#161a1e] rounded-3xl p-8 border border-white/5 flex flex-col justify-between cursor-pointer group hover:bg-[#1c2024] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#69f6b8]/10 flex items-center justify-center">
              <Zap className="text-[#69f6b8] h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-[#f8f9fe]">Stake & Earn</h3>
              <p className="text-[#a9abaf] text-sm mt-1">Compound yields up to 12% APY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Table */}
      <section className="bg-[#101417] rounded-3xl border border-white/5 overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
          <h2 className="text-xl font-headline font-bold">Market Intelligence</h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest text-glow">Live Feed</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                {["Asset", "Price", "24h Change", "Market Cap", "Activity", "Action"].map((h) => (
                  <TableHead key={h} className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf]">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {markets.map((m) => (
                <TableRow key={m.name} className="border-none hover:bg-[#161a1e] transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-[#1c2024] flex items-center justify-center border border-white/5 font-bold text-xs ${m.color}`}>
                        {m.ticker}
                      </div>
                      <span className="font-bold text-[#f8f9fe]">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-headline font-bold text-[#f8f9fe]">
                    ${m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`px-8 py-6 font-bold ${m.up ? "text-[#69f6b8]" : "text-[#ff716c]"}`}>
                    {m.change}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-[#a9abaf] text-sm font-medium">{m.cap}</TableCell>
                  <TableCell className="px-8 py-6 w-32">
                    <div className="h-8">
                      <LiveAreaChart data={history.map(h => ({ ...h, value: h.value + (Math.random() * 200) }))} color={m.stroke} />
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button 
                      variant="outline" 
                      onClick={() => { setSelectedAsset(m); setActiveModal('trade'); }}
                      className="rounded-xl border-white/10 text-xs font-bold hover:bg-[#81ecff] hover:text-[#003840] transition-all"
                    >
                      Trade
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ── CUSTOM POPUP WINDOWS (No external dependency required) ────────── */}
      {activeModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Animated Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
            onClick={() => setActiveModal(null)} 
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-[#101417] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-8 right-8 text-[#a9abaf] hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {activeModal === 'send' && (
              <div className="space-y-8">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#81ecff]/10 flex items-center justify-center mb-6">
                    <ArrowUpRight className="text-[#81ecff] h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Send Assets</h2>
                  <p className="text-[#a9abaf] text-sm mt-2">Transfer funds instantly to any cryptographic address.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Recipient Address</label>
                    <input placeholder="0x... or ENS name" className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Amount (USD)</label>
                    <div className="relative">
                      <input placeholder="0.00" type="number" className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#81ecff]">MAX</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => { triggerTransaction(2500, 'send'); setActiveModal(null); }} 
                  className="w-full bg-[#81ecff] text-[#003840] font-bold py-7 rounded-2xl hover:scale-[0.98] transition-all text-base shadow-lg shadow-[#81ecff]/10"
                >
                  Authorize Transfer
                </Button>
              </div>
            )}

            {activeModal === 'trade' && selectedAsset && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#1c2024] border border-white/5 flex items-center justify-center font-bold text-[#81ecff]">
                      {selectedAsset.ticker}
                    </div>
                    <div>
                      <h2 className="text-2xl font-headline font-bold text-white tracking-tight">Trade {selectedAsset.name}</h2>
                      <p className="text-[#69f6b8] text-xs font-bold tracking-widest uppercase">Live Market Execution</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#1c2024]/50 border border-white/5 rounded-3xl p-8 text-center space-y-2">
                  <p className="text-[10px] text-[#a9abaf] uppercase tracking-widest font-bold">Estimated Output</p>
                  <p className="text-5xl font-headline font-bold text-white tracking-tighter">
                    {(1500 / selectedAsset.price).toFixed(4)} <span className="text-[#a9abaf] text-2xl">{selectedAsset.ticker}</span>
                  </p>
                  <p className="text-xs text-[#a9abaf] pt-2">1 {selectedAsset.ticker} ≈ ${selectedAsset.price.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={() => setActiveModal(null)} variant="outline" className="py-7 rounded-2xl border-white/5 hover:bg-white/5">Cancel</Button>
                  <Button 
                    onClick={() => { triggerTransaction(1500, 'buy'); setActiveModal(null); }} 
                    className="bg-[#69f6b8] text-[#003840] font-bold py-7 rounded-2xl hover:brightness-110"
                  >
                    Confirm Buy
                  </Button>
                </div>
              </div>
            )}

            {activeModal === 'stake' && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-[#69f6b8]/10 flex items-center justify-center">
                    <Zap className="text-[#69f6b8] h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Yield Vault</h2>
                    <p className="text-[#a9abaf] text-sm">Lock assets to earn protocol rewards.</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-[#1c2024] p-5 rounded-2xl border border-white/5">
                    <span className="text-sm font-medium text-[#a9abaf]">Variable APY</span>
                    <span className="text-xl font-bold text-[#69f6b8]">12.42%</span>
                  </div>
                  <div className="flex justify-between items-center bg-[#1c2024] p-5 rounded-2xl border border-white/5">
                    <span className="text-sm font-medium text-[#a9abaf]">Staking Period</span>
                    <span className="text-xl font-bold text-white">Flexi-Lock</span>
                  </div>
                </div>
                <div className="p-4 bg-[#81ecff]/5 border border-[#81ecff]/10 rounded-2xl">
                  <p className="text-[10px] leading-relaxed text-[#81ecff]/80 font-medium">
                    Note: Staked assets contribute to network security. Withdrawals are subject to a 24h unbonding period.
                  </p>
                </div>
                <Button 
                  onClick={() => { triggerTransaction(0, 'stake'); setActiveModal(null); }} 
                  className="w-full bg-white text-black font-bold py-7 rounded-2xl hover:bg-[#f8f9fe]/90 transition-all shadow-xl shadow-white/5"
                >
                  Start Earning
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}