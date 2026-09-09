import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import {
  FolderGit2,
  Users,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Calendar,
  Layers,
  Plus,
  Trash2,
  Award,
} from 'lucide-react';

export function ProjectDashboardPage({ teamId, onNavigate }) {
  const { currentUser } = useAuth();
  const { teams, projects, updateTeam } = useData();
  const { addToast } = useNotifications();

  const team = teams.find(t => t.id === teamId) || teams[0];
  const project = projects.find(p => p.id === team?.projectId) || projects[0];

  const [milestones, setMilestones] = useState([
    { id: 1, title: 'Literature survey & architecture diagram', done: true },
    { id: 2, title: 'Cloud Firestore database schema & auth integration', done: true },
    { id: 3, title: 'Core machine learning model training & inference API', done: false },
    { id: 4, title: 'Interactive frontend client dashboard & WebSockets', done: false },
    { id: 5, title: 'Final project defense presentation & report', done: false },
  ]);

  const [newTaskText, setNewTaskText] = useState('');

  if (!team || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Team workspace not found.</p>
        <Button variant="primary" size="sm" onClick={() => onNavigate('dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isLeader = team.leaderId === currentUser?.id;

  // Compute Team Skill Coverage
  const allTeamSkills = new Set();
  (team.members || []).forEach(m => {
    (m.skills || []).forEach(s => allTeamSkills.add(s.toLowerCase()));
  });

  const requiredSkills = project.requiredSkills || [];
  const coveredSkills = requiredSkills.filter(s => allTeamSkills.has(s.toLowerCase()));
  const teamCoveragePercent = requiredSkills.length > 0
    ? Math.round((coveredSkills.length / requiredSkills.length) * 100)
    : 100;

  const handleStatusChange = async (newStatus) => {
    await updateTeam(team.id, { status: newStatus });
  };

  const handleToggleMilestone = (id) => {
    const updated = milestones.map(m => m.id === id ? { ...m, done: !m.done } : m);
    setMilestones(updated);
    const completedCount = updated.filter(m => m.done).length;
    const newProgress = Math.round((completedCount / updated.length) * 100);
    updateTeam(team.id, { progress: newProgress });
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    const newM = { id: Date.now(), title: newTaskText.trim(), done: false };
    setMilestones([...milestones, newM]);
    setNewTaskText('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('my_projects')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Projects
          </button>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {team.name} Workspace
            </h1>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold">
              {team.status || 'In Progress'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-brand-400 mt-1">
            Project: {project.title}
          </p>
        </div>

        {/* Status Switcher */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 text-xs">
          {['Planning', 'In Progress', 'Review', 'Completed'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                team.status === st
                  ? 'bg-brand-500/30 border border-brand-400 text-cyan-200 shadow-glow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Progress & Deadline Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Progress</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-white font-mono">{team.progress || 45}%</span>
            <span className="text-xs text-cyan-400 font-semibold">{milestones.filter(m => m.done).length} / {milestones.length} Milestones</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${team.progress || 45}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Skill Coverage</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-display font-black text-emerald-400 font-mono">{teamCoveragePercent}%</span>
            <span className="text-xs text-slate-400">{coveredSkills.length} of {requiredSkills.length} Required</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${teamCoveragePercent}%` }}
            />
          </div>
        </div>

        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Deadline</span>
          <div className="flex items-center gap-2 text-2xl font-display font-bold text-white mt-1">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>{team.deadline || '2026-06-01'}</span>
          </div>
          <span className="text-[11px] text-slate-400 block">Faculty Review Session: Week 14</span>
        </div>
      </div>

      {/* 2-Column: Team Skill Coverage Matrix vs Milestone Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Skill Coverage Matrix */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Team Skill Coverage Matrix
              </h2>
              <span className="text-xs text-slate-400">{coveredSkills.length}/{requiredSkills.length} Covered</span>
            </div>

            <div className="space-y-2.5">
              {requiredSkills.map((skName, i) => {
                const isCovered = allTeamSkills.has(skName.toLowerCase());
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white">{skName}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isCovered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    }`}>
                      {isCovered ? '✓ Covered by Squad' : 'Open Gap'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Member Roster List */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-400" />
              Team Roster ({(team.members || []).length})
            </h2>

            <div className="space-y-2.5">
              {(team.members || []).map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={m.name}
                      className="w-8 h-8 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-bold text-white">{m.name}</p>
                      <p className="text-[10px] text-slate-400">{m.role || 'Member'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-end max-w-[150px]">
                    {(m.skills || []).slice(0, 2).map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Milestones & Tasks Checklist */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Project Milestones & Deliverables
              </h2>
            </div>

            <div className="space-y-2">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    m.done
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-300'
                      : 'bg-slate-800/80 border-white/5 text-white hover:border-brand-500/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={m.done}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs font-medium leading-relaxed ${m.done ? 'line-through text-slate-400' : ''}`}>
                    {m.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddMilestone} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add milestone / deliverable..."
                className="flex-1 px-3 py-2 text-xs bg-slate-800/80 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
