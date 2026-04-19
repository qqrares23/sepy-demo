import { ShieldCheck } from "lucide-react";

interface DashboardNotificationProps {
  lastAction: string | null;
}

export const DashboardNotification = ({ lastAction }: DashboardNotificationProps) => {
  if (!lastAction) return null;

  return (
    <div className="fixed bottom-8 right-8 z-[100] bg-[#69f6b8] text-[#003840] px-6 py-4 rounded-2xl font-bold shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10">
      <ShieldCheck className="h-5 w-5" />
      {lastAction}
    </div>
  );
};
