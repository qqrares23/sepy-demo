import { useMemo } from "react";
import type { Token, HistoryPoint } from "@/types/crypto";
import type { MarketData } from "@/hooks/use-market-data";
import { LiveAreaChart } from "./live-area-chart";

interface SwapInfoPanelProps {
  payToken: Token;
  receiveToken: Token;
  history: HistoryPoint[];
  prices: Record<string, number>;
  data: MarketData[];
  portfolio: number;
  payAmount: string;
}

export function SwapInfoPanel({ payToken, receiveToken, history, prices, data, portfolio, payAmount }: SwapInfoPanelProps) {
  // Find current market data for selected tokens
  const payMarket = useMemo(() => data.find(d => d.symbol.toUpperCase() === payToken.symbol.toUpperCase()), [data, payToken]);
  const receiveMarket = useMemo(() => data.find(d => d.symbol.toUpperCase() === receiveToken.symbol.toUpperCase()), [data, receiveToken]);

  // Dynamic Price Impact: Scales with transaction size vs portfolio/liquidity
  const priceImpact = useMemo(() => {
    const usdValue = parseFloat(payAmount || "0") * payToken.price;
    if (usdValue === 0) return 0;
    // Simulate impact: larger trades relative to total market cap have more impact
    const baseImpact = (usdValue / (receiveMarket?.market_cap || 1e9)) * 100;
    return Math.max(0.01, baseImpact + (Math.random() * 0.02));
  }, [payAmount, payToken.price, receiveMarket]);

  // Aggregated Liquidity: Based on market caps of the pair
  const aggregatedLiquidity = useMemo(() => {
    const totalCap = (payMarket?.market_cap || 0) + (receiveMarket?.market_cap || 0);
    // Scale total cap to a readable liquidity depth (e.g. 0.01% of market cap as available liquidity)
    const liquidity = totalCap * 0.0001;
    if (liquidity === 0) return "1.2B";
    return liquidity > 1e9 ? `${(liquidity / 1e9).toFixed(1)}B` : `${(liquidity / 1e6).toFixed(1)}M`;
  }, [payMarket, receiveMarket]);

  // Win/Loss Metric: Based on 24h performance of the pair
  const performance24h = useMemo(() => {
    const change = payMarket?.price_change_percentage_24h || 0;
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      isUp: change >= 0,
      status: change > 5 ? "High Growth" : change > 0 ? "Stable Growth" : change > -5 ? "Correction" : "Volatile"
    };
  }, [payMarket]);

  return (
    <div className="lg:col-span-7 space-y-8">
      <div className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden h-[380px] flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex justify-between items-start mb-10">
          <div>
            <h3 className="text-3xl font-headline font-bold text-[#f8f9fe] mb-2">{payToken.symbol} / {receiveToken.symbol}</h3>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full ${performance24h.isUp ? 'bg-[#69f6b8]/10 text-[#69f6b8]' : 'bg-[#ff716c]/10 text-[#ff716c]'} text-xs font-bold tracking-widest`}>
                {performance24h.value}
              </span>
              <span className="text-xs text-[#a9abaf] font-bold uppercase tracking-widest">Market Status: {performance24h.status}</span>
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
          <LiveAreaChart data={history.map(h => ({ ...h, value: h.value - 128000 + (prices[payToken.symbol.toUpperCase()] || 0) }))} color="#81ecff" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#161a1e] p-8 rounded-3xl border border-white/5">
          <div className={`w-12 h-12 rounded-xl ${priceImpact > 1 ? 'bg-[#ff716c]/10 text-[#ff716c] border-[#ff716c]/20' : 'bg-[#69f6b8]/10 text-[#69f6b8] border-[#69f6b8]/20'} border flex items-center justify-center mb-6`}>
            <span className="material-symbols-outlined text-3xl">{priceImpact > 1 ? 'priority_high' : 'trending_down'}</span>
          </div>
          <h4 className="font-headline font-bold text-[#f8f9fe] text-lg mb-1">Price Impact</h4>
          <p className={`text-2xl font-headline font-bold ${priceImpact > 2 ? 'text-[#ff716c]' : priceImpact > 0.5 ? 'text-amber-500' : 'text-[#69f6b8]'}`}>
            {priceImpact > 2 ? 'High' : priceImpact > 0.5 ? 'Moderate' : 'Minimal'} 
            <span className="text-xs font-normal text-[#a9abaf] ml-1">(-{priceImpact.toFixed(2)}%)</span>
          </p>
        </div>
        <div className="bg-[#161a1e] p-8 rounded-3xl border border-white/5">
          <div className="w-12 h-12 rounded-xl bg-[#af88ff]/10 border border-[#af88ff]/20 flex items-center justify-center text-[#af88ff] mb-6">
            <span className="material-symbols-outlined text-3xl">waves</span>
          </div>
          <h4 className="font-headline font-bold text-[#f8f9fe] text-lg mb-1">Aggregated Liquidity</h4>
          <p className="text-2xl font-headline font-bold text-[#af88ff]">${aggregatedLiquidity}</p>
        </div>
      </div>
    </div>
  );
}
