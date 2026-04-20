import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0e11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-[#81ecff]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#81ecff] text-2xl">shield</span>
            </div>
            <div className="absolute inset-0 w-16 h-16 border-2 border-transparent border-t-[#81ecff] rounded-full animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold tracking-[0.35em] text-[#a9abaf] uppercase">Vault.OS</p>
            <p className="text-[9px] tracking-[0.2em] text-[#737679] uppercase mt-1">Verifying session…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

/** Inverse guard — redirects logged-in users away from login/register */
export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null; // brief blank — login page mounts instantly when no session

  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}
