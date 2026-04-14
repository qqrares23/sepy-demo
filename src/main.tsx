import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import "./index.css"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { SiteShell } from "@/components/site-shell.tsx"
import DashboardPage from "@/pages/dashboard-page.tsx"
import LoginPage from "@/pages/login-page.tsx"
import RegisterPage from "@/pages/register-page.tsx"
import MarketPage from "@/pages/market-page.tsx"
import SwaptradePage from "@/pages/swaptrade-page.tsx"
import VaultSettings from "@/pages/settings-page.tsx"
import Web3Page from "@/pages/web3-page.tsx"
import TransactionHistoryPage from "@/pages/transaction-history-page.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<SiteShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="swap" element={<SwaptradePage />} />
            <Route path="settings" element={<VaultSettings />} />
            <Route path="web3" element={<Web3Page />} />
            <Route path="history" element={<TransactionHistoryPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
