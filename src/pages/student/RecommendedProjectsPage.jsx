import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { rankProjectsForStudent } from '../../services/matchingEngine';
import { MatchBadge } from '../../components/common/MatchBadge';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  Target,
  Bookmark,
} from 'lucide-react';

export function RecommendedProjectsPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const { projects, isBookmarked, toggleBookmark } = useData();

  const [minTier, setMinTier] = useState('all'); // 'all' | '90' | '75' | '60'

  const allRanked = rankProjectsForStudent(currentUser, projects);

  const filteredRanked = allRanked.filter((proj) => {
    if (minTier === '90') return proj.match.totalScore >= 90;
    if (minTier === '75') return proj.match.totalScore >= 75;
    if (minTier === '60') return proj.match.totalScore >= 60;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Deterministic 4-Factor AI Ranking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Recommended For You
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Projects dynamically ranked by comparing your technical skills (50%), interests (25%), tech stack (15%), and difficulty preference (10%).
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs">
          {[
            { id: 'all', label: 'All Matches' },
            { id: '90', label: '90%+ (Excellent)' },
            { id: '75', label: '75%+ (Strong)' },
            { id: '60', label: '60%+ (Good)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMinTier(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                minTier === tab.id
                  ? 'bg-brand-500/25 border border-brand-400 text-cyan-200 shadow-glow-sm font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Projects List with Detailed Breakdown */}
      {filteredRanked.length === 0 ? (
        <EmptyState
          title="No projects match this threshold"
          description="Try selecting 'All Matches' or updating your skill profile to boost compatibility scores."
          actionLabel="View All Projects"
          onAction={() => setMinTier('all')}
        />
      ) : (
        <div className="space-y-6">
          {filteredRanked.map((project, index) => {
            const match = project.match;
            const bookmarked = isBookmarked(project.id);

            return (
              <div
                key={project.id}
                className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 hover:border-brand-500/40 shadow-card-3d transition-all duration-300 relative overflow-hidden group"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Title & Reasons */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs text-slate-400 font-bold">
                        #{index + 1}
                      </span>
                      <MatchBadge
                        score={match.totalScore}
                        label={match.qualityLabel}
                        tier={match.qualityTier}
                        size="md"
                      />
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-white/10 text-slate-300 text-xs">
                        {project.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                        {project.difficulty}
                      </span>
                    </div>

                    <h3
                      onClick={() => onNavigate('project_details', { projectId: project.id })}
                      className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      {project.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Why this matches transparent list */}
                    <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Why this is recommended for you:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                        {match.reasons.map((reason, rIdx) => (
                          <div key={rIdx} className="flex items-start gap-2">
                            <span className="text-cyan-400 font-bold shrink-0">•</span>
                            <span className="leading-snug">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills Breakdown */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs text-slate-400 mr-1">Skills:</span>
                      {(project.requiredSkills || []).map((sk, sIdx) => {
                        const isMatched = match.matchedSkills.some(ms => ms.name === sk);
                        return (
                          <SkillChip
                            key={sIdx}
                            name={sk}
                            status={isMatched ? 'matched' : 'default'}
                            size="xs"
                          />
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Multi-Factor Breakdown Bars & CTAs */}
                  <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Formula Breakdown (100% Max)
                    </span>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Skills Match (50%)</span>
                          <span className="font-mono font-bold text-brand-400">{match.breakdown.skill}/50</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-brand-400 h-full rounded-full" style={{ width: `${(match.breakdown.skill / 50) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Interest Alignment (25%)</span>
                          <span className="font-mono font-bold text-purple-400">{match.breakdown.interest}/25</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-purple-400 h-full rounded-full" style={{ width: `${(match.breakdown.interest / 25) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Technology Fit (15%)</span>
                          <span className="font-mono font-bold text-cyan-400">{match.breakdown.technology}/15</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${(match.breakdown.technology / 15) * 100}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-slate-300 mb-1">
                          <span>Difficulty Match (10%)</span>
                          <span className="font-mono font-bold text-emerald-400">{match.breakdown.difficulty}/10</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(match.breakdown.difficulty / 10) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => onNavigate('project_details', { projectId: project.id })}
                        icon={ArrowRight}
                        iconPosition="right"
                      >
                        Details
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onNavigate('skillgap', { projectId: project.id })}
                      >
                        Skill Gap
                      </Button>

                      <button
                        onClick={() => toggleBookmark(project.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          bookmarked
                            ? 'bg-brand-500/20 text-cyan-300 border-brand-500/40'
                            : 'bg-slate-800 text-slate-400 hover:text-white border-white/5'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
