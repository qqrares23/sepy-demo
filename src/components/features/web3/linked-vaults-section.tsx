import { Trash2, Link as LinkIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WalletRecord } from "@/hooks/use-wallets";

interface LinkedVaultsSectionProps {
  linkedWallets: WalletRecord[];
  isConnected: boolean;
  isCurrentWalletLinked: boolean;
  onLink: () => Promise<boolean>;
  onDelete: (id: string) => void;
  loading: boolean;
}

export function LinkedVaultsSection({
  linkedWallets,
  isConnected,
  isCurrentWalletLinked,
  onLink,
  onDelete,
  loading
}: LinkedVaultsSectionProps) {
  return (
    <section className="bg-[#101417] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-headline font-bold flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-[#81ecff]" />
            Linked Security Vaults
          </h2>
          <p className="text-xs text-[#a9abaf] mt-1 uppercase tracking-widest">Authorized crypto identities for this account</p>
        </div>
        
        {isConnected && !isCurrentWalletLinked && (
          <Button 
            onClick={onLink}
            className="bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-xl gap-2 transition-all active:scale-95 shadow-lg shadow-[#81ecff]/10"
          >
            <Plus className="h-4 w-4" /> Link Active Wallet
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {linkedWallets.map((w) => (
          <div key={w.id} className="group relative bg-[#1c2024] border border-white/5 rounded-2xl p-5 hover:border-[#81ecff]/30 transition-all shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#81ecff]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm text-[#81ecff]">account_balance_wallet</span>
                </div>
                <span className="text-[10px] font-bold text-[#81ecff] uppercase tracking-widest">{w.name}</span>
              </div>
              <button 
                onClick={() => onDelete(w.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/10 text-red-400/50 hover:text-red-400 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="font-mono text-xs text-white truncate">{w.address}</p>
            <div className="mt-3 flex items-center gap-2">
               <div className="h-1 w-1 rounded-full bg-[#69f6b8]" />
               <span className="text-[8px] font-bold text-[#a9abaf] uppercase tracking-widest">Vault Authorized</span>
            </div>
          </div>
        ))}
        
        {linkedWallets.length === 0 && !loading && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-black/10">
            <DatabaseIcon className="h-8 w-8 text-white/10 mb-3" />
            <p className="text-xs text-white/30 font-bold uppercase tracking-widest text-center">
              No linked vaults found.<br/>Connect and link a wallet to secure your assets.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
  </svg>
);
