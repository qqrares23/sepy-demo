import type { Asset } from "@/types/crypto";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TradeModalProps {
  asset: Asset;
  price: number;
  onClose: () => void;
}

export const TradeModal = ({ asset, price, onClose }: TradeModalProps) => {
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
};
