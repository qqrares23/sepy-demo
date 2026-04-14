"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// ── Market Simulation Hook ────────────────────────────────────────────────────

export function useMarketData() {
  const [prices, setPrices] = useState({
    BTC: 64281.20,
    ETH: 3412.85,
    SOL: 145.32,
    DOT: 7.24,
    USDC: 1.00
  });
  
  const [portfolio, setPortfolio] = useState(128432.50);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Initialize history
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
        DOT: prev.DOT + (Math.random() - 0.5) * 0.1,
        USDC: 1.00 + (Math.random() - 0.5) * 0.001
      }));
      
      setPortfolio(prev => {
        const newValue = prev + (Math.random() - 0.5) * 100;
        setHistory(h => [...h.slice(1), { time: Date.now(), value: newValue }]);
        return newValue;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return { prices, portfolio, history };
}

// ── New Recharts Live Component ──────────────────────────────────────────────

function LiveAreaChart({ data, color = "#81ecff" }: { data: any[], color?: string }) {
  const config = {
    value: {
      label: "Value",
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={config} className="w-full h-full aspect-auto">
      <AreaChart
        data={data}
        margin={{
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id={`fillColor-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          dataKey="value"
          type="natural"
          fill={`url(#fillColor-${color.replace("#", "")})`}
          fillOpacity={0.4}
          stroke={color}
          strokeWidth={3}
          isAnimationActive={true}
          animationDuration={1000}
        />
      </AreaChart>
    </ChartContainer>
  );
}

// ── Types & Data ─────────────────────────────────────────────────────────────

interface SwapToken {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  balance: string;
  price: number;
}

const recentSwaps = [
  { id: "TX-9281", time: "2 mins ago", from: "2.45 ETH", to: "6,012.4 USDC", value: "$6,012.42", status: "Confirmed", gas: "0.002 ETH" },
  { id: "TX-9275", time: "14 mins ago", from: "0.85 ETH", to: "2,102.1 USDC", value: "$2,102.15", status: "Confirmed", gas: "0.0015 ETH" },
  { id: "TX-9260", time: "1 hour ago", from: "15,000 USDC", to: "6.12 ETH", value: "$14,992.80", status: "Confirmed", gas: "12.5 USDC" },
];

// ── Components ───────────────────────────────────────────────────────────────

function SwapDetailsModal({ tx, onClose }: { tx: typeof recentSwaps[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b0e11]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#161a1e] w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#81ecff]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="flex justify-between items-center mb-8 relative z-10">
          <h3 className="font-headline font-bold text-xl text-[#f8f9fe]">Transmission Details</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#101417] flex items-center justify-center text-[#a9abaf] hover:text-white transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        
        <div className="space-y-6 relative z-10">
          <div className="flex flex-col items-center py-6 bg-[#101417] rounded-3xl border border-white/5">
            <div className="w-16 h-16 bg-[#69f6b8]/10 rounded-full flex items-center justify-center border border-[#69f6b8]/20 mb-4">
              <span className="material-symbols-outlined text-3xl text-[#69f6b8]">check_circle</span>
            </div>
            <p className="text-2xl font-headline font-bold text-[#f8f9fe]">{tx.value}</p>
            <p className="text-xs text-[#a9abaf] font-bold uppercase tracking-widest mt-1">Settled Globally</p>
          </div>

          <div className="space-y-3">
            {[
              { label: "Transmission ID", value: tx.id },
              { label: "Asset Flow", value: tx.from + " ➔ " + tx.to },
              { label: "Network Fee", value: tx.gas },
              { label: "Timestamp", value: tx.time },
              { label: "Status", value: tx.status, color: "text-[#69f6b8]" }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-4 bg-[#101417] rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">{item.label}</span>
                <span className={`text-sm font-bold ${item.color || "text-[#f8f9fe]"}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <Button className="w-full py-6 rounded-2xl bg-[#101417] text-[#81ecff] border border-[#81ecff]/20 font-headline font-bold uppercase tracking-widest text-xs hover:bg-[#81ecff] hover:text-[#003840] transition-all">
            View on Blockchain Explorer
          </Button>
        </div>
      </div>
    </div>
  );
}

function TokenInput({ label, token, amount, onAmountChange, isReadOnly = false }: { 
  label: string; 
  token: SwapToken; 
  amount: string; 
  onAmountChange?: (val: string) => void;
  isReadOnly?: boolean;
}) {
  return (
    <div className="bg-[#101417] rounded-3xl p-6 border border-white/5 transition-all hover:border-white/10 group">
      <div className="flex justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">{label}</span>
        <span className="text-[10px] font-bold text-[#a9abaf] tracking-widest">Balance: {token.balance} {token.symbol}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-[#1c2024] px-4 py-2 rounded-2xl border border-white/5 cursor-pointer hover:bg-[#22262b] transition-all">
          <div className={`w-8 h-8 rounded-full bg-[#101417] flex items-center justify-center border border-white/5 ${token.color}`}>
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{token.icon}</span>
          </div>
          <span className="font-headline font-bold text-sm text-[#f8f9fe]">{token.symbol}</span>
          <span className="material-symbols-outlined text-sm text-[#a9abaf]">expand_more</span>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          readOnly={isReadOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="bg-transparent border-none p-0 text-3xl font-headline font-bold text-right focus-visible:ring-0 text-[#f8f9fe] placeholder-[#a9abaf]/20"
        />
      </div>
      <div className="text-right mt-2 text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">
        ≈ ${(Number(amount) * token.price).toLocaleString()} USD
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SwapPage() {
  const { prices, history } = useMarketData();
  
  const tokens: Record<string, SwapToken> = {
    ETH: { 
      symbol: "ETH", 
      name: "Ethereum", 
      icon: "diamond", 
      color: "text-[#af88ff]", 
      balance: "12.45",
      price: prices.ETH 
    },
    USDC: { 
      symbol: "USDC", 
      name: "USD Coin", 
      icon: "monetization_on", 
      color: "text-[#81ecff]", 
      balance: "2,448.15",
      price: prices.USDC 
    }
  };

  const [payTokenSymbol, setPayTokenSymbol] = useState("ETH");
  const [receiveTokenSymbol, setReceiveTokenSymbol] = useState("USDC");
  
  const payToken = tokens[payTokenSymbol];
  const receiveToken = tokens[receiveTokenSymbol];
  
  const [payAmount, setPayAmount] = useState("1.0");
  const [isRotating, setIsRotating] = useState(false);
  const [selectedTx, setSelectedTx] = useState<typeof recentSwaps[0] | null>(null);

  const handleSwap = () => {
    setIsRotating(true);
    setTimeout(() => {
      setPayTokenSymbol(receiveTokenSymbol);
      setReceiveTokenSymbol(payTokenSymbol);
      setIsRotating(false);
    }, 300);
  };

  const receiveAmount = (Number(payAmount) * (payToken.price / receiveToken.price)).toFixed(2);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
            Kinetic Swap
          </h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">
            Institutional-grade execution with zero-latency liquidity routing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Swap Card */}
        <div className="lg:col-span-5 bg-[#161a1e] rounded-[3rem] p-2 border border-white/5 shadow-2xl">
          <div className="bg-[#1c2024] rounded-[2.8rem] p-8 space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-headline font-bold text-[#81ecff]">Exchange</h2>
              <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-[#101417] border border-white/5 text-[#a9abaf] hover:text-[#81ecff]">
                <span className="material-symbols-outlined text-xl">settings_suggest</span>
              </Button>
            </div>

            <TokenInput 
              label="You Pay" 
              token={payToken} 
              amount={payAmount} 
              onAmountChange={setPayAmount} 
            />

            <div className="relative h-2 flex items-center justify-center">
              <button
                onClick={handleSwap}
                className={`absolute z-10 w-12 h-12 bg-[#22262b] rounded-2xl flex items-center justify-center border-4 border-[#1c2024] text-[#81ecff] transition-all duration-500 hover:text-[#69f6b8] shadow-xl ${isRotating ? "rotate-180 scale-90" : "hover:rotate-180"}`}
              >
                <span className="material-symbols-outlined text-2xl">swap_vert</span>
              </button>
            </div>

            <TokenInput 
              label="You Receive" 
              token={receiveToken} 
              amount={receiveAmount} 
              isReadOnly 
            />

            <div className="px-4 py-4 bg-[#101417]/50 rounded-2xl space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">
                <span>Exchange Rate</span>
                <span className="text-[#f8f9fe]">1 {payToken.symbol} = {(payToken.price / receiveToken.price).toFixed(4)} {receiveToken.symbol}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">
                <span>Slippage Protection</span>
                <span className="text-[#69f6b8]">0.5% (OPTIMAL)</span>
              </div>
            </div>

            <Button className="w-full py-8 rounded-[2rem] bg-gradient-to-br from-[#81ecff] to-[#00d4ec] text-[#003840] font-headline font-bold text-xl shadow-xl shadow-[#81ecff]/10 hover:scale-[1.02] active:scale-95 transition-all">
              Initiate Swap
            </Button>
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden h-[380px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-headline font-bold text-[#f8f9fe] mb-2">{payToken.symbol} / {receiveToken.symbol}</h3>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#69f6b8]/10 text-[#69f6b8] text-xs font-bold tracking-widest">+4.28%</span>
                  <span className="text-xs text-[#a9abaf] font-bold uppercase tracking-widest">Market Status: High Growth</span>
                </div>
              </div>
              <div className="flex gap-2 bg-[#1c2024] p-1 rounded-xl border border-white/5">
                {["1H", "1D", "1W", "1M"].map((t) => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t === "1D" ? "bg-[#22262b] text-[#81ecff]" : "text-[#a9abaf] hover:text-[#f8f9fe]"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              <LiveAreaChart data={history.map(h => ({ ...h, value: h.value - 128000 + (prices[payToken.symbol as keyof typeof prices] || 0) }))} color="#81ecff" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#161a1e] p-8 rounded-3xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#69f6b8]/10 border border-[#69f6b8]/20 flex items-center justify-center text-[#69f6b8] mb-6">
                <span className="material-symbols-outlined text-3xl">trending_down</span>
              </div>
              <h4 className="font-headline font-bold text-[#f8f9fe] text-lg mb-1">Price Impact</h4>
              <p className="text-2xl font-headline font-bold text-[#69f6b8]">Minimal <span className="text-xs font-normal text-[#a9abaf] ml-1">(-0.01%)</span></p>
            </div>
            <div className="bg-[#161a1e] p-8 rounded-3xl border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-[#af88ff]/10 border border-[#af88ff]/20 flex items-center justify-center text-[#af88ff] mb-6">
                <span className="material-symbols-outlined text-3xl">waves</span>
              </div>
              <h4 className="font-headline font-bold text-[#f8f9fe] text-lg mb-1">Aggregated Liquidity</h4>
              <p className="text-2xl font-headline font-bold text-[#af88ff]">$42.8M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <section className="bg-[#101417] rounded-[2.5rem] border border-white/5 overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#161a1e]/30">
          <h2 className="text-xl font-headline font-bold">Recent Market Swaps</h2>
          <Button variant="ghost" className="text-[#81ecff] font-bold text-xs uppercase tracking-[0.2em] p-0 hover:bg-transparent">View History Explorer</Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none hover:bg-transparent">
                {["Timestamp", "Transmission Flow", "Total Value", "Status", "Activity", "Action"].map((h, i) => (
                  <TableHead key={h} className={`px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] ${i === 5 ? "text-right" : ""}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {recentSwaps.map((tx) => (
                <TableRow key={tx.id} className="border-none hover:bg-[#161a1e]/50 transition-all group cursor-pointer" onClick={() => setSelectedTx(tx)}>
                  <TableCell className="px-8 py-6 text-xs text-[#a9abaf] font-bold">{tx.time}</TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#f8f9fe]">{tx.from}</span>
                      <span className="material-symbols-outlined text-[#81ecff] text-sm animate-pulse">arrow_forward</span>
                      <span className="font-bold text-[#f8f9fe]">{tx.to}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-headline font-bold text-sm text-[#f8f9fe]">{tx.value}</TableCell>
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#69f6b8] shadow-[0_0_8px_#69f6b8]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#69f6b8]">{tx.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 w-40">
                    <div className="h-10 w-full">
                      <LiveAreaChart data={history.map(h => ({ ...h, value: h.value + (Math.random() - 0.5) * 500 }))} color="#81ecff" />
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-white/10 text-[#a9abaf] group-hover:text-[#81ecff] group-hover:border-[#81ecff]/30 transition-all">
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

      {/* Modals - Placed at the very end to avoid container clipping */}
      {selectedTx && (
        <div className="fixed inset-0 z-[9999]">
          <SwapDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </div>
      )}
    </div>
  );
}
