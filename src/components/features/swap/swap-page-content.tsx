import type { Token, CoinGeckoSearchResult, HistoryPoint } from "@/types/crypto";
import type { SwapTx } from "@/types/transaction";
import type { MarketData } from "@/hooks/use-market-data";
import { SwapDetailsModal } from "./swap-details-modal";
import { SwapCard } from "./swap-card";
import { SwapInfoPanel } from "./swap-info-panel";
import { RecentSwapsTable } from "./recent-swaps-table";
import { DashboardNotification } from "../dashboard/dashboard-notification";

interface SwapPageContentProps {
  prices: Record<string, number>;
  data: MarketData[];
  portfolio: number;
  history: HistoryPoint[];
  payToken: Token;
  receiveToken: Token;
  payAmount: string;
  setPayAmount: (val: string) => void;
  receiveAmount: string;
  handleSwap: () => void;
  isRotating: boolean;
  selectedTx: SwapTx | null;
  setSelectedTx: (tx: SwapTx | null) => void;
  recentSwaps: SwapTx[];
  onPayTokenSelect?: (coin: CoinGeckoSearchResult) => void;
  onReceiveTokenSelect?: (coin: CoinGeckoSearchResult) => void;
  onInitiateSwap?: () => Promise<void>;
  ownedAssets?: CoinGeckoSearchResult[];
  lastAction: string | null;
  onAddSymbol?: (symbol: string, id?: string) => void;
}

export function SwapPageContent({
  prices,
  data,
  portfolio,
  history,
  payToken,
  receiveToken,
  payAmount,
  setPayAmount,
  receiveAmount,
  handleSwap,
  isRotating,
  selectedTx,
  setSelectedTx,
  recentSwaps,
  onPayTokenSelect,
  onReceiveTokenSelect,
  onInitiateSwap,
  ownedAssets,
  lastAction,
  onAddSymbol,
}: SwapPageContentProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <DashboardNotification lastAction={lastAction} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
            Kinetic Swap
          </h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">
            Institutional-grade execution with zero-latency liquidity routing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <SwapCard 
          payToken={payToken}
          receiveToken={receiveToken}
          payAmount={payAmount}
          setPayAmount={setPayAmount}
          receiveAmount={receiveAmount}
          handleSwap={handleSwap}
          isRotating={isRotating}
          onPayTokenSelect={onPayTokenSelect}
          onReceiveTokenSelect={onReceiveTokenSelect}
          onInitiateSwap={onInitiateSwap}
          ownedAssets={ownedAssets}
          onAddSymbol={onAddSymbol}
        />

        <SwapInfoPanel 
          payToken={payToken}
          receiveToken={receiveToken}
          history={history}
          prices={prices}
          data={data}
          portfolio={portfolio}
          payAmount={payAmount}
        />
      </div>

      <RecentSwapsTable 
        recentSwaps={recentSwaps}
        history={history}
        setSelectedTx={setSelectedTx}
      />

      {/* Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none opacity-50" />

      {/* Modals */}
      {selectedTx && (
        <div className="fixed inset-0 z-[9999]">
          <SwapDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
        </div>
      )}
    </div>
  );
}
