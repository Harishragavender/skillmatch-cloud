import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { TeamCard } from '../../components/cards/TeamCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import {
  Bookmark,
  Users,
  FolderGit2,
  Sparkles,
  PlusCircle,
  Compass,
} from 'lucide-react';

export function MyProjectsPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const { projects, teams, bookmarks } = useData();

  const [activeTab, setActiveTab] = useState('teams'); // 'teams' | 'bookmarks'

  if (!currentUser) return null;

  // Active teams where user is a member
  const myTeams = teams.filter(t => (t.memberIds || []).includes(currentUser.id));

  // Bookmarked projects
  const bookmarkedProjects = projects.filter(p => bookmarks.includes(p.id));

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-cyan-400" />
            My Projects & Squads
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Access your active team workspaces and manage your saved project bookmarks.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'teams'
                ? 'bg-brand-500/20 border border-brand-400 text-cyan-200 shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Active Teams ({myTeams.length})
          </button>

          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bookmarks'
                ? 'bg-brand-500/20 border border-brand-400 text-cyan-200 shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Bookmarks ({bookmarkedProjects.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'teams' ? (
        myTeams.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No active teams yet"
            description="You haven't formed or joined a project squad. Create a team or apply to an open roster."
            actionLabel="Create a Team"
            onAction={() => onNavigate('create_team')}
            secondaryActionLabel="Explore Projects"
            onSecondaryAction={() => onNavigate('projects')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTeams.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                onViewTeam={() => onNavigate('project_dashboard', { teamId: team.id })}
                isMember={true}
                isLeader={team.leaderId === currentUser.id}
              />
            ))}
          </div>
        )
      ) : (
        bookmarkedProjects.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No bookmarked projects"
            description="You can bookmark projects in the discovery catalog to review them later."
            actionLabel="Browse Projects"
            onAction={() => onNavigate('projects')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedProjects.map(proj => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onViewDetails={() => onNavigate('project_details', { projectId: proj.id })}
                onAnalyzeGap={() => onNavigate('skillgap', { projectId: proj.id })}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
