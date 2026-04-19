import { useState } from "react";
import { Button } from "@/components/ui/button";

export function QuickExecutionCard({ prices }: { prices: any }) {
  const [processing, setProcessing] = useState(false);
  
  return (
    <div className="bg-[#161a1e] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 border border-white/5 relative overflow-hidden animate-in slide-in-from-right duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#af88ff]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="relative z-10 space-y-5 md:space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#af88ff]/10 border border-[#af88ff]/20 flex items-center justify-center text-[#af88ff]">
            <span className="material-symbols-outlined text-xl md:text-2xl">bolt</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-sm md:text-base">Snapshot Execution</h3>
            <p className="text-[9px] md:text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest">Instant Market Order</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          <div className="bg-[#101417] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#f7931a]/10 flex items-center justify-center text-[#f7931a]">
                <span className="material-symbols-outlined text-[10px] md:text-xs">currency_bitcoin</span>
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase">BTC</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-[#f8f9fe]">${prices.BTC.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="bg-[#101417] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#627eea]/10 flex items-center justify-center text-[#627eea]">
                <span className="material-symbols-outlined text-[10px] md:text-xs">diamond</span>
              </span>
              <span className="text-[10px] md:text-xs font-bold uppercase">ETH</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-[#f8f9fe]">${prices.ETH.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="bg-[#101417] p-4 md:p-5 rounded-xl md:rounded-2xl border border-[#af88ff]/20">
          <p className="text-[9px] md:text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest mb-1 md:mb-2">Liquidity Score</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl md:text-3xl font-headline font-bold text-[#af88ff]">98.2</span>
            <span className="text-[10px] md:text-xs text-[#69f6b8] font-bold mb-1 md:mb-1">+0.4%</span>
          </div>
        </div>

        <Button 
          onClick={() => { setProcessing(true); setTimeout(() => setProcessing(false), 2000); }}
          className="w-full py-5 md:py-6 rounded-xl md:rounded-2xl bg-[#af88ff] text-[#101417] font-headline font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#af88ff]/90 transition-all active:scale-95"
        >
          {processing ? "Capturing Order..." : "Run Kinetic Trade"}
        </Button>
      </div>
    </div>
  );
}
