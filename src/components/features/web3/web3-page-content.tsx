import type { NFT, Protocol, ModalType, Chain } from "@/types/web3";
import { 
  Modal, 
  SignModal, 
  DeployModal, 
  BridgeModal, 
  NFTModal, 
  StakeModal, 
  TxSuccessModal, 
  DisconnectModal 
} from "./web3-modals";
import { Web3Header } from "./web3-header";
import { WalletCard } from "./wallet-card";
import { QuickActions } from "./quick-actions";
import { NFTVault } from "./nft-vault";
import { DeFiProtocols } from "./defi-protocols";
import { RawTXBuilder } from "./raw-tx-builder";

interface Web3PageContentProps {
  modal: ModalType;
  setModal: (modal: ModalType) => void;
  selectedNFT: NFT | null;
  setSelectedNFT: (nft: NFT | null) => void;
  selectedProtocol: Protocol | null;
  setSelectedProtocol: (protocol: Protocol | null) => void;
  txMessage: string;
  openTxSuccess: (msg: string) => void;
  nfts: NFT[];
  protocols: Protocol[];
  chains: Chain[];
}

export function Web3PageContent({
  modal,
  setModal,
  selectedNFT,
  setSelectedNFT,
  selectedProtocol,
  setSelectedProtocol,
  txMessage,
  openTxSuccess,
  nfts,
  protocols,
  chains,
}: Web3PageContentProps) {
  return (
    <div className="min-h-screen text-white md:pl-72 pb-24 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        <Web3Header />

        <WalletCard chains={chains} setModal={setModal} connected={false} />

        <QuickActions setModal={setModal} />

        <NFTVault nfts={nfts} setSelectedNFT={setSelectedNFT} setModal={setModal} />

        <DeFiProtocols protocols={protocols} setSelectedProtocol={setSelectedProtocol} setModal={setModal} />

        <RawTXBuilder openTxSuccess={openTxSuccess} />

      </div>

      {/* ── Modals ── */}
      {modal === "sign" && (
        <Modal onClose={() => setModal(null)}>
          <SignModal onClose={() => setModal(null)} onSign={() => openTxSuccess("Message signed and verified on-chain.")} />
        </Modal>
      )}
      {modal === "deploy" && (
        <Modal onClose={() => setModal(null)}>
          <DeployModal onDeploy={() => openTxSuccess("Contract deployed at 0x9fE3...2aB7")} />
        </Modal>
      )}
      {modal === "bridge" && (
        <Modal onClose={() => setModal(null)}>
          <BridgeModal onClose={() => setModal(null)} onBridge={() => openTxSuccess("Bridge initiated. Funds arriving in ~2 minutes.")} />
        </Modal>
      )}
      {modal === "nft" && selectedNFT && (
        <Modal onClose={() => setModal(null)}>
          <NFTModal 
            nft={selectedNFT} 
            onAction={openTxSuccess} 
          />
        </Modal>
      )}
      {modal === "stake" && selectedProtocol && (
        <Modal onClose={() => setModal(null)}>
          <StakeModal protocol={selectedProtocol} onClose={() => setModal(null)} onStake={() => openTxSuccess(`Staked ETH in ${selectedProtocol.name} successfully.`)} />
        </Modal>
      )}
      {modal === "disconnect" && (
        <Modal onClose={() => setModal(null)}>
          <DisconnectModal onClose={() => setModal(null)} onDisconnect={() => { setModal(null); }} />
        </Modal>
      )}
      {modal === "txSuccess" && (
        <Modal onClose={() => setModal(null)}>
          <TxSuccessModal onClose={() => setModal(null)} message={txMessage} />
        </Modal>
      )}
    </div>
  );
}
