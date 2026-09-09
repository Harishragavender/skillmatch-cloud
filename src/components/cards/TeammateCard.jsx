import React from 'react';
import { UserPlus, Sparkles, ArrowRight, GraduationCap, MapPin } from 'lucide-react';
import { MatchBadge } from '../common/MatchBadge';
import { SkillChip } from '../common/SkillChip';
import { Button } from '../common/Button';
import { clsx } from 'clsx';

export function TeammateCard({
  student,
  onViewProfile,
  onInvite,
  className = '',
}) {
  const comp = student.compatibility;

  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 glass-card-hover group relative overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500" />

      <div>
        {/* Top Header with Avatar & Compatibility Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-brand-500/30 group-hover:border-cyan-400/60 shadow-md transition-colors"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Available for projects" />
            </div>
            <div>
              <h3
                onClick={onViewProfile}
                className="text-base sm:text-lg font-display font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
              >
                {student.name}
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3 h-3 text-brand-400" />
                {student.year} • {student.department?.split(' ')[0] || 'Engineering'}
              </p>
            </div>
          </div>

          {comp && (
            <MatchBadge
              score={comp.compatibilityScore}
              label={comp.qualityLabel}
              tier={comp.badgeColor === 'emerald' ? 'excellent' : 'strong'}
              size="sm"
            />
          )}
        </div>

        {/* Dynamic Synergy Explanation Callout */}
        {comp?.primarySynergy && (
          <div className="p-3 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4 text-xs text-brand-200 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
            <span>{comp.primarySynergy}</span>
          </div>
        )}

        {/* Bio snippet */}
        {student.bio && (
          <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {student.bio}
          </p>
        )}

        {/* Technical Skills */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Key Strengths
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(student.technicalSkills || []).slice(0, 4).map((skill, idx) => (
              <SkillChip
                key={idx}
                name={skill.name}
                level={skill.level}
                size="xs"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onViewProfile}
          icon={ArrowRight}
          iconPosition="right"
        >
          View Profile
        </Button>

        {onInvite && (
          <Button
            variant="primary"
            size="sm"
            onClick={onInvite}
            icon={UserPlus}
          >
            Invite
          </Button>
        )}
      </div>
    </div>
  );
}
