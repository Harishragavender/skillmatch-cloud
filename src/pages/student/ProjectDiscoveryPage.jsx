import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { calculateProjectMatch } from '../../services/matchingEngine';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import {
  Compass,
  Search,
  SlidersHorizontal,
  Sparkles,
  Layers,
  Check,
  X,
  ArrowUpDown,
} from 'lucide-react';

export function ProjectDiscoveryPage({ onNavigate, initialFilters = {} }) {
  const { currentUser } = useAuth();
  const { projects, categories, skills } = useData();

  const [search, setSearch] = useState(initialFilters.search || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'newest' | 'title'
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Compute matched projects and apply filters
  const filteredProjects = useMemo(() => {
    let result = projects.map(proj => ({
      ...proj,
      match: calculateProjectMatch(currentUser, proj)
    }));

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.requiredSkills || []).some(s => s.toLowerCase().includes(q)) ||
        (p.technologies || []).some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Difficulty Filter
    if (selectedDifficulty !== 'All') {
      result = result.filter(p => p.difficulty === selectedDifficulty);
    }

    // 4. Required Skill Filter
    if (selectedSkill !== 'All') {
      result = result.filter(p => (p.requiredSkills || []).includes(selectedSkill));
    }

    // 5. Sorting
    if (sortBy === 'match') {
      result.sort((a, b) => (b.match?.totalScore || 0) - (a.match?.totalScore || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [projects, currentUser, search, selectedCategory, selectedDifficulty, selectedSkill, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSelectedSkill('All');
    setSortBy('match');
  };

  const hasActiveFilters = search || selectedCategory !== 'All' || selectedDifficulty !== 'All' || selectedSkill !== 'All';

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
            <Compass className="w-8 h-8 text-cyan-400" />
            Project Discovery
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse active academic projects with live compatibility scoring tailored to your skill profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate('recommended')}
            icon={Sparkles}
          >
            Recommended Only
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, required skills, or tech..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400"
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

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:col-span-3 flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            >
              <option value="match">Sort: Match % (High to Low)</option>
              <option value="newest">Sort: Newest Added</option>
              <option value="title">Sort: Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills (Difficulty & Quick Skills) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Difficulty:</span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1 rounded-xl font-medium border transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-brand-500/20 border-brand-400 text-cyan-200 font-semibold shadow-glow-sm'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-slate-200">{filteredProjects.length}</strong> matching projects</span>
        <span>Ranked using 4-factor algorithm</span>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects match your filters"
          description="Try broadening your search query or clearing the category and difficulty filters."
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onViewDetails={() => onNavigate('project_details', { projectId: proj.id })}
              onAnalyzeGap={() => onNavigate('skillgap', { projectId: proj.id })}
            />
          ))}
        </div>
      )}
    </div>
  );
}
