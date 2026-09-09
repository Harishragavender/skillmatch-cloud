import React from 'react';
import { useData } from '../../context/DataContext';
import { SkillDistributionChart } from '../../components/analytics/SkillDistributionChart';
import { CategoryBreakdownChart, TeamVelocityChart } from '../../components/analytics/CategoryBreakdownChart';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Layers,
  Sparkles,
  Users,
  Award,
} from 'lucide-react';

export function AdminAnalyticsPage({ onNavigate }) {
  const { projects, students, teams, skills } = useData();

  // Difficulty counts
  const diffCounts = { 'Beginner': 0, 'Intermediate': 0, 'Advanced': 0 };
  projects.forEach(p => {
    if (diffCounts[p.difficulty] !== undefined) {
      diffCounts[p.difficulty] += 1;
    }
  });

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-cyan-400" />
          Platform Telemetry & Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Deep data insights on student skill saturation, project demand distribution, and team formation velocities.
        </p>
      </div>

      {/* Grid of Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Saturation */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" />
              Technical Skill Frequency
            </h2>
            <span className="text-xs text-slate-400">Total Skills: {skills.length}</span>
          </div>
          <SkillDistributionChart skills={skills} students={students} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Project Domain Allocation
            </h2>
            <span className="text-xs text-slate-400">{projects.length} Active Projects</span>
          </div>
          <CategoryBreakdownChart projects={projects} />
        </div>

        {/* Difficulty Allocation */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Project Difficulty Breakdown
            </h2>
          </div>

          <div className="space-y-3 pt-2">
            {Object.entries(diffCounts).map(([lvl, count]) => {
              const colors = {
                'Beginner': 'bg-emerald-400',
                'Intermediate': 'bg-cyan-400',
                'Advanced': 'bg-purple-400',
              }[lvl];

              return (
                <div key={lvl} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{lvl}</span>
                    <span className="font-mono text-white">{count} Projects ({Math.round((count / projects.length) * 100 || 0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colors}`}
                      style={{ width: `${projects.length ? (count / projects.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Lifecycle Velocity */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Team Formation Lifecycle
            </h2>
            <span className="text-xs text-slate-400">{teams.length} Formed Squads</span>
          </div>
          <TeamVelocityChart teams={teams} />
        </div>
      </div>
    </div>
  );
}
