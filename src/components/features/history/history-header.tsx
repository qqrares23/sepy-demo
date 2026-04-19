import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SyncButton } from "./sync-button";

interface HistoryHeaderProps {
  refreshing: boolean;
  onRefresh: () => void;
}

export function HistoryHeader({ refreshing, onRefresh }: HistoryHeaderProps) {
  return (
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
        <SyncButton refreshing={refreshing} onRefresh={onRefresh} />
        
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
      </div>
    </div>
  );
}
