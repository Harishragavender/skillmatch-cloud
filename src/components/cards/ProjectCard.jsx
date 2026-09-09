import React from 'react';
import { Bookmark, Users, Clock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { MatchBadge } from '../common/MatchBadge';
import { SkillChip } from '../common/SkillChip';
import { Button } from '../common/Button';
import { useData } from '../../context/DataContext';
import { clsx } from 'clsx';

export function ProjectCard({
  project,
  onViewDetails,
  onAnalyzeGap,
  className = '',
}) {
  const { isBookmarked, toggleBookmark } = useData();
  const bookmarked = isBookmarked(project.id);
  const match = project.match;

  const difficultyColors = {
    'Beginner': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    'Intermediate': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    'Advanced': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  }[project.difficulty] || 'text-slate-300 bg-slate-800 border-slate-700';

  return (
    <div
      className={clsx(
        "glass-panel rounded-3xl p-6 flex flex-col justify-between border border-white/10 glass-card-hover group relative overflow-hidden transition-all duration-300",
        className
      )}
    >
      {/* Top ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all duration-500" />

      <div>
        {/* Header Badges & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {match && (
              <MatchBadge
                score={match.totalScore}
                label={match.qualityLabel}
                tier={match.qualityTier}
                size="sm"
              />
            )}
            <span className={clsx("px-2.5 py-1 text-xs font-semibold rounded-full border", difficultyColors)}>
              {project.difficulty}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(project.id);
            }}
            title={bookmarked ? "Remove bookmark" : "Save project"}
            className={clsx(
              "p-2 rounded-xl transition-all duration-200 border",
              bookmarked
                ? "bg-brand-500/20 text-brand-300 border-brand-500/40 shadow-glow-sm"
                : "bg-slate-800/80 text-slate-400 hover:text-white border-white/5 hover:border-white/20"
            )}
          >
            <Bookmark className={clsx("w-4 h-4", bookmarked && "fill-current")} />
          </button>
        </div>

        {/* Project Title */}
        <h3
          onClick={onViewDetails}
          className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-brand-300 transition-colors cursor-pointer line-clamp-2 mb-2"
        >
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Project Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4 pb-4 border-b border-white/5">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-brand-400" />
            Team: {project.teamSize || '3-4'}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {project.duration || '3 Months'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300 font-medium">{project.category}</span>
        </div>

        {/* Required Skills Chips */}
        <div className="space-y-2 mb-5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Required Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(project.requiredSkills || []).slice(0, 4).map((skillName, idx) => {
              const isMatched = match?.matchedSkills?.some(ms => ms.name === skillName);
              return (
                <SkillChip
                  key={idx}
                  name={skillName}
                  status={isMatched ? 'matched' : 'default'}
                  size="xs"
                />
              );
            })}
            {(project.requiredSkills || []).length > 4 && (
              <span className="text-[11px] text-slate-400 self-center px-1">
                +{(project.requiredSkills || []).length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={onViewDetails}
          icon={ArrowRight}
          iconPosition="right"
        >
          View Project
        </Button>

        {onAnalyzeGap && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onAnalyzeGap}
            title="Analyze Skill Gap"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </Button>
        )}
      </div>
    </div>
  );
}
