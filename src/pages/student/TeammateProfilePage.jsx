import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateTeammateCompatibility } from '../../services/teammateEngine';
import { SkillChip } from '../../components/common/SkillChip';
import { MatchBadge } from '../../components/common/MatchBadge';
import { Button } from '../../components/common/Button';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Sparkles,
  ArrowLeft,
  UserPlus,
  Layers,
  Heart,
  Terminal,
  Award,
  CheckCircle2,
} from 'lucide-react';

export function TeammateProfilePage({ studentId, onNavigate }) {
  const { currentUser } = useAuth();
  const { students } = useData();

  const student = students.find(s => s.id === studentId) || students[0];

  if (!student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Student profile not found.</p>
        <Button variant="primary" size="sm" onClick={() => onNavigate('teammates')} className="mt-4">
          Back to Teammates
        </Button>
      </div>
    );
  }

  const comp = calculateTeammateCompatibility(currentUser, student);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('teammates')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Teammate Search
        </button>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('teams', { inviteStudent: student })}
          icon={UserPlus}
        >
          Invite to Team
        </Button>
      </div>

      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-card-3d relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-purple-500/40 shadow-glow-purple"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                  {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono capitalize">
                  {student.experienceLevel || 'Intermediate'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-brand-400" />
                {student.department} • {student.year}
              </p>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-500" />
                {student.college}
              </p>
            </div>
          </div>

          {comp && (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Synergy Score</span>
              <div className="text-3xl font-display font-extrabold text-cyan-400 font-mono mb-1">
                {comp.compatibilityScore}%
              </div>
              <MatchBadge
                score={comp.compatibilityScore}
                label={comp.qualityLabel}
                tier={comp.badgeColor === 'emerald' ? 'excellent' : 'strong'}
                size="xs"
              />
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Synergy Breakdown Card */}
      {comp && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-card-3d bg-gradient-to-br from-slate-900 via-brand-950/30 to-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <h2 className="text-base sm:text-lg font-display font-bold text-white">
              Why You & {student.name} Are Compatible
            </h2>
          </div>

          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-sm text-cyan-200 leading-relaxed font-medium">
            "{comp.primarySynergy}"
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Complementary Skills They Bring:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {comp.complementarySkills.length === 0 ? (
                  <span className="text-xs text-slate-400">Overlapping stack</span>
                ) : (
                  comp.complementarySkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-medium">
                      + {sk}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Shared Domain Interests:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {comp.sharedInterests.length === 0 ? (
                  <span className="text-xs text-slate-400">Broad cross-domain fit</span>
                ) : (
                  comp.sharedInterests.map((int, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-medium">
                      ✓ {int}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bio, Technical Skills, and Soft Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Bio & Focus
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {student.bio || "Student has not added a detailed bio."}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-400" />
              Technical Skills & Proficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {(student.technicalSkills || []).map((sk, i) => (
                <SkillChip key={i} name={sk.name} level={sk.level} size="md" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(student.softSkills || []).map((ss, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/5 text-slate-300 text-xs">
                  {ss}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(student.interests || []).map((int, i) => (
                <span key={i} className="px-2.5 py-1 rounded-xl bg-slate-800 border border-white/5 text-slate-300 text-xs">
                  {int}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
