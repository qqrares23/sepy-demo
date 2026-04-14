import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ShieldLockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
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

const CheckBadgeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.307 4.491 4.491 0 0 1-1.307-3.497A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.491 4.491 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
);

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

export default function VaultRegister() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0b0e11] text-[#f8f9fe] font-sans overflow-x-hidden"
      style={{ fontFamily: "'IBM Plex Mono', 'DM Sans', monospace" }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px]" style={{ background: "rgba(129,236,255,0.07)" }} />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full blur-[150px]" style={{ background: "rgba(175,136,255,0.04)" }} />
        <div className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full blur-[100px]" style={{ background: "rgba(105,246,184,0.04)" }} />
      </div>

      <main className="relative z-10 w-full max-w-5xl px-6 py-14 flex flex-col md:flex-row items-center gap-16">
        {/* Left — Branding */}
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

        {/* Right — Registration Form */}
        <div className="w-full md:w-1/2 max-w-md">
          <Card
            className="border-0 shadow-2xl"
            style={{
              background: "rgba(34,38,43,0.55)",
              backdropFilter: "blur(28px)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "1.75rem",
              boxShadow: "0 24px 60px rgba(0,229,255,0.06), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <CardHeader className="pb-2 pt-8 px-8">
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant="outline"
                  className="text-[10px] tracking-widest uppercase px-2 py-0.5"
                  style={{ borderColor: "rgba(129,236,255,0.2)", color: "#81ecff", background: "rgba(129,236,255,0.06)" }}
                >
                  New Account
                </Badge>
              </div>
              <CardTitle
                className="text-2xl font-bold mt-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#f8f9fe" }}
              >
                Create account
              </CardTitle>
              <CardDescription style={{ color: "#737679" }}>
                Start your journey with a few simple steps.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pt-6 space-y-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#737679" }}
                >
                  Full Name
                </Label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#737679" }}
                  >
                    <PersonIcon />
                  </span>
                  <Input
                    type="text"
                    placeholder="Satoshi Nakamoto"
                    className="pl-9 h-12 rounded-xl border-0 text-sm"
                    style={{
                      background: "rgba(22,26,30,0.9)",
                      color: "#f8f9fe",
                      outline: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#737679" }}
                >
                  Email Address
                </Label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#737679" }}
                  >
                    <EmailIcon />
                  </span>
                  <Input
                    type="email"
                    placeholder="name@domain.com"
                    className="pl-9 h-12 rounded-xl border-0 text-sm"
                    style={{
                      background: "rgba(22,26,30,0.9)",
                      color: "#f8f9fe",
                      outline: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#737679" }}
                >
                  Password
                </Label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#737679" }}
                  >
                    <KeyIcon />
                  </span>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 h-12 rounded-xl border-0 text-sm"
                    style={{
                      background: "rgba(22,26,30,0.9)",
                      color: "#f8f9fe",
                      outline: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: "#737679" }}
                  >
                    {showPassword ? "hide" : "show"}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "#737679" }}
                >
                  Confirm Password
                </Label>
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: "#737679" }}
                  >
                    <KeyIcon />
                  </span>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-9 pr-10 h-12 rounded-xl border-0 text-sm"
                    style={{
                      background: "rgba(22,26,30,0.9)",
                      color: "#f8f9fe",
                      outline: "1px solid rgba(255,255,255,0.07)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs"
                    style={{ color: "#737679" }}
                  >
                    {showConfirm ? "hide" : "show"}
                  </button>
                </div>
              </div>

              <Separator style={{ background: "rgba(255,255,255,0.06)" }} />

              {/* Terms */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(v) => setAgreed(!!v)}
                  className="mt-0.5 border-[rgba(255,255,255,0.2)]"
                  style={{ accentColor: "#81ecff" }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-snug cursor-pointer select-none"
                  style={{ color: "#a9abaf" }}
                >
                  I agree to the{" "}
                  <span className="hover:underline cursor-pointer" style={{ color: "#81ecff" }}>
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="hover:underline cursor-pointer" style={{ color: "#81ecff" }}>
                    Privacy Policy
                  </span>
                  .
                </label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 px-8 pb-8">
              {/* Submit */}
              <Button
                onClick={() => navigate("/")}
                className="w-full h-12 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)",
                  color: "#003840",
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: "0 8px 28px rgba(0,212,236,0.25)",
                  border: "none",
                }}
              >
                Create Secure Wallet
                <ArrowRightIcon />
              </Button>

              {/* Sign in link */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="text-sm" style={{ color: "#737679" }}>
                  Already a member?
                </span>
                <Link
                  to="/login"
                  className="text-sm font-bold transition-colors hover:underline"
                  style={{ color: "#81ecff" }}
                >
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </Card>

          {/* Trust icons */}
          <div className="mt-8 flex justify-center items-center gap-6 opacity-30">
            {[<CheckBadgeIcon />, <ShieldLockIcon />, <KeyIcon />, <CheckBadgeIcon />].map((ic, i) => (
              <span key={i} className="text-[#81ecff]">
                {ic}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom gradient line */}
      <div
        className="fixed bottom-0 left-0 w-full h-px"
        style={{ background: "linear-gradient(to right, transparent, rgba(129,236,255,0.3), transparent)" }}
      />
    </div>
  );
}