"use client";

import { useState, useMemo } from "react";
import type { Asset } from "@/types/crypto";
import { useMarketData, type PriceProvider } from "@/hooks/use-market-data";
import { MarketPageContent } from "@/components/features/market/market-page-content";
import { RefreshCw, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MarketPage() {
  const [currency, setCurrency] = useState<'usd' | 'eur'>('usd');
  const [provider, setProvider] = useState<PriceProvider>('coingecko');
  const [watchedSymbols, setWatchedSymbols] = useState<string[]>(["BTC", "ETH", "SOL", "USDC", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT"]);
  
  const { data, prices, history, loading, refresh, error, searchSymbol, topUp, lastAction } = useMarketData(currency, provider, watchedSymbols);
  const [viewMode, setViewMode] = useState<"real-time" | "snapshot">("real-time");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const navigate = useNavigate();

  const handleTrade = async (symbol: string, amount: number) => {
    const success = await topUp(symbol, amount);
    if (success) {
      navigate("/");
    }
  };

  const handleAddSymbol = async (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    if (!watchedSymbols.includes(upperSymbol)) {
      // We add it to the list, useMarketData will handle the fetch.
      // If it's a known symbol, it works immediately.
      // If not, useMarketData will try to fetch by lowercase ID.
      setWatchedSymbols(prev => [...prev, upperSymbol]);
    }
  };

  const assets: Asset[] = useMemo(() => {
    return data.map((coin, index) => {
      const isUp = coin.price_change_percentage_24h >= 0;
      const currencySymbol = currency === 'usd' ? '$' : '€';
      
      return {
        rank: index + 1,
        name: coin.name,
        ticker: coin.symbol.toUpperCase(),
        icon: coin.symbol === "btc" ? "currency_bitcoin" : coin.symbol === "eth" ? "diamond" : coin.symbol === "sol" ? "layers" : "monetization_on",
        iconColor: coin.symbol === "btc" ? "text-[#81ecff]" : coin.symbol === "eth" ? "text-[#af88ff]" : "text-[#a9abaf]",
        price: coin.current_price ? `${currencySymbol}${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "N/A",
        priceRaw: coin.current_price || 0,
        change: provider === 'alchemy' ? "N/A" : `${isUp ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}%`,
        changeRaw: coin.price_change_percentage_24h || 0,
        changeColor: isUp ? "text-[#69f6b8]" : "text-[#ff716c]",
        cap: provider === 'alchemy' || coin.market_cap === 0 ? "N/A" : `${currencySymbol}${(coin.market_cap / 1e9).toFixed(1)}B`,
        capRaw: coin.market_cap || 0,
        volume: "$2.1B"
      };
    });
  }, [data, currency, provider]);

  const isRateLimited = error?.includes("Limit");

  return (
    <div className="relative pb-20 md:pb-0">
      <div className="md:fixed md:top-24 md:right-8 z-50 flex flex-col items-end gap-3 mb-8 md:mb-0 px-4 md:px-0">
        {error && (
          <div className={`w-full md:w-auto px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase border animate-in fade-in slide-in-from-top-2 ${isRateLimited ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            {error}
          </div>
        )}
        
        <div className="flex flex-wrap items-center justify-end gap-3">
          {/* Provider Selector */}
          <div className="flex items-center gap-2 bg-[#161a1e] border border-white/10 p-1 rounded-xl shadow-2xl overflow-x-auto no-scrollbar">
            <Database className="h-3 w-3 text-[#737679] ml-2 shrink-0" />
            <button 
              onClick={() => setProvider('coingecko')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${provider === 'coingecko' ? 'bg-[#af88ff] text-white' : 'text-[#737679]'}`}
            >
              CoinGecko
            </button>
            <button 
              onClick={() => setProvider('alchemy')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${provider === 'alchemy' ? 'bg-[#81ecff] text-[#003840]' : 'text-[#737679]'}`}
            >
              Alchemy
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Toggle */}
            <div className="flex bg-[#161a1e] border border-white/10 p-1 rounded-xl shadow-2xl">
              <button 
                onClick={() => setCurrency('usd')}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${currency === 'usd' ? 'bg-[#81ecff] text-[#003840]' : 'text-[#a9abaf]'}`}
              >
                USD
              </button>
              <button 
                onClick={() => setCurrency('eur')}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${currency === 'eur' ? 'bg-[#81ecff] text-[#003840]' : 'text-[#a9abaf]'}`}
              >
                EUR
              </button>
            </div>

            {/* Refresh Button */}
            <button 
              onClick={() => refresh()}
              disabled={loading || isRateLimited}
              className="flex items-center gap-2 bg-[#161a1e] border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase text-[#a9abaf] hover:text-[#81ecff] transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-2xl"
            >
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{loading ? 'Refreshing...' : isRateLimited ? 'Cooldown' : 'Refresh'}</span>
              <span className="sm:hidden">{loading ? '...' : 'Rec'}</span>
            </button>
          </div>
        </div>
      </div>

      <MarketPageContent 
        prices={prices}
        history={history}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedAsset={selectedAsset}
        setSelectedAsset={setSelectedAsset}
        assets={assets}
        onAddSymbol={handleAddSymbol}
        searchSymbol={searchSymbol}
        onTrade={handleTrade}
        lastAction={lastAction}
      />
    </div>
  );
}
