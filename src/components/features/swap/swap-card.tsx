import type { Token, CoinGeckoSearchResult } from "@/types/crypto";
import { Button } from "@/components/ui/button";
import { TokenInput } from "./token-input";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface SwapCardProps {
  payToken: Token;
  receiveToken: Token;
  payAmount: string;
  setPayAmount: (val: string) => void;
  receiveAmount: string;
  handleSwap: () => void;
  isRotating: boolean;
  onPayTokenSelect?: (coin: CoinGeckoSearchResult) => void;
  onReceiveTokenSelect?: (coin: CoinGeckoSearchResult) => void;
  onInitiateSwap?: () => Promise<void>;
  ownedAssets?: CoinGeckoSearchResult[];
}

export function SwapCard({
  payToken,
  receiveToken,
  payAmount,
  setPayAmount,
  receiveAmount,
  handleSwap,
  isRotating,
  onPayTokenSelect,
  onReceiveTokenSelect,
  onInitiateSwap,
  ownedAssets,
}: SwapCardProps) {
  const [isSwapping, setIsSwapping] = useState(false);

  const handleFinalSwap = async () => {
    setIsSwapping(true);
    try {
      await onInitiateSwap?.();
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="lg:col-span-5 bg-[#161a1e] rounded-[3rem] p-2 border border-white/5 shadow-2xl">
      <div className="bg-[#1c2024] rounded-[2.8rem] p-8 space-y-6">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-lg font-headline font-bold text-[#81ecff]">Exchange</h2>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-[#101417] border border-white/5 text-[#a9abaf] hover:text-[#81ecff]">
            <span className="material-symbols-outlined text-xl">settings_suggest</span>
          </Button>
        </div>

        <TokenInput 
          label="You Pay" 
          token={payToken} 
          amount={payAmount} 
          onAmountChange={setPayAmount} 
          onTokenSelect={onPayTokenSelect}
          tokenList={ownedAssets}
        />

        <div className="relative h-2 flex items-center justify-center">
          <button
            onClick={handleSwap}
            className={`absolute z-10 w-12 h-12 bg-[#22262b] rounded-2xl flex items-center justify-center border-4 border-[#1c2024] text-[#81ecff] transition-all duration-500 hover:text-[#69f6b8] shadow-xl ${isRotating ? "rotate-180 scale-90" : "hover:rotate-180"}`}
          >
            <span className="material-symbols-outlined text-2xl">swap_vert</span>
          </button>
        </div>

        <TokenInput 
          label="You Receive" 
          token={receiveToken} 
          amount={receiveAmount} 
          onTokenSelect={onReceiveTokenSelect}
          isReadOnly 
        />

        <div className="px-4 py-4 bg-[#101417]/50 rounded-2xl space-y-3">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">
            <span>Exchange Rate</span>
            <span className="text-[#f8f9fe]">1 {payToken.symbol} = {(payToken.price / (receiveToken.price || 1)).toFixed(4)} {receiveToken.symbol}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">
            <span>Slippage Protection</span>
            <span className="text-[#69f6b8]">0.5% (OPTIMAL)</span>
          </div>
        </div>

        <Button 
          disabled={isSwapping || !payAmount || parseFloat(payAmount) <= 0}
          onClick={handleFinalSwap}
          className="w-full py-8 rounded-[2rem] bg-gradient-to-br from-[#81ecff] to-[#00d4ec] text-[#003840] font-headline font-bold text-xl shadow-xl shadow-[#81ecff]/10 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {isSwapping ? <Loader2 className="h-6 w-6 animate-spin" /> : "Initiate Swap"}
        </Button>
      </div>
    </div>
  );
}

