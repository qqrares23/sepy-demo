import { useState, useEffect, useMemo, useCallback } from "react";
import type { NFT, Chain } from "@/types/web3";
import { useAccount, useBalance } from 'wagmi';
import { supabase } from "@/lib/supabase";
import type { WalletRecord } from "@/hooks/use-wallets";

const ALCHEMY_API_KEY = import.meta.env.VITE_ALCHEMY_API_KEY;

export function useWeb3Data() {
  const { address, isConnected, connector } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [linkedWallets, setLinkedWallets] = useState<WalletRecord[]>([]);
  const [loadingWallets, setLoadingWallets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinkedWallets = useCallback(async () => {
    setLoadingWallets(true);
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
      setLoadingWallets(false);
    }
  }, []);

  const linkCurrentWallet = useCallback(async () => {
    if (!address) return false;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error: insertError } = await supabase.from('wallets').insert({
        user_id: user.id,
        address: address,
        chain: 'Ethereum',
        name: connector?.name || 'Injected'
      });

      if (insertError) throw insertError;
      
      await fetchLinkedWallets();
      return true;
    } catch (err: any) {
      console.error("Link error:", err);
      setError(err.message || "Failed to link wallet");
      return false;
    }
  }, [address, connector, fetchLinkedWallets]);

  const deleteWallet = useCallback(async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('wallets').delete().eq('id', id);
      if (deleteError) throw deleteError;
      await fetchLinkedWallets();
    } catch (err: any) {
      console.error("Delete wallet error:", err);
      setError(err.message || "Failed to delete wallet");
    }
  }, [fetchLinkedWallets]);

  useEffect(() => {
    fetchLinkedWallets();
  }, [fetchLinkedWallets]);

  useEffect(() => {
    async function fetchNFTs() {
      if (!isConnected || !address || !ALCHEMY_API_KEY) {
        setNfts([]);
        return;
      }
      try {
        const response = await fetch(
          `https://eth-mainnet.g.alchemy.com/nft/v3/${ALCHEMY_API_KEY}/getNFTsForOwner?owner=${address}&withMetadata=true&pageSize=10`
        );
        if (!response.ok) throw new Error("NFT fetch failed");
        
        const data = await response.json();
        const mappedNfts: NFT[] = (data.ownedNfts || []).map((nft: any) => ({
          id: `#${nft.tokenId?.slice(-4) || '0000'}`,
          name: nft.name || nft.contract?.name || "Unnamed NFT",
          collection: nft.contract?.name || "Unknown Collection",
          floor: "Floor N/A",
          color: "#81ecff",
          rarity: "Standard"
        }));
        setNfts(mappedNfts);
      } catch (err) {
        console.error("NFT fetch error:", err);
        setNfts([]);
      }
    }
    fetchNFTs();
  }, [isConnected, address]);

  const chains: Chain[] = useMemo(() => {
    if (!isConnected) return [];
    return [{ 
      name: "Ethereum", 
      symbol: "ETH", 
      icon: "diamond", 
      color: "#81ecff", 
      balance: ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : "0.00" 
    }];
  }, [isConnected, ethBalance]);

  const isCurrentWalletLinked = useMemo(() => {
    if (!address) return false;
    return linkedWallets.some(w => w.address.toLowerCase() === address.toLowerCase());
  }, [address, linkedWallets]);

  return {
    nfts,
    linkedWallets,
    loadingWallets,
    error,
    chains,
    linkCurrentWallet,
    deleteWallet,
    isCurrentWalletLinked,
    isConnected,
    address
  };
}
