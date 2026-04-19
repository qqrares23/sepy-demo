import { ProfileCard } from "./profile-card";
import { QuickLinks } from "./quick-links";
import { SecuritySection } from "./security-section";

export function SettingsPageContent() {
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
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-[#81ecff]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#af88ff]/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
