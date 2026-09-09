import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { analyzeSkillGap } from '../../services/skillGapEngine';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import { MatchBadge } from '../../components/common/MatchBadge';
import {
  Split,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  BookOpen,
  GraduationCap,
} from 'lucide-react';

export function SkillGapPage({ projectId, onNavigate }) {
  const { currentUser, updateUserProfile } = useAuth();
  const { projects } = useData();
  const { addToast } = useNotifications();

  const [selectedProjectId, setSelectedProjectId] = useState(projectId || projects[0]?.id || '');

  const project = projects.find(p => p.id === selectedProjectId) || projects[0];
  const gapAnalysis = analyzeSkillGap(currentUser, project);

  const handleSimulateAddSkill = async (skillName) => {
    const currentSkills = currentUser.technicalSkills || [];
    if (!currentSkills.some(s => s.name === skillName)) {
      const updated = [...currentSkills, { name: skillName, level: 'Intermediate' }];
      await updateUserProfile({ technicalSkills: updated });
      addToast(`🎉 Added ${skillName} (Intermediate) to your profile! Scores updated.`, 'success');
    }
  };

  if (!project || !gapAnalysis) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Select a project to analyze skill gaps.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Real-Time What-If Improvement Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
            <Split className="w-8 h-8 text-brand-400" />
            Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare your skillset against project requirements and simulate compatibility score improvements.
          </p>
        </div>

        {/* Project Selector */}
        <div className="min-w-[260px]">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Select Target Project:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400 font-semibold"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-brand-500/30 shadow-card-3d bg-gradient-to-br from-slate-900 via-brand-950/30 to-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              Target Project Evaluation
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-400 font-medium">
                {gapAnalysis.summaryText}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                gapAnalysis.hasGap
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                {gapAnalysis.readinessRating}
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/90 border border-white/10 text-center space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Current vs Potential Score
            </span>
            <div className="flex items-center justify-center gap-3">
              <div>
                <span className="text-3xl font-display font-extrabold text-white font-mono">
                  {gapAnalysis.currentScore}%
                </span>
                <span className="text-[10px] text-slate-400 block">Current</span>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-3xl font-display font-extrabold text-cyan-400 font-mono">
                  {gapAnalysis.maxPossibleScore}%
                </span>
                <span className="text-[10px] text-cyan-300 block">Max Potential</span>
              </div>
            </div>
            <MatchBadge score={gapAnalysis.currentScore} size="sm" className="mt-2" />
          </div>
        </div>
      </div>

      {/* Acquired Skills vs Missing Skills Comparison Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acquired Skills */}
        <div className="p-6 rounded-3xl glass-panel border border-emerald-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Acquired Skills ({gapAnalysis.acquiredCount})
            </h3>
            <span className="text-xs text-slate-400">Ready in your profile</span>
          </div>

          {gapAnalysis.matchedSkills.length === 0 ? (
            <p className="text-xs text-slate-400 py-4">No matching skills found yet.</p>
          ) : (
            <div className="space-y-2">
              {gapAnalysis.matchedSkills.map((sk, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-800/80 border border-emerald-500/30 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-white">{sk.name}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase">
                    {sk.level || 'Intermediate'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills */}
        <div className="p-6 rounded-3xl glass-panel border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Skill Gaps ({gapAnalysis.missingCount})
            </h3>
            <span className="text-xs text-slate-400">Required for full readiness</span>
          </div>

          {gapAnalysis.missingSkills.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-300">
              🎉 Zero skill gaps! You satisfy all technical requirements for this project.
            </div>
          ) : (
            <div className="space-y-2">
              {gapAnalysis.missingSkills.map((skName, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-800/80 border border-rose-500/30 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-white">{skName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono text-[10px] uppercase">
                    Missing
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simulated What-If Improvements Cards */}
      {gapAnalysis.potentialImprovements.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 space-y-6">
          <div>
            <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              Simulated What-If Score Improvements
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              See exact algorithm gain for adding each missing skill, and 1-click update your active profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gapAnalysis.potentialImprovements.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 hover:border-cyan-400/50 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.skillName}</span>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono font-bold text-xs">
                    +{item.scoreGain}% Gain
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.recommendation}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] text-slate-400">
                    New Score: <strong className="text-white">{item.simulatedScore}%</strong>
                  </span>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleSimulateAddSkill(item.skillName)}
                    icon={PlusCircle}
                  >
                    Add to Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
