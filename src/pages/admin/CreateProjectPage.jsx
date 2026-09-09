import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { SkillChip } from '../../components/common/SkillChip';
import {
  FolderPlus,
  ArrowLeft,
  Sparkles,
  Plus,
  Layers,
} from 'lucide-react';

export function CreateProjectPage({ onNavigate }) {
  const { currentUser } = useAuth();
  const { categories, createProject } = useData();
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Artificial Intelligence',
    difficulty: 'Intermediate',
    teamSize: '3-4',
    maxMembers: 4,
    duration: '4 Months',
    objective: '',
    expectedOutcome: '',
    requiredSkills: ['Python', 'Machine Learning'],
    technologies: ['Python', 'FastAPI', 'React'],
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [newTechInput, setNewTechInput] = useState('');
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

  const handleAddTech = (e) => {
    e.preventDefault();
    if (!newTechInput.trim()) return;
    if (!formData.technologies.includes(newTechInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, newTechInput.trim()]
      });
    }
    setNewTechInput('');
  };

  const handleRemoveTech = (tech) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      addToast('Please enter a project title and description.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await createProject({
        ...formData,
        createdBy: currentUser?.name || 'Prof. Robert Vance',
        createdById: currentUser?.id || 'admin-robert',
      });
      onNavigate('admin_projects');
    } catch (err) {
      addToast('Failed to create project', 'error');
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
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects Directory
        </button>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <FolderPlus className="w-7 h-7 text-cyan-400" />
          Publish New Academic Capstone Project
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Specify project scope, required skills, and duration. The matching algorithm will immediately index and rank this project for eligible students.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-3d">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Autonomous Campus Navigation & Fleet Routing"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Primary Category / Domain *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Comprehensive Description *
            </label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline the architectural problem statement, dataset, and core challenges..."
              className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Difficulty, Team Size, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Difficulty Level
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
                Recommended Team Size
              </label>
              <input
                type="text"
                value={formData.teamSize}
                onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                placeholder="e.g. 3-4"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Estimated Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 4 Months"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Objective & Expected Outcome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Project Objective & Research Goals
              </label>
              <textarea
                rows={2}
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                placeholder="State the measurable goal (e.g. Reduce energy load by 25%)..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Expected Deliverables & Outcomes
              </label>
              <textarea
                rows={2}
                value={formData.expectedOutcome}
                onChange={(e) => setFormData({ ...formData, expectedOutcome: e.target.value })}
                placeholder="e.g. Working camera prototype, API server, final paper..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          {/* Required Skills Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Required Technical Skills ({formData.requiredSkills.length})
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
                placeholder="Add required skill (e.g. Docker, Python)..."
                className="px-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                + Add Skill
              </Button>
            </div>
          </div>

          {/* Recommended Technologies Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Recommended Technologies ({formData.technologies.length})
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.technologies.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-xl bg-slate-800 border border-white/5 text-slate-200 text-xs font-medium flex items-center gap-2"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(t)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTechInput}
                onChange={(e) => setNewTechInput(e.target.value)}
                placeholder="Add technology (e.g. PyTorch, Firebase)..."
                className="px-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
              <Button type="button" variant="secondary" size="sm" onClick={handleAddTech}>
                + Add Tech
              </Button>
            </div>
          </div>

          {/* Submit Action */}
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
              icon={FolderPlus}
            >
              Publish Project to Cloud
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
