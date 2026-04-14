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

interface Asset {
  rank: number;
  name: string;
  ticker: string;
  icon: string;
  iconColor: string;
  price: string;
  change: string;
  changeColor: string;
  cap: string;
  volume: string;
}

// ── Trade Modal ───────────────────────────────────────────────────────────────

function TradeModal({ asset, price, onClose }: { asset: Asset; price: number; onClose: () => void }) {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const handleTrade = () => {
    setStatus("processing");
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b0e11]/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#161a1e] w-full max-w-md rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#81ecff]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#101417] border border-white/5 flex items-center justify-center">
              <span className={`material-symbols-outlined ${asset.iconColor}`}>{asset.icon}</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg">Trade {asset.ticker}</h3>
              <p className="text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest">{asset.name} / USD</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#101417] flex items-center justify-center text-[#a9abaf] hover:text-white transition-colors border border-white/5">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {status === "success" ? (
          <div className="py-12 text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#69f6b8]/10 rounded-full flex items-center justify-center mx-auto border border-[#69f6b8]/20">
              <span className="material-symbols-outlined text-4xl text-[#69f6b8]">check_circle</span>
            </div>
            <h4 className="text-2xl font-headline font-bold">Trade Executed</h4>
            <p className="text-sm text-[#a9abaf]">Your order for {amount} {asset.ticker} has been synchronized with the ledger.</p>
            <Button onClick={onClose} className="w-full bg-[#101417] text-[#f8f9fe] border border-white/10 rounded-2xl py-6 mt-4">Close Window</Button>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            <div className="bg-[#101417] p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest mb-3">
                <span>Amount to Buy</span>
                <span>Balance: 12.45 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border-none p-0 text-3xl font-headline font-bold focus-visible:ring-0 text-[#81ecff]"
                />
                <span className="font-headline font-bold text-xl opacity-50">{asset.ticker}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-between text-xs text-[#a9abaf] font-medium">
                <span>Estimated Value</span>
                <span>${(Number(amount) * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#101417] p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Slippage</p>
                <p className="font-bold text-sm mt-1">0.1% (Optimal)</p>
              </div>
              <div className="bg-[#101417] p-4 rounded-2xl border border-white/5">
                <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Fee</p>
                <p className="font-bold text-sm mt-1">$2.40 USD</p>
              </div>
            </div>

            <Button
              disabled={!amount || status === "processing"}
              onClick={handleTrade}
              className={`w-full py-7 rounded-2xl font-headline font-bold text-lg transition-all ${
                status === "processing" ? "opacity-50" : "hover:scale-[1.02]"
              }`}
              style={{ background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)", color: "#003840" }}
            >
              {status === "processing" ? "Synchronizing..." : `Confirm Buy ${asset.ticker}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Quick Execution Card ──────────────────────────────────────────────────────

function QuickExecutionCard({ prices }: { prices: any }) {
  const [processing, setProcessing] = useState(false);
  
  return (
    <div className="bg-[#161a1e] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#af88ff]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#af88ff]/10 border border-[#af88ff]/20 flex items-center justify-center text-[#af88ff]">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <h3 className="font-headline font-bold">Snapshot Execution</h3>
            <p className="text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest">Instant Market Order</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-[#101417] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#f7931a]/10 flex items-center justify-center text-[#f7931a]">
                <span className="material-symbols-outlined text-xs">currency_bitcoin</span>
              </span>
              <span className="text-xs font-bold uppercase">BTC</span>
            </div>
            <span className="text-sm font-bold text-[#f8f9fe]">${prices.BTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="bg-[#101417] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#627eea]/10 flex items-center justify-center text-[#627eea]">
                <span className="material-symbols-outlined text-xs">diamond</span>
              </span>
              <span className="text-xs font-bold uppercase">ETH</span>
            </div>
            <span className="text-sm font-bold text-[#f8f9fe]">${prices.ETH.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-[#101417] p-5 rounded-2xl border border-[#af88ff]/20">
          <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest mb-2">Liquidity Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-headline font-bold text-[#af88ff]">98.2</span>
            <span className="text-xs text-[#69f6b8] font-bold mb-1">+0.4%</span>
          </div>
        </div>

        <Button 
          onClick={() => { setProcessing(true); setTimeout(() => setProcessing(false), 2000); }}
          className="w-full py-6 rounded-2xl bg-[#af88ff] text-[#101417] font-headline font-bold uppercase tracking-widest text-xs hover:bg-[#af88ff]/90 transition-all active:scale-95"
        >
          {processing ? "Capturing Order..." : "Run Kinetic Trade"}
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MarketPage() {
  const { prices, history } = useMarketData();
  const [viewMode, setViewMode] = useState<"real-time" | "snapshot">("real-time");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const assets: Asset[] = [
    { rank: 1, name: "Bitcoin", ticker: "BTC", icon: "currency_bitcoin", iconColor: "text-[#81ecff]", price: `$${prices.BTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: "+2.41%", changeColor: "text-[#69f6b8]", cap: "$1.26T", volume: "$34.1B" },
    { rank: 2, name: "Ethereum", ticker: "ETH", icon: "diamond", iconColor: "text-[#af88ff]", price: `$${prices.ETH.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: "-0.82%", changeColor: "text-[#ff716c]", cap: "$419.4B", volume: "$12.8B" },
    { rank: 3, name: "Solana", ticker: "SOL", icon: "layers", iconColor: "text-[#00d4ec]", price: `$${prices.SOL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: "+5.12%", changeColor: "text-[#69f6b8]", cap: "$66.2B", volume: "$4.2B" },
    { rank: 4, name: "USD Coin", ticker: "USDC", icon: "monetization_on", iconColor: "text-[#a9abaf]", price: `$${prices.USDC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, change: "0.00%", changeColor: "text-[#a9abaf]", cap: "$32.5B", volume: "$2.1B" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {selectedAsset && (
        <TradeModal 
          asset={selectedAsset} 
          price={prices[selectedAsset.ticker as keyof typeof prices] || 0} 
          onClose={() => setSelectedAsset(null)} 
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
            Market Intelligence
          </h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">
            Institutional-grade monitoring of cryptographic asset flows and liquidity depths.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#1c2024] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setViewMode("real-time")}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              viewMode === "real-time" 
                ? "bg-[#81ecff] text-[#003840] shadow-lg shadow-[#81ecff]/10" 
                : "text-[#a9abaf] hover:text-[#f8f9fe]"
            }`}
          >
            Real-Time
          </button>
          <button
            onClick={() => setViewMode("snapshot")}
            className={`px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
              viewMode === "snapshot" 
                ? "bg-[#af88ff] text-[#101417] shadow-lg shadow-[#af88ff]/10" 
                : "text-[#a9abaf] hover:text-[#f8f9fe]"
            }`}
          >
            Snapshot
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={`${viewMode === "snapshot" ? "lg:col-span-8" : "lg:col-span-12"} space-y-8 transition-all duration-500`}>
          {/* Main Chart Area */}
          <div className="bg-[#101417] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden min-h-[400px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1c2024] border border-white/5 flex items-center justify-center text-[#81ecff]">
                  <span className="material-symbols-outlined text-3xl">currency_bitcoin</span>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold">Bitcoin <span className="text-[#a9abaf] font-normal text-sm ml-2 font-body">BTC / USD</span></h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-3xl font-headline font-bold text-[#81ecff]">${prices.BTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className="text-[#69f6b8] text-sm font-bold flex items-center">+2.41%</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 p-1 bg-[#1c2024] rounded-xl border border-white/5">
                {["1H", "1D", "1W", "1M", "1Y"].map((t) => (
                  <button key={t} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${t === "1D" ? "bg-[#22262b] text-[#81ecff]" : "text-[#a9abaf] hover:text-[#f8f9fe]"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-64 w-full relative group">
               <LiveAreaChart data={history.map(h => ({ ...h, value: h.value - 128000 + prices.BTC }))} color="#81ecff" />
              
              {/* Fake Data Point */}
              <div className="absolute left-3/4 bottom-[120px] bg-[#1c2024] px-3 py-1.5 rounded-lg border border-[#81ecff]/30 text-[10px] font-bold text-[#81ecff] z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                ${(prices.BTC + 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[#a9abaf] ml-1">12:00 PM</span>
              </div>
            </div>
          </div>

          {/* Asset Table */}
          <div className="bg-[#101417] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
            <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#161a1e]/30">
              <h2 className="text-xl font-headline font-bold">Market Assets</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a9abaf] text-lg">search</span>
                  <Input className="bg-[#1c2024] border-white/5 rounded-xl pl-10 pr-4 h-10 text-xs w-48 focus-visible:ring-[#81ecff]/30" placeholder="Filter node..." />
                </div>
                <Button variant="outline" className="rounded-xl border-white/10 text-[#a9abaf] w-10 h-10 p-0"><span className="material-symbols-outlined text-lg">filter_list</span></Button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none hover:bg-transparent">
                    {["Rank", "Asset", "Market Price", "24h Shift", "Capitalization", "Activity", "Actions"].map((h, i) => (
                      <TableHead key={h} className={`px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] ${i === 6 ? "text-right" : ""}`}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-white/5">
                  {assets.map((asset) => (
                    <TableRow key={asset.ticker} className="border-none hover:bg-[#161a1e]/50 transition-all group">
                      <TableCell className="px-8 py-6 text-xs font-bold text-[#a9abaf]">{asset.rank}</TableCell>
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#1c2024] flex items-center justify-center border border-white/5 group-hover:border-[#81ecff]/30 transition-colors">
                            <span className={`material-symbols-outlined ${asset.iconColor} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{asset.icon}</span>
                          </div>
                          <div>
                            <p className="font-bold text-[#f8f9fe]">{asset.name}</p>
                            <p className="text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest">{asset.ticker}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 font-headline font-bold text-sm text-[#f8f9fe]">{asset.price}</TableCell>
                      <TableCell className="px-8 py-6">
                        <div className={`flex items-center gap-1 text-sm font-bold ${asset.changeColor}`}>
                          <span className="material-symbols-outlined text-sm">{asset.change.startsWith("+") ? "trending_up" : "trending_down"}</span>
                          {asset.change}
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-[#a9abaf] text-xs font-bold">{asset.cap}</TableCell>
                      <TableCell className="px-8 py-6">
                        <div className="h-10 w-24">
                          <LiveAreaChart 
                            data={history.map(h => ({ ...h, value: h.value - 128000 + (prices[asset.ticker as keyof typeof prices] || 0) }))} 
                            color={asset.changeColor.includes("69f6b8") ? "#69f6b8" : asset.changeColor.includes("ff716c") ? "#ff716c" : "#81ecff"} 
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-8 py-6 text-right">
                        <Button 
                          onClick={() => setSelectedAsset(asset)}
                          className="rounded-xl bg-[#1c2024] border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-[#81ecff] hover:text-[#003840] hover:border-[#81ecff] transition-all px-6"
                        >
                          Trade
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {viewMode === "snapshot" && (
          <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-right duration-500">
            <QuickExecutionCard prices={prices} />
            
            <div className="bg-[#101417] rounded-[2.5rem] p-8 border border-white/5 space-y-6">
              <h4 className="font-headline font-bold text-lg">Network State</h4>
              <div className="space-y-4">
                {[
                  { label: "Gas Velocity", value: "14.2 Gwei", color: "#69f6b8" },
                  { label: "Node Latency", value: "24ms", color: "#81ecff" },
                  { label: "Block Delta", value: "+1", color: "#af88ff" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#161a1e] p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">{stat.label}</span>
                    <span className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
    </div>
  );
}
