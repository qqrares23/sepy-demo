"use client";

import { useWeb3Data } from "@/hooks/use-web3-data";
import { useWeb3State } from "@/hooks/use-web3-state";
import { Web3PageContent } from "@/components/features/web3/web3-page-content";
import { LinkedVaultsSection } from "@/components/features/web3/linked-vaults-section";

export default function Web3Page() {
  const {
    nfts,
    linkedWallets,
    loadingWallets,
    chains,
    linkCurrentWallet,
    deleteWallet,
    isCurrentWalletLinked,
    isConnected
  } = useWeb3Data();

  const {
    modal,
    setModal,
    selectedNFT,
    setSelectedNFT,
    selectedProtocol,
    setSelectedProtocol,
    txMessage,
    openTxSuccess,
  } = useWeb3State();

  const handleLink = async (): Promise<boolean> => {
    const success = await linkCurrentWallet();
    if (success) {
      openTxSuccess("Wallet linked to your account successfully.");
    }
    return !!success;
  };

  return (
    <div className="space-y-8">
      <LinkedVaultsSection 
        linkedWallets={linkedWallets}
        isConnected={isConnected}
        isCurrentWalletLinked={isCurrentWalletLinked}
        onLink={handleLink}
        onDelete={deleteWallet}
        loading={loadingWallets}
      />

      <Web3PageContent 
        modal={modal}
        setModal={setModal}
        selectedNFT={selectedNFT}
        setSelectedNFT={setSelectedNFT}
        selectedProtocol={selectedProtocol}
        setSelectedProtocol={setSelectedProtocol}
        txMessage={txMessage}
        openTxSuccess={openTxSuccess}
        nfts={nfts}
        protocols={[]}
        chains={chains}
      />
    </div>
  );
}
