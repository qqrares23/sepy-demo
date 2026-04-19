import { useBlockNumber, useGasPrice } from 'wagmi';
import { formatUnits } from 'viem';

export function Web3Header() {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const { data: gasPriceResult } = useGasPrice({ watch: true });

  const gasPrice = gasPriceResult 
    ? Math.round(Number(formatUnits(gasPriceResult, 9)))
    : '...';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-[#81ecff]">cloud</span>
          Web3 Console
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-[0.3em]">On-chain operations · Vault.OS</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0f1318] px-4 py-2 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#69f6b8] animate-pulse" />
          <span className="text-slate-400">Block</span>
          <span className="font-mono text-[#69f6b8]">{blockNumber?.toString() || '...'}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0f1318] px-4 py-2 text-xs">
          <span className="material-symbols-outlined text-sm text-[#f9ca24]">local_gas_station</span>
          <span className="font-mono text-[#f9ca24]">{gasPrice} gwei</span>
        </div>
      </div>
    </div>
  );
}
