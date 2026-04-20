import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Check, X, Clock, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TopupRequest {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  symbol: string;
  amount: number;
  usd_value: number;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  reviewed_at: string | null;
  admin_notes: string | null;
}

type StatusFilter = 'all' | 'pending' | 'approved' | 'denied';

export function AdminPageContent() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TopupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [processing, setProcessing] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const query = supabase
      .from('topup_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') query.eq('status', filter);

    const { data, error } = await query;
    if (!error && data) setRequests(data as TopupRequest[]);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = async (req: TopupRequest) => {
    if (!user) return;
    setProcessing(req.id);

    const { data: holdingData } = await supabase
      .from('holdings')
      .select('amount')
      .eq('user_id', req.user_id)
      .eq('symbol', req.symbol)
      .single();

    const currentAmount = holdingData?.amount ? Number(holdingData.amount) : 0;
    const newAmount = currentAmount + req.amount;

    const { error: holdingError } = await supabase
      .from('holdings')
      .upsert({ user_id: req.user_id, symbol: req.symbol, amount: newAmount }, { onConflict: 'user_id, symbol' });

    if (holdingError) {
      notify(`Failed to update holdings: ${holdingError.message}`);
      setProcessing(null);
      return;
    }

    await supabase.from('transactions').insert({
      user_id: req.user_id,
      type: 'Buy',
      asset: req.symbol === 'BTC' ? 'Bitcoin' : req.symbol === 'ETH' ? 'Ethereum' : req.symbol,
      symbol: req.symbol,
      amount: `+${req.amount} ${req.symbol}`,
      value: `$${req.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      usd_value: req.usd_value,
      status: 'Completed',
      from: 'External Card',
      to: 'Vault Wallet',
    });

    await supabase.from('topup_requests').update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    }).eq('id', req.id);

    await supabase.from('notifications').insert({
      user_id: req.user_id,
      title: 'Top-up Approved',
      message: `Your request to purchase ${req.amount} ${req.symbol} ($${req.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}) has been approved and added to your portfolio.`,
      type: 'success',
      related_request_id: req.id,
    });

    notify(`Approved: +${req.amount} ${req.symbol} for ${req.user_email}`);
    fetchRequests();
    setProcessing(null);
  };

  const handleDeny = async (req: TopupRequest) => {
    if (!user) return;
    setProcessing(req.id);

    await supabase.from('topup_requests').update({
      status: 'denied',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    }).eq('id', req.id);

    await supabase.from('notifications').insert({
      user_id: req.user_id,
      title: 'Top-up Declined',
      message: `Your request to purchase ${req.amount} ${req.symbol} ($${req.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}) was declined. Please contact support for more information.`,
      type: 'error',
      related_request_id: req.id,
    });

    notify(`Denied request from ${req.user_email}`);
    fetchRequests();
    setProcessing(null);
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <style>{`.font-headline { font-family: 'Space Grotesk', sans-serif; }`}</style>

      {/* Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-[200] bg-[#1c2024] border border-[#81ecff]/30 text-[#81ecff] text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#81ecff]/10 flex items-center justify-center">
            <ShieldCheck className="text-[#81ecff] h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#f8f9fe] tracking-tight">Admin Panel</h1>
            <p className="text-[#a9abaf] text-sm mt-0.5">
              Top-up request management
              {pendingCount > 0 && filter === 'all' && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-[#ff716c]/20 text-[#ff716c] text-xs font-bold">
                  {pendingCount} pending
                </span>
              )}
            </p>
          </div>
        </div>
        <Button
          onClick={fetchRequests}
          variant="secondary"
          className="bg-[#1c2024] border border-white/10 text-[#a9abaf] hover:text-white h-10 rounded-xl flex items-center gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['pending', 'approved', 'denied', 'all'] as StatusFilter[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              filter === s
                ? 'bg-[#81ecff] text-[#003840]'
                : 'bg-[#1c2024] border border-white/10 text-[#a9abaf] hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-[#101417] rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-6 w-6 text-[#81ecff] animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="h-8 w-8 text-[#a9abaf]" />
            <p className="text-[#a9abaf] text-sm font-medium">No {filter !== 'all' ? filter : ''} requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">User</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">Asset</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">Amount</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">USD Value</th>
                  <th className="text-left px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">Date</th>
                  <th className="text-center px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a9abaf]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <tr
                    key={req.id}
                    className={`border-b border-white/5 last:border-0 transition-colors hover:bg-white/[0.02] ${
                      i % 2 === 0 ? '' : 'bg-white/[0.01]'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#f8f9fe]">{req.user_name || 'Anonymous'}</p>
                      <p className="text-xs text-[#a9abaf] mt-0.5">{req.user_email}</p>
                      <p className="text-[10px] text-[#737679] mt-0.5 font-mono">{req.user_id.slice(0, 8)}…</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-[#81ecff]/10 text-[#81ecff] text-xs font-bold">
                        {req.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-[#f8f9fe]">
                        {req.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-[#69f6b8]">
                        ${req.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#a9abaf]">
                        {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-[#737679] mt-0.5">
                        {new Date(req.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(req)}
                            disabled={processing === req.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#69f6b8]/10 border border-[#69f6b8]/20 text-[#69f6b8] text-xs font-bold hover:bg-[#69f6b8]/20 transition-all disabled:opacity-50 active:scale-95"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleDeny(req)}
                            disabled={processing === req.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ff716c]/10 border border-[#ff716c]/20 text-[#ff716c] text-xs font-bold hover:bg-[#ff716c]/20 transition-all disabled:opacity-50 active:scale-95"
                          >
                            <X className="h-3.5 w-3.5" />
                            Deny
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-[#737679]">
                          {req.reviewed_at
                            ? new Date(req.reviewed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                            : '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TopupRequest['status'] }) {
  if (status === 'pending') {
    return (
      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px] uppercase tracking-wider">
        <Clock className="h-2.5 w-2.5 mr-1" /> Pending
      </Badge>
    );
  }
  if (status === 'approved') {
    return (
      <Badge className="bg-[#69f6b8]/10 text-[#69f6b8] border-[#69f6b8]/20 text-[10px] uppercase tracking-wider">
        <Check className="h-2.5 w-2.5 mr-1" /> Approved
      </Badge>
    );
  }
  return (
    <Badge className="bg-[#ff716c]/10 text-[#ff716c] border-[#ff716c]/20 text-[10px] uppercase tracking-wider">
      <X className="h-2.5 w-2.5 mr-1" /> Denied
    </Badge>
  );
}
