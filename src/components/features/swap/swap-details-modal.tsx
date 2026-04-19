import type { SwapTx } from "@/types/transaction";
import { Button } from "@/components/ui/button";

export function SwapDetailsModal({ tx, onClose }: { tx: SwapTx; onClose: () => void }) {
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
