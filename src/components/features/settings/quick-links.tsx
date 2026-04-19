export function QuickLinks() {
  return (
    <nav className="space-y-3">
      {[
        { icon: "person", label: "Profile Details", color: "text-[#81ecff]", active: true },
        { icon: "security", label: "Security Matrix", color: "text-[#a9abaf]", active: false },
        { icon: "notifications", label: "Alert Prefs", color: "text-[#a9abaf]", active: false },
      ].map((item) => (
        <button
          key={item.label}
          className={`w-full p-5 rounded-2xl flex items-center justify-between group transition-all ${
            item.active ? "bg-[#1c2024] border border-white/10" : "hover:bg-[#161a1e] border border-transparent hover:border-white/5"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#101417] border border-white/5 ${item.active ? item.color : "text-[#a9abaf]"}`}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
            </div>
            <span className={`font-headline font-bold text-sm ${item.active ? "text-[#f8f9fe]" : "text-[#a9abaf] group-hover:text-[#f8f9fe]"}`}>
              {item.label}
            </span>
          </div>
          <span className="material-symbols-outlined text-[#45484c] group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
      ))}
    </nav>
  );
}
