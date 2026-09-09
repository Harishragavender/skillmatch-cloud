import React from 'react';
import { isLiveFirebaseConfigured } from '../../services/firebase';
import { Button } from '../../components/common/Button';
import {
  CloudLightning,
  Shield,
  Database,
  Cpu,
  Globe,
  Lock,
  CheckCircle2,
  Server,
  Zap,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function CloudArchitecturePage({ onNavigate }) {
  return (
    <div className="space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <CloudLightning className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{isLiveFirebaseConfigured ? 'Firebase Cloud Mode Active' : 'Local Storage Mode — Add Firebase Credentials to Enable Cloud'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Cloud System Architecture & Infrastructure
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Complete structural blueprint detailing multi-tier cloud services, security boundaries, and reactive database topology.
        </p>
      </div>

      {/* Cloud Architecture Diagram Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-brand-500/30 shadow-card-3d space-y-6 bg-gradient-to-br from-slate-900 via-brand-950/30 to-slate-900">
        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Multi-Tier Cloud Topology
        </h2>

        {/* 4-Tier Interactive Block Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tier 1: Client / CDN */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3 relative group hover:border-cyan-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-cyan-400">Tier 1 • Edge</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-base font-bold text-white">Cloud Hosting & CDN</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Global CDN edge distribution delivering sub-50ms TTFB, SSL termination, and client asset caching.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
              React 18 · Vite · Tailwind
            </div>
          </div>

          {/* Tier 2: Cloud Auth & Identity Gateway */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-3 relative group hover:border-purple-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-purple-400">Tier 2 • Security</span>
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-base font-bold text-white">Cloud Authentication</h3>
            {isLiveFirebaseConfigured ? (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Firebase Auth gateway providing cryptographic JWT session tokens and role-based access control (Student vs Admin).
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                  Anonymous Auth · JWT · RBAC
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Local session emulation via localStorage. No real Firebase credentials configured.
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-amber-400 font-mono">
                  Demo Mode · LocalStorage
                </div>
              </>
            )}
          </div>

          {/* Tier 3: Calculation & Matching Engine */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-brand-500/30 space-y-3 relative group hover:border-brand-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-brand-400">Tier 3 • Compute</span>
              <Cpu className="w-4 h-4 text-brand-400" />
            </div>
            <h3 className="text-base font-bold text-white">Matching Engine API</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Weighted 4-factor algorithm evaluating skill overlap, domain synergy, and skill-gap what-if simulation.
            </p>
            <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
              Multi-Factor · Synergy Matrix
            </div>
          </div>

          {/* Tier 4: Cloud Firestore Database */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 relative group hover:border-emerald-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">Tier 4 • Storage</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Cloud Firestore</h3>
            {isLiveFirebaseConfigured ? (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  NoSQL distributed document collections with multi-client real-time synchronization and automatic failover.
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                  Firestore · Reactive Sync
                </div>
              </>
            ) : (
              <>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Data stored in browser localStorage. Add Firebase credentials in .env to enable Firestore.
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] text-amber-400 font-mono">
                  LocalStorage · Fallback Mode
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cloud Firestore Collection Schemas */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-card-3d">
        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          Cloud Firestore Document Schema Layout
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {[
            {
              collection: 'users/{userId}',
              fields: ['name: String', 'email: String', 'role: student | admin', 'college: String', 'technicalSkills: Array<{name, level}>', 'interests: Array<String>', 'createdAt: Timestamp']
            },
            {
              collection: 'projects/{projectId}',
              fields: ['title: String', 'description: String', 'category: String', 'difficulty: String', 'requiredSkills: Array<String>', 'technologies: Array<String>', 'teamSize: String', 'status: String']
            },
            {
              collection: 'teams/{teamId}',
              fields: ['name: String', 'projectId: String', 'leaderId: String', 'memberIds: Array<String>', 'members: Array<Object>', 'requiredSkills: Array<String>', 'status: String', 'progress: Number']
            },
            {
              collection: 'joinRequests/{reqId}',
              fields: ['teamId: String', 'studentId: String', 'studentName: String', 'message: String', 'compatibilityScore: Number', 'status: pending | accepted | rejected', 'createdAt: Timestamp']
            },
            {
              collection: 'skills/{skillId}',
              fields: ['name: String', 'category: String', 'domain: Frontend | Backend | AI/ML | Cloud/DevOps | UI/UX | Security', 'createdAt: Timestamp']
            },
            {
              collection: 'notifications/{notifId}',
              fields: ['userId: String', 'type: join_request | project_recommendation | system', 'title: String', 'message: String', 'read: Boolean', 'createdAt: Timestamp']
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-white/5 space-y-2">
              <span className="text-cyan-400 font-bold block">{item.collection}</span>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {item.fields.map((f, i) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Security & RBAC Specifications */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
        <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
          <Lock className="w-5 h-5 text-purple-400" />
          Cloud Security Rules & Role-Based Authorization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <span className="font-bold text-cyan-300 block">Student Authorization Scope</span>
            <p className="text-slate-300 leading-relaxed">
              Students can create and mutate their own profile, submit team applications, and manage teams they lead. They have read-only access to academic project directories.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1.5">
            <span className="font-bold text-purple-300 block">Faculty Administrator Scope</span>
            <p className="text-slate-300 leading-relaxed">
              Faculty admins have elevated authorization to publish new project topics, mutate difficulty guidelines, moderate skills taxonomy, and inspect system telemetry.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
