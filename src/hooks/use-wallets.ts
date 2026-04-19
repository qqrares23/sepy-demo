import { useState, useEffect, useCallback } from "react";
import { useAccount, useConnectorClient } from "wagmi";
import { supabase } from "@/lib/supabase";

export interface WalletRecord {
  id: string;
  user_id: string;
  address: string;
  chain: string;
  name: string;
  created_at: string;
}

export function useWallets() {
  const { address, isConnected, connector } = useAccount();
  const [linkedWallets, setLinkedWallets] = useState<WalletRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinkedWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error: fetchError } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id);
        
        if (fetchError) throw fetchError;
        if (data) setLinkedWallets(data);
      }
    } catch (err: any) {
      console.error("Fetch linked wallets error:", err);
      setError(err.message || "Failed to fetch linked wallets");
    } finally {
      setLoading(false);
    }
  }, []);

  const linkCurrentWallet = async () => {
    if (!address) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check if already linked
      if (linkedWallets.some(w => w.address.toLowerCase() === address.toLowerCase())) {
        return;
      }

      const { error: insertError } = await supabase.from('wallets').insert({
        user_id: user.id,
        address: address,
        chain: 'Ethereum',
        name: connector?.name || 'Metamask'
      });

      if (insertError) throw insertError;
      
      await fetchLinkedWallets();
    } catch (err: any) {
      console.error("Link wallet error:", err);
      setError(err.message || "Failed to link wallet");
    }
  };

  const deleteWallet = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('wallets').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setLinkedWallets(prev => prev.filter(w => w.id !== id));
    } catch (err: any) {
      console.error("Delete wallet error:", err);
      setError(err.message || "Failed to delete wallet");
    }
  };

  useEffect(() => {
    fetchLinkedWallets();
  }, [fetchLinkedWallets]);

  const activeWalletLinked = address ? linkedWallets.some(w => w.address.toLowerCase() === address.toLowerCase()) : false;

  return {
    linkedWallets,
    loading,
    error,
    linkCurrentWallet,
    deleteWallet,
    activeWalletLinked,
    refresh: fetchLinkedWallets
  };
}
