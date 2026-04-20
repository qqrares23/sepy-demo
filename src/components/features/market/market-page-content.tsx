import type { Asset } from "@/types/crypto";
import { MarketHeader } from "./market-header";
import { MarketChartSection } from "./market-chart-section";
import { AssetTable } from "./asset-table";
import { QuickExecutionCard } from "./quick-execution-card";
import { NetworkStateCard } from "./network-state-card";
import { TradeModal } from "./trade-modal";

interface MarketPageContentProps {
  prices: any;
  history: any[];
  viewMode: "real-time" | "snapshot";
  setViewMode: (mode: "real-time" | "snapshot") => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  assets: Asset[];
  onAddSymbol?: (symbol: string) => void;
  searchSymbol?: (query: string) => Promise<string | null>;
}

export function MarketPageContent({
  prices,
  history,
  viewMode,
  setViewMode,
  selectedAsset,
  setSelectedAsset,
  assets,
  onAddSymbol,
  searchSymbol,
}: MarketPageContentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      {selectedAsset && (
        <TradeModal 
          asset={selectedAsset} 
          price={prices[selectedAsset.ticker as keyof typeof prices] || 0} 
          onClose={() => setSelectedAsset(null)} 
        />
      )}

      <MarketHeader viewMode={viewMode} setViewMode={setViewMode} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className={`${viewMode === "snapshot" ? "lg:col-span-8" : "lg:col-span-12"} space-y-8 transition-all duration-500`}>
          <MarketChartSection prices={prices} />
          <AssetTable 
            assets={assets} 
            history={history} 
            prices={prices} 
            setSelectedAsset={setSelectedAsset} 
            onAddSymbol={onAddSymbol}
            searchSymbol={searchSymbol}
          />
        </div>

        {viewMode === "snapshot" && (
          <div className="lg:col-span-4 space-y-8 animate-in slide-in-from-right duration-500">
            <QuickExecutionCard prices={prices} />
            <NetworkStateCard />
          </div>
        )}
      </div>

      {/* Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-[#81ecff]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[200px] md:w-[600px] h-[200px] md:h-[600px] bg-[#af88ff]/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none opacity-50" />
    </div>
  );
}
