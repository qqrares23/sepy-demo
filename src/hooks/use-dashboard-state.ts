import { useState } from "react";

export function useDashboardState() {
  const [activeRange, setActiveRange] = useState("1D");
  const [activeModal, setActiveModal] = useState<'send' | 'stake' | 'sell' | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  return {
    activeRange,
    setActiveRange,
    activeModal,
    setActiveModal,
    selectedAsset,
    setSelectedAsset,
  };
}
