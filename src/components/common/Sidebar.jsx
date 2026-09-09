import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isLiveFirebaseConfigured } from '../../services/firebase';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Split,
  Users,
  UserCheck,
  FolderGit2,
  Bookmark,
  Shield,
  Layers,
  GraduationCap,
  FileCode2,
  FolderPlus,
  BarChart3,
  CloudLightning,
  Settings,
  Flame,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { clsx } from 'clsx';

export function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const { currentUser, isAdmin, profileStrength } = useAuth();

  if (!currentUser) return null;

  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Skill Profile', icon: GraduationCap },
    { id: 'skills', label: 'Skills Manager', icon: FileCode2 },
    { id: 'projects', label: 'Project Discovery', icon: Compass },
    { id: 'recommended', label: 'Recommended For You', icon: Sparkles, badge: 'AI' },
    { id: 'skillgap', label: 'Skill Gap Analysis', icon: Split },
    { id: 'teammates', label: 'Find Teammates', icon: Users, badge: 'Synergy' },
    { id: 'teams', label: 'Teams & Creation', icon: UserCheck },
    { id: 'join_requests', label: 'Join Requests', icon: Flame },
    { id: 'my_projects', label: 'My Projects & Saved', icon: Bookmark },
  ];

  const adminNavItems = [
    { id: 'admin_dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'admin_projects', label: 'Manage Projects', icon: FolderGit2 },
    { id: 'admin_create_project', label: 'Create Project', icon: FolderPlus },
    { id: 'admin_students', label: 'Manage Students', icon: Users },
    { id: 'admin_skills', label: 'Manage Skills DB', icon: FileCode2 },
    { id: 'admin_categories', label: 'Categories', icon: Layers },
    { id: 'admin_teams', label: 'Monitor Teams', icon: UserCheck },
    { id: 'admin_analytics', label: 'Cloud Analytics', icon: BarChart3 },
    { id: 'cloud_architecture', label: 'Cloud Architecture', icon: CloudLightning, badge: 'AWS/GCP' },
  ];

  const items = isAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "fixed lg:sticky top-16 sm:top-18 left-0 z-30 h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)] w-64 glass-panel border-r border-white/10 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="space-y-6">
          {/* Section Label */}
          <div className="px-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'Faculty Admin Portal' : 'Student Navigation'}
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 group relative select-none",
                    isActive
                      ? "bg-gradient-to-r from-brand-500/20 to-cyan-500/10 text-white font-semibold border border-brand-500/30 shadow-glow-sm"
                      : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={clsx(
                        "w-4 h-4 transition-colors",
                        isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-brand-300"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md bg-brand-500/25 text-brand-300 border border-brand-500/40">
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-400 rounded-l-full shadow-glow-cyan" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile Strength (Student) or Cloud Health (Admin) */}
        {!isAdmin && profileStrength && (
          <div className="pt-4 border-t border-white/10">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-950/60 to-slate-900 border border-brand-500/20 shadow-sm">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">Profile Strength</span>
                <span className="font-mono font-bold text-cyan-400">{profileStrength.score}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden mb-2">
                <div
                  className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-700"
                  style={{ width: `${profileStrength.score}%` }}
                />
              </div>
              {profileStrength.missing.length > 0 ? (
                <p className="text-[11px] text-slate-400 leading-tight">
                  Tip: {profileStrength.missing[0]}
                </p>
              ) : (
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Profile fully optimized!
                </p>
              )}
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="pt-4 border-t border-white/10">
            <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-semibold mb-1">
                {isLiveFirebaseConfigured ? (
                  <><Shield className="w-3.5 h-3.5" /> Firebase Cloud Live</>
                ) : (
                  <><Database className="w-3.5 h-3.5" /> Local Mode</>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {isLiveFirebaseConfigured
                  ? 'Firestore DB sync active across 24 students and 10 capstone teams.'
                  : 'Using localStorage. Add Firebase credentials for cloud sync.'}
              </p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
