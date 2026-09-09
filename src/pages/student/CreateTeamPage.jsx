import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { SkillChip } from '../../components/common/SkillChip';
import confetti from 'canvas-confetti';
import {
  Users,
  PlusCircle,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export function CreateTeamPage({ initialProjectId, onNavigate }) {
  const { currentUser } = useAuth();
  const { projects, createTeam } = useData();
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: '',
    projectId: initialProjectId || projects[0]?.id || '',
    description: '',
    maxMembers: 4,
    requiredSkills: ['React', 'Python'],
    deadline: '2026-06-01',
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedProject = projects.find(p => p.id === formData.projectId) || projects[0];

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    if (!formData.requiredSkills.includes(newSkillInput.trim())) {
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, newSkillInput.trim()]
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skill) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skill)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast('Please enter a team name.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const created = await createTeam({
        name: formData.name,
        projectId: selectedProject.id,
        projectTitle: selectedProject.title,
        description: formData.description,
        maxMembers: Number(formData.maxMembers),
        requiredSkills: formData.requiredSkills,
        deadline: formData.deadline,
      });

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      addToast(`🎉 Squad "${created.name}" created! You are the Team Lead.`, 'success');
      onNavigate('team_details', { teamId: created.id });
    } catch (err) {
      addToast(err.message || 'Failed to create team', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-brand-400" />
          Form a New Project Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Create a capstone team, choose your project, specify open skill roles, and recruit complementary teammates.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-3d">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name & Project Select */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Team / Squad Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. EcoVisionaries, CloudSparks"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Capstone Project *
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400 font-medium"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Team Mission & Goals
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your vision, target milestones, and what roles you are actively recruiting for..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Max Members & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Maximum Team Size (Students)
              </label>
              <select
                value={formData.maxMembers}
                onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              >
                <option value={2}>2 Members (Pair)</option>
                <option value={3}>3 Members (Standard)</option>
                <option value={4}>4 Members (Recommended)</option>
                <option value={5}>5 Members (Large)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Project Completion Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Required Skills Looking For */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Open Roles & Desired Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.requiredSkills.map((sk) => (
                <SkillChip
                  key={sk}
                  name={sk}
                  onRemove={handleRemoveSkill}
                  size="sm"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="e.g. UI/UX Design, Docker, PyTorch..."
                className="px-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                + Add Skill
              </Button>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('dashboard')}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={PlusCircle}
            >
              Create Team & Open Recruitment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
