import { Button } from "@/components/ui/button";
import { ToggleRow } from "./toggle-row";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { LogOut, Trash2, ShieldAlert, Loader2 } from "lucide-react";

export function SecuritySection() {
  const { user, signOut } = useAuth();
  const [isResetting, setIsResetting] = useState(false);

  const handleClearData = async () => {
    if (!user || !confirm("Are you sure? This will permanently delete all your holdings and transaction history for this demo account.")) return;
    
    setIsResetting(true);
    try {
      await supabase.from('holdings').delete().eq('user_id', user.id);
      await supabase.from('transactions').delete().eq('user_id', user.id);
      await supabase.from('swaps').delete().eq('user_id', user.id);
      
      alert("Demo data cleared successfully.");
      window.location.href = "/";
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <section className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
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
        <Button 
          onClick={() => signOut()}
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 rounded-xl px-6 h-12 text-[10px] font-bold uppercase tracking-widest transition-all gap-2"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
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

        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="h-5 w-5 text-[#ff716c]" />
            <h4 className="text-xl font-headline font-bold text-[#f8f9fe]">Danger Zone</h4>
          </div>
          
          <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-[#f8f9fe] mb-1">Delete Account and Data</p>
              <p className="text-xs text-[#a9abaf]">Permanently delete your profile, holdings, transaction logs, and history. This cannot be undone.</p>
            </div>
            <Button
              onClick={handleClearData}
              disabled={isResetting}
              className="bg-[#ff716c] text-white font-bold px-8 py-6 rounded-2xl hover:brightness-110 transition-all uppercase text-[10px] tracking-widest shrink-0"
            >
              {isResetting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4 mr-2" /> Delete Account and Data</>}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
