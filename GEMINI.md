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
- `is_admin`: boolean (controls access to Admin Panel)

### 2. `requests` (Admin Approval System)
Tables used for the institutional approval workflow.
- **`topup_requests`**: Pending fiat-to-crypto purchases.
- **`swap_requests`**: Pending token-to-token exchanges.
- **`sell_requests`**: Pending crypto-to-fiat bank withdrawals. Includes `bank_name`, `account_holder`, `iban`, and `swift`.

### 3. `wallets`, `nfts` & `transactions`
Persistent storage for user-linked identities, assets, and approved history.

---

## Key Implementation Logic

### 1. Market Data (`use-market-data.ts`)
- **Dual Providers:** Toggles between **CoinGecko** and **Alchemy**.
- **Expanded Mapping:** Includes over 60+ curated assets (BTC, ETH, SOL, USDC, USDT, FET, TAO, etc.) in `SYMBOL_TO_ID` for reliable resolution.
- **Dynamic Search:** Integrated with CoinGecko Search API for discovering unmapped assets.

### 2. Admin Approval Workflow
- **State Transition:** Swaps, Sells, and Top-ups are no longer immediate. They insert a "pending" record into the respective request table.
- **Management Console:** The `AdminPage` features a tabbed interface for reviewing and processing these requests.
- **Atomicity:** Balance updates and transaction logging occur simultaneously upon admin approval.

### 3. Authentication & Navigation
- **Security Guards:** `ProtectedRoute` and `SiteShell` enforce strict session checks.
- **Auto-Redirect:** Immediate redirection to `/login` upon sign-out or session expiry.
- **Access Control:** Admin routes are guarded by the `is_admin` flag on the user profile.

### 4. Modular Architecture
- **Hooks**: `useMarketData` centralizes price feeds and execution logic. `useAuth` manages the session lifecycle.
- **UI Components**: Feature-based decomposition (e.g., `src/components/features/admin/`, `src/components/features/swap/`).

---

## Environment Configuration
Required `.env` keys:
- `VITE_SUPABASE_URL`: Supabase project endpoint.
- `VITE_SUPABASE_ANON_KEY`: Supabase public key.
- `VITE_ALCHEMY_API_KEY`: Required for Prices, NFTs, and RPC stability.
- `VITE_COINGECKO_API_KEY`: (Optional) Pro API key for higher rate limits.

---

## Recent Fixes & Critical Notes
- **Market Values Fix**: Resolved missing prices by expanding the internal symbol-to-id mapping and fixing CoinGecko Search integration.
- **Auth Redirects**: Fixed broken sign-out links in both desktop (`SiteShell`) and mobile (`Sidebar`) navigation.
- **Type Guarding**: Implemented type guards in the Admin Panel to safely handle union types for different request models.
- **Validation**: Fixed a critical 23502 error in Sell requests by ensuring `swift` and `account_holder` fields are properly collected and passed.
- **Build Integrity**: Cleaned up React Hook ordering violations and unused interfaces to ensure 100% build success.
