# Vault Crypto Demo - Technical Documentation & Session Memory

## Project Overview
A high-security cryptographic asset management dashboard featuring real-time market monitoring, multi-wallet linking, and NFT vault integration.

## Tech Stack
- **Frontend:** React (TypeScript) + Vite
- **Styling:** Tailwind CSS + Shadcn UI + Framer Motion
- **Backend/Database:** Supabase (Auth, RLS, Real-time)
- **Web3:** RainbowKit + Wagmi + Viem
- **Data Providers:** Alchemy (Prices, NFTs, RPCs), CoinGecko (Market Stats)

---

## Database Schema (Supabase)

### 1. `profiles`
Extends `auth.users` via triggers. Stores metadata.
- `id`: uuid (primary key, references auth.users)
- `full_name`: text
- `avatar_url`: text
- `tier`: text (standard, pro, institutional)

### 2. `wallets`
Stores linked crypto identities.
- `id`: uuid (primary key)
- `user_id`: uuid (references profiles.id)
- `address`: text (wallet address)
- `chain`: text (e.g., Ethereum)
- `name`: text (e.g., MetaMask)

### 3. `nfts` & `transactions`
Tables ready for persistent storage of user assets and history.

---

## Key Implementation Logic

### 1. Market Data (`use-market-data.ts`)
- **Dual Providers:** Supports toggling between **CoinGecko** (metadata/stats) and **Alchemy** (direct price feed).
- **Visibility Detection:** Pauses API calls when the tab is hidden to preserve rate limits.
- **Rate Limit Protection:** Intelligent cooldown logic and 429 error handling.
- **Performance:** Heavily memoized (`useMemo`, `useCallback`) to prevent infinite re-render loops common with charting libraries.

### 2. Web3 & Wallet Management
- **RPC Stability:** Uses dedicated Alchemy endpoints in `wagmi.ts` to bypass CORS issues on public nodes.
- **Identity:** Uses `useEnsName` to display user's `.eth` names where available.
- **Linking System:** Users can connect via RainbowKit and then "Authorize" that wallet into the Supabase database for cross-device persistence.
- **Real-time Stats:** Fetches live ETH balance and live NFT data via Alchemy NFT API.
- **Modular Logic:** Logic extracted into `useWallets` and `useWeb3Data` hooks for clean component separation.

### 3. Modular Architecture
The application has been refactored into a modular, feature-based structure:
- **Custom Hooks**:
  - `useTransactions`: Centralizes ledger fetching and real-time synchronization.
  - `useWallets`: Manages the lifecycle of authorized crypto identities.
  - `useWeb3Data`: Orchestrates NFT fetching and active connection state.
- **Component Decomposition**:
  - Pages like `HistoryPage`, `WalletPage`, and `Web3Page` now act as thin orchestrators.
  - UI logic is delegated to specialized components in `src/components/features/`.

### 4. Global Search & UI
- **Top Bar Search**: Fully functional search bar in `SiteShell` that performs live lookups via CoinGecko API.
- **Metric Cards**: Standardized `MetricCard` system for consistent data visualization across the dashboard and ledger.

---

## Environment Configuration
Required `.env` keys:
- `VITE_SUPABASE_URL`: Supabase project endpoint.
- `VITE_SUPABASE_ANON_KEY`: Supabase public key.
- `VITE_ALCHEMY_API_KEY`: Required for Prices, NFTs, and RPC stability.
- `VITE_COINGECKO_API_KEY`: (Optional) Pro API key for higher rate limits.

---

## Recent Fixes & Critical Notes
- **Type Safety**: Eliminated `any` usages across all major features (`Dashboard`, `Market`, `Swap`, `History`, `Web3`), replacing them with specific interfaces in `src/types/`.
- **CORS Errors**: Resolved by migrating from public nodes to Alchemy-authenticated RPC URLs.
- **Recharts Loops**: Fixed by ensuring all chart data arrays passed to `LiveAreaChart` have stable references.
- **Clean UI**: Removed redundant notification buttons and logos to streamline the user experience.
