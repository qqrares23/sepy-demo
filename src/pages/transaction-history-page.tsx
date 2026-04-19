"use client";

import { useState } from "react";
import type { Transaction } from "@/types/transaction";
import { HistoryPageContent } from "@/components/features/history/history-page-content";
import { useTransactions } from "@/hooks/use-transactions";

export default function HistoryPage() {
  const { transactions, refreshing, refresh } = useTransactions();
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  return (
    <HistoryPageContent 
      selectedTx={selectedTx}
      setSelectedTx={setSelectedTx}
      transactions={transactions}
      refreshing={refreshing}
      onRefresh={refresh}
    />
  );
}
