import type { ModalType } from "@/types/web3";

export function QuickActions({ setModal }: { setModal: (modal: ModalType) => void }) {
  const actions = [
    { label: "Bridge", icon: "swap_horizontal_circle", color: "#81ecff", action: () => setModal("bridge") },
    { label: "Deploy", icon: "rocket_launch", color: "#b16cff", action: () => setModal("deploy") },
    { label: "Connect", icon: "add_link", color: "#69f6b8", action: () => setModal("connect") },
    { label: "Sign Msg", icon: "draw", color: "#f9ca24", action: () => setModal("sign") },
  ];

  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500 mb-3">Quick Actions</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.action}
            className="flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-[#0f1318] py-5 hover:border-white/20 hover:bg-white/4 active:scale-95 transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:scale-110" style={{ color: a.color }}>{a.icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
