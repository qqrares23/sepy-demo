import { TrendingUp, Send, Zap, Plus, Loader2, ShoppingCart, Search } from "lucide-react";
import { LiveAreaChart } from "./live-area-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import type { HistoryPoint, CoinGeckoSearchResult } from "@/types/crypto";

interface DashboardHeroProps {
  portfolio: number;
  history: HistoryPoint[];
  setActiveModal: (modal: 'send' | 'stake' | 'sell' | null) => void;
  topUp?: (symbol: string, amount: number) => Promise<void>;
  prices?: Record<string, number>;
}

export const DashboardHero = ({ portfolio, history, setActiveModal, topUp, prices }: DashboardHeroProps) => {
  const [isBuying, setIsBuying] = useState(false);
  const [buyAmount, setBuyAmount] = useState("0.1");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CoinGeckoSearchResult[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinGeckoSearchResult | null>(null);
  const [_isSearching, setIsSearching] = useState(false);

  // Search logic for CoinGecko
  useEffect(() => {
    const searchCoins = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`);
        const data = await response.json();
        setSearchResults(data.coins?.slice(0, 5) || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchCoins, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFinalBuy = async () => {
    if (!selectedCoin || !buyAmount || isNaN(parseFloat(buyAmount))) return;
    
    setIsBuying(true);
    try {
      await topUp?.(selectedCoin.symbol, parseFloat(buyAmount));
      setSelectedCoin(null);
      setSearchQuery("");
      setBuyAmount("0.1");
    } finally {
      setIsBuying(false);
    }
  };

  const estimatedPrice = selectedCoin ? (prices?.[selectedCoin.symbol.toUpperCase()] || 0) * parseFloat(buyAmount || "0") : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 bg-[#101417] rounded-3xl p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[450px]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#81ecff]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex-1">
            <span className="text-xs font-bold tracking-[0.2em] text-[#a9abaf] uppercase">Net Portfolio Value</span>
            <div className="text-5xl md:text-6xl font-headline font-bold text-[#f8f9fe] mt-4 tracking-tighter">
              {portfolio ? `$${portfolio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$0.00"}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#69f6b8]/10 text-[#69f6b8] text-sm font-bold">
                <TrendingUp className="h-4 w-4" /> {portfolio > 0 ? "+2.4%" : "0.0%"}
              </div>
              <span className="text-xs text-[#a9abaf] font-medium ml-2 uppercase tracking-widest italic">Supabase Cloud Sync</span>
            </div>
          </div>

          {/* New Digital Asset Acquisition UI */}
          <div className="flex flex-col gap-4 bg-[#161a1e] p-5 rounded-2xl border border-white/5 min-w-full md:min-w-[320px] shadow-2xl">
            <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-[0.1em] flex items-center gap-2">
              <ShoppingCart className="h-3 w-3 text-[#81ecff]" /> Digital Asset Acquisition
            </p>
            
            <div className="space-y-3">
              {/* Coin Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737679]" />
                <Input 
                  placeholder="Search coin (e.g. SOL)..."
                  value={selectedCoin ? `${selectedCoin.name} (${selectedCoin.symbol})` : searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedCoin(null);
                  }}
                  className="bg-[#101417] border-white/10 pl-9 h-10 text-xs rounded-xl focus:ring-[#81ecff]/30"
                />
                
                {searchResults.length > 0 && !selectedCoin && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c2024] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl animate-in fade-in slide-in-from-top-1">
                    {searchResults.map(coin => (
                      <button 
                        key={coin.id}
                        onClick={() => setSelectedCoin(coin)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                      >
                        <img src={coin.thumb} alt="" className="w-5 h-5 rounded-full" />
                        <div>
                          <p className="text-xs font-bold text-[#f8f9fe]">{coin.name}</p>
                          <p className="text-[10px] text-[#a9abaf] uppercase">{coin.symbol}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount Input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737679]" />
                  <Input 
                    type="number"
                    placeholder="Amount"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    className="bg-[#101417] border-white/10 pl-9 h-10 text-xs rounded-xl"
                  />
                </div>
                <Button 
                  disabled={isBuying || !selectedCoin}
                  onClick={handleFinalBuy}
                  className="bg-[#81ecff] hover:bg-[#81ecff]/90 text-[#003840] font-bold text-[10px] uppercase h-10 rounded-xl px-4 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isBuying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Purchase"}
                </Button>
              </div>

              {/* Estimate */}
              {selectedCoin && (
                <div className="bg-[#101417]/50 rounded-xl p-3 border border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-bold text-[#a9abaf] uppercase tracking-widest">Est. Cost</span>
                  <span className="text-xs font-bold text-[#69f6b8]">
                    ${estimatedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="relative h-48 md:h-56 mt-8 w-full group">
           <LiveAreaChart data={history} color="#81ecff" />
           <div className="absolute top-0 right-0 z-20">
              <div className="bg-[#1c2024]/80 backdrop-blur-md border border-white/5 rounded-lg px-3 py-1.5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#69f6b8] animate-pulse" />
                <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-wider">Market Fluctuations: Active</span>
              </div>
           </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-6">
        <div 
          onClick={() => setActiveModal('send')}
          className="flex-1 bg-gradient-to-br from-[#81ecff] to-[#00d4ec] rounded-3xl p-8 flex flex-col justify-between cursor-pointer group hover:scale-[1.02] transition-transform shadow-xl shadow-[#81ecff]/10"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
            <Send className="text-[#003840] h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-headline font-bold text-[#003840]">Send Assets</h3>
            <p className="text-[#003840]/70 text-sm mt-1">Instant P2P transfers</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModal('stake')}
          className="flex-1 bg-[#161a1e] rounded-3xl p-8 border border-white/5 flex flex-col justify-between cursor-pointer group hover:bg-[#1c2024] transition-all"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#69f6b8]/10 flex items-center justify-center">
            <Zap className="text-[#69f6b8] h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-headline font-bold text-[#f8f9fe]">Stake & Earn</h3>
            <p className="text-[#a9abaf] text-sm mt-1">Compound yields up to 12% APY</p>
          </div>
        </div>
      </div>
    </div>
  );
};
