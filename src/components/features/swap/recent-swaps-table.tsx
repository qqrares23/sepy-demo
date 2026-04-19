import type { SwapTx } from "@/types/transaction";
import type { HistoryPoint } from "@/types/crypto";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiveAreaChart } from "./live-area-chart";

interface RecentSwapsTableProps {
  recentSwaps: SwapTx[];
  history: HistoryPoint[];
  setSelectedTx: (tx: SwapTx) => void;
}

export function RecentSwapsTable({ recentSwaps, history, setSelectedTx }: RecentSwapsTableProps) {
  return (
    <section className="bg-[#101417] rounded-[2.5rem] border border-white/5 overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#161a1e]/30">
        <h2 className="text-xl font-headline font-bold">Recent Market Swaps</h2>
        <Button variant="ghost" className="text-[#81ecff] font-bold text-xs uppercase tracking-[0.2em] p-0 hover:bg-transparent">View History Explorer</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              {["Timestamp", "Transmission Flow", "Total Value", "Status", "Activity", "Action"].map((h, i) => (
                <TableHead key={h} className={`px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] ${i === 5 ? "text-right" : ""}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {recentSwaps.map((tx) => (
              <TableRow key={tx.id} className="border-none hover:bg-[#161a1e]/50 transition-all group cursor-pointer" onClick={() => setSelectedTx(tx)}>
                <TableCell className="px-8 py-6 text-xs text-[#a9abaf] font-bold">{tx.time}</TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#f8f9fe]">{tx.from}</span>
                    <span className="material-symbols-outlined text-[#81ecff] text-sm animate-pulse">arrow_forward</span>
                    <span className="font-bold text-[#f8f9fe]">{tx.to}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 font-headline font-bold text-sm text-[#f8f9fe]">{tx.value}</TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#69f6b8] shadow-[0_0_8px_#69f6b8]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#69f6b8]">{tx.status}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 w-40">
                  <div className="h-10 w-full">
                    <LiveAreaChart data={history.map(h => ({ ...h, value: h.value + (Math.random() - 0.5) * 500 }))} color="#81ecff" />
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-white/10 text-[#a9abaf] group-hover:text-[#81ecff] group-hover:border-[#81ecff]/30 transition-all">
                    <span className="material-symbols-outlined text-lg">open_in_new</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
