import type { Chain, ModalType } from "@/types/web3";
import { Button } from "@/components/ui/button";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useEnsName } from 'wagmi';

interface WalletCardProps {
  chains: Chain[];
  setModal: (modal: ModalType) => void;
}

export function WalletCard({ chains, setModal }: WalletCardProps) {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });

  const displayName = ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "No wallet");

  return (
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
                {displayName}
              </p>
              {isConnected && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#69f6b8]/15 text-[#69f6b8] border border-[#69f6b8]/20">
                  CONNECTED
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isConnected ? "Live Connection · Mainnet" : "Connect a wallet to get started"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected = ready && account && chain;

              if (!connected) {
                return (
                  <Button 
                    onClick={openConnectModal} 
                    className="bg-[#81ecff] text-[#003840] font-bold hover:bg-[#69f6b8] rounded-2xl gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm">add_link</span> Connect
                  </Button>
                );
              }

              return (
                <div className="flex gap-2">
                  <Button 
                    onClick={openChainModal} 
                    variant="ghost" 
                    className="border border-white/10 text-slate-300 hover:text-[#81ecff] rounded-2xl text-xs gap-1.5"
                  >
                    {chain.name}
                  </Button>
                  <Button 
                    onClick={openAccountModal} 
                    variant="ghost" 
                    className="border border-white/10 text-slate-300 hover:text-[#81ecff] rounded-2xl text-xs gap-1.5"
                  >
                    {account.displayName}
                  </Button>
                </div>
              );
            }}
          </ConnectButton.Custom>
          {isConnected && (
            <Button onClick={() => setModal("sign")} variant="ghost" className="border border-white/10 text-slate-300 hover:text-[#81ecff] hover:border-[#81ecff]/30 rounded-2xl text-xs gap-1.5 hidden sm:flex">
              <span className="material-symbols-outlined text-sm">edit</span> Sign
            </Button>
          )}
        </div>
      </div>

      {isConnected && chains.length > 0 && (
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {chains.map((chain) => (
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
  );
}
