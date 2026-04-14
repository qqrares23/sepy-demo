"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid } from "recharts";
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

// ── Market Simulation Hook ────────────────────────────────────────────────────

export function useMarketData() {
  const [prices, setPrices] = useState({
    BTC: 64281.20,
    ETH: 3412.85,
    SOL: 145.32,
    DOT: 7.24
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
          <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
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
          fill="url(#fillColor)"
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

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { prices, portfolio, history } = useMarketData();
  const [activeRange, setActiveRange] = useState("1D");

  const markets = [
    { name: "Bitcoin", ticker: "BTC", price: prices.BTC, change: "+2.45%", up: true, cap: "$1.2T", color: "text-[#F7931A]", icon: "currency_bitcoin", stroke: "#69f6b8" },
    { name: "Ethereum", ticker: "ETH", price: prices.ETH, change: "-1.12%", up: false, cap: "$410.5B", color: "text-[#627EEA]", icon: "diamond", stroke: "#ff716c" },
    { name: "Solana", ticker: "SOL", price: prices.SOL, change: "+8.91%", up: true, cap: "$64.2B", color: "text-[#14F195]", icon: "bolt", stroke: "#69f6b8" },
    { name: "Polkadot", ticker: "DOT", price: prices.DOT, change: "+0.42%", up: true, cap: "$10.1B", color: "text-[#E6007A]", icon: "hub", stroke: "#69f6b8" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
            Vault Overview
          </h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">
            Real-time monitoring of your cryptographic assets and node performance.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#1c2024] p-1 rounded-xl border border-white/5">
          {["1D", "1W", "1M", "ALL"].map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRange === r 
                  ? "bg-[#81ecff] text-[#003840] shadow-lg shadow-[#81ecff]/10" 
                  : "text-[#a9abaf] hover:text-[#f8f9fe]"
              }`}
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
            <span className="text-xs font-bold tracking-[0.2em] text-[#a9abaf] uppercase">
              Net Portfolio Value
            </span>
            <div className="text-6xl font-headline font-bold text-[#f8f9fe] mt-4 tracking-tighter">
              ${portfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#69f6b8]/10 text-[#69f6b8] text-sm font-bold">
                <TrendingUp className="h-4 w-4" />
                +12.4%
              </div>
              <span className="text-xs text-[#a9abaf] font-medium ml-2 uppercase tracking-widest">Live Node Sync Active</span>
            </div>
          </div>

          <div className="relative h-56 mt-8 w-full">
             <LiveAreaChart data={history} color="#81ecff" />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="flex-1 bg-gradient-to-br from-[#81ecff] to-[#00d4ec] rounded-3xl p-8 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-transform duration-300 shadow-xl shadow-[#81ecff]/10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <span className="material-symbols-outlined text-[#003840] text-3xl">send</span>
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-[#003840]">Send Assets</h3>
              <p className="text-[#003840]/70 text-sm mt-1">Instant peer-to-peer transfers</p>
            </div>
          </div>

          <div className="flex-1 bg-[#161a1e] rounded-3xl p-8 border border-white/5 flex flex-col justify-between cursor-pointer group hover:bg-[#1c2024] transition-all duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#69f6b8]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#69f6b8] text-3xl">shopping_cart</span>
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-[#f8f9fe]">Buy / Stake</h3>
              <p className="text-[#a9abaf] text-sm mt-1">Grow your portfolio with 8% APY</p>
            </div>
          </div>
        </div>
      </div>

      {/* Market Table */}
      <section className="bg-[#101417] rounded-3xl border border-white/5 overflow-hidden">
        <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
          <h2 className="text-xl font-headline font-bold">Market Intelligence</h2>
          <Button variant="ghost" className="text-[#81ecff] font-bold uppercase tracking-widest text-xs p-0 hover:bg-transparent">
            Live Stream
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none">
                {["Asset", "Live Price", "24h Change", "Market Cap", "Activity", "Action"].map((h, i) => (
                  <TableHead key={h} className={`px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] ${i === 5 ? "text-right" : ""}`}>{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-white/5">
              {markets.map((m) => (
                <TableRow key={m.name} className="border-none hover:bg-[#161a1e] transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#1c2024] flex items-center justify-center border border-white/5">
                        <span className={`material-symbols-outlined ${m.color} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-[#f8f9fe]">{m.name}</p>
                        <p className="text-[10px] text-[#a9abaf] font-bold">{m.ticker}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-headline font-bold text-sm text-[#f8f9fe]">
                    ${m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`px-8 py-6 text-sm font-bold ${m.up ? "text-[#69f6b8]" : "text-[#ff716c]"}`}>
                    {m.change}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-[#a9abaf] text-sm font-medium">{m.cap}</TableCell>
                  <TableCell className="px-8 py-6 w-40">
                    <div className="h-10 w-full">
                      <LiveAreaChart data={history.map(h => ({ ...h, value: h.value + (Math.random() - 0.5) * 500 }))} color={m.stroke} />
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button variant="outline" size="sm" className="rounded-lg border-white/10 text-xs font-bold uppercase tracking-widest hover:bg-[#81ecff] hover:text-[#003840] transition-all">Trade</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
