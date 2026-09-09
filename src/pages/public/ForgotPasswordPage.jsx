import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Cloud, Mail, ArrowLeft, Send } from 'lucide-react';

export function ForgotPasswordPage({ onNavigate }) {
  const { addToast } = useNotifications();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    addToast('Password reset link sent to your university email.', 'success');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-glow mb-2">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Cloud className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your university email to receive a password reset link.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-3d">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs leading-relaxed">
                Check your inbox! We have dispatched a secure cloud password reset link to <strong>{email}</strong>.
              </div>
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => onNavigate('login')}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
                    placeholder="student@clouduniv.edu"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                icon={Send}
                iconPosition="right"
              >
                Send Reset Link
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
