import { useMemo, useState } from "react";
import { useMarketData } from "@/hooks/use-market-data";
import { useDashboardState } from "@/hooks/use-dashboard-state";
import { DashboardPageContent } from "@/components/features/dashboard/dashboard-page-content";
import type { DashboardMarket, BankDetails } from "@/types/crypto";
import { useNavigate } from "react-router-dom";

const DEFAULT_SYMBOLS = ["BTC", "ETH", "SOL", "USDC", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT"];

export default function DashboardPage() {
  const [watchedSymbols, setWatchedSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const { data, prices, portfolio, holdings, history, triggerTransaction, topUp, sellAsset, lastAction, addDynamicMapping } = useMarketData('usd', 'coingecko', watchedSymbols);
  const navigate = useNavigate();
  const {
    activeRange,
    setActiveRange,
    activeModal,
    setActiveModal,
    selectedAsset,
    setSelectedAsset,
  } = useDashboardState();

  const handleAddSymbol = (symbol: string, id?: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (id) {
      addDynamicMapping(symbol, id);
    }
    if (!watchedSymbols.includes(upperSymbol)) {
      setWatchedSymbols(prev => [...prev, upperSymbol]);
    }
  };

  const handleSell = async (symbol: string, amount: number, bankDetails: BankDetails) => {
    const success = await sellAsset(symbol, amount, bankDetails);
    if (success) {
      navigate("/");
    }
  };

  const handleTopUp = async (symbol: string, amount: number) => {
    const success = await topUp(symbol, amount);
    if (success) {
      navigate("/");
    }
  };

  const myAssets = useMemo(() => {
    // Map holdings to the format needed for the table
    return Object.entries(holdings)
      .map(([symbol, amount]) => {
        const coin = data.find(c => c.symbol.toUpperCase() === symbol);
        if (!coin || amount <= 0) return null;

        const isUp = coin.price_change_percentage_24h >= 0;
        
        return {
          name: coin.name,
          ticker: symbol,
          balance: amount,
          value: amount * coin.current_price,
          price: coin.current_price,
          change: `${isUp ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
          up: isUp,
          cap: `$${(coin.market_cap / 1e9).toFixed(1)}B`,
          color: symbol === "BTC" ? "text-[#F7931A]" : symbol === "ETH" ? "text-[#627EEA]" : "text-[#81ecff]",
          stroke: symbol === "BTC" ? "#F7931A" : symbol === "ETH" ? "#627EEA" : "#81ecff"
        };
      })
      .filter((asset): asset is DashboardMarket => asset !== null)
      .sort((a, b) => b.value - a.value);
  }, [holdings, data]);

  return (
    <DashboardPageContent 
      activeRange={activeRange}
      setActiveRange={setActiveRange}
      activeModal={activeModal}
      setActiveModal={setActiveModal}
      selectedAsset={selectedAsset}
      setSelectedAsset={setSelectedAsset}
      portfolio={portfolio}
      history={history}
      markets={myAssets}
      lastAction={lastAction}
      triggerTransaction={triggerTransaction}
      topUp={handleTopUp}
      prices={prices}
      sellAsset={handleSell}
      onAddSymbol={handleAddSymbol}
    />
  );
}
