import { ActiveWalletCard } from "./active-wallet-card";
import { AuthorizedWalletsList } from "./authorized-wallets-list";
import type { WalletRecord } from "@/hooks/use-wallets";

interface WalletPageContentProps {
  linkedWallets: WalletRecord[];
  onLink: () => void;
  onDelete: (id: string) => void;
  loading: boolean;
  activeWalletLinked: boolean;
}

export function WalletPageContent({ 
  linkedWallets, 
  onLink, 
  onDelete, 
  loading, 
  activeWalletLinked 
}: WalletPageContentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">Vault Access</h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">Manage your linked crypto identities and secure your assets.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <ActiveWalletCard onLink={onLink} isLinked={activeWalletLinked} />
        </div>
        <AuthorizedWalletsList 
          wallets={linkedWallets} 
          onDelete={onDelete} 
          loading={loading} 
        />
      </div>
    </div>
  );
}
