"use client";

import { SettingsPageContent } from "@/components/features/settings/settings-page-content";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function VaultSettings() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#81ecff]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[60vh] w-full flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-headline font-bold text-white">Access Restricted</h2>
        <p className="text-[#a9abaf]">Please log in to manage your vault settings.</p>
      </div>
    );
  }

  return <SettingsPageContent />;
}
