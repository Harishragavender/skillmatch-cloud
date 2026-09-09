import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { rankProjectsForStudent } from '../../services/matchingEngine';
import { findRecommendedTeammates } from '../../services/teammateEngine';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { TeammateCard } from '../../components/cards/TeammateCard';
import { MatchBadge } from '../../components/common/MatchBadge';
import { Button } from '../../components/common/Button';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Users,
  Compass,
  Layers,
  Award,
  CheckCircle2,
  FolderGit2,
  Zap,
} from 'lucide-react';

export function StudentDashboard({ onNavigate }) {
  const { currentUser, profileStrength } = useAuth();
  const { projects, students, teams } = useData();

  if (!currentUser) return null;

  // Compute matched projects and complementary teammates
  const rankedProjects = rankProjectsForStudent(currentUser, projects);
  const topProjects = rankedProjects.slice(0, 3);
  const recommendedTeammates = findRecommendedTeammates(currentUser, students).slice(0, 2);

  // User's current team memberships
  const myTeams = teams.filter(t => (t.memberIds || []).includes(currentUser.id));

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Welcome Banner & Hero Stats */}
      <div className="relative p-6 sm:p-8 rounded-3xl glass-panel border border-brand-500/25 shadow-card-3d overflow-hidden bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Personalized Matching Active</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              We analyzed your {currentUser.technicalSkills?.length || 0} skills and {currentUser.interests?.length || 0} interests against active capstone projects. Here are your top recommendations.
            </p>
          </div>

          {/* Quick Profile Strength Widget */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-white/10 shrink-0">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Profile Match Power
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-3xl font-display font-black text-white font-mono">
                  {profileStrength.score}%
                </span>
                <span className="text-xs text-emerald-400 font-medium">
                  {profileStrength.score >= 85 ? 'Optimized' : 'Needs Boost'}
                </span>
              </div>
            </div>

            <Button
              variant={profileStrength.score >= 85 ? 'secondary' : 'primary'}
              size="sm"
              onClick={() => onNavigate('edit_profile')}
            >
              {profileStrength.score >= 85 ? 'Edit Profile' : 'Complete Profile'}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available Projects', value: projects.length, icon: Compass, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'High Match (>75%)', value: rankedProjects.filter(p => p.match.totalScore >= 75).length, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Potential Teammates', value: students.filter(s => s.id !== currentUser.id).length, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Active Teams Formed', value: myTeams.length, icon: FolderGit2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="glass-panel p-4 sm:p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
                <div className="text-2xl font-display font-bold text-white mt-1">{metric.value}</div>
              </div>
              <div className={`p-3 rounded-xl ${metric.bg} ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Top Recommended Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Recommended For You
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked highest based on skills (50%), interests (25%), tech stack (15%), and difficulty (10%).
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('recommended')}
            icon={ArrowRight}
            iconPosition="right"
          >
            View All Matches
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onViewDetails={() => onNavigate('project_details', { projectId: proj.id })}
              onAnalyzeGap={() => onNavigate('skillgap', { projectId: proj.id })}
            />
          ))}
        </div>
      </div>

      {/* 4. Complementary Teammate Suggestions & Active Squads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Teammates */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                Complementary Teammates
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Peers whose domain strengths complement your backend and ML profile.
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('teammates')}
              icon={ArrowRight}
              iconPosition="right"
            >
              Explore All
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedTeammates.map((teammate) => (
              <TeammateCard
                key={teammate.id}
                student={teammate}
                onViewProfile={() => onNavigate('teammate_profile', { studentId: teammate.id })}
                onInvite={() => onNavigate('teams')}
              />
            ))}
          </div>
        </div>

        {/* Right: Quick Action Hub & Active Teams */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-emerald-400" />
            Your Team Squads
          </h2>

          <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4">
            {myTeams.length === 0 ? (
              <div className="text-center py-6 space-y-3">
                <p className="text-xs text-slate-400">You haven't joined or formed a team yet.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onNavigate('create_team')}
                >
                  Create a New Team
                </Button>
              </div>
            ) : (
              myTeams.map((team) => (
                <div
                  key={team.id}
                  onClick={() => onNavigate('project_dashboard', { teamId: team.id })}
                  className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-white/5 hover:border-brand-500/40 cursor-pointer transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {team.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 font-mono">
                      {team.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{team.projectTitle}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{team.memberIds?.length || 1} Members</span>
                    <span className="text-brand-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      Workspace <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}

            <div className="pt-2 border-t border-white/5">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('create_team')}
              >
                + Create New Team
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
