import { RegisterBranding } from "./register-branding";
import { RegisterForm } from "./register-form";
import { RegisterTrustIcons } from "./register-trust-icons";

export function RegisterPageContent() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0b0e11] text-[#f8f9fe] font-sans overflow-x-hidden"
      style={{ fontFamily: "'IBM Plex Mono', 'DM Sans', monospace" }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px]"
          style={{ background: "rgba(129,236,255,0.07)" }}
        />
        <div
          className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: "rgba(175,136,255,0.04)" }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "rgba(105,246,184,0.04)" }}
        />
      </div>

      <main className="relative z-10 w-full max-w-6xl px-6 py-14 flex flex-col md:flex-row items-center gap-16">
        <RegisterBranding />
        <div className="w-full md:flex-1">
          <RegisterForm />
          <RegisterTrustIcons />
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
