import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Loader2, X, Mail, User, Lock, UserCircle } from "lucide-react";

export function ProfileCard() {
  const { user, updateProfile, updateAccount } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    password: ""
  });
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setSuccessMsg("");
    
    // 1. Update Profile (Full Name)
    const { error: pError } = await updateProfile({ full_name: formData.full_name });
    
    // 2. Update Account (Email/Password) if changed
    const accountUpdates: any = {};
    if (formData.email !== user?.email) accountUpdates.email = formData.email;
    if (formData.password) accountUpdates.password = formData.password;
    
    if (Object.keys(accountUpdates).length > 0) {
      const { error: aError } = await updateAccount(accountUpdates);
      if (aError) console.error(aError);
    }

    setIsSaving(false);
    if (!pError) {
      setSuccessMsg("Account updated successfully");
      setTimeout(() => {
        setShowModal(false);
        setSuccessMsg("");
      }, 2000);
    }
  };

  if (!user) return null;

  return (
    <>
      <section className="bg-[#101417] rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden text-center flex flex-col items-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#81ecff]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-[#81ecff] to-[#69f6b8] shadow-lg shadow-[#81ecff]/10">
              <div className="w-full h-full rounded-full bg-[#161a1e] overflow-hidden border-4 border-[#101417]">
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`}
                />
              </div>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              size="icon"
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#81ecff] text-[#003840] rounded-xl shadow-lg hover:scale-110 transition-transform border-4 border-[#101417]"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
            </Button>
          </div>

          <h3 className="text-2xl font-headline font-bold text-[#f8f9fe]">{user.full_name || "Anonymous User"}</h3>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf] mt-2 mb-8">
            Verified {user.tier || 'standard'} Tier • Node {user.id.substring(0, 4).toUpperCase()}
          </p>
          
          <div className="w-full space-y-4">
            <div className="bg-[#1c2024] p-4 rounded-2xl flex items-center justify-between border border-white/5">
              <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Vault Email</span>
              <span className="text-xs font-mono text-[#81ecff] font-bold">{user.email}</span>
            </div>
            <div className="bg-[#1c2024] p-4 rounded-2xl flex items-center justify-between border border-white/5">
              <span className="text-[10px] font-bold text-[#a9abaf] uppercase tracking-widest">Public ID</span>
              <span className="text-xs font-mono text-[#81ecff] font-bold">0x{user.id.substring(0, 6).toUpperCase()}...</span>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Account Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0b0e11]/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-[#161a1e] w-full max-w-lg rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#81ecff]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#81ecff]/10 flex items-center justify-center text-[#81ecff]">
                  <UserCircle className="h-6 w-6" />
                </div>
                <h3 className="font-headline font-bold text-2xl text-[#f8f9fe]">Account Identity</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-full bg-[#101417] flex items-center justify-center text-[#a9abaf] hover:text-white transition-colors border border-white/5">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1 flex items-center gap-2">
                    <User className="h-3 w-3" /> Full Name
                  </label>
                  <input 
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    className="w-full bg-[#101417] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1 flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email Address
                  </label>
                  <input 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-[#101417] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-[#a9abaf] ml-1 flex items-center gap-2">
                    <Lock className="h-3 w-3" /> New Password (Optional)
                  </label>
                  <input 
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-[#101417] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:border-[#81ecff]/50 transition-all" 
                  />
                </div>
              </div>

              {successMsg && (
                <div className="p-4 bg-[#69f6b8]/10 border border-[#69f6b8]/20 rounded-2xl text-[#69f6b8] text-xs font-bold text-center animate-in fade-in zoom-in-95">
                  {successMsg}
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={() => setShowModal(false)}
                  variant="outline" 
                  className="flex-1 py-7 rounded-2xl border-white/5 text-white font-headline font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                >
                  Cancel
                </Button>
                <Button 
                  disabled={isSaving}
                  onClick={handleSave}
                  className="flex-1 py-7 rounded-2xl bg-[#81ecff] text-[#003840] font-headline font-bold uppercase tracking-widest text-xs hover:bg-[#81ecff]/90 transition-all shadow-lg shadow-[#81ecff]/10"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
