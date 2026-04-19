import { useState } from "react";

export function useSwapState() {
  const [payTokenSymbol, setPayTokenSymbol] = useState("ETH");
  const [receiveTokenSymbol, setReceiveTokenSymbol] = useState("USDC");
  const [payAmount, setPayAmount] = useState("1.0");
  const [isRotating, setIsRotating] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const handleSwapTokens = (receiveTokenSymbol: string, payTokenSymbol: string) => {
    setIsRotating(true);
    setTimeout(() => {
      setPayTokenSymbol(receiveTokenSymbol);
      setReceiveTokenSymbol(payTokenSymbol);
      setIsRotating(false);
    }, 300);
  };

  return {
    payTokenSymbol,
    setPayTokenSymbol,
    receiveTokenSymbol,
    setReceiveTokenSymbol,
    payAmount,
    setPayAmount,
    isRotating,
    setIsRotating,
    selectedTx,
    setSelectedTx,
    handleSwapTokens,
  };
}
