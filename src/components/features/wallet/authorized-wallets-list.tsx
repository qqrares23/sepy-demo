import { Database, Link as LinkIcon } from "lucide-react";
import { AuthorizedWalletItem } from "./authorized-wallet-item";
import type { WalletRecord } from "@/hooks/use-wallets";

interface AuthorizedWalletsListProps {
  wallets: WalletRecord[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export function AuthorizedWalletsList({ wallets, onDelete, loading }: AuthorizedWalletsListProps) {
  return (
    <div className="lg:col-span-8 bg-[#101417] rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-headline font-bold text-white">Authorized Vaults</h2>
          <p className="text-xs text-slate-500 font-medium">Crypto identities linked to your demo account.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#1c2024] px-4 py-2 rounded-xl border border-white/5">
          <Database className="h-4 w-4 text-[#81ecff]" />
          <span className="text-xs font-bold text-white">{wallets.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wallets.map((wallet) => (
          <AuthorizedWalletItem 
            key={wallet.id} 
            wallet={wallet} 
            onDelete={onDelete} 
          />
        ))}

        {wallets.length === 0 && !loading && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2rem] bg-black/10">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <LinkIcon className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="text-lg font-headline font-bold text-white/40 mb-2">No Vaults Connected</h3>
            <p className="text-xs text-white/20 font-medium max-w-xs text-center">
              Link your active wallet to your account to track your NFTs and portfolio value automatically.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
