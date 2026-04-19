import type { Transaction } from "@/types/transaction";

interface TransactionModalProps {
  tx: Transaction;
  onClose: () => void;
}

export function TransactionModal({ tx, onClose }: TransactionModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0b0e11]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#161a1e] w-full max-w-lg rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#81ecff]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h3 className="font-headline font-bold text-2xl text-[#f8f9fe]">Ledger Inspector</h3>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#101417] flex items-center justify-center text-[#a9abaf] hover:text-white transition-colors border border-white/5">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="flex flex-col items-center py-8 bg-[#101417] rounded-3xl border border-white/5">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 mb-4 ${tx.status === 'Completed' ? 'bg-[#69f6b8]/10 border-[#69f6b8]/20 text-[#69f6b8]' : 'bg-[#81ecff]/10 border-[#81ecff]/20 text-[#81ecff]'}`}>
              <span className="material-symbols-outlined text-4xl">{tx.status === 'Completed' ? 'verified' : 'sync'}</span>
            </div>
            <p className="text-3xl font-headline font-bold text-[#f8f9fe]">{tx.amount}</p>
            <p className="text-sm text-[#a9abaf] font-bold uppercase tracking-widest mt-1">{tx.value} USD</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Internal Hash", value: tx.id },
              { label: "Protocol Action", value: tx.type },
              { label: "Origin Source", value: tx.from },
              { label: "Destination", value: tx.to },
              { label: "Network Fee", value: tx.gas },
              { label: "Finality Status", value: tx.status, color: tx.status === 'Completed' ? "text-[#69f6b8]" : "text-[#81ecff]" }
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-4 bg-[#101417] rounded-2xl border border-white/5">
                <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">{item.label}</span>
                <span className={`text-xs font-mono font-bold ${item.color || "text-[#f8f9fe]"}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
