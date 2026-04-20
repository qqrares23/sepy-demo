import { useRef, useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Clock, TrendingUp, X } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";
import type { AppNotification } from "@/hooks/use-notifications";

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  const handleMarkRead = async (n: AppNotification, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!n.read) await markRead(n.id);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-950/80 text-slate-400 hover:text-[#81ecff] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff716c] text-[8px] font-black text-white shadow-lg shadow-[#ff716c]/30 animate-in zoom-in duration-200">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-[380px] bg-[#101417] border border-white/10 rounded-3xl shadow-2xl z-[100] animate-in fade-in slide-in-from-top-2 duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#81ecff]" />
              <span className="text-sm font-bold text-[#f8f9fe]">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#ff716c]/20 text-[#ff716c] text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-[10px] font-bold text-[#a9abaf] hover:text-[#81ecff] transition-colors uppercase tracking-wider"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Bell className="h-8 w-8 text-[#737679]" />
                <p className="text-sm text-[#a9abaf] font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={(e) => handleMarkRead(n, e)}
                  className={`flex items-start gap-4 px-5 py-4 border-b border-white/5 last:border-0 cursor-pointer transition-colors hover:bg-white/[0.03] ${
                    !n.read ? 'bg-white/[0.02]' : ''
                  }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl ${iconBg(n.type)}`}>
                    <NotifIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-bold ${!n.read ? 'text-[#f8f9fe]' : 'text-[#a9abaf]'}`}>
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#81ecff]" />
                      )}
                    </div>
                    <p className="text-xs text-[#737679] mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-[#737679] mt-1.5 flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" />
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function iconBg(type: AppNotification['type']) {
  switch (type) {
    case 'success': return 'bg-[#69f6b8]/10';
    case 'error':   return 'bg-[#ff716c]/10';
    case 'warning': return 'bg-yellow-500/10';
    default:        return 'bg-[#81ecff]/10';
  }
}

function NotifIcon({ type }: { type: AppNotification['type'] }) {
  switch (type) {
    case 'success': return <Check className="h-4 w-4 text-[#69f6b8]" />;
    case 'error':   return <X className="h-4 w-4 text-[#ff716c]" />;
    case 'warning': return <Bell className="h-4 w-4 text-yellow-400" />;
    default:        return <TrendingUp className="h-4 w-4 text-[#81ecff]" />;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
