import { useState } from "react";
import type { Asset } from "@/types/crypto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiveAreaChart } from "./live-area-chart";

interface AssetTableProps {
  assets: Asset[];
  history: any[];
  prices: any;
  setSelectedAsset: (asset: Asset) => void;
  onAddSymbol?: (symbol: string) => void;
  searchSymbol?: (query: string) => Promise<string | null>;
}

export const AssetTable = ({ assets, history, prices, setSelectedAsset, onAddSymbol, searchSymbol }: AssetTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [globalResults, setGlobalResults] = useState<{id: string, name: string, symbol: string}[]>([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [sortBy, setSortBy] = useState<"rank" | "gainers" | "losers" | "cap" | "price">("rank");
  const [showFilters, setShowFilters] = useState(false);

  const sortedAssets = [...assets].sort((a, b) => {
    switch (sortBy) {
      case "gainers": return b.changeRaw - a.changeRaw;
      case "losers": return a.changeRaw - b.changeRaw;
      case "cap": return b.capRaw - a.capRaw;
      case "price": return b.priceRaw - a.priceRaw;
      default: return a.rank - b.rank;
    }
  });

  const filteredAssets = sortedAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = async (val: string) => {
    setSearchTerm(val);
    if (val.length > 2 && searchSymbol) {
      setIsSearchingGlobal(true);
      try {
        const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
        const baseUrl = COINGECKO_API_KEY ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";
        const headers: Record<string, string> = {};
        if (COINGECKO_API_KEY) {
          headers["x-cg-pro-api-key"] = COINGECKO_API_KEY;
        }

        const response = await fetch(`${baseUrl}/search?query=${val}`, { headers });
        const result = await response.json();
        setGlobalResults(result.coins?.slice(0, 5) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearchingGlobal(false);
      }
    } else {
      setGlobalResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      const exists = assets.some(a => a.ticker.toLowerCase() === searchTerm.trim().toLowerCase());
      if (!exists) {
        onAddSymbol?.(searchTerm.trim().toUpperCase());
        setSearchTerm("");
        setGlobalResults([]);
      }
    }
  };

  const filterOptions = [
    { id: "rank", label: "Market Rank", icon: "format_list_numbered" },
    { id: "gainers", label: "Top Gainers", icon: "trending_up" },
    { id: "losers", label: "Top Losers", icon: "trending_down" },
    { id: "cap", label: "Market Cap", icon: "database" },
    { id: "price", label: "Highest Price", icon: "attach_money" },
  ];

  return (
    <div className="bg-[#101417] rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl">
      <div className="px-4 md:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 bg-[#161a1e]/30 gap-4">
        <h2 className="text-xl font-headline font-bold">Market Assets</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a9abaf] text-lg">search</span>
            <Input 
              className="bg-[#1c2024] border-white/5 rounded-xl pl-10 pr-4 h-10 text-xs w-full sm:w-64 md:w-72 focus-visible:ring-[#81ecff]/30" 
              placeholder="Search or add symbol (e.g. PEPE)..." 
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {(searchTerm && (globalResults.length > 0 || !assets.some(a => a.ticker.toLowerCase() === searchTerm.toLowerCase()))) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c2024] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 min-w-full sm:min-w-[300px]">
                {globalResults.length > 0 && (
                  <div className="mb-2">
                    <p className="px-3 py-2 text-[10px] text-[#a9abaf] uppercase tracking-widest font-bold">Global Results</p>
                    {globalResults.map(coin => (
                      <button
                        key={coin.id}
                        onClick={() => {
                          onAddSymbol?.(coin.symbol.toUpperCase());
                          setSearchTerm("");
                          setGlobalResults([]);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/5 rounded-xl transition-colors group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-[#81ecff]">
                            {coin.symbol.substring(0, 3).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#f8f9fe] group-hover:text-[#81ecff] transition-colors">{coin.name}</p>
                            <p className="text-[10px] text-[#a9abaf] uppercase">{coin.symbol}</p>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-sm text-[#a9abaf] group-hover:text-[#81ecff]">add_circle</span>
                      </button>
                    ))}
                  </div>
                )}
                
                {!assets.some(a => a.ticker.toLowerCase() === searchTerm.toLowerCase()) && (
                  <div className="p-2 border-t border-white/5">
                    <Button 
                      onClick={() => {
                        onAddSymbol?.(searchTerm.toUpperCase());
                        setSearchTerm("");
                        setGlobalResults([]);
                      }}
                      className="w-full justify-start gap-2 bg-[#81ecff]/10 hover:bg-[#81ecff] text-[#81ecff] hover:text-[#003840] border border-[#81ecff]/20 rounded-xl h-10 text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      Add "{searchTerm.toUpperCase()}" manually
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant="outline" 
              className={`rounded-xl border-white/10 w-10 h-10 p-0 transition-all ${showFilters ? "bg-[#81ecff] text-[#003840] border-[#81ecff]" : "text-[#a9abaf]"}`}
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
            </Button>
            
            {showFilters && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
                <div className="absolute top-full right-0 mt-2 bg-[#1c2024] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1 min-w-[200px]">
                  <p className="px-3 py-2 text-[10px] text-[#a9abaf] uppercase tracking-widest font-bold">Sort By</p>
                  {filterOptions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSortBy(opt.id as any);
                        setShowFilters(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${sortBy === opt.id ? "bg-[#81ecff]/10 text-[#81ecff]" : "text-[#a9abaf] hover:bg-white/5 hover:text-[#f8f9fe]"}`}
                    >
                      <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                      {sortBy === opt.id && <span className="material-symbols-outlined text-sm ml-auto">check_circle</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] hidden sm:table-cell">Rank</TableHead>
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf]">Asset</TableHead>
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf]">Price</TableHead>
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf]">24h Shift</TableHead>
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] hidden lg:table-cell">Capitalization</TableHead>
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] hidden md:table-cell">Activity</TableHead>
              <TableHead className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const assetPrice = prices[asset.ticker] || 0;
                const mappedHistory = history.map(h => ({ 
                  ...h, 
                  value: h.value - 128000 + assetPrice 
                }));

                return (
                  <TableRow key={asset.ticker} className="border-none hover:bg-[#161a1e]/50 transition-all group">
                    <TableCell className="px-4 md:px-8 py-6 text-xs font-bold text-[#a9abaf] hidden sm:table-cell">{asset.rank}</TableCell>
                    <TableCell className="px-4 md:px-8 py-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#1c2024] flex items-center justify-center border border-white/5 group-hover:border-[#81ecff]/30 transition-colors">
                          <span className={`material-symbols-outlined ${asset.iconColor} text-lg md:text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{asset.icon}</span>
                        </div>
                        <div>
                          <p className="font-bold text-[#f8f9fe] text-xs md:text-sm">{asset.name}</p>
                          <p className="text-[9px] md:text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest">{asset.ticker}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-8 py-6 font-headline font-bold text-xs md:text-sm text-[#f8f9fe]">{asset.price}</TableCell>
                    <TableCell className="px-4 md:px-8 py-6">
                      <div className={`flex items-center gap-1 text-xs md:text-sm font-bold ${asset.changeColor}`}>
                        <span className="material-symbols-outlined text-xs md:text-sm">{asset.change.startsWith("+") ? "trending_up" : "trending_down"}</span>
                        {asset.change}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-8 py-6 text-[#a9abaf] text-xs font-bold hidden lg:table-cell">{asset.cap}</TableCell>
                    <TableCell className="px-4 md:px-8 py-6 hidden md:table-cell">
                      <div className="h-10 w-20 md:w-24">
                        <LiveAreaChart 
                          data={mappedHistory} 
                          color={asset.changeColor.includes("69f6b8") ? "#69f6b8" : asset.changeColor.includes("ff716c") ? "#ff716c" : "#81ecff"} 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 md:px-8 py-6 text-right">
                      <Button 
                        onClick={() => setSelectedAsset(asset)}
                        className="rounded-lg md:rounded-xl bg-[#1c2024] border border-white/10 text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-[#81ecff] hover:text-[#003840] hover:border-[#81ecff] transition-all px-3 md:px-6 h-8 md:h-10"
                      >
                        Trade
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-white/20">search_off</span>
                    </div>
                    <div>
                      <p className="text-[#f8f9fe] font-bold">No assets found</p>
                      <p className="text-xs text-[#a9abaf] mt-1">Try searching for a different symbol or add it to your watchlist</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
