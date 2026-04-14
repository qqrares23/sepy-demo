import { useState } from "react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalType =
  | "connect"
  | "sign"
  | "deploy"
  | "bridge"
  | "nft"
  | "stake"
  | "disconnect"
  | "txSuccess"
  | null;

interface NFT {
  id: string;
  name: string;
  collection: string;
  floor: string;
  color: string;
  rarity: string;
}

interface Protocol {
  name: string;
  apy: string;
  tvl: string;
  icon: string;
  color: string;
  staked: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const NFTS: NFT[] = [
  { id: "#4821", name: "Vault Phantom", collection: "VaultGen", floor: "2.4 ETH", color: "#81ecff", rarity: "Legendary" },
  { id: "#0093", name: "Cipher Node", collection: "CipherDAO", floor: "0.8 ETH", color: "#69f6b8", rarity: "Epic" },
  { id: "#1337", name: "Dark Shard", collection: "Obsidian", floor: "5.1 ETH", color: "#b16cff", rarity: "Mythic" },
  { id: "#8824", name: "Neon Ape", collection: "BoredPunks", floor: "12.0 ETH", color: "#f9ca24", rarity: "Rare" },
  { id: "#0012", name: "Genesis Block", collection: "Founders", floor: "1.2 ETH", color: "#ff7675", rarity: "Common" },
];

const PROTOCOLS: Protocol[] = [
  { name: "LiquidVault", apy: "14.2%", tvl: "$2.1B", icon: "water_drop", color: "#81ecff", staked: "1.42 ETH" },
  { name: "StakeForge", apy: "9.8%", tvl: "$890M", icon: "bolt", color: "#69f6b8", staked: "0.00 ETH" },
  { name: "NexusPool", apy: "22.5%", tvl: "$430M", icon: "hub", color: "#b16cff", staked: "0.55 ETH" },
];

const CHAINS = [
  { name: "Ethereum", symbol: "ETH", icon: "diamond", color: "#81ecff", balance: "3.41" },
  { name: "Arbitrum", symbol: "ARB", icon: "speed", color: "#69f6b8", balance: "120.8" },
  { name: "Base", symbol: "BASE", icon: "layers", color: "#b16cff", balance: "0.92" },
  { name: "Polygon", symbol: "MATIC", icon: "hexagon", color: "#f9ca24", balance: "512.0" },
];

// ─── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
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

// ─── Modals content ────────────────────────────────────────────────────────────
function ConnectModal({ onClose, onConnect }: { onClose: () => void; onConnect: () => void }) {
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

function SignModal({ onClose, onSign }: { onClose: () => void; onSign: () => void }) {
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

function DeployModal({ onClose, onDeploy }: { onClose: () => void; onDeploy: () => void }) {
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

function BridgeModal({ onClose, onBridge }: { onClose: () => void; onBridge: () => void }) {
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

function NFTModal({ nft, onClose, onAction }: { nft: NFT; onClose: () => void, onAction: (msg: string) => void }) {
  const [listed, setListed] = useState(false);
  return (
    <>
      <div className="rounded-2xl mb-4 h-40 flex items-center justify-center relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${nft.color}22, #0f1318)`, border: `1px solid ${nft.color}33` }}>
        {/* Moved badge to top-left to avoid close button overlap */}
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

function StakeModal({ protocol, onClose, onStake }: { protocol: Protocol; onClose: () => void; onStake: () => void }) {
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

function TxSuccessModal({ onClose, message }: { onClose: () => void; message: string }) {
  const hash = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6);
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

function DisconnectModal({ onClose, onDisconnect }: { onClose: () => void; onDisconnect: () => void }) {
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Web3Page() {
  const [modal, setModal] = useState<ModalType>(null);
  const [connected, setConnected] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [txMessage, setTxMessage] = useState("");
  const [gasPrice] = useState("24");
  const [blockNumber] = useState("19_847_203");

  const openTxSuccess = (msg: string) => {
    setTxMessage(msg);
    setModal("txSuccess");
  };

  return (
    <div className="min-h-screen text-white md:pl-72 pb-24 md:pb-0">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white font-headline flex items-center gap-2">
              <span className="material-symbols-outlined text-[#81ecff]">cloud</span>
              Web3 Console
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-[0.3em]">On-chain operations · Vault.OS</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Network status pill */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0f1318] px-4 py-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#69f6b8] animate-pulse" />
              <span className="text-slate-400">Block</span>
              <span className="font-mono text-[#69f6b8]">{blockNumber}</span>
            </div>
            {/* Gas */}
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0f1318] px-4 py-2 text-xs">
              <span className="material-symbols-outlined text-sm text-[#f9ca24]">local_gas_station</span>
              <span className="font-mono text-[#f9ca24]">{gasPrice} gwei</span>
            </div>
          </div>
        </div>

        {/* ── Wallet Card ── */}
        <div
          className="relative rounded-3xl border border-white/8 overflow-hidden p-6"
          style={{ background: "linear-gradient(135deg, #0f1318 60%, #81ecff0a)" }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: "#81ecff", transform: "translate(30%, -30%)" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#81ecff]/10 border border-[#81ecff]/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-[#81ecff]">account_balance_wallet</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-white font-headline text-lg">
                    {connected ? "0x3fA2...9b1C" : "No wallet"}
                  </p>
                  {connected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#69f6b8]/15 text-[#69f6b8] border border-[#69f6b8]/20">
                      CONNECTED
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {connected ? "MetaMask · Ethereum Mainnet" : "Connect a wallet to get started"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {connected ? (
                <>
                  <Button onClick={() => setModal("sign")} variant="ghost" className="border border-white/10 text-slate-300 hover:text-[#81ecff] hover:border-[#81ecff]/30 rounded-2xl text-xs gap-1.5">
                    <span className="material-symbols-outlined text-sm">edit</span> Sign
                  </Button>
                  <Button onClick={() => setModal("disconnect")} variant="ghost" className="border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-2xl text-xs gap-1.5">
                    <span className="material-symbols-outlined text-sm">link_off</span> Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={() => setModal("connect")} className="bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl gap-1.5">
                  <span className="material-symbols-outlined text-sm">add_link</span> Connect
                </Button>
              )}
            </div>
          </div>

          {connected && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CHAINS.map((chain) => (
                <div key={chain.name} className="rounded-2xl bg-black/30 border border-white/8 p-3">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="material-symbols-outlined text-sm" style={{ color: chain.color }}>{chain.icon}</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">{chain.name}</span>
                  </div>
                  <p className="font-mono font-black text-white text-sm">{chain.balance}</p>
                  <p className="text-[10px] text-slate-600">{chain.symbol}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Bridge", icon: "swap_horizontal_circle", color: "#81ecff", action: () => setModal("bridge") },
              { label: "Deploy", icon: "rocket_launch", color: "#b16cff", action: () => setModal("deploy") },
              { label: "Connect", icon: "add_link", color: "#69f6b8", action: () => setModal("connect") },
              { label: "Sign Msg", icon: "draw", color: "#f9ca24", action: () => setModal("sign") },
            ].map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-[#0f1318] py-5 hover:border-white/20 hover:bg-white/4 active:scale-95 transition-all duration-200 group"
              >
                <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:scale-110" style={{ color: a.color }}>{a.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── NFT Vault ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">NFT Vault</p>
            <span className="text-[10px] text-slate-600 font-mono">{NFTS.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {NFTS.map((nft) => (
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
        </div>

        {/* ── DeFi Staking ── */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-3 mt-4">DeFi Protocols</p>
          <div className="space-y-3">
            {PROTOCOLS.map((p) => (
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
        </div>

        {/* ── Raw TX Builder ── */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-3">Raw Transaction</p>
          <div className="rounded-3xl border border-white/8 bg-[#0f1318] p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">To Address</label>
                <input defaultValue="0xAbC1...4d2F" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#81ecff]/50" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Value (ETH)</label>
                <input defaultValue="0.01" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#81ecff]/50" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] uppercase tracking-widest text-slate-500 mb-1 block">Data (hex)</label>
                <input defaultValue="0x" className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono outline-none focus:border-[#81ecff]/50" />
              </div>
            </div>
            <Button
              onClick={() => openTxSuccess("Raw transaction broadcast to Ethereum mainnet.")}
              className="bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl gap-2 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              Broadcast Transaction
            </Button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === "connect" && (
        <Modal onClose={() => setModal(null)}>
          <ConnectModal onClose={() => setModal(null)} onConnect={() => { setConnected(true); setModal(null); }} />
        </Modal>
      )}
      {modal === "sign" && (
        <Modal onClose={() => setModal(null)}>
          <SignModal onClose={() => setModal(null)} onSign={() => openTxSuccess("Message signed and verified on-chain.")} />
        </Modal>
      )}
      {modal === "deploy" && (
        <Modal onClose={() => setModal(null)}>
          <DeployModal onClose={() => setModal(null)} onDeploy={() => openTxSuccess("Contract deployed at 0x9fE3...2aB7")} />
        </Modal>
      )}
      {modal === "bridge" && (
        <Modal onClose={() => setModal(null)}>
          <BridgeModal onClose={() => setModal(null)} onBridge={() => openTxSuccess("Bridge initiated. Funds arriving in ~2 minutes.")} />
        </Modal>
      )}
      {modal === "nft" && selectedNFT && (
        <Modal onClose={() => setModal(null)}>
          <NFTModal 
            nft={selectedNFT} 
            onClose={() => setModal(null)} 
            onAction={openTxSuccess} 
          />
        </Modal>
      )}
      {modal === "stake" && selectedProtocol && (
        <Modal onClose={() => setModal(null)}>
          <StakeModal protocol={selectedProtocol} onClose={() => setModal(null)} onStake={() => openTxSuccess(`Staked ETH in ${selectedProtocol.name} successfully.`)} />
        </Modal>
      )}
      {modal === "disconnect" && (
        <Modal onClose={() => setModal(null)}>
          <DisconnectModal onClose={() => setModal(null)} onDisconnect={() => { setConnected(false); setModal(null); }} />
        </Modal>
      )}
      {modal === "txSuccess" && (
        <Modal onClose={() => setModal(null)}>
          <TxSuccessModal onClose={() => setModal(null)} message={txMessage} />
        </Modal>
      )}
    </div>
  );
}