import { useState } from "react";
import type { ModalType, NFT, Protocol } from "@/types/web3";

export function useWeb3State() {
  const [modal, setModal] = useState<ModalType>(null);
  const [connected, setConnected] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [txMessage, setTxMessage] = useState("");
  const [gasPrice] = useState("24");
  const [blockNumber] = useState("19_847_203");

  const openTxSuccess = (msg: string) => {
    setTxMessage(msg);
    setModal("txSuccess");
  };

  return {
    modal,
    setModal,
    connected,
    setConnected,
    selectedNFT,
    setSelectedNFT,
    selectedProtocol,
    setSelectedProtocol,
    txMessage,
    openTxSuccess,
    gasPrice,
    blockNumber,
  };
}
