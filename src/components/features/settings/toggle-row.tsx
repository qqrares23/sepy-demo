import { Switch } from "@/components/ui/switch";

export function ToggleRow({
  id,
  icon,
  iconColor,
  title,
  description,
  checked,
  disabled,
}: {
  id: string;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-6 bg-[#161a1e] rounded-2xl border border-white/5 group hover:bg-[#1c2024] transition-all">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#101417] border border-white/5 ${iconColor}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
          <p className="font-bold text-[#f8f9fe]">{title}</p>
          <p className="text-xs text-[#a9abaf] font-medium mt-1">{description}</p>
        </div>
      </div>
      <Switch id={id} defaultChecked={checked} disabled={disabled} className="data-[state=checked]:bg-[#81ecff]" />
    </div>
  );
}
