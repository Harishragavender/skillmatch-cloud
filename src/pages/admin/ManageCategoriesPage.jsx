import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import {
  Layers,
  Plus,
} from 'lucide-react';

export function ManageCategoriesPage({ onNavigate }) {
  const { categories, createCategory, projects } = useData();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createCategory({ name: name.trim(), description: description.trim() });
    setShowAddModal(false);
    setName('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-purple-400" />
            Project & Interest Categories ({categories.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage academic domains that guide student interest matching and capstone classification.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setShowAddModal(true)}
          icon={Plus}
        >
          + Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const projectCount = projects.filter(p => p.category === cat.name).length;
          return (
            <div
              key={cat.id}
              className="p-6 rounded-3xl glass-panel border border-white/10 space-y-3 hover:border-purple-500/40 transition-all shadow-card-3d group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                  {projectCount} Projects
                </span>
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                {cat.name}
              </h3>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                {cat.description || "Academic computing domain for undergraduate capstone research."}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create New Project Category"
        subtitle="This category will be selectable by students and faculty when creating new projects."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Quantum Computing, Embedded Edge AI"
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what kinds of projects fall under this domain..."
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
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
              Save Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
