import type { Market, HistoryPoint, DashboardMarket } from "@/types/crypto";
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

interface MarketIntelligenceProps {
  markets: DashboardMarket[];
  history: HistoryPoint[];
  setSelectedAsset: (asset: Market) => void;
  setActiveModal: (modal: 'send' | 'stake' | 'sell' | null) => void;
}

export const MarketIntelligence = ({ markets, history, setSelectedAsset, setActiveModal }: MarketIntelligenceProps) => {
  return (
    <section className="bg-[#101417] rounded-3xl border border-white/5 overflow-hidden">
      <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <h2 className="text-xl font-headline font-bold">Your Assets</h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#69f6b8] animate-pulse" />
          <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest text-glow">Secure Storage Active</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              {["Asset", "Balance", "Total Value", "24h Change", "Price", "Market Cap", "Activity", "Action"].map((h) => (
                <TableHead key={h} className="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.length > 0 ? markets.map((m, index) => {
              // Create stable mapped history data for this market
              const mappedHistory = history.map((h, i) => ({
                ...h,
                value: h.value + (index * 50) + (i % 3 === 0 ? 20 : -10)
              }));

              return (
                <TableRow key={m.name} className="border-none hover:bg-[#161a1e] transition-colors group">
                  <TableCell className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-[#1c2024] flex items-center justify-center border border-white/5 font-bold text-[10px] ${m.color}`}>
                        {m.ticker}
                      </div>
                      <span className="font-bold text-[#f8f9fe] whitespace-nowrap">{m.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-bold text-[#f8f9fe]">
                    {m.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} <span className="text-[10px] text-[#a9abaf] ml-1 uppercase">{m.ticker}</span>
                  </TableCell>
                  <TableCell className="px-8 py-6 font-headline font-bold text-[#81ecff]">
                    ${m.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className={`px-8 py-6 font-bold ${m.up ? "text-[#69f6b8]" : "text-[#ff716c]"}`}>
                    {m.change}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-[#f8f9fe] text-xs font-medium">
                    ${m.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="px-8 py-6 text-[#a9abaf] text-[10px] font-medium">{m.cap}</TableCell>
                  <TableCell className="px-8 py-6 w-32">
                    <div className="h-8">
                      <LiveAreaChart data={mappedHistory} color={m.stroke} />
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button 
                      variant="outline" 
                      onClick={() => { setSelectedAsset(m); setActiveModal('sell'); }}
                      className="rounded-xl border-[#ff716c]/20 text-[#ff716c] text-[10px] uppercase font-bold hover:bg-[#ff716c] hover:text-white transition-all px-4"
                    >
                      Sell
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }) : (
              <TableRow>
                <TableCell colSpan={8} className="px-8 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-white/10">account_balance_wallet</span>
                    <p className="text-sm font-bold text-[#a9abaf]">No assets found. Purchase your first crypto to see it here.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
