import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { clsx } from 'clsx';

export function ToastContainer() {
  const { toasts, removeToast } = useNotifications();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          info: <Info className="w-5 h-5 text-brand-400 shrink-0" />,
        };

        const borderGlow = {
          success: 'border-emerald-500/40 shadow-glow-emerald',
          error: 'border-rose-500/40 shadow-lg',
          warning: 'border-amber-500/40 shadow-lg',
          info: 'border-brand-500/40 shadow-glow',
        }[toast.type] || 'border-brand-500/40';

        return (
          <div
            key={toast.id}
            className={clsx(
              "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl glass-panel border bg-slate-900/95 backdrop-blur-xl transition-all duration-300 transform translate-y-0",
              borderGlow
            )}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 text-sm font-medium text-slate-200 leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
