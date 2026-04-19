import { LoginHeader } from "./login-header";
import { LoginForm } from "./login-form";
import { LoginTrustBadges } from "./login-trust-badges";
import { LoginFooter } from "./login-footer";

export function LoginPageContent() {
  return (
    <div
      className="min-h-screen flex flex-col bg-[#0b0e11] text-[#f8f9fe] overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(129,236,255,0.05)" }}
        />
        <div
          className="absolute -bottom-[5%] -left-[5%] w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "rgba(175,136,255,0.05)" }}
        />
      </div>

      <LoginHeader />

      {/* Main */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-6 -mt-10">
        <div className="w-full max-w-[480px]">
          <LoginForm />
          <LoginTrustBadges />
        </div>
      </main>

      <LoginFooter />
    </div>
  );
}
