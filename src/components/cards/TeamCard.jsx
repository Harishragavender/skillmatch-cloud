import React from 'react';
import { Users, ArrowRight, UserPlus, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '../common/Button';
import { SkillChip } from '../common/SkillChip';
import { clsx } from 'clsx';

export function TeamCard({
  team,
  onViewTeam,
  onRequestJoin,
  isMember = false,
  isLeader = false,
  className = '',
}) {
  const memberCount = (team.memberIds || []).length;
  const maxMembers = team.maxMembers || 4;
  const isFull = memberCount >= maxMembers;

  const statusColors = {
    'Planning': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'In Progress': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'Review': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    'Completed': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  }[team.status] || 'text-slate-300 bg-slate-800';

  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 glass-card-hover group relative overflow-hidden transition-all duration-300",
        className
      )}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className={clsx("px-2.5 py-1 text-xs font-semibold rounded-full border", statusColors)}>
            {team.status || 'In Progress'}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-full border border-white/5">
            <Users className="w-3.5 h-3.5 text-brand-400" />
            {memberCount}/{maxMembers} Members
          </span>
        </div>

        {/* Team Name */}
        <h3
          onClick={onViewTeam}
          className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer mb-1"
        >
          {team.name}
        </h3>

        {/* Project Target */}
        <p className="text-xs font-medium text-brand-400 line-clamp-1 mb-3">
          Project: {team.projectTitle}
        </p>

        {/* Description */}
        {team.description && (
          <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
            {team.description}
          </p>
        )}

        {/* Member Avatars Stack */}
        <div className="flex items-center justify-between py-3 my-2 border-y border-white/5">
          <div className="flex items-center -space-x-2 overflow-hidden">
            {(team.members || []).map((member, idx) => (
              <img
                key={idx}
                src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                alt={member.name}
                title={`${member.name} (${member.role || 'Member'})`}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover"
              />
            ))}
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Leader</span>
            <span className="text-xs font-semibold text-slate-200">{team.leaderName}</span>
          </div>
        </div>

        {/* Required Skills Wanted */}
        {(team.requiredSkills || []).length > 0 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Looking for Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(team.requiredSkills || []).slice(0, 3).map((sk, idx) => (
                <SkillChip key={idx} name={sk} size="xs" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/5">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1"
          onClick={onViewTeam}
          icon={ArrowRight}
          iconPosition="right"
        >
          {isMember ? 'Team Workspace' : 'View Team'}
        </Button>

        {!isMember && onRequestJoin && !isFull && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRequestJoin}
            icon={UserPlus}
          >
            Join
          </Button>
        )}
      </div>
    </div>
  );
}
