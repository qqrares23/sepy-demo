import { CheckBadgeIcon, ShieldLockIcon, KeyIcon } from "./register-icons";

export const RegisterTrustIcons = () => {
  return (
    <div className="mt-8 flex justify-center items-center gap-6 opacity-30">
      {[<CheckBadgeIcon />, <ShieldLockIcon />, <KeyIcon />, <CheckBadgeIcon />].map((ic, i) => (
        <span key={i} className="text-[#81ecff]">
          {ic}
        </span>
      ))}
    </div>
  );
};
