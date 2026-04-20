import { useState } from "react";
import { Loader2 } from "lucide-react";
import { LiveAreaChart } from "./live-area-chart";
import { useChartData } from "@/hooks/use-chart-data";

const RANGES = ["1H", "1D", "1W", "1M", "1Y"] as const;
type Range = typeof RANGES[number];

interface MarketChartSectionProps {
  prices: Record<string, number>;
}

export const MarketChartSection = ({ prices }: MarketChartSectionProps) => {
  const [range, setRange] = useState<Range>("1D");
  const btcPrice = prices.BTC;

  const { data: chartData, loading } = useChartData("bitcoin", range);

  return (
    <div className="bg-[#101417] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 border border-white/5 relative overflow-hidden min-h-[350px] md:min-h-[400px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#1c2024] border border-white/5 flex items-center justify-center text-[#81ecff]">
            <span className="material-symbols-outlined text-2xl md:text-3xl">currency_bitcoin</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-headline font-bold">
              Bitcoin <span className="text-[#a9abaf] font-normal text-xs md:text-sm ml-2 font-body">BTC / MARKET</span>
            </h3>
            <div className="flex items-center gap-2 mt-0.5 md:mt-1">
              <span className="text-2xl md:text-3xl font-headline font-bold text-[#81ecff]">
                {btcPrice
                  ? `$${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  : "Fetching..."}
              </span>
              {chartData.length >= 2 && (() => {
                const pct = ((chartData[chartData.length - 1].value - chartData[0].value) / chartData[0].value) * 100;
                return (
                  <span className={`text-xs md:text-sm font-bold flex items-center ${pct >= 0 ? 'text-[#69f6b8]' : 'text-[#ff716c]'}`}>
                    {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                  </span>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="flex gap-1 md:gap-2 p-1 bg-[#1c2024] rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
          {RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${
                range === r ? "bg-[#81ecff] text-[#003840]" : "text-[#a9abaf] hover:text-[#f8f9fe]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 md:h-64 w-full relative group">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 text-[#81ecff] animate-spin" />
          </div>
        ) : (
          <LiveAreaChart data={chartData} color="#81ecff" />
        )}
        {!loading && chartData.length > 0 && (
          <div className="absolute left-1/2 md:left-3/4 bottom-[60px] md:bottom-[80px] bg-[#1c2024] px-3 py-1.5 rounded-lg border border-[#81ecff]/30 text-[10px] font-bold text-[#81ecff] z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {btcPrice
              ? `$${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "..."}
            <span className="text-[#a9abaf] ml-1">Live</span>
          </div>
        )}
      </div>
    </div>
  );
};
