import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Bell, Check, Sparkles, UserPlus, Info, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

export function NotificationsPage({ onNavigate }) {
  const { notifications, markAsRead } = useNotifications();

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Bell className="w-7 h-7 text-cyan-400" />
            Notifications & System Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Stay updated on team join requests, project recommendations, and platform activity.
          </p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are completely caught up! We will alert you when team requests or project recommendations occur."
          actionLabel="Explore Projects"
          onAction={() => onNavigate('projects')}
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const icons = {
              join_request: <UserPlus className="w-5 h-5 text-cyan-400" />,
              project_recommendation: <Sparkles className="w-5 h-5 text-purple-400" />,
              system: <Info className="w-5 h-5 text-brand-400" />,
            }[notif.type] || <Bell className="w-5 h-5 text-brand-400" />;

            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={clsx(
                  "p-4 sm:p-5 rounded-3xl glass-panel border transition-all cursor-pointer flex items-start justify-between gap-4",
                  notif.read
                    ? "border-white/5 opacity-70 bg-slate-900/50"
                    : "border-brand-500/30 bg-slate-900/90 shadow-glow-sm"
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-white/10 shrink-0 mt-0.5">
                    {icons}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{notif.title}</h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!notif.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
