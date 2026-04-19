import type { Transaction } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { useMemo } from "react";
import { MetricCard } from "./metric-card";

export function HistoryMetrics({ transactions = [] }: { transactions: Transaction[] }) {
  const stats = useMemo(() => {
    const inboundTypes = ['Buy', 'Receive', 'Swap'];
    const totalInbound = transactions
      .filter(tx => inboundTypes.includes(tx.type))
      .reduce((sum, tx) => {
        const val = parseFloat(tx.value.replace(/[$,]/g, '')) || 0;
        return sum + val;
      }, 0);

    return {
      count: transactions.length,
      volume: totalInbound
    };
  }, [transactions]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard
        icon="receipt_long"
        iconColorClass="text-[#81ecff] bg-[#81ecff]"
        label="Total Transmissions"
        value={stats.count}
        footer={
          <div className="h-1.5 w-full bg-[#1c2024] rounded-full overflow-hidden">
            <div className="h-full bg-[#81ecff] rounded-full" style={{ width: `${Math.min(100, stats.count * 10)}%` }} />
          </div>
        }
      />

      <MetricCard
        icon="account_balance_wallet"
        iconColorClass="text-[#69f6b8] bg-[#69f6b8]"
        label="Inbound Volume"
        value={`$${stats.volume > 1000 ? `${(stats.volume / 1000).toFixed(1)}K` : stats.volume.toFixed(2)}`}
        footer={
          <div className="flex items-center gap-2 text-[#69f6b8] text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            Live Account Sync
          </div>
        }
      />

      <MetricCard
        icon="security"
        iconColorClass="text-[#af88ff] bg-[#af88ff]"
        label="Verification Status"
        value="High-Trust"
        footer={
          <Badge className="bg-[#af88ff]/10 text-[#af88ff] border-none uppercase text-[9px] font-bold px-3">Protocol Verified</Badge>
        }
      />
    </section>
  );
}
