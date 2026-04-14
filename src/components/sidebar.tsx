"use client";

import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard", icon: "grid_view" },
  { to: "/market", label: "Markets", icon: "show_chart" },
  { to: "/swap", label: "Swap", icon: "swap_horiz" },
  { to: "/settings", label: "Settings", icon: "settings" },
  { to: "/web3", label: "Web3", icon: "cloud" },
  { to: "/history", label: "History", icon: "history" },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-white/10 bg-[#0b0e11] px-6 py-8 z-40">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-cyan-300 font-headline">
          <span className="material-symbols-outlined">shield</span>
          Vault.OS
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[0.35em] text-slate-500">Verified Node</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 group ${
                isActive
                  ? "bg-[#1a1d21] text-[#81ecff] border-r-4 border-[#81ecff] shadow-[0_0_20px_rgba(129,236,255,0.1)]"
                  : "text-slate-500 hover:text-[#81ecff] hover:bg-white/5 hover:translate-x-1"
              }`
            }
          >
            <span className={`material-symbols-outlined transition-transform duration-300 group-hover:scale-110`}>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-slate-950/80 p-5 border border-white/10 group/footer">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#69f6b8] animate-pulse shadow-[0_0_8px_#69f6b8]" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Secure endpoint</p>
        </div>
        <p className="mt-3 text-sm font-semibold text-[#81ecff] group-hover/footer:translate-x-1 transition-transform">Hardware vault ready</p>
        <Button 
          variant="secondary" 
          className="mt-5 w-full bg-[#22262b] border border-[#81ecff]/20 text-[#81ecff] hover:bg-[#81ecff] hover:text-[#003840] transition-all duration-300 shadow-lg shadow-cyan-950/20 active:scale-95"
        >
          Connect Wallet
        </Button>
      </div>
    </aside>
  );
}
