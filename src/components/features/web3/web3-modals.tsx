import type { NFT, Protocol } from "@/types/web3";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

const CHAINS = [
  { name: "Ethereum", symbol: "ETH", icon: "diamond", color: "#81ecff", balance: "3.41" },
  { name: "Arbitrum", symbol: "ARB", icon: "speed", color: "#69f6b8", balance: "120.8" },
  { name: "Base", symbol: "BASE", icon: "layers", color: "#b16cff", balance: "0.92" },
  { name: "Polygon", symbol: "MATIC", icon: "hexagon", color: "#f9ca24", balance: "512.0" },
];

export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0f1318] p-6 shadow-2xl"
        style={{ boxShadow: "0 0 60px rgba(129,236,255,0.08)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex items-center justify-center rounded-full bg-[#0f1318]/80 p-1.5 text-slate-400 backdrop-blur-md hover:bg-white/10 hover:text-white transition-all border border-transparent hover:border-white/10"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function ConnectModal({ onConnect }: { onConnect: () => void }) {
  const wallets = [
    { name: "MetaMask", icon: "account_balance_wallet", color: "#f6851b" },
    { name: "WalletConnect", icon: "qr_code_scanner", color: "#3b99fc" },
    { name: "Coinbase Wallet", icon: "currency_bitcoin", color: "#0052ff" },
    { name: "Ledger", icon: "shield", color: "#81ecff" },
  ];
  return (
    <>
      <h2 className="text-lg font-black text-white mb-1 font-headline">Connect Wallet</h2>
      <p className="text-xs text-slate-500 mb-5 uppercase tracking-widest">Choose your provider</p>
      <div className="space-y-2">
        {wallets.map((w) => (
          <button
            key={w.name}
            onClick={onConnect}
            className="w-full flex items-center gap-4 rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm font-semibold text-white hover:border-[#81ecff]/40 hover:bg-[#81ecff]/5 transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: w.color }}>{w.icon}</span>
            {w.name}
            <span className="material-symbols-outlined ml-auto text-slate-600 group-hover:text-[#81ecff] transition-colors">chevron_right</span>
          </button>
        ))}
      </div>
    </>
  );
}

export function SignModal({ onClose, onSign }: { onClose: () => void; onSign: () => void }) {
  return (
    <>
      <h2 className="text-lg font-black text-white mb-1 font-headline">Sign Message</h2>
      <p className="text-xs text-slate-500 mb-5 uppercase tracking-widest">Vault.OS Authentication</p>
      <div className="rounded-2xl bg-black/40 border border-white/8 p-4 mb-5 font-mono text-xs text-slate-400 leading-relaxed">
        <p className="text-[#81ecff] mb-2">// Message payload</p>
        <p>domain: vault.os</p>
        <p>address: 0x3fA2...9b1C</p>
        <p>statement: Authenticate to Vault.OS</p>
        <p>nonce: 8f2a91dc</p>
        <p>issued: {new Date().toISOString()}</p>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-2xl">Cancel</Button>
        <Button onClick={onSign} className="flex-1 bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl transition-all">Sign</Button>
      </div>
    </>
  );
}

export function DeployModal({ onDeploy }: { onDeploy: () => void }) {
  const [step, setStep] = useState(0);
  const steps = ["Configure", "Review", "Deploy"];
  return (
    <>
      <h2 className="text-lg font-black text-white mb-1 font-headline">Deploy Contract</h2>
      <div className="flex gap-2 mb-5 mt-3">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`h-1 rounded-full mb-1 transition-all duration-300 ${i <= step ? "bg-[#81ecff]" : "bg-white/10"}`} />
            <span className={`text-[9px] uppercase tracking-widest font-bold ${i <= step ? "text-[#81ecff]" : "text-slate-600"}`}>{s}</span>
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="space-y-3 mb-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Contract Name</label>
            <input defaultValue="VaultToken" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#81ecff]/50" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Network</label>
            <select className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#81ecff]/50">
              <option>Ethereum Mainnet</option>
              <option>Arbitrum One</option>
              <option>Base</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Gas Limit</label>
            <input defaultValue="300000" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#81ecff]/50" />
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="rounded-2xl bg-black/40 border border-white/8 p-4 mb-5 space-y-2 text-xs">
          {[["Contract", "VaultToken"], ["Network", "Ethereum Mainnet"], ["Gas Est.", "0.0042 ETH"], ["Compiler", "v0.8.24"]].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-slate-500">{k}</span>
              <span className="text-white font-mono">{v}</span>
            </div>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="text-center py-4 mb-5">
          <span className="material-symbols-outlined text-5xl text-[#81ecff] animate-spin" style={{ animationDuration: "2s" }}>refresh</span>
          <p className="mt-3 text-sm text-slate-400">Broadcasting to network…</p>
        </div>
      )}
      <div className="flex gap-3">
        {step > 0 && <Button variant="ghost" onClick={() => setStep(s => s - 1)} className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-2xl">Back</Button>}
        {step < 2
          ? <Button onClick={() => setStep(s => s + 1)} className="flex-1 bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl">Next</Button>
          : <Button onClick={onDeploy} className="flex-1 bg-[#69f6b8] text-[#003840] font-bold hover:bg-[#81ecff] rounded-2xl">Confirm Deploy</Button>
        }
      </div>
    </>
  );
}

export function BridgeModal({ onClose, onBridge }: { onClose: () => void; onBridge: () => void }) {
  const [amount, setAmount] = useState("0.5");
  const [from, setFrom] = useState("Ethereum");
  const [to, setTo] = useState("Arbitrum");
  return (
    <>
      <h2 className="text-lg font-black text-white mb-1 font-headline">Bridge Assets</h2>
      <p className="text-xs text-slate-500 mb-5 uppercase tracking-widest">Cross-chain transfer</p>
      <div className="space-y-3 mb-5">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none">
              {CHAINS.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <span className="material-symbols-outlined text-[#81ecff]">swap_horiz</span>
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">To</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none">
              {CHAINS.map(c => <option key={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Amount (ETH)</label>
          <input value={amount} onChange={e => setAmount(e.target.value)} className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#81ecff]/50" />
        </div>
        <div className="rounded-xl bg-black/30 border border-white/8 p-3 space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-slate-500">Bridge fee</span><span className="text-white">~0.002 ETH</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Est. time</span><span className="text-[#69f6b8]">~2 min</span></div>
          <div className="flex justify-between"><span className="text-slate-500">You receive</span><span className="text-[#81ecff] font-bold">{(parseFloat(amount || "0") - 0.002).toFixed(3)} ETH</span></div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-2xl">Cancel</Button>
        <Button onClick={onBridge} className="flex-1 bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl">Bridge Now</Button>
      </div>
    </>
  );
}

export function NFTModal({ nft, onAction }: { nft: NFT; onAction: (msg: string) => void }) {
  const [listed, setListed] = useState(false);
  return (
    <>
      <div className="rounded-2xl mb-4 h-40 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${nft.color}22, #0f1318)`, border: `1px solid ${nft.color}33` }}>
        <div className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border bg-black/60 backdrop-blur-md z-0" style={{ color: nft.color, borderColor: `${nft.color}40` }}>
          {nft.rarity}
        </div>
        <span className="material-symbols-outlined text-7xl" style={{ color: nft.color }}>image</span>
      </div>
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-lg font-black text-white font-headline">{nft.name} {nft.id}</h2>
        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${nft.color}22`, color: nft.color }}>{nft.collection}</span>
      </div>
      <p className="text-xs text-slate-500 mb-4">Floor price: <span className="text-white font-bold">{nft.floor}</span></p>
      
      <div className="grid grid-cols-2 gap-2 mb-6 text-xs">
        {[["Token ID", nft.id], ["Standard", "ERC-721"], ["Chain", "Ethereum"], ["Royalty", "5%"]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-black/30 border border-white/8 p-2 flex justify-between">
            <span className="text-slate-500">{k}</span>
            <span className="text-white font-mono font-bold">{v}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onAction(`Initiated transfer of ${nft.name} to new address.`)} 
            className="w-full border border-white/10 text-slate-300 hover:text-white rounded-2xl text-xs"
          >
            <span className="material-symbols-outlined text-sm mr-2">send</span> Transfer
          </Button>
          <Button
            onClick={() => setListed(!listed)}
            className="w-full rounded-2xl text-xs font-bold transition-all"
            style={{ background: listed ? "#69f6b822" : nft.color, color: listed ? "#69f6b8" : "#003840", border: listed ? "1px solid #69f6b8" : "none" }}
          >
            <span className="material-symbols-outlined text-sm mr-2">{listed ? "check" : "storefront"}</span>
            {listed ? "Listed" : "List Asset"}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="ghost" 
            onClick={() => onAction(`${nft.name} has been set as your global Web3 avatar.`)} 
            className="w-full border border-white/10 text-slate-300 hover:text-white rounded-2xl text-xs"
          >
            <span className="material-symbols-outlined text-sm mr-2">account_circle</span> Set Avatar
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onAction(`WARNING: ${nft.name} was sent to the burn address.`)} 
            className="w-full border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-2xl text-xs"
          >
            <span className="material-symbols-outlined text-sm mr-2">local_fire_department</span> Burn Token
          </Button>
        </div>
      </div>
    </>
  );
}

export function StakeModal({ protocol, onClose, onStake }: { protocol: Protocol; onClose: () => void; onStake: () => void }) {
  const [amount, setAmount] = useState("0.5");
  return (
    <>
      <h2 className="text-lg font-black text-white mb-1 font-headline">Stake in {protocol.name}</h2>
      <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest">Liquid staking protocol</p>
      <div className="flex gap-3 mb-4">
        <div className="flex-1 rounded-2xl bg-black/30 border border-white/8 p-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">APY</p>
          <p className="text-xl font-black" style={{ color: protocol.color }}>{protocol.apy}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-black/30 border border-white/8 p-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">TVL</p>
          <p className="text-xl font-black text-white">{protocol.tvl}</p>
        </div>
        <div className="flex-1 rounded-2xl bg-black/30 border border-white/8 p-3 text-center">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Staked</p>
          <p className="text-xl font-black text-white">{protocol.staked}</p>
        </div>
      </div>
      <div className="mb-4">
        <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Amount to stake (ETH)</label>
        <div className="flex gap-2">
          <input value={amount} onChange={e => setAmount(e.target.value)} className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#81ecff]/50" />
          <button onClick={() => setAmount("3.41")} className="text-[10px] px-3 rounded-xl border border-white/10 text-slate-400 hover:text-[#81ecff] hover:border-[#81ecff]/30 transition-all">MAX</button>
        </div>
      </div>
      <div className="rounded-xl bg-black/30 border border-white/8 p-3 mb-4 space-y-1 text-xs">
        <div className="flex justify-between"><span className="text-slate-500">Est. yearly yield</span><span style={{ color: protocol.color }} className="font-bold">+{(parseFloat(amount || "0") * parseFloat(protocol.apy) / 100).toFixed(4)} ETH</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Unlock period</span><span className="text-white">7 days</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Protocol fee</span><span className="text-white">0.1%</span></div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-2xl">Cancel</Button>
        <Button onClick={onStake} className="flex-1 font-bold rounded-2xl transition-all" style={{ background: protocol.color, color: "#003840" }}>Stake ETH</Button>
      </div>
    </>
  );
}

export function TxSuccessModal({ onClose, message }: { onClose: () => void; message: string }) {
  const hash = useMemo(() => {
    return "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
  }, []);

  return (
    <div className="text-center py-2">
      <div className="w-16 h-16 rounded-full bg-[#69f6b8]/15 border border-[#69f6b8]/30 flex items-center justify-center mx-auto mb-4">
        <span className="material-symbols-outlined text-3xl text-[#69f6b8]">check_circle</span>
      </div>
      <h2 className="text-lg font-black text-white mb-1 font-headline">Transaction Sent</h2>
      <p className="text-xs text-slate-400 mb-4">{message}</p>
      <div className="rounded-xl bg-black/40 border border-white/8 px-4 py-2 mb-5 text-xs font-mono text-slate-400">
        {hash}
      </div>
      <Button onClick={onClose} className="w-full bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl">Done</Button>
    </div>
  );
}

export function DisconnectModal({ onClose, onDisconnect }: { onClose: () => void; onDisconnect: () => void }) {
  return (
    <>
      <div className="text-center py-2">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl text-red-400">link_off</span>
        </div>
        <h2 className="text-lg font-black text-white mb-2 font-headline">Disconnect Wallet?</h2>
        <p className="text-xs text-slate-500 mb-6">0x3fA2...9b1C will be removed from this session.</p>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1 border border-white/10 text-slate-400 hover:text-white rounded-2xl">Keep Connected</Button>
          <Button onClick={onDisconnect} className="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-bold rounded-2xl">Disconnect</Button>
        </div>
      </div>
    </>
  );
}
