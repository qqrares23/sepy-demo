import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PersonIcon, EmailIcon, KeyIcon, ArrowRightIcon } from "./register-icons";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Redirect to login or dashboard after successful signup
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto md:mx-0">
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

        <form onSubmit={handleRegister}>
          <CardContent className="px-8 pt-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
                {error}
              </div>
            )}

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
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
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
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)",
                color: "#003840",
                fontFamily: "'Space Grotesk', sans-serif",
                boxShadow: "0 8px 28px rgba(0,212,236,0.25)",
                border: "none",
              }}
            >
              {loading ? "Creating..." : "Create Secure Wallet"}
              <ArrowRightIcon />
            </Button>

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
        </form>
      </Card>
    </div>
  );
};
