"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ── Types & Data ─────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  type: "Receive" | "Send" | "Swap";
  asset: string;
  amount: string;
  value: string;
  time: string;
  status: "Completed" | "Pending" | "Failed";
  from: string;
  to: string;
  gas: string;
}

const transactions: Transaction[] = [
  { id: "0x82...f2a1", type: "Receive", asset: "Bitcoin", amount: "0.45 BTC", value: "$28,926.45", time: "2 mins ago", status: "Completed", from: "0x123...456", to: "Vault_Main", gas: "0.0002 BTC" },
  { id: "0x45...e922", type: "Swap", asset: "Ethereum", amount: "2.5 ETH", value: "$8,532.12", time: "14 mins ago", status: "Completed", from: "Vault_Main", to: "Uniswap_V3", gas: "0.004 ETH" },
  { id: "0x11...c330", type: "Send", asset: "Solana", amount: "45 SOL", value: "$6,532.00", time: "1 hour ago", status: "Pending", from: "Vault_Main", to: "0x987...654", gas: "0.00001 SOL" },
  { id: "0x99...a118", type: "Receive", asset: "USDC", amount: "15,000 USDC", value: "$15,000.00", time: "3 hours ago", status: "Completed", from: "Coinbase_Entry", to: "Vault_Main", gas: "12.5 USDC" },
];

// ── Components ───────────────────────────────────────────────────────────────

function TransactionModal({ tx, onClose }: { tx: Transaction; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b0e11]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#161a1e] w-full max-w-lg rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#81ecff]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h3 className="font-headline font-bold text-2xl text-[#f8f9fe]">Ledger Inspector</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#101417] flex items-center justify-center text-[#a9abaf] hover:text-white transition-colors border border-white/5">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-col items-center py-8 bg-[#101417] rounded-3xl border border-white/5">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 ${tx.status === 'Completed' ? 'bg-[#69f6b8]/10 border-[#69f6b8]/20 text-[#69f6b8]' : 'bg-[#81ecff]/10 border-[#81ecff]/20 text-[#81ecff]'}`}>
              <span className="material-symbols-outlined text-4xl">{tx.status === 'Completed' ? 'verified' : 'sync'}</span>
            </div>
            <p className="text-3xl font-headline font-bold text-[#f8f9fe]">{tx.amount}</p>
            <p className="text-sm text-[#a9abaf] font-bold uppercase tracking-widest mt-1">{tx.value} USD</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Internal Hash", value: tx.id },
              { label: "Protocol Action", value: tx.type },
              { label: "Origin Source", value: tx.from },
              { label: "Destination", value: tx.to },
              { label: "Network Fee", value: tx.gas },
              { label: "Finality Status", value: tx.status, color: tx.status === 'Completed' ? "text-[#69f6b8]" : "text-[#81ecff]" }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-4 bg-[#101417] rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">{item.label}</span>
                <span className={`text-xs font-mono font-bold ${item.color || "text-[#f8f9fe]"}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 py-7 rounded-2xl bg-[#101417] text-[#81ecff] border border-[#81ecff]/20 font-headline font-bold uppercase tracking-widest text-xs hover:bg-[#81ecff] hover:text-[#003840] transition-all">Export Proof</Button>
            <Button variant="outline" className="flex-1 py-7 rounded-2xl border-white/10 text-white font-headline font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">Raw JSON</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
            Ledger History
          </h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">
            A comprehensive record of all cryptographic transmissions and state changes.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-[#1c2024] border-white/5 rounded-xl h-11 text-xs font-bold uppercase tracking-widest">
              <SelectValue placeholder="All Assets" />
            </SelectTrigger>
            <SelectContent className="bg-[#1c2024] border-white/10 text-white">
              <SelectItem value="all">All Assets</SelectItem>
              <SelectItem value="btc">Bitcoin</SelectItem>
              <SelectItem value="eth">Ethereum</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-11 rounded-xl border-white/10 text-[#a9abaf] hover:text-white px-6 uppercase text-[10px] font-bold tracking-widest">
            Export CSV
          </Button>
        </div>
      </div>

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
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 ${tx.type === 'Receive' ? 'bg-[#69f6b8]/10 text-[#69f6b8]' : tx.type === 'Send' ? 'bg-[#ff716c]/10 text-[#ff716c]' : 'bg-[#81ecff]/10 text-[#81ecff]'}`}>
                        <span className="material-symbols-outlined text-lg">{tx.type === 'Receive' ? 'south_west' : tx.type === 'Send' ? 'north_east' : 'swap_horiz'}</span>
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

      {/* Metrics Bento */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 bg-[#101417] border border-white/5 rounded-[2rem] p-8">
          <CardContent className="p-0 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#81ecff]/10 border border-[#81ecff]/20 flex items-center justify-center text-[#81ecff]">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Total Transmissions</p>
              <p className="text-3xl font-headline font-bold text-[#f8f9fe] mt-1">1,284</p>
            </div>
            <div className="h-1.5 w-full bg-[#1c2024] rounded-full overflow-hidden">
              <div className="h-full bg-[#81ecff] w-3/4 rounded-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[#101417] border border-white/5 rounded-[2rem] p-8">
          <CardContent className="p-0 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#69f6b8]/10 border border-[#69f6b8]/20 flex items-center justify-center text-[#69f6b8]">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Inbound Volume</p>
              <p className="text-3xl font-headline font-bold text-[#f8f9fe] mt-1">$42.8K</p>
            </div>
            <div className="flex items-center gap-2 text-[#69f6b8] text-xs font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              +12.4% this month
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-[#101417] border border-white/5 rounded-[2rem] p-8">
          <CardContent className="p-0 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-[#af88ff]/10 border border-[#af88ff]/20 flex items-center justify-center text-[#af88ff]">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Verification Status</p>
              <p className="text-3xl font-headline font-bold text-[#f8f9fe] mt-1">High-Trust</p>
            </div>
            <Badge className="bg-[#af88ff]/10 text-[#af88ff] border-none uppercase text-[9px] font-bold px-3">Protocol Verified</Badge>
          </CardContent>
        </Card>
      </section>

      {/* Decorative Background */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
    </div>
  );
}
