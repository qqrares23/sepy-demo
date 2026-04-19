import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface MetricCardProps {
  icon: string;
  iconColorClass: string;
  label: string;
  value: string | number;
  footer?: ReactNode;
}

export function MetricCard({ icon, iconColorClass, label, value, footer }: MetricCardProps) {
  return (
    <Card className="border-0 bg-[#101417] border border-white/5 rounded-[2rem] p-8 shadow-xl">
      <CardContent className="p-0 space-y-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClass}`}>
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>{icon}</span>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">{label}</p>
          <p className="text-3xl font-headline font-bold text-[#f8f9fe] mt-1">{value}</p>
        </div>
        {footer}
      </CardContent>
    </Card>
  );
}
