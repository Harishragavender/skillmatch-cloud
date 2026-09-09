import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { SkillChip } from '../../components/common/SkillChip';
import { Button } from '../../components/common/Button';
import {
  FileCode2,
  Search,
  Plus,
  Trash2,
  Check,
  Star,
  Sparkles,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export function SkillsManagerPage({ onNavigate }) {
  const { currentUser, updateUserProfile } = useAuth();
  const { skills: cloudSkills } = useData();
  const { addToast } = useNotifications();

  const [mySkills, setMySkills] = useState(currentUser?.technicalSkills || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newCustomSkill, setNewCustomSkill] = useState('');

  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Cloud & DevOps', 'AI & Data', 'Databases', 'Design', 'Security', 'Hardware'];

  const filteredSkills = cloudSkills.filter((sk) => {
    const matchesCat = selectedCategory === 'All' || sk.category === selectedCategory;
    const matchesSearch = sk.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddSkill = (skillName, defaultLevel = 'Intermediate') => {
    if (!mySkills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      const updated = [...mySkills, { name: skillName, level: defaultLevel }];
      setMySkills(updated);
      updateUserProfile({ technicalSkills: updated });
      addToast(`Added ${skillName} (${defaultLevel}) to your profile.`, 'success');
    }
  };

  const handleRemoveSkill = (skillName) => {
    const updated = mySkills.filter(s => s.name !== skillName);
    setMySkills(updated);
    updateUserProfile({ technicalSkills: updated });
    addToast(`Removed ${skillName}.`, 'info');
  };

  const handleChangeLevel = (skillName, newLevel) => {
    const updated = mySkills.map(s => s.name === skillName ? { ...s, level: newLevel } : s);
    setMySkills(updated);
    updateUserProfile({ technicalSkills: updated });
    addToast(`Updated ${skillName} proficiency to ${newLevel}.`, 'info');
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newCustomSkill.trim()) return;
    handleAddSkill(newCustomSkill.trim(), 'Intermediate');
    setNewCustomSkill('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FileCode2 className="w-7 h-7 text-brand-400" />
            Skills & Competency Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Fine-tune your technical skills and proficiency levels to maximize project match accuracy.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => onNavigate('recommended')}
          icon={Sparkles}
        >
          View Matched Projects
        </Button>
      </div>

      {/* Current Skills Matrix with Level Controllers */}
      <div className="p-6 rounded-3xl glass-panel border border-brand-500/25 shadow-card-3d space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-display font-bold text-white flex items-center gap-2">
              <span>Your Active Skill Stack</span>
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-mono">
                {mySkills.length} Skills
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust proficiency level for each skill to scale algorithm weights.
            </p>
          </div>
        </div>

        {mySkills.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No technical skills added yet. Select from the skill catalog below!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {mySkills.map((sk) => (
              <div
                key={sk.name}
                className="p-3 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-between gap-3 hover:border-brand-500/30 transition-all"
              >
                <div className="truncate">
                  <span className="text-sm font-semibold text-white block truncate">{sk.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleChangeLevel(sk.name, lvl)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono uppercase transition-all ${
                        sk.level === lvl
                          ? lvl === 'Advanced'
                            ? 'bg-purple-500/30 border border-purple-400 text-purple-200 font-bold'
                            : lvl === 'Intermediate'
                              ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-200 font-bold'
                              : 'bg-emerald-500/30 border border-emerald-400 text-emerald-200 font-bold'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent'
                      }`}
                    >
                      {lvl.slice(0, 3)}
                    </button>
                  ))}

                  <button
                    onClick={() => handleRemoveSkill(sk.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog & Search */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog (e.g. Python, Docker, PyTorch)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
          </div>

          {/* Add custom skill quick input */}
          <form onSubmit={handleAddCustomSkill} className="flex items-center gap-2">
            <input
              type="text"
              value={newCustomSkill}
              onChange={(e) => setNewCustomSkill(e.target.value)}
              placeholder="Add other skill..."
              className="px-3 py-2 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            />
            <Button variant="secondary" size="sm" type="submit" icon={Plus}>
              Add
            </Button>
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500/20 border border-brand-400 text-cyan-200 shadow-glow-sm font-semibold'
                  : 'bg-slate-800/60 border border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Available Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
          {filteredSkills.map((sk) => {
            const isAlreadyAdded = mySkills.some(s => s.name.toLowerCase() === sk.name.toLowerCase());
            return (
              <button
                key={sk.id}
                onClick={() => !isAlreadyAdded && handleAddSkill(sk.name, 'Intermediate')}
                disabled={isAlreadyAdded}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isAlreadyAdded
                    ? 'bg-brand-500/10 border-brand-500/30 text-brand-300 opacity-60 cursor-default'
                    : 'bg-slate-800/70 hover:bg-slate-700/80 border-white/5 hover:border-cyan-400/40 text-slate-200 group'
                }`}
              >
                <div className="truncate">
                  <p className="text-xs font-semibold truncate group-hover:text-cyan-300 transition-colors">
                    {sk.name}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sk.category}</p>
                </div>

                {isAlreadyAdded ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 shrink-0 transition-colors" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
