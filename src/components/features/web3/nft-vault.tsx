import type { NFT, ModalType } from "@/types/web3";

interface NFTVaultProps {
  nfts: NFT[];
  setSelectedNFT: (nft: NFT) => void;
  setModal: (modal: ModalType) => void;
}

export function NFTVault({ nfts, setSelectedNFT, setModal }: NFTVaultProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">NFT Vault</p>
        <span className="text-[10px] text-slate-600 font-mono">{nfts.length} items</span>
      </div>
      
      {nfts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {nfts.map((nft) => (
            <button
              key={nft.id}
              onClick={() => { setSelectedNFT(nft); setModal("nft"); }}
              className="text-left rounded-3xl border border-white/8 bg-[#0f1318] overflow-hidden hover:border-white/20 active:scale-95 transition-all duration-200 group flex flex-col"
            >
              <div className="h-28 w-full flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${nft.color}18, #0b0e11)` }}>
                <div className="absolute top-2 right-2 text-[8px] font-bold uppercase px-2 py-0.5 rounded-full border bg-black/40" style={{ color: nft.color, borderColor: `${nft.color}40` }}>
                  {nft.rarity}
                </div>
                <span className="material-symbols-outlined text-4xl transition-transform duration-300 group-hover:scale-110" style={{ color: nft.color }}>image</span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-black text-white text-sm font-headline truncate">{nft.name}</p>
                  </div>
                  <p className="text-[10px] text-slate-500">{nft.collection}</p>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold" style={{ color: nft.color }}>{nft.id}</span>
                  <span className="text-xs font-bold text-white bg-white/5 px-2 py-0.5 rounded-lg border border-white/5">{nft.floor}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0f1318]/50">
          <span className="material-symbols-outlined text-3xl text-slate-600 mb-2">grid_view</span>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">No NFTs detected in connected vault</p>
        </div>
      )}
    </div>
  );
}
