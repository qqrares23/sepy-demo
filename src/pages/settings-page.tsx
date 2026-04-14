"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

// ── Profile Card ──────────────────────────────────────────────────────────────

function ProfileCard() {
  return (
    <section className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden text-center flex flex-col items-center">
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#81ecff]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
      <div className="relative z-10">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#81ecff] to-[#69f6b8] shadow-lg shadow-[#81ecff]/10">
            <div className="w-full h-full rounded-full bg-[#161a1e] overflow-hidden border-4 border-[#101417]">
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0AivCjKAnNYl5C2BmlIlBc_gEdXSxizVeP-ROvRqc6315MWIxUTGSk04Iwlri3gneiICKBW1bqtk41kycYshC5eXRIdDXw2THeUZXZZicb7k3eSG8nc3fpT3KpY5OXVjQLUqF2IMcrxnd_rJRWbAODEk_jBlfZo1MIWtu6Oe5bIgDobk5WrwvQ30V6v7AVnl6ulslYBk5h36oqRW--WJjb2o7SX6WGNUJvwW-tJdahwqtVV4-XneTZCe85rJFMbpP8JAOR9rWxqeD"
              />
            </div>
          </div>
          <Button
            size="icon"
            className="absolute bottom-0 right-0 w-10 h-10 bg-[#81ecff] text-[#003840] rounded-xl shadow-lg hover:scale-110 transition-transform border-4 border-[#101417]"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
          </Button>
        </div>
        <h3 className="text-2xl font-headline font-bold text-[#f8f9fe]">Nexus_Architect_01</h3>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf] mt-2 mb-8">Verified Pro Tier • Node 774</p>
        
        <div className="w-full space-y-4">
          <div className="bg-[#1c2024] p-4 rounded-2xl flex items-center justify-between border border-white/5">
            <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Public ID</span>
            <span className="text-xs font-mono text-[#81ecff] font-bold">0x4F...E2A9</span>
          </div>
          <Button
            variant="outline"
            className="w-full border-white/10 text-[#f8f9fe] text-[10px] font-bold py-4 rounded-2xl hover:bg-[#1c2024] transition-all uppercase tracking-[0.2em]"
          >
            Blockchain Profile
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Quick Links ───────────────────────────────────────────────────────────────

function QuickLinks() {
  return (
    <nav className="space-y-3">
      {[
        { icon: "person", label: "Profile Details", color: "text-[#81ecff]", active: true },
        { icon: "security", label: "Security Matrix", color: "text-[#a9abaf]", active: false },
        { icon: "notifications", label: "Alert Prefs", color: "text-[#a9abaf]", active: false },
      ].map((item) => (
        <button
          key={item.label}
          className={`w-full p-5 rounded-2xl flex items-center justify-between group transition-all ${
            item.active ? "bg-[#1c2024] border border-white/10" : "hover:bg-[#161a1e] border border-transparent hover:border-white/5"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-[#101417] border border-white/5 ${item.active ? item.color : "text-[#a9abaf]"}`}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
            </div>
            <span className={`font-headline font-bold text-sm ${item.active ? "text-[#f8f9fe]" : "text-[#a9abaf] group-hover:text-[#f8f9fe]"}`}>
              {item.label}
            </span>
          </div>
          <span className="material-symbols-outlined text-[#45484c] group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
      ))}
    </nav>
  );
}

// ── Toggle Row ────────────────────────────────────────────────────────────────

function ToggleRow({
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

// ── Security Section ──────────────────────────────────────────────────────────

function SecuritySection() {
  return (
    <section className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#81ecff]/10 flex items-center justify-center text-[#81ecff] border border-[#81ecff]/20">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-headline font-bold text-[#f8f9fe] tracking-tight">Privacy & Security</h2>
          <p className="text-sm text-[#a9abaf] font-medium mt-1">
            Manage defensive protocols and high-frequency session history.
          </p>
        </div>
      </div>
      
      <div className="space-y-6">
        <ToggleRow
          id="2fa"
          icon="phonelink_lock"
          iconColor="text-[#69f6b8]"
          title="Two-Factor Authentication"
          description="Hardware keys and biometric verification active."
          checked
        />

        <div className="pt-4">
          <p className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-[0.2em] mb-6">
            Active Security Sessions
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-[#161a1e] rounded-2xl border border-white/5 hover:bg-[#1c2024] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#101417] flex items-center justify-center text-[#81ecff]">
                  <span className="material-symbols-outlined">desktop_windows</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f8f9fe]">Vault Desktop - MacOS (Sonoma)</p>
                  <p className="text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest mt-1">San Francisco, USA • Active Now</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#69f6b8]/10 text-[#69f6b8]">
                <span className="w-2 h-2 rounded-full bg-[#69f6b8] shadow-[0_0_8px_#69f6b8]" />
                <span className="text-[10px] font-bold tracking-widest">ACTIVE</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-5 bg-[#161a1e] rounded-2xl border border-white/5 hover:bg-[#1c2024] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#101417] flex items-center justify-center text-[#a9abaf]">
                  <span className="material-symbols-outlined">smartphone</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#f8f9fe]">iPhone 15 Pro - iOS 17.4</p>
                  <p className="text-[10px] text-[#a9abaf] font-bold uppercase tracking-widest mt-1">London, UK • 2 Hours Ago</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="text-[10px] font-bold text-[#ff716c] hover:text-[#ff716c] hover:bg-[#ff716c]/10 tracking-widest"
              >
                TERMINATE
              </Button>
            </div>
          </div>
        </div>

        <Button
          variant="link"
          className="text-[#81ecff] text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all p-0 mt-4"
        >
          <span>Advanced Cryptographic Options</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Button>
      </div>
    </section>
  );
}

// ── Notifications Section ─────────────────────────────────────────────────────

function NotificationsSection() {
  const notifCards = [
    {
      id: "price",
      title: "Price Alerts",
      desc: "Instant signals for 5% volatility shifts in core assets.",
      checked: true,
      disabled: false,
    },
    {
      id: "confirm",
      title: "Confirmations",
      desc: "Notify when transactions reach full blockchain finality.",
      checked: true,
      disabled: false,
    },
    {
      id: "whale",
      title: "Whale Movements",
      desc: "Track institutional movements across liquidity pools.",
      checked: false,
      disabled: false,
    },
    {
      id: "security",
      title: "Security Signals",
      desc: "Mandatory alerts for login attempts or key rotations.",
      checked: true,
      disabled: true,
    },
  ];

  return (
    <section className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5">
      <div className="flex items-center gap-5 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#af88ff]/10 flex items-center justify-center text-[#af88ff] border border-[#af88ff]/20">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            notifications_active
          </span>
        </div>
        <div>
          <h2 className="text-3xl font-headline font-bold text-[#f8f9fe] tracking-tight">Notification Matrix</h2>
          <p className="text-sm text-[#a9abaf] font-medium mt-1">
            Configure automated transaction signals and network alerts.
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notifCards.map((card) => (
          <div key={card.id} className="p-8 bg-[#161a1e] rounded-3xl border border-white/5 flex flex-col justify-between min-h-[160px] group hover:bg-[#1c2024] transition-all">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#f8f9fe] text-lg">{card.title}</p>
              <Switch id={card.id} defaultChecked={card.checked} disabled={card.disabled} className="data-[state=checked]:bg-[#81ecff]" />
            </div>
            <p className="text-sm text-[#a9abaf] font-medium leading-relaxed mt-4">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function VaultSettings() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .font-headline { font-family: 'Space Grotesk', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-headline font-bold text-[#f8f9fe] tracking-tight mb-2">
            Vault Settings
          </h1>
          <p className="text-[#a9abaf] max-w-xl font-medium">
            Configure node protocols, manage security matrices, and personalize your high-frequency execution environment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-10">
          <ProfileCard />
          <QuickLinks />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-10">
          <SecuritySection />
          <NotificationsSection />

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6">
            <Button
              variant="outline"
              className="px-8 py-4 rounded-2xl border-white/10 text-sm font-bold text-[#a9abaf] hover:text-[#f8f9fe] hover:bg-[#161a1e] transition-all uppercase tracking-[0.2em]"
            >
              Discard Changes
            </Button>
            <Button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#81ecff] to-[#00d4ec] text-[#003840] text-sm font-bold shadow-xl shadow-[#81ecff]/10 hover:scale-[1.02] transition-all uppercase tracking-[0.2em]">
              Sync Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}