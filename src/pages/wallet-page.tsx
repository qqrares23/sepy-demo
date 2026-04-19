"use client";

import { useWallets } from "@/hooks/use-wallets";
import { WalletPageContent } from "@/components/features/wallet/wallet-page-content";

export default function WalletPage() {
  const { 
    linkedWallets, 
    loading, 
    linkCurrentWallet, 
    deleteWallet, 
    activeWalletLinked 
  } = useWallets();

  return (
    <WalletPageContent 
      linkedWallets={linkedWallets}
      onLink={linkCurrentWallet}
      onDelete={deleteWallet}
      loading={loading}
      activeWalletLinked={activeWalletLinked}
    />
  );
}
