import { Trash2, ExternalLink } from "lucide-react";
import type { WalletRecord } from "@/hooks/use-wallets";

interface AuthorizedWalletItemProps {
  wallet: WalletRecord;
  onDelete: (id: string) => void;
}

export function AuthorizedWalletItem({ wallet, onDelete }: AuthorizedWalletItemProps) {
  return (
    <div className="group bg-[#161a1e] border border-white/5 rounded-3xl p-6 hover:border-[#81ecff]/30 transition-all relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-lg text-[#81ecff]">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">{wallet.name}</p>
              <p className="text-xs font-bold text-white">{wallet.chain} · ETH</p>
            </div>
          </div>
          <button 
            onClick={() => onDelete(wallet.id)}
            className="p-2 rounded-xl hover:bg-red-500/10 text-slate-600 hover:text-red-400 transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="font-mono text-xs text-slate-400 truncate mb-4 bg-black/20 p-2 rounded-lg border border-white/5">
          {wallet.address}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-[#69f6b8]" />
            <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Active</span>
          </div>
          <a 
            href={`https://etherscan.io/address/${wallet.address}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] font-bold text-[#81ecff] hover:underline flex items-center gap-1"
          >
            Explorer <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
