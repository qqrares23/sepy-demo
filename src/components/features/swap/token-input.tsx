import type { Token, CoinGeckoSearchResult } from "@/types/crypto";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";

export function TokenInput({ 
  label, 
  token, 
  amount, 
  onAmountChange, 
  onTokenSelect,
  isReadOnly = false,
  tokenList,
  onAddSymbol
}: { 
  label: string; 
  token: Token; 
  amount: string; 
  onAmountChange?: (val: string) => void;
  onTokenSelect?: (token: CoinGeckoSearchResult) => void;
  isReadOnly?: boolean;
  tokenList?: CoinGeckoSearchResult[];
  onAddSymbol?: (symbol: string, id?: string) => void;
}) {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CoinGeckoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If a static tokenList is provided, filter it locally
    if (tokenList) {
      if (!query) {
        setResults(tokenList.slice(0, 5));
      } else {
        const filtered = tokenList.filter(t => 
          t.name.toLowerCase().includes(query.toLowerCase()) || 
          t.symbol.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered.slice(0, 5));
      }
      return;
    }

    // Otherwise, perform live search on CoinGecko
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const search = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
        const data = await response.json();
        setResults(data.coins?.slice(0, 5) || []);
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(search, 500);
    return () => clearTimeout(t);
  }, [query, tokenList]);

  return (
    <div className="bg-[#101417] rounded-3xl p-6 border border-white/5 transition-all hover:border-white/10 group relative">
      <div className="flex justify-between mb-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">{label}</span>
        <span className="text-[10px] font-bold text-[#a9abaf] tracking-widest">Balance: {token.balance} {token.symbol}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div 
          onClick={() => onTokenSelect && setShowSearch(!showSearch)}
          className={`flex items-center gap-3 bg-[#1c2024] px-4 py-2 rounded-2xl border border-white/5 transition-all ${onTokenSelect ? 'cursor-pointer hover:bg-[#22262b]' : ''}`}
        >
          <div className={`w-8 h-8 rounded-full bg-[#101417] flex items-center justify-center border border-white/5 ${token.color}`}>
            {token.icon.startsWith("http") ? (
              <img src={token.icon} className="w-5 h-5 rounded-full" alt="" />
            ) : (
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>{token.icon}</span>
            )}
          </div>
          <span className="font-headline font-bold text-sm text-[#f8f9fe]">{token.symbol}</span>
          {onTokenSelect && <span className="material-symbols-outlined text-sm text-[#a9abaf]">expand_more</span>}
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          readOnly={isReadOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="bg-transparent border-none p-0 text-3xl font-headline font-bold text-right focus-visible:ring-0 text-[#f8f9fe] placeholder-[#a9abaf]/20"
        />
      </div>
      <div className="text-right mt-2 text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">
        ≈ ${(Number(amount) * token.price).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
      </div>

      {showSearch && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c2024] border border-white/10 rounded-2xl p-4 z-[100] shadow-2xl animate-in fade-in slide-in-from-top-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#a9abaf]" />
            <input 
              autoFocus
              placeholder="Search coin..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-[#101417] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#81ecff]/30"
            />
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-[#81ecff]" /></div>
            ) : results.length > 0 ? (
              results.map(coin => (
                <button
                  key={coin.id}
                  onClick={() => {
                    onTokenSelect?.(coin);
                    onAddSymbol?.(coin.symbol, coin.id);
                    setShowSearch(false);
                    setQuery("");
                  }}
                  className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors text-left"
                >
                  <img src={coin.thumb} alt="" className="w-6 h-6 rounded-full" />
                  <div>
                    <p className="text-xs font-bold text-white">{coin.name}</p>
                    <p className="text-[10px] text-[#a9abaf] uppercase">{coin.symbol}</p>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-center text-[10px] text-[#a9abaf] py-2">No coins found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
