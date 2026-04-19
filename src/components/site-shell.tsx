import { Link, Outlet, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"
import { useState, useEffect, useRef } from "react"
import { Search, Loader2, X } from "lucide-react"
import type { CoinGeckoSearchResult } from "@/types/crypto"

export function SiteShell() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<CoinGeckoSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchAssets = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }
      setIsSearching(true)
      try {
        const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`)
        const data = await response.json()
        setSearchResults(data.coins?.slice(0, 6) || [])
        setShowResults(true)
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsSearching(false)
      }
    }

    const timer = setTimeout(searchAssets, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelectAsset = (asset: CoinGeckoSearchResult) => {
    setSearchQuery("")
    setShowResults(false)
    navigate("/market")
    // In a real app, we might pass the asset ID to the market page
  }

  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <Sidebar />

      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b0e11]/80 px-6 backdrop-blur-xl md:pl-[18rem]">
        <div className="flex items-center gap-4 flex-1">
          <div ref={searchRef} className="relative w-full max-w-[400px]">
            <div className="hidden md:flex items-center gap-3 rounded-2xl bg-[#161a1e] px-4 py-2 border border-white/5 transition-all focus-within:border-[#81ecff]/30 focus-within:bg-[#1c2024] group w-full">
              {isSearching ? (
                <Loader2 className="h-4 w-4 text-[#81ecff] animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-[#737679] group-focus-within:text-[#81ecff] transition-colors" />
              )}
              <Input
                className="flex-1 bg-transparent border-none px-0 text-sm text-[#f8f9fe] placeholder:text-[#737679] focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                placeholder="Search assets, txs, nodes..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-[#737679] hover:text-white">
                  <X className="h-3 w-3" />
                </button>
              )}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                <span className="text-[10px] font-bold text-[#737679]">⌘</span>
                <span className="text-[10px] font-bold text-[#737679]">K</span>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1c2024] border border-white/10 rounded-2xl p-2 z-[60] shadow-2xl animate-in fade-in slide-in-from-top-2 overflow-hidden">
                <p className="px-3 py-2 text-[10px] text-[#a9abaf] uppercase tracking-widest font-bold">Search Results</p>
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {searchResults.map((coin) => (
                    <button
                      key={coin.id}
                      onClick={() => handleSelectAsset(coin)}
                      className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <img src={coin.thumb} alt="" className="w-6 h-6 rounded-full" />
                        <div>
                          <p className="text-xs font-bold text-[#f8f9fe] group-hover:text-[#81ecff] transition-colors">{coin.name}</p>
                          <p className="text-[10px] text-[#a9abaf] uppercase">{coin.symbol}</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-sm text-[#737679] group-hover:text-[#81ecff]">chevron_right</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/wallets" className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950/80 text-slate-400 hover:text-cyan-300 transition-colors">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </Link>
          <Link
            to="/login"
            className="hidden rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-xs uppercase tracking-[0.3em] text-slate-300 hover:text-cyan-200 md:inline-flex"
          >
            Sign out
          </Link>
        </div>
      </header>

      <main className="min-h-screen bg-[#0b0e11] md:pl-[18rem] pt-24 pb-32 md:pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
