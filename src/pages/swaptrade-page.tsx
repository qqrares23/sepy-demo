"use client";

import { useState, useMemo, useEffect } from "react";
import type { Token, CoinGeckoSearchResult } from "@/types/crypto";
import type { SwapTx } from "@/types/transaction";
import { useMarketData } from "@/hooks/use-market-data";
import { useSwapState } from "@/hooks/use-swap-state";
import { SwapPageContent } from "@/components/features/swap/swap-page-content";
import { supabase } from "@/lib/supabase";

export default function SwapPage() {
  const { data, prices, portfolio, history, holdings, swapAssets } = useMarketData();
  const {
    payAmount,
    setPayAmount,
    isRotating,
    selectedTx,
    setSelectedTx,
    handleSwapTokens,
  } = useSwapState();

  const [payToken, setPayToken] = useState<Token>({
    symbol: "ETH",
    name: "Ethereum",
    icon: "diamond",
    color: "text-[#af88ff]",
    balance: "0",
    price: 0
  });

  const [receiveToken, setReceiveToken] = useState<Token>({
    symbol: "BTC",
    name: "Bitcoin",
    icon: "currency_bitcoin",
    color: "text-[#F7931A]",
    balance: "0",
    price: 0
  });

  const [recentSwaps, setRecentSwaps] = useState<SwapTx[]>([]);

  // Fetch swap history
  useEffect(() => {
    const fetchSwaps = async () => {
      const { data, error } = await supabase
        .from('swaps')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setRecentSwaps(data.map(s => ({
          id: s.id.substring(0, 8).toUpperCase(),
          time: new Date(s.created_at).toLocaleTimeString(),
          from: `${s.from_amount} ${s.from_symbol}`,
          to: `${s.to_amount.toFixed(4)} ${s.to_symbol}`,
          value: `$${s.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          status: s.status,
          gas: "0.001 ETH" // Mock gas for UI
        })));
      }
    };
    
    fetchSwaps();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSwaps, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update dynamic balances and prices for tokens
  const activePayToken = useMemo(() => ({
    ...payToken,
    balance: (holdings[payToken.symbol.toUpperCase()] || 0).toString(),
    price: prices[payToken.symbol.toUpperCase()] || 0
  }), [payToken, holdings, prices]);

  const activeReceiveToken = useMemo(() => ({
    ...receiveToken,
    balance: (holdings[receiveToken.symbol.toUpperCase()] || 0).toString(),
    price: prices[receiveToken.symbol.toUpperCase()] || 0
  }), [receiveToken, holdings, prices]);

  const handlePayTokenSelect = (coin: CoinGeckoSearchResult) => {
    setPayToken({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      icon: coin.thumb,
      color: "text-[#81ecff]",
      balance: "0",
      price: 0
    });
  };

  const handleReceiveTokenSelect = (coin: CoinGeckoSearchResult) => {
    setReceiveToken({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      icon: coin.thumb,
      color: "text-[#af88ff]",
      balance: "0",
      price: 0
    });
  };
  
  const handleSwapOrder = () => {
    handleSwapTokens(receiveToken.symbol, payToken.symbol);
    const temp = payToken;
    setPayToken(receiveToken);
    setReceiveToken(temp);
  };

  const receiveAmount = (
    activeReceiveToken.price > 0 
    ? (Number(payAmount) * (activePayToken.price / activeReceiveToken.price)).toFixed(6)
    : "0.00"
  );

  const onInitiateSwap = async () => {
    const amountToPay = parseFloat(payAmount);
    const amountToReceive = parseFloat(receiveAmount);
    if (isNaN(amountToPay) || isNaN(amountToReceive)) return;

    await swapAssets(activePayToken.symbol, activeReceiveToken.symbol, amountToPay, amountToReceive);
  };

  // Filter market data to only include coins user actually owns
  const ownedAssets = useMemo<CoinGeckoSearchResult[]>(() => {
    return data.filter(coin => (holdings[coin.symbol.toUpperCase()] || 0) > 0)
      .map(coin => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        thumb: coin.image,
      }));
  }, [data, holdings]);

  return (
    <SwapPageContent 
      prices={prices}
      data={data}
      portfolio={portfolio}
      history={history}
      payToken={activePayToken}
      receiveToken={activeReceiveToken}
      payAmount={payAmount}
      setPayAmount={setPayAmount}
      receiveAmount={receiveAmount}
      handleSwap={handleSwapOrder}
      isRotating={isRotating}
      selectedTx={selectedTx}
      setSelectedTx={setSelectedTx}
      recentSwaps={recentSwaps}
      onPayTokenSelect={handlePayTokenSelect}
      onReceiveTokenSelect={handleReceiveTokenSelect}
      onInitiateSwap={onInitiateSwap}
      ownedAssets={ownedAssets}
    />
  );
}
