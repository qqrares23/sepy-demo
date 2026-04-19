import type { Transaction } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TransactionTableProps {
  transactions: Transaction[];
  setSelectedTx: (tx: Transaction) => void;
}

export function TransactionTable({ transactions, setSelectedTx }: TransactionTableProps) {
  return (
    <section className="bg-[#101417] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              {["Action", "Asset Flow", "Total Value", "Timestamp", "Finality", "Inspect"].map((h, i) => (
                <TableHead key={h} className={`px-8 py-6 text-[10px] uppercase tracking-widest font-bold text-[#a9abaf] ${i === 5 ? "text-right" : ""}`}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-none hover:bg-[#161a1e]/50 transition-all group cursor-pointer" onClick={() => setSelectedTx(tx)}>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 ${
                      tx.type === 'Receive' || tx.type === 'Buy' ? 'bg-[#69f6b8]/10 text-[#69f6b8]' : 
                      tx.type === 'Send' || tx.type === 'Sell' ? 'bg-[#ff716c]/10 text-[#ff716c]' : 
                      'bg-[#81ecff]/10 text-[#81ecff]'
                    }`}>
                      <span className="material-symbols-outlined text-lg">
                        {tx.type === 'Receive' ? 'south_west' : 
                         tx.type === 'Buy' ? 'shopping_cart' :
                         tx.type === 'Send' ? 'north_east' : 
                         tx.type === 'Sell' ? 'account_balance' :
                         'swap_horiz'}
                      </span>
                    </div>
                    <span className="font-bold text-[#f8f9fe]">{tx.type}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <div>
                    <p className="font-bold text-[#f8f9fe]">{tx.asset}</p>
                    <p className="text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest mt-0.5">{tx.amount}</p>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 font-headline font-bold text-sm text-[#f8f9fe]">{tx.value}</TableCell>
                <TableCell className="px-8 py-6 text-xs text-[#a9abaf] font-bold">{tx.time}</TableCell>
                <TableCell className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${tx.status === 'Completed' ? 'bg-[#69f6b8] shadow-[0_0_8px_#69f6b8]' : 'bg-[#81ecff] animate-pulse shadow-[0_0_8px_#81ecff]'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${tx.status === 'Completed' ? 'text-[#69f6b8]' : 'text-[#81ecff]'}`}>{tx.status}</span>
                  </div>
                </TableCell>
                <TableCell className="px-8 py-6 text-right">
                  <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-[#1c2024] text-[#a9abaf] group-hover:text-[#81ecff]">
                    <span className="material-symbols-outlined text-xl">search_insights</span>
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
