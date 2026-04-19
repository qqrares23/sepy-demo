import { useAuth } from "@/hooks/use-auth";

interface DashboardHeaderProps {
  activeRange: string;
  setActiveRange: (range: string) => void;
}

export const DashboardHeader = ({ activeRange, setActiveRange }: DashboardHeaderProps) => {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Trader";

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#81ecff] uppercase">Vault Console</span>
          <div className="h-1 w-1 rounded-full bg-[#81ecff]" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#a9abaf] uppercase">
            Welcome, {user?.full_name || "Agent"}
          </span>
        </div>
        <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
          {firstName}'s Overview
        </h1>
        <p className="text-[#a9abaf] max-w-xl font-medium">Real-time monitoring of your cryptographic assets.</p>
      </div>
      <div className="flex items-center gap-3 bg-[#1c2024] p-1 rounded-xl border border-white/5">
        {["1D", "1W", "1M", "ALL"].map((r) => (
          <button 
            key={r} 
            onClick={() => setActiveRange(r)} 
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeRange === r ? "bg-[#81ecff] text-[#003840]" : "text-[#a9abaf] hover:text-[#f8f9fe]"}`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};
