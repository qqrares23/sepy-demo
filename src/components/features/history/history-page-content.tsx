import type { Transaction } from "@/types/transaction";
import { TransactionModal } from "./transaction-modal";
import { HistoryHeader } from "./history-header";
import { TransactionTable } from "./transaction-table";
import { HistoryMetrics } from "./history-metrics";

interface HistoryPageContentProps {
  selectedTx: Transaction | null;
  setSelectedTx: (tx: Transaction | null) => void;
  transactions: Transaction[];
  refreshing: boolean;
  onRefresh: () => void;
}

export function HistoryPageContent({
  selectedTx,
  setSelectedTx,
  transactions,
  refreshing,
  onRefresh,
}: HistoryPageContentProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {selectedTx && <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />}

      <HistoryHeader refreshing={refreshing} onRefresh={onRefresh} />

      <TransactionTable transactions={transactions} setSelectedTx={setSelectedTx} />

      <HistoryMetrics transactions={transactions} />

      {/* Decorative Background */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
    </div>
  );
}
