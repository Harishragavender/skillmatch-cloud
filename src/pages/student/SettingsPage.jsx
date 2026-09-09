import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { isLiveFirebaseConfigured } from '../../services/firebase';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Cloud,
  RotateCcw,
  Shield,
  CheckCircle2,
  Lock,
  Database,
  Loader2,
} from 'lucide-react';

export function SettingsPage({ onNavigate }) {
  const { currentUser, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { resetDatabase, seedFirestore } = useData();
  const [seeding, setSeeding] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset all projects, students, teams, and skills back to original demo seeds?')) {
      resetDatabase();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-7 h-7 text-cyan-400" />
          Settings & Cloud Environment
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure interface preferences, inspect cloud connection status, and manage demo database.
        </p>
      </div>

      {/* 1. Appearance & Theme */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Appearance & Theme
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/5">
          <div>
            <span className="text-sm font-bold text-white block">Theme Mode</span>
            <span className="text-xs text-slate-400">Current theme: {theme === 'dark' ? 'Deep Dark SaaS' : 'Clean Light Mode'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => theme !== 'dark' && toggleTheme()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'dark'
                  ? 'bg-brand-500/20 border-brand-400 text-cyan-200 shadow-glow-sm'
                  : 'bg-slate-800 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4 text-cyan-400" />
              Dark Mode
            </button>

            <button
              onClick={() => theme !== 'light' && toggleTheme()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                theme === 'light'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-sm'
                  : 'bg-slate-800 text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" />
              Light Mode
            </button>
          </div>
        </div>
      </div>

      {/* 2. Cloud Architecture Status */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Cloud className="w-4 h-4 text-cyan-400" />
          Cloud Computing Infrastructure Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold block">Authentication Layer</span>
            {isLiveFirebaseConfigured ? (
              <>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Firebase Auth SDK Connected
                </p>
                <p className="text-[11px] text-slate-400">Anonymous auth via Firebase. Multi-tenant role separation active.</p>
              </>
            ) : (
              <>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-400" /> Local Demo Mode
                </p>
                <p className="text-[11px] text-slate-400">No Firebase credentials — using localStorage session emulation.</p>
              </>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
            <span className="text-slate-400 font-semibold block">Cloud Database</span>
            {isLiveFirebaseConfigured ? (
              <>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cloud Firestore Sync Active
                </p>
                <p className="text-[11px] text-slate-400">NoSQL distributed document store with real-time subscriptions.</p>
              </>
            ) : (
              <>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-400" /> Local Storage Fallback
                </p>
                <p className="text-[11px] text-slate-400">Data persisted to browser localStorage. Add Firebase credentials to enable Firestore.</p>
              </>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate('cloud_architecture')}
        >
          View Full Cloud Architecture Blueprint
        </Button>
      </div>

      {/* 3. Seed Firestore (admin action) */}
      {isLiveFirebaseConfigured && (
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4" />
              Seed Firestore Database
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Populate your Cloud Firestore with the demo dataset (24 students, 35+ skills, 10 projects, default teams). Safe to run multiple times — skips if data already exists.
            </p>
          </div>

          <Button
            variant="success"
            size="md"
            disabled={seeding}
            onClick={async () => {
              setSeeding(true);
              try {
                await seedFirestore();
              } finally {
                setSeeding(false);
              }
            }}
            icon={seeding ? Loader2 : Database}
          >
            {seeding ? 'Seeding Firestore…' : 'Seed Demo Data to Firestore'}
          </Button>
        </div>
      )}

      {/* 4. Academic Demo Reset */}
      <div className="p-6 rounded-3xl glass-panel border border-rose-500/20 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset Database
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Need to restart your demo walkthrough? This restores all 24 students, 35+ skills, 10 projects, and default teams.
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          onClick={handleReset}
          icon={RotateCcw}
        >
          Reset Cloud Database to Factory Seeds
        </Button>
      </div>
    </div>
  );
}
