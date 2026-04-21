"use client";

import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { to: "/", label: "Dashboard", icon: "grid_view" },
  { to: "/market", label: "Markets", icon: "show_chart" },
  { to: "/swap", label: "Swap", icon: "swap_horiz" },
  { to: "/web3", label: "Web3", icon: "cloud" },
  { to: "/history", label: "History", icon: "history" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const [walletCount, setWalletCount] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<number>(0);

  useEffect(() => {
    if (!user?.is_admin) { setPendingRequests(0); return; }
    const fetchPending = async () => {
      const { count } = await supabase
        .from('topup_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingRequests(count || 0);
    };
    fetchPending();
    const channel = supabase
      .channel('admin-topup-requests')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'topup_requests' }, fetchPending)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.is_admin]);

  useEffect(() => {
    const fetchWalletCount = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { count, error } = await supabase
          .from('wallets')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        if (!error && count !== null) {
          setWalletCount(count);
        }
      }
    };

    fetchWalletCount();

    // Set up a subscription for real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wallets',
        },
        () => {
          fetchWalletCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col border-r border-white/10 bg-[#0b0e11] px-6 py-8 z-40">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black tracking-tight text-[#81ecff] font-headline">
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
          {user?.is_admin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 transform active:scale-95 group ${
                  isActive
                    ? "bg-[#1a1d21] text-[#81ecff] border-r-4 border-[#81ecff] shadow-[0_0_20px_rgba(129,236,255,0.1)]"
                    : "text-slate-500 hover:text-[#81ecff] hover:bg-white/5 hover:translate-x-1"
                }`
              }
            >
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">
                admin_panel_settings
              </span>
              Admin
              {pendingRequests > 0 && (
                <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-[#ff716c] text-[8px] font-black text-white">
                  {pendingRequests}
                </span>
              )}
            </NavLink>
          )}
        </nav>

        <div className="mt-auto rounded-3xl bg-slate-950/80 p-5 border border-white/10 group/footer">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${walletCount > 0 ? 'bg-[#69f6b8]' : 'bg-slate-600'} animate-pulse shadow-[0_0_8px_${walletCount > 0 ? '#69f6b8' : '#64748b'}]`} />
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Secure endpoint</p>
          </div>
          <p className="mt-3 text-sm font-semibold text-[#81ecff] group-hover/footer:translate-x-1 transition-transform">
            {walletCount > 0 ? `${walletCount} Wallet${walletCount > 1 ? 's' : ''} Authorized` : 'Hardware vault ready'}
          </p>
          <Link to="/wallets" className="block mt-5">
            <Button
              variant="secondary"
              className="w-full bg-[#22262b] border border-[#81ecff]/20 text-[#81ecff] hover:bg-[#81ecff] hover:text-[#003840] transition-all duration-300 shadow-lg active:scale-95"
            >
              {walletCount > 0 ? 'Manage Vaults' : 'Connect Wallet'}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0b0e11]/95 backdrop-blur-3xl border-t border-white/10 px-1 flex items-center justify-around z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-2xl transition-all duration-300 shrink-0 min-w-[50px] ${
                isActive
                  ? "text-[#81ecff] bg-[#81ecff]/10"
                  : "text-slate-500"
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">{item.icon}</span>
            <span className="text-[6px] font-black uppercase tracking-widest">{item.label}</span>
          </NavLink>
        ))}
        {user?.is_admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-2xl transition-all duration-300 shrink-0 min-w-[50px] ${
                isActive ? "text-[#81ecff] bg-[#81ecff]/10" : "text-slate-500"
              }`
            }
          >
            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
            <span className="text-[6px] font-black uppercase tracking-widest">Admin</span>
            {pendingRequests > 0 && (
              <span className="absolute top-1 right-1 h-3 w-3 flex items-center justify-center rounded-full bg-[#ff716c] text-[7px] font-black text-white">
                {pendingRequests}
              </span>
            )}
          </NavLink>
        )}
        <button
          onClick={async () => {
            await signOut();
          }}
          className="flex flex-col items-center justify-center gap-1 px-1 py-2 rounded-2xl transition-all duration-300 shrink-0 min-w-[50px] text-slate-500 hover:text-[#ff716c]"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
          <span className="text-[6px] font-black uppercase tracking-widest">Logout</span>
        </button>
      </nav>
    </>
  );
}