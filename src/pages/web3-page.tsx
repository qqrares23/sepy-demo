"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// ── Types & Data ─────────────────────────────────────────────────────────────

interface NFT {
  id: string;
  collection: string;
  name: string;
  price: string;
  img: string;
  rarity: string;
  owner: string;
}

const dapps = [
  { name: "Uniswap V3", url: "app.uniswap.org", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjVoUD2nMdHbT5Shk2RvnFDavVNple1--OZyzOJx1BzNC1ktWPr0l2fNpMoU3JG1ej29ZQNQyNGwCOzEk5IMxmLquAByHAYf862IXtQlAWLSC0vPcdCTmD1zFeNWA4cAnrfEKIU7ZuGvkHo5jm_8La9-s5HZKda3tyuo70DfTp7x2Y8CEVW-S21PBmuPnDV7nFx0Q-kD0mBDUOSTvQTm2GpfVuQ6Ccb1RT5t-TkiLbi0NZ2WuD8trEOKwpnTP95ktkwBUd2cXdG5lI" },
  { name: "OpenSea", url: "opensea.io", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuArlxJY4YcGU-y5LKteTtmweCTz3f_zQFGqQepgTVpWL-54JtMrWrx9LGViWbZypOVJTMUMiAaV2nxja-pCi8Yqqx-6aLcYIBB6pNrylng89gruRzRdsvFD8_gv3hHNz5g39dqu9yfCC9Oebq9HIVsMKnlx1EHG59ru_HC3W2fnc-vyKlVjoAEXa27iPL6rwV-TY2vqQhimF9nTPOgc-_Odnp9ovhcKOff7MXnwglmrJFJRWo5KQ2e_C5w0miOmhpCQ-PkAhgFJNdaR" },
];

const nfts: NFT[] = [
  { id: "#8291", collection: "Aether Voids", name: "Chrome Sentinel", price: "4.20 ETH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXrwIx3YNfoqnRtukpA_dyUi7wGhkbvnHnnsIYQfTPvbgTHkM29MW4byuvEObNOfwWt3P0dJGrqIvs9RwLBoZBroNIREo-lszaJWzeGkMZepKqKcu0rwMBkHgSFvWCMWi287_eDkoP45Zaau4bTusPDnRxDosUpNTi9QdkW4Q8O_gML0pwaCGSvGeei5znqMBnePTJUeVx977Sqy5UfUthF9z5EQ5N75jG2jAoVli3RHHg76oIz7kDCnxwNAKwvK2nKBL1mbz_GDJC", rarity: "Legendary", owner: "Nexus_Vault_01" },
  { id: "#0455", collection: "Liquid Genesis", name: "Void Ripple", price: "1.85 ETH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdeDhExPaxkPXVpnjorXeZCPrJTUReuAQVc2AwhWotnpDw_V4MDSzDD-e0Us7QC1_ig5I2Ksi5dryxnvP2tEJxopA8UXGic86hM3vma1tmQeYAncO6DmduKQh1ozh1XZBcDT-w2s_Dwy8LBZ6K0tK6ScDtLBoZRhagmPY22u_XbHAb0LJ-YVBf6ILoBLxZjl6qkKXSknEr9cG38WhODU7qEp_ScXc2-4-035YoVfH66AetqmbbABtc4Sybt64y88s1KiqIRH0S4nSH", rarity: "Rare", owner: "Nexus_Vault_01" },
  { id: "#1120", collection: "Cyber Faunas", name: "Neon Apex", price: "12.4 ETH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSiPeugJlp4DOD1pAqcUlvy_IpygByng1XLlIbYXmBEosa4S9OulKbCJWFTKDA58oGyX0eFzPuzqtA0yYQ7ZKVzyb0UVYBGWYOVijhkoiJ1IJ0s1GDtOCAfmZJhsyF3HmECdBCek9LMqbV1xR-552Kop1DzgchR5_sd2IeRkw9e0huiIGHggi6RvJNYH-Y4227ctwUrPpk-q3o6ugObmMXWx7FeeaVqGJi_gM5SOanDxBOz41ILa1X86U0o1WhmHLZjxJaHwMlMnn7", rarity: "Epic", owner: "Nexus_Vault_01" },
  { id: "#5532", collection: "Meta Horizons", name: "Silent Monolith", price: "0.95 ETH", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVYgVNB9mF9tsB-bKDAeu_dJCexyqRMwxuFxJWuj5hyZBg3qZBAo0yk_Z6Q9XcRRbUZkoDKlaBaDhw-1G9bhWZFB8CSSbyzPQhHwobvZlf61RabkWo9dGaNXNbM54Pe0fo7p2ZNRdSuL8DCve020ifgqFHUefrCE-DdmXDfxuECzwcFC-BWg7ZUdIRSWGlRcrrWoC-RaErG7Z037jAPc86r0NINGBArgxp7XdFHvfEcFMwdHP15umHcFVBdqlptxraz5GVHsSH9NLm", rarity: "Common", owner: "Nexus_Vault_01" },
];

// ── Components ───────────────────────────────────────────────────────────────

function NFTModal({ nft, onClose }: { nft: NFT; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b0e11]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#161a1e] w-full max-w-4xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row h-auto md:h-[600px] relative">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="w-full md:w-1/2 h-64 md:h-full relative overflow-hidden bg-black flex items-center justify-center">
          <img src={nft.img} alt={nft.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161a1e] via-transparent to-transparent" />
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-between space-y-8 overflow-y-auto">
          <div>
            <Badge className="bg-[#81ecff]/10 text-[#81ecff] border-[#81ecff]/20 mb-4 px-3 py-1 rounded-full uppercase tracking-widest text-[10px] font-bold">
              {nft.rarity} Token
            </Badge>
            <h2 className="text-4xl font-headline font-bold text-[#f8f9fe] mb-2">{nft.name}</h2>
            <p className="text-lg text-[#a9abaf] font-medium">{nft.collection} {nft.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#101417] p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest mb-2">Floor Value</p>
              <p className="text-2xl font-headline font-bold text-[#81ecff]">{nft.price}</p>
            </div>
            <div className="bg-[#101417] p-5 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest mb-2">Protocol</p>
              <p className="text-lg font-bold text-[#f8f9fe]">ERC-721</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#101417] rounded-xl border border-white/5">
              <span className="text-xs text-[#a9abaf] font-medium">Provenance</span>
              <span className="text-xs font-mono text-[#81ecff]">{nft.owner}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#101417] rounded-xl border border-white/5">
              <span className="text-xs text-[#a9abaf] font-medium">Chain State</span>
              <span className="text-xs font-bold text-[#69f6b8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#69f6b8]" />
                IMMUTABLE
              </span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 py-7 rounded-2xl bg-gradient-to-r from-[#81ecff] to-[#00d4ec] text-[#003840] font-headline font-bold uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">List for Sale</Button>
            <Button variant="outline" className="flex-1 py-7 rounded-2xl border-white/10 text-white font-headline font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all">Transfer</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendInterface() {
  const [address, setAddress] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <Card className="bg-[#101417] border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#af88ff]/5 rounded-full -ml-16 -mt-16 blur-3xl" />
      <CardContent className="p-0 space-y-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#af88ff]/10 border border-[#af88ff]/20 flex items-center justify-center text-[#af88ff]">
            <span className="material-symbols-outlined text-2xl">send</span>
          </div>
          <div>
            <h3 className="text-xl font-headline font-bold">Transmit Assets</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Peer-to-Peer Transmission</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf] px-1">Recipient Nexus Address</label>
            <Input 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x... or user.vault" 
              className="bg-[#161a1e] border-white/5 rounded-2xl h-14 pl-6 text-sm focus-visible:ring-[#af88ff]/30" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf] px-1">Amount</label>
              <Input placeholder="0.00" className="bg-[#161a1e] border-white/5 rounded-2xl h-14 pl-6 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf] px-1">Asset</label>
              <div className="h-14 rounded-2xl bg-[#161a1e] border border-white/5 flex items-center justify-between px-6 cursor-pointer">
                <span className="text-sm font-bold text-[#f8f9fe]">ETH</span>
                <span className="material-symbols-outlined text-[#a9abaf]">expand_more</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#161a1e] p-4 rounded-2xl border border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#69f6b8] text-sm">bolt</span>
            <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Network Speed</span>
          </div>
          <span className="text-xs font-bold text-[#f8f9fe]">Instant (24 Gwei)</span>
        </div>

        <Button 
          disabled={!address || sending}
          onClick={() => { setSending(true); setTimeout(() => { setSending(false); setAddress(""); }, 2000); }}
          className="w-full py-7 rounded-[2rem] bg-[#af88ff] text-[#101417] font-headline font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#af88ff]/90 transition-all active:scale-95"
        >
          {sending ? "TRANSMITTING..." : "Send Secure Transmission"}
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VaultWeb3() {
  const [activeChain, setActiveChain] = useState("Ethereum");
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {selectedNFT && <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: dApps + Archive */}
        <div className="lg:col-span-8 space-y-12">
          {/* Connected dApps */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#69f6b8] mb-2">Nexus Terminals</p>
                <h1 className="text-4xl font-headline font-bold text-[#f8f9fe]">Connectivity</h1>
              </div>
              <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 rounded-full border-[#69f6b8]/20 bg-[#69f6b8]/5 text-[#69f6b8] font-bold text-[10px] uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-[#69f6b8] animate-pulse" />
                WalletConnect Active
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {dapps.map((dapp) => (
                <Card key={dapp.name} className="border-0 bg-[#101417] border border-white/5 transition-all cursor-pointer hover:bg-[#161a1e] group">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#1c2024] flex items-center justify-center p-3 border border-white/5">
                        <img src={dapp.img} alt={dapp.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="font-headline font-bold text-[#f8f9fe]">{dapp.name}</p>
                        <p className="text-[10px] text-[#a9abaf] uppercase mt-1 font-bold">{dapp.url}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#a9abaf] text-xl">link_off</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* NFT Gallery */}
          <section className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#81ecff] mb-2">Vault Artifacts</p>
                <h1 className="text-4xl font-headline font-bold text-[#f8f9fe]">NFT Archive</h1>
              </div>
              <Tabs value={activeChain} onValueChange={setActiveChain}>
                <TabsList className="p-1 rounded-xl bg-[#1c2024] border border-white/5">
                  {["Ethereum", "Polygon"].map((chain) => (
                    <TabsTrigger
                      key={chain}
                      value={chain}
                      className="rounded-lg text-[10px] font-bold uppercase tracking-widest px-6 py-2 data-[state=active]:bg-[#81ecff] data-[state=active]:text-[#003840]"
                    >
                      {chain}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {nfts.slice(0, 2).map((nft) => (
                <Card
                  key={nft.id}
                  onClick={() => setSelectedNFT(nft)}
                  className="border-0 bg-[#161a1e] border border-white/5 overflow-hidden group transition-all duration-500 hover:border-[#81ecff]/30 cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden bg-black">
                    <img src={nft.img} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <CardContent className="p-6">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#69f6b8] mb-1">{nft.collection}</p>
                    <h3 className="font-headline font-bold text-[#f8f9fe] text-lg">{nft.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Send Card */}
        <div className="lg:col-span-4 sticky top-24">
          <SendInterface />
          
          <div className="mt-8 bg-[#101417] rounded-[2.5rem] p-8 border border-white/5 space-y-6">
            <h4 className="font-headline font-bold text-lg">Nexus Reputation</h4>
            <div className="flex items-end gap-3">
              <span className="text-5xl font-headline font-bold text-[#81ecff]">99.8</span>
              <Badge className="bg-[#69f6b8]/10 text-[#69f6b8] border-none mb-2 uppercase text-[9px] font-bold">Tier 1 Node</Badge>
            </div>
            <p className="text-xs text-[#a9abaf] leading-relaxed">Your account is currently ranked in the top 0.1% of secure nodes within the Nexus network.</p>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
    </div>
  );
}
