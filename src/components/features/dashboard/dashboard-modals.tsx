import type { Market, BankDetails, DashboardMarket } from "@/types/crypto";
import { X, ArrowUpRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DashboardModalsProps {
  activeModal: 'send' | 'stake' | 'sell' | null;
  setActiveModal: (modal: 'send' | 'stake' | 'sell' | null) => void;
  selectedAsset: Market | null;
  triggerTransaction: (amount: number, type: 'buy' | 'send' | 'stake') => void;
  sellAsset?: (symbol: string, amount: number, bankDetails: BankDetails) => void;
}

export const DashboardModals = ({ activeModal, setActiveModal, selectedAsset, triggerTransaction, sellAsset }: DashboardModalsProps) => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountName: "",
    bankName: "",
    iban: "",
    swift: "",
    amount: ""
  });

  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Animated Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={() => setActiveModal(null)} 
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#101417] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
        <button 
          onClick={() => setActiveModal(null)}
          className="absolute top-8 right-8 text-[#a9abaf] hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {activeModal === 'send' && (
          <div className="space-y-8">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#81ecff]/10 flex items-center justify-center mb-6">
                <ArrowUpRight className="text-[#81ecff] h-6 w-6" />
              </div>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Send Assets</h2>
              <p className="text-[#a9abaf] text-sm mt-2">Transfer funds instantly to any cryptographic address.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Recipient Address</label>
                <input placeholder="0x... or ENS name" className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Amount (USD)</label>
                <div className="relative">
                  <input placeholder="0.00" type="number" className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#81ecff]">MAX</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => { triggerTransaction(2500, 'send'); setActiveModal(null); }} 
              className="w-full bg-[#81ecff] text-[#003840] font-bold py-7 rounded-2xl hover:scale-[0.98] transition-all text-base shadow-lg shadow-[#81ecff]/10"
            >
              Authorize Transfer
            </Button>
          </div>
        )}

        {activeModal === 'stake' && (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-[#69f6b8]/10 flex items-center justify-center">
                <Zap className="text-[#69f6b8] h-8 w-8" />
              </div>
              <div>
                <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Yield Vault</h2>
                <p className="text-[#a9abaf] text-sm">Lock assets to earn protocol rewards.</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#1c2024] p-5 rounded-2xl border border-white/5">
                <span className="text-sm font-medium text-[#a9abaf]">Variable APY</span>
                <span className="text-xl font-bold text-[#69f6b8]">12.42%</span>
              </div>
              <div className="flex justify-between items-center bg-[#1c2024] p-5 rounded-2xl border border-white/5">
                <span className="text-sm font-medium text-[#a9abaf]">Staking Period</span>
                <span className="text-xl font-bold text-white">Flexi-Lock</span>
              </div>
            </div>
            <div className="p-4 bg-[#81ecff]/5 border border-[#81ecff]/10 rounded-2xl">
              <p className="text-[10px] leading-relaxed text-[#81ecff]/80 font-medium">
                Note: Staked assets contribute to network security. Withdrawals are subject to a 24h unbonding period.
              </p>
            </div>
            <Button 
              onClick={() => { triggerTransaction(0, 'stake'); setActiveModal(null); }} 
              className="w-full bg-white text-black font-bold py-7 rounded-2xl hover:bg-[#f8f9fe]/90 transition-all shadow-xl shadow-white/5"
            >
              Start Earning
            </Button>
          </div>
        )}

        {activeModal === 'sell' && selectedAsset && (
          <div className="space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#ff716c]/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#ff716c] text-3xl">account_balance</span>
              </div>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Sell {selectedAsset.ticker}</h2>
              <p className="text-[#a9abaf] text-sm mt-2">Liquidate assets directly to your bank account.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Account Holder Name</label>
                <input 
                  placeholder="John Doe" 
                  value={bankDetails.accountName}
                  onChange={e => setBankDetails({...bankDetails, accountName: e.target.value})}
                  className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#ff716c]/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Bank Name</label>
                <input 
                  placeholder="Global Reserve Bank" 
                  value={bankDetails.bankName}
                  onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})}
                  className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#ff716c]/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">IBAN / Account Number</label>
                <input 
                  placeholder="GB12 3456 7890 ..." 
                  value={bankDetails.iban}
                  onChange={e => setBankDetails({...bankDetails, iban: e.target.value})}
                  className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#ff716c]/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">SWIFT / BIC Code</label>
                <input 
                  placeholder="CHASEUS33 ..." 
                  value={bankDetails.swift}
                  onChange={e => setBankDetails({...bankDetails, swift: e.target.value})}
                  className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#ff716c]/50 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1">Amount to Sell ({selectedAsset.ticker})</label>
                <div className="relative">
                  <input 
                    placeholder="0.00" 
                    type="number" 
                    value={bankDetails.amount}
                    onChange={e => setBankDetails({...bankDetails, amount: e.target.value})}
                    className="w-full bg-[#1c2024] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#ff716c]/50 transition-all" 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#ff716c] cursor-pointer" onClick={() => setBankDetails({...bankDetails, amount: (selectedAsset as DashboardMarket).balance.toString()})}>MAX</span>
                </div>
              </div>
            </div>

            <Button 
              disabled={!bankDetails.amount || !bankDetails.iban}
              onClick={() => { 
                sellAsset?.(selectedAsset.ticker, parseFloat(bankDetails.amount), bankDetails); 
                setActiveModal(null); 
              }} 
              className="w-full bg-[#ff716c] text-white font-bold py-7 rounded-2xl hover:scale-[0.98] transition-all text-base shadow-lg shadow-[#ff716c]/10"
            >
              Confirm Bank Transfer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
