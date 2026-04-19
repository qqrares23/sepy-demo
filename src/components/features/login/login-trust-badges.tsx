import { ShieldIcon, SecurityIcon, HubIcon } from "./login-icons";

const badges = [
  { icon: <ShieldIcon />, label: "AES-256 Bit" },
  { icon: <SecurityIcon />, label: "Biometric Ready" },
  { icon: <HubIcon />, label: "Multi-Chain" },
];

export const LoginTrustBadges = () => {
  return (
    <div className="mt-8 flex justify-center items-center gap-6 opacity-40">
      {badges.map((b) => (
        <div
          key={b.label}
          className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all cursor-default"
        >
          <span style={{ color: "#81ecff" }}>{b.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#f8f9fe" }}>
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
};
