import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { SkillChip } from '../../components/common/SkillChip';
import {
  Edit,
  ArrowLeft,
  Save,
} from 'lucide-react';

export function EditProjectPage({ projectId, onNavigate }) {
  const { projects, categories, updateProject } = useData();
  const { addToast } = useNotifications();

  const project = projects.find(p => p.id === projectId) || projects[0];

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    category: project?.category || 'Artificial Intelligence',
    difficulty: project?.difficulty || 'Intermediate',
    teamSize: project?.teamSize || '3-4',
    duration: project?.duration || '4 Months',
    objective: project?.objective || '',
    expectedOutcome: project?.expectedOutcome || '',
    requiredSkills: project?.requiredSkills || [],
    technologies: project?.technologies || [],
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      await updateProject(project.id, formData);
      onNavigate('admin_projects');
    } catch (err) {
      addToast('Failed to update project', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div>
        <button
          onClick={() => onNavigate('admin_projects')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
        </button>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Edit className="w-7 h-7 text-cyan-400" />
          Edit Project: {project?.title}
        </h1>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-3d">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Team Size
              </label>
              <input
                type="text"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Required Skills */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Required Technical Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.requiredSkills.map((sk) => (
                <SkillChip key={sk} name={sk} onRemove={handleRemoveSkill} size="sm" />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add skill..."
                className="px-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                + Add
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('admin_projects')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={Save}
            >
              Save Project Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
