interface MarketHeaderProps {
  viewMode: "real-time" | "snapshot";
  setViewMode: (mode: "real-time" | "snapshot") => void;
}

export const MarketHeader = ({ viewMode, setViewMode }: MarketHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight">
          Market Intelligence
        </h1>
        <p className="text-[#a9abaf] max-w-xl font-medium text-sm md:text-base leading-relaxed">
          Institutional-grade monitoring of cryptographic asset flows and liquidity depths.
        </p>
      </div>
      <div className="flex items-center gap-2 md:gap-3 bg-[#1c2024] p-1 rounded-xl border border-white/5 self-start md:self-auto">
        <button
          onClick={() => setViewMode("real-time")}
          className={`px-4 md:px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            viewMode === "real-time" 
              ? "bg-[#81ecff] text-[#003840] shadow-lg shadow-[#81ecff]/10" 
              : "text-[#a9abaf] hover:text-[#f8f9fe]"
          }`}
        >
          Real-Time
        </button>
        <button
          onClick={() => setViewMode("snapshot")}
          className={`px-4 md:px-6 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            viewMode === "snapshot" 
              ? "bg-[#af88ff] text-[#101417] shadow-lg shadow-[#af88ff]/10" 
              : "text-[#a9abaf] hover:text-[#f8f9fe]"
          }`}
        >
          Snapshot
        </button>
      </div>
    </div>
  );
};
