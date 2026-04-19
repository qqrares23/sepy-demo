import { useState, useEffect, useCallback } from "react";
import type { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

export function useTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (isManual = false) => {
    if (!user) return;
    if (isManual) setRefreshing(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTransactions(data.map(tx => ({
          id: tx.id.substring(0, 10),
          type: tx.type,
          asset: tx.asset,
          amount: tx.amount,
          value: tx.value,
          time: new Date(tx.created_at).toLocaleString(),
          status: tx.status,
          from: tx.from || 'Unknown',
          to: tx.to || 'Vault',
          gas: tx.gas || '0.001 ETH'
        })));
      }
    } catch (err: any) {
      console.error("Fetch transactions error:", err);
      setError(err.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTransactions();
    
    if (!user) return;

    const channel = supabase
      .channel(`history-all-changes-${user.id}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions', 
          filter: `user_id=eq.${user.id}` 
        }, 
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTransactions]);

  return {
    transactions,
    loading,
    refreshing,
    error,
    refresh: () => fetchTransactions(true)
  };
}
