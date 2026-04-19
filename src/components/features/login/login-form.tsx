import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailIcon, KeyIcon, EyeIcon, ArrowRightIcon } from "./login-icons";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // Navigate to dashboard on success
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
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

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl font-bold text-base tracking-wider flex items-center justify-center gap-3 transition-all duration-200 active:scale-95 hover:opacity-90 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #81ecff 0%, #00d4ec 100%)",
              color: "#003840",
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: "0 20px 40px rgba(0,229,255,0.15)",
              border: "none",
              letterSpacing: "0.1em",
            }}
          >
            {loading ? "Decrypting..." : "Login to Vault"}
            <ArrowRightIcon />
          </Button>
        </div>
      </form>

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
  );
};
