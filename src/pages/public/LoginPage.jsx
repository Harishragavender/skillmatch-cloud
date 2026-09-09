import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { SEED_STUDENTS, SEED_ADMIN } from '../../services/seedData';
import { Button } from '../../components/common/Button';
import {
  Cloud,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Shield,
  User,
  GraduationCap,
} from 'lucide-react';

export function LoginPage({ onNavigate }) {
  const { login, switchDemoUser } = useAuth();
  const { addToast } = useNotifications();

  const [email, setEmail] = useState('alex.chen@clouduniv.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('Signed in successfully!', 'success');
      onNavigate('dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (userId, role) => {
    switchDemoUser(userId);
    addToast(`Signed in as Demo ${role === 'admin' ? 'Faculty Admin' : 'Student'}!`, 'success');
    if (role === 'admin') {
      onNavigate('admin_dashboard');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-glow mb-2">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Cloud className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Welcome back to SkillMatch
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Sign in to discover your matched projects and teams.
          </p>
        </div>

        {/* 1-Click Instant Demo Login Card */}
        <div className="p-4 rounded-2xl glass-panel border border-brand-500/30 shadow-glow-sm bg-gradient-to-br from-slate-900 via-brand-950/40 to-slate-900">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>1-Click Instant Demo Access</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo('user-alex', 'student')}
              className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-white/10 hover:border-brand-400 text-left transition-all group"
            >
              <div className="flex items-center gap-2">
                <img
                  src={SEED_STUDENTS[0].avatar}
                  alt="Alex"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">Alex Chen</p>
                  <p className="text-[10px] text-slate-400">Student (Fullstack)</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleQuickDemo(SEED_ADMIN.id, 'admin')}
              className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-left transition-all group"
            >
              <div className="flex items-center gap-2">
                <img
                  src={SEED_ADMIN.avatar}
                  alt="Robert"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-purple-200 group-hover:text-white truncate">Prof. Vance</p>
                  <p className="text-[10px] text-purple-400">Faculty Admin</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-3d">
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
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                  placeholder="student@clouduniv.edu"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot_password')}
                  className="text-xs text-brand-400 hover:text-brand-300"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-brand-400 hover:text-brand-300 font-semibold"
            >
              Create student profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
