import { Wallet, ShieldCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useEnsName } from "wagmi";

interface ActiveWalletCardProps {
  onLink: () => void;
  isLinked: boolean;
}

export function ActiveWalletCard({ onLink, isLinked }: ActiveWalletCardProps) {
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });

  return (
    <div className="bg-[#101417] rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden h-full shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#81ecff]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#81ecff]/10 flex items-center justify-center border border-[#81ecff]/20">
              <Wallet className="h-6 w-6 text-[#81ecff]" />
            </div>
            <span className="text-[10px] font-bold text-[#81ecff] uppercase tracking-[0.2em]">Active Connection</span>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-[#69f6b8] animate-pulse' : 'bg-slate-700'}`} />
                <span className="text-sm font-bold text-white">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>

            {isConnected && (
              <>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Identity</p>
                  <p className="font-mono text-sm text-white truncate">{ensName || address}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Balance</p>
                  <p className="text-2xl font-headline font-bold text-[#81ecff]">
                    {ethBalance ? `${parseFloat(ethBalance.formatted).toFixed(4)} ${ethBalance.symbol}` : '0.00 ETH'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <Button 
                onClick={openConnectModal}
                className={`w-full h-12 rounded-xl font-bold transition-all ${isConnected ? 'bg-[#1c2024] text-white border border-white/10 hover:bg-white/5' : 'bg-[#81ecff] text-[#003840] hover:bg-[#69f6b8]'}`}
              >
                {isConnected ? 'Change Wallet' : 'Connect Wallet'}
              </Button>
            )}
          </ConnectButton.Custom>

          {isConnected && !isLinked && (
            <Button 
              onClick={onLink}
              className="w-full h-12 rounded-xl bg-[#69f6b8] text-[#003840] font-bold hover:opacity-90 gap-2"
            >
              <Plus className="h-4 w-4" /> Link to Account
            </Button>
          )}
          
          {isLinked && (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#69f6b8]/5 border border-[#69f6b8]/20">
              <ShieldCheck className="h-4 w-4 text-[#69f6b8]" />
              <span className="text-[10px] font-bold text-[#69f6b8] uppercase tracking-widest">Linked & Authorized</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
