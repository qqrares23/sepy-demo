import { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import type { Token, HistoryPoint } from "@/types/crypto";
import type { MarketData } from "@/hooks/use-market-data";
import { useChartData } from "@/hooks/use-chart-data";
import { LiveAreaChart } from "./live-area-chart";

const RANGES = ["1H", "1D", "1W", "1M"] as const;
type Range = typeof RANGES[number];

interface SwapInfoPanelProps {
  payToken: Token;
  receiveToken: Token;
  history: HistoryPoint[];
  prices: Record<string, number>;
  data: MarketData[];
  portfolio: number;
  payAmount: string;
}

export function SwapInfoPanel({ payToken, receiveToken, prices, data, payAmount }: SwapInfoPanelProps) {
  const [range, setRange] = useState<Range>("1D");

  const payMarket    = useMemo(() => data.find(d => d.symbol.toUpperCase() === payToken.symbol.toUpperCase()), [data, payToken]);
  const receiveMarket = useMemo(() => data.find(d => d.symbol.toUpperCase() === receiveToken.symbol.toUpperCase()), [data, receiveToken]);

  // Resolve the CoinGecko ID for the selected pay token
  const coinId = payMarket?.id ?? payToken.symbol.toLowerCase();
  const { data: chartData, loading: chartLoading } = useChartData(coinId, range);

  const priceImpact = useMemo(() => {
    const usdValue = parseFloat(payAmount || "0") * payToken.price;
    if (usdValue === 0) return 0;
    const baseImpact = (usdValue / (receiveMarket?.market_cap || 1e9)) * 100;
    return Math.max(0.01, baseImpact + (Math.random() * 0.02));
  }, [payAmount, payToken.price, receiveMarket]);

  const aggregatedLiquidity = useMemo(() => {
    const totalCap = (payMarket?.market_cap || 0) + (receiveMarket?.market_cap || 0);
    const liquidity = totalCap * 0.0001;
    if (liquidity === 0) return "1.2B";
    return liquidity > 1e9 ? `${(liquidity / 1e9).toFixed(1)}B` : `${(liquidity / 1e6).toFixed(1)}M`;
  }, [payMarket, receiveMarket]);

  const performance24h = useMemo(() => {
    const change = payMarket?.price_change_percentage_24h || 0;
    return {
      value: `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`,
      isUp: change >= 0,
      status: change > 5 ? "High Growth" : change > 0 ? "Stable Growth" : change > -5 ? "Correction" : "Volatile"
    };
  }, [payMarket]);

  // Compute range % change from chart data
  const rangeChange = useMemo(() => {
    if (chartData.length < 2) return null;
    const pct = ((chartData[chartData.length - 1].value - chartData[0].value) / chartData[0].value) * 100;
    return { pct, isUp: pct >= 0 };
  }, [chartData]);

  const currentPrice = prices[payToken.symbol.toUpperCase()] || payToken.price;

  return (
    <div className="lg:col-span-7 space-y-8">
      <div className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden h-[380px] flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <h3 className="text-3xl font-headline font-bold text-[#f8f9fe] mb-1">
              {payToken.symbol} / {receiveToken.symbol}
            </h3>
            <div className="flex items-center gap-3">
              {rangeChange ? (
                <span className={`px-3 py-1 rounded-full ${rangeChange.isUp ? 'bg-[#69f6b8]/10 text-[#69f6b8]' : 'bg-[#ff716c]/10 text-[#ff716c]'} text-xs font-bold tracking-widest`}>
                  {rangeChange.isUp ? '+' : ''}{rangeChange.pct.toFixed(2)}% ({range})
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full ${performance24h.isUp ? 'bg-[#69f6b8]/10 text-[#69f6b8]' : 'bg-[#ff716c]/10 text-[#ff716c]'} text-xs font-bold tracking-widest`}>
                  {performance24h.value}
                </span>
              )}
              <span className="text-xs text-[#a9abaf] font-bold uppercase tracking-widest">
                {performance24h.status}
              </span>
            </div>
            {currentPrice > 0 && (
              <p className="text-lg font-headline font-bold text-[#f8f9fe] mt-1">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>
          <div className="flex gap-2 bg-[#1c2024] p-1 rounded-xl border border-white/5">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  range === r ? "bg-[#22262b] text-[#81ecff]" : "text-[#a9abaf] hover:text-[#f8f9fe]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          {chartLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-5 w-5 text-[#81ecff] animate-spin" />
            </div>
          ) : (
            <LiveAreaChart
              data={chartData}
              color={rangeChange?.isUp ?? true ? "#81ecff" : "#ff716c"}
            />
          )}
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
