import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { MatchBadge } from '../../components/common/MatchBadge';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Flame,
  CheckCircle,
  XCircle,
  Inbox,
  Send,
  Sparkles,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';

export function JoinRequestsPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const { joinRequests, teams, resolveJoinRequest } = useData();

  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'

  if (!currentUser) return null;

  // Teams where current user is leader
  const myLeadTeamIds = teams.filter(t => t.leaderId === currentUser.id).map(t => t.id);

  // Received requests for user's led teams
  const receivedRequests = joinRequests.filter(r => myLeadTeamIds.includes(r.teamId));

  // Sent requests by current user
  const sentRequests = joinRequests.filter(r => r.studentId === currentUser.id);

  const handleAction = async (request, status) => {
    const studentObj = {
      id: request.studentId,
      name: request.studentName,
      avatar: request.studentAvatar,
      technicalSkills: (request.studentSkills || []).map(s => ({ name: s })),
    };
    await resolveJoinRequest(request.id, status, request.teamId, studentObj);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-3">
            <Flame className="w-8 h-8 text-cyan-400" />
            Team Join Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review incoming candidate applications for your squads or track requests you dispatched.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/80 border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'received'
                ? 'bg-brand-500/20 border border-brand-400 text-cyan-200 shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            Received ({receivedRequests.filter(r => r.status === 'pending').length})
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'sent'
                ? 'bg-brand-500/20 border border-brand-400 text-cyan-200 shadow-glow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" />
            Sent ({sentRequests.length})
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'received' ? (
        receivedRequests.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No incoming join requests"
            description="When peers discover your teams in the directory and request to join, their profiles will appear here for your review."
            actionLabel="View My Teams"
            onAction={() => onNavigate('dashboard')}
          />
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((req) => {
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req.id}
                  className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4 shadow-card-3d"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={req.studentName}
                        className="w-12 h-12 rounded-2xl object-cover border border-brand-400/30"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{req.studentName}</h3>
                          <MatchBadge score={req.compatibilityScore || 88} size="xs" />
                        </div>
                        <p className="text-xs text-slate-400">
                          {req.studentDepartment || 'Computer Science'} • Applied to <strong className="text-slate-200">{req.teamName || 'Your Team'}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isPending ? (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleAction(req, 'accepted')}
                            icon={CheckCircle}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleAction(req, 'rejected')}
                            icon={XCircle}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                          req.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {req.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  {req.message && (
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-xs text-slate-200 leading-relaxed font-normal">
                      "{req.message}"
                    </div>
                  )}

                  {/* Candidate Skills */}
                  {(req.studentSkills || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 self-center mr-1">Skills:</span>
                      {req.studentSkills.map((sk, i) => (
                        <SkillChip key={i} name={sk} size="xs" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        sentRequests.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No sent requests"
            description="You haven't requested to join any teams yet. Browse open squads and send an application!"
            actionLabel="Find Teams"
            onAction={() => onNavigate('projects')}
          />
        ) : (
          <div className="space-y-4">
            {sentRequests.map((req) => (
              <div
                key={req.id}
                className="p-5 rounded-3xl glass-panel border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Application to {req.teamName || 'Team'}</h3>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                      req.status === 'accepted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : req.status === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Project: {req.projectTitle}</p>
                  {req.message && (
                    <p className="text-xs text-slate-300 mt-2 italic bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
                      "{req.message}"
                    </p>
                  )}
                </div>

                <div className="text-right text-xs text-slate-400 shrink-0">
                  <span>Sent {new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
