import { useState, useEffect } from 'react';
import type { HistoryPoint } from '@/types/crypto';

const RANGE_TO_DAYS: Record<string, string> = {
  '1H':  '1',
  '1D':  '1',
  '1W':  '7',
  '1M':  '30',
  '1Y':  '365',
  'ALL': 'max',
};

const COINGECKO_API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;
const BASE_URL = COINGECKO_API_KEY
  ? 'https://pro-api.coingecko.com/api/v3'
  : 'https://api.coingecko.com/api/v3';

export function useChartData(coinId: string, range: string) {
  const [data, setData] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coinId) return;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      try {
        const days = RANGE_TO_DAYS[range] ?? '1';
        const headers: Record<string, string> = {};
        if (COINGECKO_API_KEY) headers['x-cg-pro-api-key'] = COINGECKO_API_KEY;

        const res = await fetch(
          `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
          { headers, signal: controller.signal }
        );
        if (!res.ok) return;

        const json = await res.json();
        let points: HistoryPoint[] = (json.prices as [number, number][]).map(
          ([time, value]) => ({ time, value })
        );

        // For 1H, CoinGecko returns hourly data for days=1 (free tier).
        // Slice the last 12 points to approximate the most recent hour.
        if (range === '1H') points = points.slice(-12);

        setData(points);
      } catch {
        // AbortError on unmount — ignore silently
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [coinId, range]);

  return { data, loading };
}
