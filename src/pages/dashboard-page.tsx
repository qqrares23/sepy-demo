import { useMemo } from "react";
import { useMarketData } from "@/hooks/use-market-data";
import { useDashboardState } from "@/hooks/use-dashboard-state";
import { DashboardPageContent } from "@/components/features/dashboard/dashboard-page-content";
import type { DashboardMarket } from "@/types/crypto";

export default function DashboardPage() {
  const { data, prices, portfolio, holdings, history, triggerTransaction, topUp, sellAsset, lastAction } = useMarketData();
  const {
    activeRange,
    setActiveRange,
    activeModal,
    setActiveModal,
    selectedAsset,
    setSelectedAsset,
  } = useDashboardState();

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
      topUp={topUp}
      prices={prices}
      sellAsset={sellAsset}
    />
  );
}
