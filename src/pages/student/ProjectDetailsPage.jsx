import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateProjectMatch } from '../../services/matchingEngine';
import { analyzeSkillGap } from '../../services/skillGapEngine';
import { MatchScoreDial } from '../../components/common/MatchScoreDial';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import { TeamCard } from '../../components/cards/TeamCard';
import {
  ArrowLeft,
  Sparkles,
  Bookmark,
  Users,
  Clock,
  Target,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  UserCheck,
} from 'lucide-react';

export function ProjectDetailsPage({ projectId, onNavigate }) {
  const { currentUser } = useAuth();
  const { projects, teams, isBookmarked, toggleBookmark } = useData();

  const project = projects.find(p => p.id === projectId) || projects[0];

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Project not found.</p>
        <Button variant="primary" size="sm" onClick={() => onNavigate('projects')} className="mt-4">
          Back to Projects
        </Button>
      </div>
    );
  }

  const bookmarked = isBookmarked(project.id);
  const match = calculateProjectMatch(currentUser, project);
  const gapAnalysis = analyzeSkillGap(currentUser, project);

  // Teams working on this project
  const projectTeams = teams.filter(t => t.projectId === project.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('projects')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Discovery
        </button>

        <button
          onClick={() => toggleBookmark(project.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            bookmarked
              ? 'bg-brand-500/20 border-brand-400 text-cyan-200 shadow-glow-sm'
              : 'bg-slate-800/80 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current text-cyan-400' : ''}`} />
          <span>{bookmarked ? 'Saved to Bookmarks' : 'Bookmark Project'}</span>
        </button>
      </div>

      {/* Main Hero Header */}
      <div className="p-6 sm:p-10 rounded-3xl glass-panel border border-white/10 shadow-card-3d relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950/30 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left Project Info */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/40 font-mono">
                {project.category}
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 border border-white/10 text-slate-300">
                {project.difficulty} Difficulty
              </span>
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {project.status || 'Active'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {project.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Recommended Team</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> {project.teamSize || '3-4'} Members
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Estimated Duration</span>
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-400" /> {project.duration || '4 Months'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Created By</span>
                <span className="font-semibold text-white truncate block">
                  {project.createdBy || 'Faculty Coordinator'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Match Dial */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-lg">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Your Personal Match
            </span>
            <MatchScoreDial
              score={match.totalScore}
              tierLabel={match.qualityLabel}
              breakdown={match.breakdown}
              size="lg"
            />
          </div>
        </div>
      </div>

      {/* Skill Gap Banner */}
      {gapAnalysis && (
        <div className="p-6 rounded-3xl glass-panel border border-brand-500/30 shadow-glow-sm bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-display font-bold text-cyan-300">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Skill Gap & Readiness Analysis</span>
            </div>
            <p className="text-xs text-slate-300">
              {gapAnalysis.summaryText}{' '}
              {gapAnalysis.hasGap ? `Acquiring missing skills can push your compatibility up to ${gapAnalysis.maxPossibleScore}%.` : 'You have 100% of the required skills!'}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate('skillgap', { projectId: project.id })}
          >
            Open Skill Gap Simulator
          </Button>
        </div>
      )}

      {/* 2-Column Details: Objectives vs Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Objective & Outcomes */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-400" />
              Project Objective
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              {project.objective || "Deliver an end-to-end academic prototype addressing key research milestones and institutional evaluation standards."}
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Expected Outcomes & Deliverables
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              {project.expectedOutcome || "Complete source code repository, cloud deployment architecture diagram, interactive dashboard demo, and final project documentation."}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onNavigate('create_team', { projectId: project.id, projectTitle: project.title })}
              icon={PlusCircle}
            >
              Create Team for This Project
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('teammates', { targetProject: project })}
              icon={Users}
            >
              Find Teammates
            </Button>
          </div>
        </div>

        {/* Right: Skills & Tech Stacks */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Required Technical Skills
            </h2>
            <div className="space-y-2">
              {(project.requiredSkills || []).map((skillName, idx) => {
                const isMatched = match.matchedSkills.some(ms => ms.name === skillName);
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white">{skillName}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      isMatched
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {isMatched ? '✓ In Profile' : 'Missing Skill'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Recommended Technologies
            </h2>
            <div className="flex flex-wrap gap-2">
              {(project.technologies || []).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-white/5 text-slate-200 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Formed Teams for this Project */}
      <div className="space-y-4 pt-6 border-t border-white/10">
        <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-emerald-400" />
          Active Squads on this Project ({projectTeams.length})
        </h2>

        {projectTeams.length === 0 ? (
          <div className="p-8 rounded-3xl glass-panel text-center text-slate-400 text-xs">
            No student teams have formed for this project yet. Be the first to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectTeams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onViewTeam={() => onNavigate('team_details', { teamId: team.id })}
                onRequestJoin={() => onNavigate('teams', { openJoin: team.id })}
                isMember={(team.memberIds || []).includes(currentUser?.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
