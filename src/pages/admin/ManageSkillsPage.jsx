import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  FileCode2,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Layers,
} from 'lucide-react';

export function ManageSkillsPage({ onNavigate }) {
  const { skills, createSkill, deleteSkill } = useData();
  const { addToast } = useNotifications();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Languages',
    domain: 'Backend',
  });

  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Cloud & DevOps', 'AI & Data', 'Databases', 'Design', 'Security', 'Hardware', 'Tools'];
  const domains = ['Frontend', 'Backend', 'AI/ML', 'Cloud/DevOps', 'UI/UX', 'Cybersecurity', 'IoT', 'Data Science', 'Systems'];

  const filteredSkills = skills.filter(sk => {
    const matchesSearch = sk.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'All' || sk.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    await createSkill({
      name: formData.name.trim(),
      category: formData.category,
      domain: formData.domain,
    });
    setShowAddModal(false);
    setFormData({ name: '', category: 'Languages', domain: 'Backend' });
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete "${name}" from the skills database?`)) {
      await deleteSkill(id);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileCode2 className="w-7 h-7 text-cyan-400" />
            Skills Database ({skills.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain the taxonomy of recognized skills and domain synergy mappings used by the matching engine.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          icon={Plus}
        >
          + Add New Skill
        </Button>
      </div>

      {/* Search & Category Pills */}
      <div className="p-4 rounded-3xl glass-panel border border-white/10 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCat(c)}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCat === c
                  ? 'bg-brand-500/20 border border-brand-400 text-cyan-200 font-semibold shadow-glow-sm'
                  : 'bg-slate-800/60 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {filteredSkills.map((sk) => (
          <div
            key={sk.id}
            className="p-4 rounded-2xl glass-panel border border-white/10 flex items-center justify-between gap-2 group hover:border-cyan-400/40 transition-all"
          >
            <div className="truncate">
              <span className="text-sm font-bold text-white block truncate group-hover:text-cyan-300 transition-colors">
                {sk.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] text-brand-400 font-mono">{sk.category}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] text-purple-300 font-mono">{sk.domain || 'General'}</span>
              </div>
            </div>

            <button
              onClick={() => handleDelete(sk.id, sk.name)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              title="Delete skill"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Skill Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Skill to Cloud Database"
        subtitle="This skill will immediately become available in student profile pickers and project requirements."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Next.js, LangChain, Kubernetes"
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              >
                {categories.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Complementary Domain
              </label>
              <select
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              >
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Plus}
            >
              Save Skill
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
