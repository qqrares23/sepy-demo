import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { Check, X, Clock, RefreshCw, ShieldCheck, ArrowRightLeft, Landmark, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BaseRequest {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string | null;
  usd_value: number;
  status: 'pending' | 'approved' | 'denied';
  created_at: string;
  reviewed_at: string | null;
}

interface TopupRequest extends BaseRequest {
  symbol: string;
  amount: number;
}

interface SwapRequest extends BaseRequest {
  from_symbol: string;
  to_symbol: string;
  from_amount: number;
  to_amount: number;
}

interface SellRequest extends BaseRequest {
  symbol: string;
  amount: number;
  bank_name: string;
  account_holder: string;
  iban: string;
  swift: string;
}

type RequestUnion = TopupRequest | SwapRequest | SellRequest;
type RequestType = 'topup' | 'swap' | 'sell';
type StatusFilter = 'all' | 'pending' | 'approved' | 'denied';

export function AdminPageContent() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RequestUnion[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<RequestType>('topup');
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [processing, setProcessing] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    let tableName = 'topup_requests';
    if (type === 'swap') tableName = 'swap_requests';
    if (type === 'sell') tableName = 'sell_requests';

    const query = supabase
      .from(tableName)
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') query.eq('status', filter);

    const { data, error } = await query;
    if (!error && data) setRequests(data as RequestUnion[]);
    setLoading(false);
  }, [type, filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprove = async (req: RequestUnion) => {
    if (!user) return;
    setProcessing(req.id);

    try {
      if (type === 'topup') {
        const r = req as TopupRequest;
        const { data: h } = await supabase.from('holdings').select('amount').eq('user_id', r.user_id).eq('symbol', r.symbol).single();
        const newAmt = (h?.amount ? Number(h.amount) : 0) + r.amount;
        await supabase.from('holdings').upsert({ user_id: r.user_id, symbol: r.symbol, amount: newAmt }, { onConflict: 'user_id, symbol' });
        
        await supabase.from('transactions').insert({
          user_id: r.user_id, type: 'Buy', asset: r.symbol, symbol: r.symbol,
          amount: `+${r.amount} ${r.symbol}`, value: `$${r.usd_value.toFixed(2)}`,
          usd_value: r.usd_value, status: 'Completed', from: 'External Card', to: 'Vault Wallet'
        });
      } else if (type === 'swap') {
        const r = req as SwapRequest;
        const { data: hFrom } = await supabase.from('holdings').select('amount').eq('user_id', r.user_id).eq('symbol', r.from_symbol).single();
        const { data: hTo } = await supabase.from('holdings').select('amount').eq('user_id', r.user_id).eq('symbol', r.to_symbol).single();
        
        const newFrom = (hFrom?.amount ? Number(hFrom.amount) : 0) - r.from_amount;
        const newTo = (hTo?.amount ? Number(hTo.amount) : 0) + r.to_amount;
        
        await supabase.from('holdings').upsert({ user_id: r.user_id, symbol: r.from_symbol, amount: newFrom }, { onConflict: 'user_id, symbol' });
        await supabase.from('holdings').upsert({ user_id: r.user_id, symbol: r.to_symbol, amount: newTo }, { onConflict: 'user_id, symbol' });

        await supabase.from('transactions').insert({
          user_id: r.user_id, type: 'Swap', asset: `${r.from_symbol} → ${r.to_symbol}`, symbol: r.from_symbol,
          amount: `-${r.from_amount} ${r.from_symbol} / +${r.to_amount.toFixed(4)} ${r.to_symbol}`,
          value: `$${r.usd_value.toFixed(2)}`, usd_value: r.usd_value, status: 'Completed', from: 'Vault Wallet', to: 'Uniswap Protocol'
        });
      } else if (type === 'sell') {
        const r = req as SellRequest;
        const { data: h } = await supabase.from('holdings').select('amount').eq('user_id', r.user_id).eq('symbol', r.symbol).single();
        const newAmt = (h?.amount ? Number(h.amount) : 0) - r.amount;
        await supabase.from('holdings').upsert({ user_id: r.user_id, symbol: r.symbol, amount: newAmt }, { onConflict: 'user_id, symbol' });

        await supabase.from('transactions').insert({
          user_id: r.user_id, type: 'Sell', asset: r.symbol, symbol: r.symbol,
          amount: `-${r.amount} ${r.symbol}`, value: `$${r.usd_value.toFixed(2)}`,
          usd_value: r.usd_value, status: 'Completed', from: 'Vault Wallet', to: `${r.bank_name} (****${r.iban.slice(-4)})`
        });
      }

      const tableName = type === 'topup' ? 'topup_requests' : type === 'swap' ? 'swap_requests' : 'sell_requests';
      await supabase.from(tableName).update({
        status: 'approved',
        reviewed_at: new Date().toISOString(),
        reviewed_by: user.id,
      }).eq('id', req.id);

      await supabase.from('notifications').insert({
        user_id: req.user_id,
        title: `${type.toUpperCase()} Approved`,
        message: `Your ${type} request has been approved.`,
        type: 'success',
      });

      notify(`Approved ${type} request from ${req.user_email}`);
      fetchRequests();
    } catch (err: any) {
      notify(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessing(null);
    }
  };

  const handleDeny = async (req: RequestUnion) => {
    if (!user) return;
    setProcessing(req.id);
    const tableName = type === 'topup' ? 'topup_requests' : type === 'swap' ? 'swap_requests' : 'sell_requests';
    
    await supabase.from(tableName).update({
      status: 'denied',
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    }).eq('id', req.id);

    await supabase.from('notifications').insert({
      user_id: req.user_id,
      title: `${type.toUpperCase()} Declined`,
      message: `Your ${type} request was declined.`,
      type: 'error',
    });

    notify(`Denied request from ${req.user_email}`);
    fetchRequests();
    setProcessing(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <style>{`.font-headline { font-family: 'Space Grotesk', sans-serif; }`}</style>

      {notification && (
        <div className="fixed top-24 right-6 z-[200] bg-[#1c2024] border border-[#81ecff]/30 text-[#81ecff] text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-right duration-300">
          {notification}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#81ecff]/10 flex items-center justify-center">
            <ShieldCheck className="text-[#81ecff] h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold text-[#f8f9fe] tracking-tight">Admin Panel</h1>
            <p className="text-[#a9abaf] text-sm mt-0.5">Manage user transaction requests</p>
          </div>
        </div>
        <Button onClick={fetchRequests} variant="secondary" className="bg-[#1c2024] border border-white/10 text-[#a9abaf] hover:text-white h-10 rounded-xl flex items-center gap-2">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-2 p-1 bg-[#1c2024] rounded-2xl w-fit border border-white/5">
          <button onClick={() => setType('topup')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'topup' ? 'bg-[#81ecff] text-[#003840]' : 'text-[#a9abaf] hover:text-white'}`}>
            <Wallet className="h-3.5 w-3.5" /> Buy Requests
          </button>
          <button onClick={() => setType('swap')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'swap' ? 'bg-[#81ecff] text-[#003840]' : 'text-[#a9abaf] hover:text-white'}`}>
            <ArrowRightLeft className="h-3.5 w-3.5" /> Swap Requests
          </button>
          <button onClick={() => setType('sell')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${type === 'sell' ? 'bg-[#81ecff] text-[#003840]' : 'text-[#a9abaf] hover:text-white'}`}>
            <Landmark className="h-3.5 w-3.5" /> Sell Requests
          </button>
        </div>

        <div className="flex gap-2">
          {(['pending', 'approved', 'denied', 'all'] as StatusFilter[]).map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${filter === s ? 'bg-[#1c2024] text-[#81ecff] border border-[#81ecff]/30' : 'text-[#a9abaf] hover:text-white border border-transparent'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#101417] rounded-3xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><RefreshCw className="h-6 w-6 text-[#81ecff] animate-spin" /></div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Clock className="h-8 w-8 text-[#a9abaf]" />
            <p className="text-[#a9abaf] text-sm font-medium">No {filter !== 'all' ? filter : ''} requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Details</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">USD Value</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Date</th>
                  <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#a9abaf]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#f8f9fe]">{req.user_name || 'Anonymous'}</p>
                      <p className="text-xs text-[#a9abaf]">{req.user_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {type === 'topup' && 'symbol' in req && <span className="text-xs font-bold text-[#81ecff]">Buy {req.amount} {req.symbol}</span>}
                      {type === 'swap' && 'from_symbol' in req && <span className="text-xs font-bold text-[#af88ff]">{req.from_amount} {req.from_symbol} → {req.to_amount.toFixed(4)} {req.to_symbol}</span>}
                      {type === 'sell' && 'symbol' in req && (
                        <div>
                          <p className="text-xs font-bold text-[#ff716c]">Sell {req.amount} {req.symbol}</p>
                          {'bank_name' in req && <p className="text-[10px] text-[#737679]">{req.bank_name} / {req.iban.slice(0,4)}...{req.iban.slice(-4)}</p>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#69f6b8]">${req.usd_value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#a9abaf]">{new Date(req.created_at).toLocaleDateString()}</p>
                      <p className="text-[10px] text-[#737679]">{new Date(req.created_at).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center"><StatusBadge status={req.status} /></td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleApprove(req)} disabled={processing === req.id} className="p-2 rounded-lg bg-[#69f6b8]/10 text-[#69f6b8] hover:bg-[#69f6b8]/20 disabled:opacity-50 transition-all"><Check className="h-4 w-4" /></button>
                          <button onClick={() => handleDeny(req)} disabled={processing === req.id} className="p-2 rounded-lg bg-[#ff716c]/10 text-[#ff716c] hover:bg-[#ff716c]/20 disabled:opacity-50 transition-all"><X className="h-4 w-4" /></button>
                        </div>
                      ) : <span className="text-[10px] text-[#737679] uppercase font-bold tracking-widest">{req.status}</span>}
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

function StatusBadge({ status }: { status: string }) {
  if (status === 'pending') return <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-[10px]">Pending</Badge>;
  if (status === 'approved') return <Badge className="bg-[#69f6b8]/10 text-[#69f6b8] border-[#69f6b8]/20 text-[10px]">Approved</Badge>;
  return <Badge className="bg-[#ff716c]/10 text-[#ff716c] border-[#ff716c]/20 text-[10px]">Denied</Badge>;
}
