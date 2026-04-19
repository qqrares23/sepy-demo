import { useAuth } from "@/hooks/use-auth";

interface SyncButtonProps {
  refreshing: boolean;
  onRefresh: () => void;
  className?: string;
}

export function SyncButton({ refreshing, onRefresh, className = "" }: SyncButtonProps) {
  const { user } = useAuth();

  return (
    <button 
      onClick={onRefresh}
      disabled={refreshing || !user}
      className={`flex items-center gap-2 bg-[#161a1e] border border-white/10 px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase text-[#a9abaf] hover:text-[#81ecff] transition-all disabled:opacity-30 shadow-2xl ${className}`}
    >
      <span className={`material-symbols-outlined text-sm ${refreshing ? 'animate-spin' : ''}`}>refresh</span>
      {refreshing ? 'Syncing...' : 'Sync History'}
    </button>
  );
}
