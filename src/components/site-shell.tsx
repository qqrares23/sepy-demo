import { Link, Outlet } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Sidebar } from "@/components/sidebar"

export function SiteShell() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-white">
      <Sidebar />

      <header className="fixed top-0 left-0 right-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b0e11]/80 px-6 backdrop-blur-xl md:pl-[18rem]">
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 rounded-3xl bg-slate-950/80 px-4 py-2 border border-white/10">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <Input
              className="w-72 bg-transparent border-none px-0 text-slate-100 placeholder:text-slate-500 focus:ring-0"
              placeholder="Search assets..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950/80 text-slate-400 hover:text-cyan-300">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950/80 text-slate-400 hover:text-cyan-300">
            <span className="material-symbols-outlined">account_balance_wallet</span>
          </button>
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
