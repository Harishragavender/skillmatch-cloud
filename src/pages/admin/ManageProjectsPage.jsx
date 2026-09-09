import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { SkillChip } from '../../components/common/SkillChip';
import {
  FolderGit2,
  FolderPlus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Plus,
} from 'lucide-react';

export function ManageProjectsPage({ onNavigate }) {
  const { projects, deleteProject, updateProject } = useData();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProject(id);
    }
  };

  const handleToggleStatus = async (project) => {
    const nextStatus = project.status === 'In Progress' ? 'Completed' : project.status === 'Planning' ? 'In Progress' : 'Planning';
    await updateProject(project.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-brand-400" />
            Manage Academic Projects ({projects.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, update project requirements, modify expected outcomes, or archive completed capstones.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('admin_create_project')}
          icon={FolderPlus}
        >
          + Add New Project
        </Button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-xl text-slate-200 focus:outline-none focus:border-brand-400"
          />
        </div>
      </div>

      {/* Projects Table / Responsive Card View */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-card-3d">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-semibold border-b border-white/10 tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Project Title & Category</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4">Required Skills</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProjects.map((proj) => (
                <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 sm:px-6 max-w-xs">
                    <div
                      onClick={() => onNavigate('project_details', { projectId: proj.id })}
                      className="font-bold text-white hover:text-cyan-300 cursor-pointer transition-colors"
                    >
                      {proj.title}
                    </div>
                    <span className="text-xs text-brand-400 font-medium block mt-0.5">{proj.category}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                      proj.difficulty === 'Advanced' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      proj.difficulty === 'Intermediate' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {proj.difficulty}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(proj.requiredSkills || []).slice(0, 3).map((sk, idx) => (
                        <SkillChip key={idx} name={sk} size="xs" />
                      ))}
                      {(proj.requiredSkills || []).length > 3 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{proj.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleStatus(proj)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-white/5 hover:border-white/20 text-xs font-mono font-bold text-slate-200 transition-colors"
                      title="Click to advance status"
                    >
                      {proj.status || 'Planning'}
                    </button>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onNavigate('admin_edit_project', { projectId: proj.id })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proj.id, proj.title)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
