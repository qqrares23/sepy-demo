import { Button } from "@/components/ui/button";

export function RawTXBuilder({ openTxSuccess }: { openTxSuccess: (msg: string) => void }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-3">Raw Transaction</p>
      <div className="rounded-3xl border border-white/8 bg-[#0f1318] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">To Address</label>
            <input defaultValue="0xAbC1...4d2F" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#81ecff]/50" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Value (ETH)</label>
            <input defaultValue="0.01" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#81ecff]/50" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Data (hex)</label>
            <input defaultValue="0x" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#81ecff]/50" />
          </div>
        </div>
        <Button
          onClick={() => openTxSuccess("Raw transaction broadcast to Ethereum mainnet.")}
          className="bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl gap-2 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">send</span>
          Broadcast Transaction
        </Button>
      </div>
    </div>
  );
}
