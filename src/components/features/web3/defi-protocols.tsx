import type { Protocol, ModalType } from "@/types/web3";
import { Button } from "@/components/ui/button";

interface DeFiProtocolsProps {
  protocols: Protocol[];
  setSelectedProtocol: (p: Protocol) => void;
  setModal: (modal: ModalType) => void;
}

export function DeFiProtocols({ protocols, setSelectedProtocol, setModal }: DeFiProtocolsProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-3 mt-4">DeFi Protocols</p>
      
      {protocols.length > 0 ? (
        <div className="space-y-3">
          {protocols.map((p) => (
            <div key={p.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[#0f1318] px-5 py-4 hover:border-white/15 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${p.color}18`, border: `1px solid ${p.color}33` }}>
                  <span className="material-symbols-outlined" style={{ color: p.color }}>{p.icon}</span>
                </div>
                <div>
                  <p className="font-black text-white text-sm font-headline">{p.name}</p>
                  <p className="text-[10px] text-slate-500">TVL {p.tvl}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">APY</p>
                  <p className="font-black text-sm" style={{ color: p.color }}>{p.apy}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest">Staked</p>
                  <p className="font-mono font-black text-sm text-white">{p.staked}</p>
                </div>
                <Button
                  onClick={() => { setSelectedProtocol(p); setModal("stake"); }}
                  className="rounded-xl text-xs font-bold transition-all active:scale-95"
                  style={{ background: `${p.color}22`, color: p.color, border: `1px solid ${p.color}33` }}
                >
                  Stake
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-10 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#0f1318]/30">
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">No active positions detected</p>
        </div>
      )}
    </div>
  );
}
