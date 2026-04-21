import type { Market, HistoryPoint, BankDetails, DashboardMarket } from "@/types/crypto";
import { DashboardHeader } from "./dashboard-header";
import { DashboardHero } from "./dashboard-hero";
import { MarketIntelligence } from "./market-intelligence";
import { DashboardModals } from "./dashboard-modals";
import { DashboardNotification } from "./dashboard-notification";

interface DashboardPageContentProps {
  activeRange: string;
  setActiveRange: (range: string) => void;
  activeModal: 'send' | 'stake' | 'sell' | null;
  setActiveModal: (modal: 'send' | 'stake' | 'sell' | null) => void;
  selectedAsset: Market | null;
  setSelectedAsset: (asset: Market | null) => void;
  portfolio: number;
  history: HistoryPoint[];
  markets: DashboardMarket[];
  lastAction: string | null;
  triggerTransaction: (amount: number, type: 'buy' | 'send' | 'stake') => void;
  topUp: (symbol: string, amount: number) => Promise<void>;
  prices: Record<string, number>;
  sellAsset: (symbol: string, amount: number, bankDetails: BankDetails) => void;
  onAddSymbol?: (symbol: string, id?: string) => void;
}

export function DashboardPageContent({
  activeRange,
  setActiveRange,
  activeModal,
  setActiveModal,
  selectedAsset,
  setSelectedAsset,
  portfolio,
  history,
  markets,
  lastAction,
  triggerTransaction,
  topUp,
  prices,
  sellAsset,
  onAddSymbol,
}: DashboardPageContentProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative">
      <style>{`
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      <DashboardNotification lastAction={lastAction} />

      <DashboardHeader activeRange={activeRange} setActiveRange={setActiveRange} />

      <DashboardHero
        portfolio={portfolio}
        history={history}
        activeRange={activeRange}
        setActiveModal={setActiveModal}
        topUp={topUp}
        prices={prices}
        onAddSymbol={onAddSymbol}
      />

      <MarketIntelligence 
        markets={markets} 
        history={history} 
        setSelectedAsset={setSelectedAsset} 
        setActiveModal={setActiveModal} 
      />

      <DashboardModals 
        activeModal={activeModal} 
        setActiveModal={setActiveModal} 
        selectedAsset={selectedAsset} 
        triggerTransaction={triggerTransaction} 
        sellAsset={sellAsset}
      />
    </div>
  );
}
