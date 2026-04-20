import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { AdminPageContent } from "@/components/features/admin/admin-page-content";

export default function AdminPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-[#81ecff]/30 border-t-[#81ecff] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return <Navigate to="/" replace />;
  }

  return <AdminPageContent />;
}
