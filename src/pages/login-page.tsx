import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
  </svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a.75.75 0 0 0-.22.53v2.25c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75V17.25h1.5a.75.75 0 0 0 .75-.75V15h1.5a.75.75 0 0 0 .53-.22l.5-.5a.75.75 0 0 0 .22-.53V12.5a6.75 6.75 0 0 0 4.5-11Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
      <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM21.25 17.25l-3.697-3.697A5.25 5.25 0 0 1 6.75 12c0-.887.22-1.722.608-2.453L4.5 6.697a11.218 11.218 0 0 0-2.176 4.304.75.75 0 0 0 0 .494c1.49 4.47 5.705 7.697 10.676 7.697 1.808 0 3.516-.457 5.002-1.263l1.374 1.374a.75.75 0 1 0 1.06-1.06Z" />
    </svg>
  );

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.704-3.08Z" clipRule="evenodd" />
  </svg>
);

const SecurityIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.307 4.491 4.491 0 0 1-1.307-3.497A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.491 4.491 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);

const HubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" clipRule="evenodd" />
    <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
  </svg>
);

const badges = [
  { icon: <ShieldIcon />, label: "AES-256 Bit" },
  { icon: <SecurityIcon />, label: "Biometric Ready" },
  { icon: <HubIcon />, label: "Multi-Chain" },
];

export default function VaultLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col bg-[#0b0e11] text-[#f8f9fe] overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: "rgba(129,236,255,0.05)" }} />
        <div className="absolute -bottom-[5%] -left-[5%] w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(175,136,255,0.05)" }} />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-10 w-full">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)",
              boxShadow: "0 0 20px rgba(129,236,255,0.3)",
            }}
          >
            <span style={{ color: "#003840" }}>
              <LockIcon />
            </span>
          </div>
          <span
            className="text-2xl font-bold uppercase tracking-[0.2em]"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f8f9fe" }}
          >
            Vault
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 -mt-10">
        <div className="w-full max-w-[480px]">
          {/* Card */}
          <div
            className="p-8 md:p-12"
            style={{
              background: "rgba(34,38,43,0.6)",
              backdropFilter: "blur(24px)",
              borderRadius: "2rem",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            }}
          >
            <div className="mb-10">
              <h1
                className="text-4xl font-bold tracking-tight mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Welcome back.
              </h1>
              <p className="font-light" style={{ color: "#a9abaf" }}>
                Access your digital assets with high-security encryption.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label
                  className="text-[10px] font-medium uppercase tracking-widest px-1"
                  style={{ color: "#a9abaf" }}
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#737679" }}
                  >
                    <EmailIcon />
                  </span>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    className="h-14 pl-11 pr-4 rounded-xl border-0 text-sm"
                    style={{
                      background: "rgba(34,38,43,0.9)",
                      color: "#f8f9fe",
                      outline: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <Label
                    className="text-[10px] font-medium uppercase tracking-widest"
                    style={{ color: "#a9abaf" }}
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="text-xs font-medium transition-colors hover:underline"
                    style={{ color: "#81ecff" }}
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative group">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#737679" }}
                  >
                    <KeyIcon />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="h-14 pl-11 pr-12 rounded-xl border-0 text-sm"
                    style={{
                      background: "rgba(34,38,43,0.9)",
                      color: "#f8f9fe",
                      outline: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-white"
                    style={{ color: "#737679" }}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  onClick={() => navigate("/")}
                  className="w-full h-14 rounded-xl font-bold text-base tracking-wider flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)",
                    color: "#003840",
                    fontFamily: "'Space Grotesk', sans-serif",
                    boxShadow: "0 20px 40px rgba(0,229,255,0.15)",
                    border: "none",
                    letterSpacing: "0.1em",
                  }}
                >
                  Login to Vault
                  <ArrowRightIcon />
                </Button>
              </div>
            </div>

            {/* Divider + sign up */}
            <div
              className="mt-10 pt-8 text-center"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm" style={{ color: "#a9abaf" }}>
                New to the cryptographic era?{" "}
                <Link
                  to="/register"
                  className="font-semibold hover:underline ml-1"
                  style={{ color: "#69f6b8" }}
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Trust badges */}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-8 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "#737679" }}>
          © 2026 Vault Financial Systems. Secured by Decentralized Infrastructure.
        </p>
      </footer>

    </div>
  );
}