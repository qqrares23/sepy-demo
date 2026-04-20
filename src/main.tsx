import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { SiteShell } from "@/components/site-shell.tsx"
import { config } from '@/lib/wagmi'
import { useAuth } from "@/hooks/use-auth.ts"
import DashboardPage from "@/pages/dashboard-page.tsx"
import LoginPage from "@/pages/login-page.tsx"
import RegisterPage from "@/pages/register-page.tsx"
import MarketPage from "@/pages/market-page.tsx"
import SwaptradePage from "@/pages/swaptrade-page.tsx"
import VaultSettings from "@/pages/settings-page.tsx"
import Web3Page from "@/pages/web3-page.tsx"
import WalletPage from "@/pages/wallet-page.tsx"
import TransactionHistoryPage from "@/pages/transaction-history-page.tsx"
import AdminPage from "@/pages/admin-page.tsx"

const queryClient = new QueryClient()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#81ecff]/30 border-t-[#81ecff] rounded-full animate-spin" />
          <p className="text-[10px] font-bold tracking-[0.3em] text-[#a9abaf] uppercase">Verifying session…</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#81ecff',
          accentColorForeground: '#003840',
          borderRadius: 'large',
        })}>
          <ThemeProvider defaultTheme="dark">
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/" element={<ProtectedRoute><SiteShell /></ProtectedRoute>}>
                  <Route index element={<DashboardPage />} />
                  <Route path="market" element={<MarketPage />} />
                  <Route path="swap" element={<SwaptradePage />} />
                  <Route path="settings" element={<VaultSettings />} />
                  <Route path="web3" element={<Web3Page />} />
                  <Route path="wallets" element={<WalletPage />} />
                  <Route path="history" element={<TransactionHistoryPage />} />
                  <Route path="admin" element={<AdminPage />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
)
