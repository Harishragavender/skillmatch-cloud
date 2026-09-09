import React from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { Users } from 'lucide-react';

export function ManageTeamsPage({ onNavigate }) {
  const { teams } = useData();

  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-cyan-400" />
          Active Capstone Squads ({teams.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor team roster health, leader assignments, and milestone execution across all registered teams.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="p-6 rounded-3xl glass-panel border border-white/10 shadow-card-3d space-y-4 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {team.status || 'In Progress'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {(team.memberIds || []).length} / {team.maxMembers || 4} Members
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{team.name}</h3>
              <p className="text-xs text-brand-400 font-medium line-clamp-1 mt-0.5">
                {team.projectTitle}
              </p>
              <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                {team.description || "Active collaboration squad."}
              </p>

              {/* Members Avatar Row */}
              <div className="flex items-center gap-2 py-3 my-2 border-y border-white/5">
                <div className="flex items-center -space-x-2">
                  {(team.members || []).map((m, i) => (
                    <img
                      key={i}
                      src={m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={m.name}
                      title={m.name}
                      className="w-7 h-7 rounded-full ring-2 ring-slate-900 object-cover"
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400">
                  Leader: <strong className="text-white">{team.leaderName}</strong>
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onNavigate('team_details', { teamId: team.id })}
            >
              Inspect Team Workspace
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
