import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./use-auth";
import type { HistoryPoint, BankDetails } from "@/types/crypto";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;
const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const SYMBOL_TO_ID: Record<string, string> = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  "SOL": "solana",
  "USDC": "usd-coin",
  "BNB": "binancecoin",
  "XRP": "ripple",
  "ADA": "cardano",
  "AVAX": "avalanche-2",
  "DOGE": "dogecoin",
  "DOT": "polkadot",
  "LINK": "chainlink",
  "MATIC": "polygon-ecosystem-token",
  "ARB": "arbitrum",
  "OP": "optimism",
  "NEAR": "near",
  "LTC": "litecoin",
  "BCH": "bitcoin-cash",
  "SHIB": "shiba-inu",
  "DAI": "dai",
  "TRX": "tron",
  "UNI": "uniswap",
  "STX": "blockstack",
  "KAS": "kaspa",
  "PEPE": "pepe",
  "ICP": "internet-computer",
  "ETC": "ethereum-classic",
  "FIL": "filecoin",
  "XLM": "stellar",
  "HBAR": "hedera-hashgraph",
  "APT": "aptos",
  "INJ": "injective-protocol",
  "RNDR": "render-token",
  "TIA": "celestia",
  "SUI": "sui",
  "SEI": "sei-network"
};

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  image: string;
}

export type PriceProvider = 'alchemy' | 'coingecko';

const DEFAULT_SYMBOLS = ["BTC", "ETH", "SOL", "USDC", "BNB", "XRP", "ADA", "AVAX", "DOGE", "DOT"];

export function useMarketData(
  currency: 'usd' | 'eur' = 'usd', 
  provider: PriceProvider = 'coingecko',
  customSymbols: string[] = DEFAULT_SYMBOLS
) {
  const { user } = useAuth();
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [holdings, setHoldings] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [lastAction, setLastAction] = useState<string | null>(null);
  
  const isFetching = useRef(false);

  // 1. Derived State (Prices & Portfolio)
  const prices = useMemo(() => {
    return data.reduce((acc, coin) => {
      acc[coin.symbol.toUpperCase()] = coin.current_price;
      return acc;
    }, {} as Record<string, number>);
  }, [data]);

  const portfolio = useMemo(() => {
    return Object.entries(holdings).reduce((total, [symbol, amount]) => {
      const price = prices[symbol] || 0;
      return total + (price * amount);
    }, 0);
  }, [holdings, prices]);

  const symbolsKey = useMemo(() => {
    const ownedSymbols = Object.keys(holdings);
    const allSymbols = Array.from(new Set([...customSymbols, ...ownedSymbols]));
    return allSymbols.sort().join(",");
  }, [customSymbols, holdings]);

  // 2. Fetchers
  const fetchFromCoinGeckoInternal = useCallback(async (symbols: string[]) => {
    const validSymbols = symbols.filter(s => s && s.trim());
    if (validSymbols.length === 0) return [];

    const ids = validSymbols.map(s => SYMBOL_TO_ID[s.toUpperCase()] || s.toLowerCase()).join(",");
    const params = new URLSearchParams({
      vs_currency: currency,
      ids: ids,
      order: "market_cap_desc",
      per_page: "250",
      page: "1",
      sparkline: "false",
      price_change_percentage: "24h"
    });
    
    const baseUrl = COINGECKO_API_KEY ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";
    const headers: Record<string, string> = {};
    if (COINGECKO_API_KEY) {
      headers["x-cg-pro-api-key"] = COINGECKO_API_KEY;
    }

    const response = await fetch(`${baseUrl}/coins/markets?${params.toString()}`, { headers });
    if (response.status === 429) throw new Error("CoinGecko Rate Limit.");
    if (!response.ok) throw new Error("CoinGecko API Error");
    return await response.json();
  }, [currency]);

  const fetchFromAlchemy = useCallback(async () => {
    if (!ALCHEMY_API_KEY || ALCHEMY_API_KEY === "YOUR_ALCHEMY_API_KEY") {
      throw new Error("Alchemy API Key missing");
    }
    // Alchemy requires repeated params: ?symbols=BTC&symbols=ETH (not comma-separated)
    const params = customSymbols.map(s => `symbols=${encodeURIComponent(s)}`).join("&");
    const response = await fetch(
      `https://api.g.alchemy.com/prices/v1/${ALCHEMY_API_KEY}/tokens/by-symbol?${params}`
    );
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Alchemy Error (${response.status})${body ? `: ${body.slice(0, 120)}` : ""}`);
    }
    const result = await response.json();
    return customSymbols
      .map(s => {
        const entry = result.data?.find((d: any) => d.symbol === s);
        // Skip symbols Alchemy doesn't support (they return an error field)
        if (!entry || entry.error || !entry.prices?.length) return null;
        // Find USD price specifically; fall back to first available
        const usdPrice = entry.prices.find((p: any) => p.currency === "usd") ?? entry.prices[0];
        const price = usdPrice?.value ? parseFloat(usdPrice.value) : 0;
        if (price === 0) return null;
        return {
          id: s.toLowerCase(),
          symbol: s.toLowerCase(),
          name: s,
          current_price: price,
          market_cap: 0,
          price_change_percentage_24h: 0,
          image: ""
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  }, [customSymbols]);

  const fetchMarkets = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);
    setError(null);

    try {
      const symbolsToFetch = symbolsKey.split(",");
      const result = provider === 'alchemy' ? await fetchFromAlchemy() : await fetchFromCoinGeckoInternal(symbolsToFetch);
      if (Array.isArray(result)) {
        setData(result);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch prices.";
      console.error(`${provider} fetch error:`, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  }, [symbolsKey, provider, fetchFromAlchemy, fetchFromCoinGeckoInternal]);

  const searchSymbol = async (query: string): Promise<string | null> => {
    try {
      const baseUrl = COINGECKO_API_KEY ? "https://pro-api.coingecko.com/api/v3" : "https://api.coingecko.com/api/v3";
      const headers: Record<string, string> = {};
      if (COINGECKO_API_KEY) headers["x-cg-pro-api-key"] = COINGECKO_API_KEY;
      const response = await fetch(`${baseUrl}/search?query=${query}`, { headers });
      if (!response.ok) return null;
      const result = await response.json();
      const coin = result.coins?.find((c: { symbol: string; id: string }) => c.symbol.toUpperCase() === query.toUpperCase()) || result.coins?.[0];
      return coin?.id || null;
    } catch (err) {
      return null;
    }
  };

  // 3. Lifecycle Effects
  useEffect(() => {
    const fetchHoldings = async () => {
      if (!user) { setHoldings({}); return; }
      const { data, error } = await supabase.from('holdings').select('symbol, amount').eq('user_id', user.id);
      if (!error && data) {
        setHoldings(data.reduce((acc, h) => ({ ...acc, [h.symbol]: Number(h.amount) }), {}));
      }
    };
    fetchHoldings();
  }, [user]);

  useEffect(() => {
    const initialHistory = Array.from({ length: 20 }, (_, i) => ({
      time: Date.now() - (20 - i) * 60000,
      value: portfolio > 0 ? portfolio * (0.95 + Math.random() * 0.1) : 0,
    }));
    setHistory(initialHistory);

    if (!document.hidden) fetchMarkets();
    const interval = setInterval(() => { if (!document.hidden) fetchMarkets(); }, 60000);
    const handleVisibilityChange = () => { if (!document.hidden) fetchMarkets(); };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchMarkets, portfolio]);

  useEffect(() => {
    if (portfolio > 0) {
      setHistory(prev => [...prev.slice(1), { time: Date.now(), value: portfolio }]);
    }
  }, [portfolio]);

  // 4. Actions
  const triggerTransaction = (amount: number, type: 'buy' | 'send' | 'stake') => {
    const sym = currency === 'usd' ? '$' : '€';
    setLastAction(`${type.toUpperCase()} successful for ${sym}${amount}`);
    setTimeout(() => setLastAction(null), 4000);
  };

  const topUp = async (symbol: string, amount: number) => {
    if (!user) { setLastAction("Please log in"); return; }
    const upperSymbol = symbol.toUpperCase();
    setLastAction(`Submitting purchase request for ${upperSymbol}...`);

    const usdValue = amount * (prices[upperSymbol] || 0);
    const { error } = await supabase.from('topup_requests').insert({
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name || null,
      symbol: upperSymbol,
      amount,
      usd_value: usdValue,
      status: 'pending',
    });

    if (!error) {
      setLastAction(`Request submitted: +${amount} ${upperSymbol} — awaiting admin approval`);
    } else {
      setLastAction("Request failed. Please try again.");
    }
    setTimeout(() => setLastAction(null), 5000);
  };

  const swapAssets = async (fromSymbol: string, toSymbol: string, fromAmount: number, toAmount: number) => {
    if (!user) { setLastAction("Please log in"); return; }
    const upperFrom = fromSymbol.toUpperCase();
    const upperTo = toSymbol.toUpperCase();
    setLastAction(`Exchanging ${upperFrom} for ${upperTo}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const currentFromAmount = holdings[upperFrom] || 0;
    if (currentFromAmount < fromAmount) {
      setLastAction("Insufficient balance");
      setTimeout(() => setLastAction(null), 4000);
      return;
    }

    const usdValue = fromAmount * (prices[upperFrom] || 0);
    const newFrom = currentFromAmount - fromAmount;
    const newTo = (holdings[upperTo] || 0) + toAmount;

    await supabase.from('holdings').upsert({ user_id: user.id, symbol: upperFrom, amount: newFrom }, { onConflict: 'user_id, symbol' });
    await supabase.from('holdings').upsert({ user_id: user.id, symbol: upperTo, amount: newTo }, { onConflict: 'user_id, symbol' });
    
    // Log unified transaction
    await supabase.from('transactions').insert({
      user_id: user.id,
      type: 'Swap',
      asset: `${upperFrom} → ${upperTo}`,
      symbol: upperFrom,
      amount: `-${fromAmount} ${upperFrom} / +${toAmount.toFixed(4)} ${upperTo}`,
      value: `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      usd_value: usdValue,
      status: 'Completed',
      from: 'Vault Wallet',
      to: 'Uniswap Protocol'
    });

    setHoldings(prev => ({ ...prev, [upperFrom]: newFrom, [upperTo]: newTo }));
    setLastAction(`Swap Complete: Received ${toAmount.toFixed(4)} ${upperTo}`);
    setTimeout(() => setLastAction(null), 4000);
  };

  const sellAsset = async (symbol: string, amount: number, bankDetails: BankDetails) => {
    if (!user) { setLastAction("Please log in"); return; }
    const upperSymbol = symbol.toUpperCase();
    setLastAction(`Processing Sell Order for ${upperSymbol}...`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const currentAmount = holdings[upperSymbol] || 0;
    if (currentAmount < amount) {
      setLastAction("Insufficient balance to sell");
      setTimeout(() => setLastAction(null), 4000);
      return;
    }

    const usdValue = amount * (prices[upperSymbol] || 0);
    const newAmount = currentAmount - amount;

    // Update holdings
    const { error: updateError } = await supabase
      .from('holdings')
      .upsert({ user_id: user.id, symbol: upperSymbol, amount: newAmount }, { onConflict: 'user_id, symbol' });

    if (!updateError) {
      // Record transaction with error check
      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'Sell',
        asset: upperSymbol === 'BTC' ? 'Bitcoin' : upperSymbol === 'ETH' ? 'Ethereum' : upperSymbol,
        symbol: upperSymbol,
        amount: `-${amount} ${upperSymbol}`,
        value: `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        usd_value: usdValue,
        status: 'Completed',
        from: 'Vault Wallet',
        to: `${bankDetails.bankName} (****${bankDetails.iban.slice(-4)})`
      });

      if (txError) {
        console.error("Failed to log transaction:", txError);
      }

      setHoldings(prev => ({ ...prev, [upperSymbol]: newAmount }));
      setLastAction(`Sell Successful: $${usdValue.toLocaleString()} sent to bank`);
    } else {
      console.error("Holdings update error:", updateError);
      setLastAction("Sell Failed");
    }
    setTimeout(() => setLastAction(null), 4000);
  };

  return { 
    data, prices, portfolio, holdings, history, 
    triggerTransaction, topUp, swapAssets, sellAsset,
    lastAction, loading, error, refresh: fetchMarkets, searchSymbol
  };
}
