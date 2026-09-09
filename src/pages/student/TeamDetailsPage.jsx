import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { calculateTeammateCompatibility } from '../../services/teammateEngine';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Users,
  UserCheck,
  Shield,
  ArrowLeft,
  UserPlus,
  LogOut,
  Calendar,
  Sparkles,
  Layers,
  Send,
} from 'lucide-react';

export function TeamDetailsPage({ teamId, onNavigate }) {
  const { currentUser } = useAuth();
  const { teams, sendJoinRequest, leaveTeam } = useData();
  const { addToast } = useNotifications();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [submittingJoin, setSubmittingJoin] = useState(false);

  const team = teams.find(t => t.id === teamId) || teams[0];

  if (!team) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Team not found.</p>
        <Button variant="primary" size="sm" onClick={() => onNavigate('dashboard')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const isLeader = team.leaderId === currentUser?.id;
  const isMember = (team.memberIds || []).includes(currentUser?.id);
  const isFull = (team.memberIds || []).length >= (team.maxMembers || 4);

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmittingJoin(true);
    try {
      // Calculate user compatibility with team leader
      const leaderFakeUser = { id: team.leaderId, technicalSkills: (team.requiredSkills || []).map(s => ({ name: s })) };
      const comp = calculateTeammateCompatibility(currentUser, leaderFakeUser);

      await sendJoinRequest(team.id, joinMessage, comp.compatibilityScore || 85);
      setShowJoinModal(false);
      setJoinMessage('');
    } catch (err) {
      addToast(err.message || 'Failed to send join request', 'error');
    } finally {
      setSubmittingJoin(false);
    }
  };

  const handleLeave = async () => {
    if (window.confirm('Are you sure you want to leave this team?')) {
      await leaveTeam(team.id);
      onNavigate('dashboard');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Back & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex items-center gap-2">
          {isLeader && (
            <Button
              variant="accent"
              size="sm"
              onClick={() => onNavigate('join_requests')}
            >
              Manage Join Requests
            </Button>
          )}

          {isMember && !isLeader && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleLeave}
              icon={LogOut}
            >
              Leave Team
            </Button>
          )}

          {!isMember && !isFull && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowJoinModal(true)}
              icon={UserPlus}
            >
              Request to Join Team
            </Button>
          )}

          {isMember && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('project_dashboard', { teamId: team.id })}
            >
              Team Workspace
            </Button>
          )}
        </div>
      </div>

      {/* Main Team Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-card-3d relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-950/30 to-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-semibold">
                {team.status || 'In Progress'}
              </span>
              <span className="text-xs text-slate-400">
                Created {new Date(team.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
              {team.name}
            </h1>

            <p className="text-xs sm:text-sm text-brand-400 font-medium">
              Project: {team.projectTitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed pt-1">
              {team.description || "Active student team collaborating on milestones, cloud architecture, and final submission."}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 text-center shrink-0 space-y-1">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Roster Capacity</span>
            <div className="text-3xl font-display font-extrabold text-white font-mono">
              {(team.memberIds || []).length} / {team.maxMembers || 4}
            </div>
            <span className="text-xs text-emerald-400 font-medium">
              {isFull ? 'Roster Full' : `${(team.maxMembers || 4) - (team.memberIds || []).length} Open Seats`}
            </span>
          </div>
        </div>
      </div>

      {/* Team Members Roster */}
      <div className="space-y-4">
        <h2 className="text-xl font-display font-bold text-white tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          Current Team Roster ({(team.members || []).length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(team.members || []).map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={member.name}
                  className="w-12 h-12 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{member.name}</span>
                    {member.id === team.leaderId && (
                      <span className="px-2 py-0.2 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-mono">
                        Team Lead
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{member.role || 'Contributor'}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 max-w-[140px] justify-end">
                {(member.skills || []).slice(0, 2).map((sk, i) => (
                  <SkillChip key={i} name={sk} size="xs" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Roles & Skills Wanted */}
      {(team.requiredSkills || []).length > 0 && (
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Skills Wanted by Team Lead
          </h3>
          <p className="text-xs text-slate-300">
            The team is actively seeking candidates possessing one or more of these capabilities:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {(team.requiredSkills || []).map((sk, i) => (
              <SkillChip key={i} name={sk} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Join Request Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title={`Request to Join "${team.name}"`}
        subtitle="Introduce yourself and explain how your skills can help achieve the project objective."
      >
        <form onSubmit={handleSendRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Message to Team Lead ({team.leaderName})
            </label>
            <textarea
              required
              rows={4}
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
              placeholder="Hi! I have strong experience in React and UI/UX and would love to build the frontend dashboard for this project..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowJoinModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submittingJoin}
              icon={Send}
              iconPosition="right"
            >
              Send Join Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
