import { ShieldLockIcon } from "./register-icons";

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#69f6b8]">
        <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.704-3.08Z" clipRule="evenodd" />
      </svg>
    ),
    title: "Biometric 2FA",
    desc: "Multi-layer encryption",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#81ecff]">
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.718a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .945-.143Z" clipRule="evenodd" />
      </svg>
    ),
    title: "Instant Settling",
    desc: "Zero-lag blockchain sync",
  },
];

export const RegisterBranding = () => {
  return (
    <div className="w-full md:w-1/2 space-y-8">
      {/* Wordmark */}
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(0,229,253,0.15)", border: "1px solid rgba(0,229,253,0.2)" }}
        >
          <span style={{ color: "#81ecff" }}>
            <ShieldLockIcon />
          </span>
        </div>
        <span
          className="text-2xl font-bold tracking-[0.25em] uppercase"
          style={{ color: "#81ecff", textShadow: "0 0 18px rgba(129,236,255,0.35)", fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Vault
        </span>
      </div>

      {/* Hero copy */}
      <div className="space-y-4">
        <h2
          className="text-4xl lg:text-5xl font-bold leading-tight"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Secure your{" "}
          <span className="italic" style={{ color: "#81ecff" }}>
            digital legacy
          </span>{" "}
          in the kinetic vault.
        </h2>
        <p className="text-base leading-relaxed max-w-sm" style={{ color: "#a9abaf" }}>
          Join thousands of investors who trust Vault for institutional-grade security and seamless asset management.
        </p>
      </div>

      {/* Feature pills */}
      <div className="flex flex-col gap-4 pt-2">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "rgba(34,38,43,0.7)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {f.icon}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {f.title}
              </p>
              <p className="text-xs" style={{ color: "#737679" }}>
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Visual asset */}
      <div
        className="mt-10 rounded-full overflow-hidden p-2 max-w-xs"
        style={{ background: "rgba(16,20,23,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhYOpe8sNoDu4IPQuFzJpwGvk951l3PavhxdqZqAyoWIwLB3Itn_B7u0cPNlIYUQlHtLk_lOD5m38TJCm3J3OgmKTxdW9Fz8CPUJV1Gfy7bO2BO4clDdbqIou9ZjMrHH3BUPbddudH-gmdM5v_Yf_JwHLqSFavg-V-bknYEJXUkEICqd2LrQrJ7haevhTDmhVx5kBjO2z3CXn6OH0fOqKUqw3PIeEBtIchPSVVP3xAejg1fS1-BSn_jy1_WLD2z0ePCBwYlPdK13HS"
          alt="abstract blockchain security visualization"
          className="w-full h-44 object-cover rounded-full grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        />
      </div>
    </div>
  );
};
