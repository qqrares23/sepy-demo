import { LiveAreaChart } from "./live-area-chart";

interface MarketChartSectionProps {
  prices: any;
  history: any[];
}

export const MarketChartSection = ({ prices, history }: MarketChartSectionProps) => {
  const btcPrice = prices.BTC;
  
  return (
    <div className="bg-[#101417] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 border border-white/5 relative overflow-hidden min-h-[350px] md:min-h-[400px]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#1c2024] border border-white/5 flex items-center justify-center text-[#81ecff]">
            <span className="material-symbols-outlined text-2xl md:text-3xl">currency_bitcoin</span>
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-headline font-bold">Bitcoin <span className="text-[#a9abaf] font-normal text-xs md:text-sm ml-2 font-body">BTC / MARKET</span></h3>
            <div className="flex items-center gap-2 mt-0.5 md:mt-1">
              <span className="text-2xl md:text-3xl font-headline font-bold text-[#81ecff]">
                {btcPrice ? `${btcPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Fetching..."}
              </span>
              <span className="text-[#69f6b8] text-xs md:text-sm font-bold flex items-center">+2.41%</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1 md:gap-2 p-1 bg-[#1c2024] rounded-xl border border-white/5 w-full md:w-auto overflow-x-auto no-scrollbar">
          {["1H", "1D", "1W", "1M", "1Y"].map((t) => (
            <button key={t} className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-lg text-[10px] md:text-xs font-bold transition-all ${t === "1D" ? "bg-[#22262b] text-[#81ecff]" : "text-[#a9abaf] hover:text-[#f8f9fe]"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-48 md:h-64 w-full relative group">
         <LiveAreaChart data={history.map(h => ({ ...h, value: h.value - 128000 + (prices.BTC || 64000) }))} color="#81ecff" />
        
        {/* Fake Data Point */}
        <div className="absolute left-1/2 md:left-3/4 bottom-[100px] md:bottom-[120px] bg-[#1c2024] px-3 py-1.5 rounded-lg border border-[#81ecff]/30 text-[10px] font-bold text-[#81ecff] z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {prices.BTC ? `${(prices.BTC + 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "..."} <span className="text-[#a9abaf] ml-1">12:00 PM</span>
        </div>
      </div>
    </div>
  );
};
