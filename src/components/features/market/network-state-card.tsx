export const NetworkStateCard = () => {
  return (
    <div className="bg-[#101417] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-8 border border-white/5 space-y-4 md:space-y-6">
      <h4 className="font-headline font-bold text-base md:text-lg">Network State</h4>
      <div className="space-y-3 md:space-y-4">
        {[
          { label: "Gas Velocity", value: "14.2 Gwei", color: "#69f6b8" },
          { label: "Node Latency", value: "24ms", color: "#81ecff" },
          { label: "Block Delta", value: "+1", color: "#af88ff" }
        ].map((stat) => (
          <div key={stat.label} className="bg-[#161a1e] p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/5 flex items-center justify-between">
            <span className="text-[9px] md:text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">{stat.label}</span>
            <span className="text-xs md:text-sm font-bold" style={{ color: stat.color }}>{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
