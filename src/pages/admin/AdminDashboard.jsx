import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { SkillDistributionChart } from '../../components/analytics/SkillDistributionChart';
import { CategoryBreakdownChart, TeamVelocityChart } from '../../components/analytics/CategoryBreakdownChart';
import { Button } from '../../components/common/Button';
import {
  LayoutDashboard,
  Users,
  FolderGit2,
  FolderPlus,
  BarChart3,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
} from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  const { currentUser } = useAuth();
  const { projects, students, teams, skills, categories } = useData();

  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const activeTeams = teams.filter(t => t.status === 'In Progress' || t.status === 'Planning').length;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Admin Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-purple-500/30 shadow-card-3d relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Faculty Administrator & Project Coordinator Console</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              Capstone & Team Formation Analytics
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time telemetry on student skill distribution, team rosters, and project category demand across departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="accent"
              size="md"
              onClick={() => onNavigate('admin_create_project')}
              icon={FolderPlus}
            >
              + Create Project
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={() => onNavigate('admin_skills')}
            >
              Manage Skills
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled Students', value: students.length, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Academic Projects', value: projects.length, icon: FolderGit2, color: 'text-brand-400', bg: 'bg-brand-500/10' },
          { label: 'Active Student Teams', value: teams.length, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { label: 'Skills in Database', value: skills.length, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">{metric.label}</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
                  {metric.value}
                </div>
              </div>
              <div className={`p-3 rounded-2xl ${metric.bg} ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Skill Distribution */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                Most Popular Student Skills
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Top technical proficiencies possessed by registered students</p>
            </div>
          </div>
          <SkillDistributionChart skills={skills} students={students} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                Project Categories Breakdown
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Distribution of academic capstone domains</p>
            </div>
          </div>
          <CategoryBreakdownChart projects={projects} />
        </div>
      </div>

      {/* 4. Active Teams & Quick Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Teams Velocity */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Team Formation & Progress Lifecycle
            </h2>
            <button
              onClick={() => onNavigate('admin_teams')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
            >
              View All Teams
            </button>
          </div>
          <TeamVelocityChart teams={teams} />
        </div>

        {/* Quick Management Links */}
        <div className="lg:col-span-6 p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-400" />
            Quick Admin Operations
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { title: 'Manage Projects', desc: 'Edit project objectives & requirements', page: 'admin_projects' },
              { title: 'Create Project', desc: 'Publish a new faculty capstone idea', page: 'admin_create_project' },
              { title: 'Manage Students', desc: 'Moderate registered student profiles', page: 'admin_students' },
              { title: 'Manage Skills DB', desc: 'Add new trending programming languages', page: 'admin_skills' },
            ].map((op, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate(op.page)}
                className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-white/5 hover:border-cyan-400/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {op.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-cyan-400 transition-all" />
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">{op.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
