import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { findRecommendedTeammates } from '../../services/teammateEngine';
import { TeammateCard } from '../../components/cards/TeammateCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import {
  Users,
  Search,
  Sparkles,
  SlidersHorizontal,
  GraduationCap,
  Layers,
  X,
  Target,
} from 'lucide-react';

export function FindTeammatesPage({ onNavigate, targetProject: initialTargetProject = null }) {
  const { currentUser } = useAuth();
  const { students, projects } = useData();

  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [selectedTargetProjectId, setSelectedTargetProjectId] = useState(initialTargetProject?.id || 'All');

  const targetProject = projects.find(p => p.id === selectedTargetProjectId) || null;

  // Rank teammates using Complementary Synergy Engine
  const rankedTeammates = useMemo(() => {
    let result = findRecommendedTeammates(currentUser, students, targetProject);

    // 1. Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        (s.technicalSkills || []).some(sk => sk.name.toLowerCase().includes(q)) ||
        (s.interests || []).some(i => i.toLowerCase().includes(q))
      );
    }

    // 2. Domain Filter
    if (selectedDomain !== 'All') {
      result = result.filter(s =>
        (s.compatibility?.candidateDomains || []).includes(selectedDomain)
      );
    }

    return result;
  }, [currentUser, students, targetProject, search, selectedDomain]);

  const domains = ['All', 'Frontend', 'Backend', 'AI/ML', 'Cloud/DevOps', 'UI/UX', 'Cybersecurity', 'IoT', 'Data Science'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Cross-Domain Synergy Pairing</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            Find Complementary Teammates
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Discover peer developers and designers whose skills complement your profile to assemble balanced, high-achieving project squads.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('create_team')}
        >
          + Create Team
        </Button>
      </div>

      {/* Filter & Target Project Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, department, or skill..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Target Project Specific Synergy */}
          <div className="sm:col-span-6">
            <select
              value={selectedTargetProjectId}
              onChange={(e) => setSelectedTargetProjectId(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            >
              <option value="All">Target Project: General Synergy (All)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>Target Project: {p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-white/5 pt-3">
          <span className="text-xs text-slate-400 mr-2 shrink-0">Synergy Domain:</span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-purple-500/25 border border-purple-400 text-purple-200 shadow-glow-purple font-semibold'
                  : 'bg-slate-800/60 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Results Strip */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-slate-200">{rankedTeammates.length}</strong> compatible candidates</span>
        <span>Ranked by complementary synergy & shared culture</span>
      </div>

      {/* Teammates Cards Grid */}
      {rankedTeammates.length === 0 ? (
        <EmptyState
          title="No teammates match this criteria"
          description="Try broadening your domain filter or search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedDomain('All');
            setSelectedTargetProjectId('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rankedTeammates.map((student) => (
            <TeammateCard
              key={student.id}
              student={student}
              onViewProfile={() => onNavigate('teammate_profile', { studentId: student.id })}
              onInvite={() => onNavigate('teams', { inviteStudent: student })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
