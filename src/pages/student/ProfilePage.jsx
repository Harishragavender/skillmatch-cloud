import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Edit,
  Sparkles,
  Award,
  Layers,
  Heart,
  Terminal,
  Calendar,
} from 'lucide-react';

export function ProfilePage({ onNavigate }) {
  const { currentUser, profileStrength } = useAuth();
  const { teams } = useData();

  if (!currentUser) return null;

  const myTeams = teams.filter(t => (t.memberIds || []).includes(currentUser.id));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* 1. Profile Header Card */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-card-3d overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-brand-400/40 shadow-glow"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900" title="Active" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono capitalize">
                  {currentUser.experienceLevel || 'Intermediate'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-brand-400" />
                {currentUser.department} • {currentUser.year}
              </p>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-500" />
                {currentUser.college}
              </p>

              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('edit_profile')}
              icon={Edit}
            >
              Edit Profile
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('skills')}
            >
              Manage Skills
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Bio & Profile Strength Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Bio */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              About & Research Interests
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {currentUser.bio || "No bio added yet. Tell other students what kind of projects you love to work on!"}
            </p>
          </div>

          {/* Technical Skills */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Terminal className="w-4 h-4 text-brand-400" />
                Technical Skills ({currentUser.technicalSkills?.length || 0})
              </h2>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
              >
                + Add / Edit Skills
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(currentUser.technicalSkills || []).map((sk, idx) => (
                <SkillChip
                  key={idx}
                  name={sk.name}
                  level={sk.level}
                  size="md"
                />
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Soft & Collaboration Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {(currentUser.softSkills || []).map((ss, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-medium"
                >
                  {ss}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interests & Active Squads */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Strength Widget */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Profile Completeness
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400">
                {profileStrength.score}%
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileStrength.score}%` }}
              />
            </div>
            {profileStrength.missing.length > 0 && (
              <div className="space-y-1 text-xs text-slate-400 pt-1">
                <span className="font-semibold text-slate-300 block mb-1">To reach 100%:</span>
                {profileStrength.missing.map((msg, i) => (
                  <p key={i} className="flex items-start gap-1 text-[11px] text-amber-300/90">
                    • {msg}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Project Interests */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Project Interests
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {(currentUser.interests || []).map((interest, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/5 text-slate-300 text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Active Teams */}
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Active Project Teams ({myTeams.length})
            </h2>

            {myTeams.length === 0 ? (
              <p className="text-xs text-slate-400">No active teams yet.</p>
            ) : (
              <div className="space-y-2">
                {myTeams.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onNavigate('project_dashboard', { teamId: t.id })}
                    className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-750 border border-white/5 cursor-pointer text-xs space-y-1 transition-all"
                  >
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{t.projectTitle}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
