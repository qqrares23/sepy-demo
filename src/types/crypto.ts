export interface Market {
  name: string;
  ticker: string;
  price: number;
  change: string;
  up: boolean;
  cap: string;
  color: string;
  stroke: string;
}

export interface DashboardMarket extends Market {
  balance: number;
  value: number;
}

export interface HistoryPoint {
  time: number;
  value: number;
}

export interface BankDetails {
  accountName: string;
  bankName: string;
  iban: string;
  amount: string;
}

export interface CoinGeckoSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

export interface Asset {
  rank: number;
  name: string;
  ticker: string;
  icon: string;
  iconColor: string;
  price: string;
  priceRaw: number;
  change: string;
  changeRaw: number;
  changeColor: string;
  cap: string;
  capRaw: number;
  volume: string;
}

export interface Token {
  symbol: string;
  name: string;
  icon: string;
  color: string;
  balance: string;
  price: number;
}
