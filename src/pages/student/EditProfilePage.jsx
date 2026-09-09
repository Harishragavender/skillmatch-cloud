import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { SEED_CATEGORIES, SOFT_SKILLS_LIST } from '../../services/seedData';
import { Button } from '../../components/common/Button';
import {
  User,
  GraduationCap,
  Building,
  Mail,
  Save,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export function EditProfilePage({ onNavigate }) {
  const { currentUser, updateUserProfile } = useAuth();
  const { addToast } = useNotifications();

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    college: currentUser?.college || '',
    department: currentUser?.department || '',
    year: currentUser?.year || '3rd Year',
    experienceLevel: currentUser?.experienceLevel || 'Intermediate',
    bio: currentUser?.bio || '',
    softSkills: currentUser?.softSkills || [],
    interests: currentUser?.interests || [],
  });

  const [loading, setLoading] = useState(false);

  const handleToggleSoftSkill = (skill) => {
    if (formData.softSkills.includes(skill)) {
      setFormData({ ...formData, softSkills: formData.softSkills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, softSkills: [...formData.softSkills, skill] });
    }
  };

  const handleToggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserProfile(formData);
      addToast('Profile updated successfully!', 'success');
      onNavigate('profile');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Profile
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Edit Student Profile
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          loading={loading}
          icon={Save}
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Academic & Contact Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Academic Year
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                College / School
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Experience Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    formData.experienceLevel === lvl
                      ? 'bg-brand-500/20 border-brand-400 text-cyan-300 shadow-glow-sm'
                      : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Bio & Project Vision
          </h2>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-3 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
            placeholder="Introduce your engineering passions, preferred architectures, and past project experience..."
          />
        </div>

        {/* Soft Skills */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Soft & Collaboration Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {SOFT_SKILLS_LIST.map((ss) => {
              const isSelected = formData.softSkills.includes(ss);
              return (
                <button
                  key={ss}
                  type="button"
                  onClick={() => handleToggleSoftSkill(ss)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200 shadow-glow-sm'
                      : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {ss}
                </button>
              );
            })}
          </div>
        </div>

        {/* Project Interests */}
        <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Project Domains & Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {SEED_CATEGORIES.map((cat) => {
              const isSelected = formData.interests.includes(cat.name);
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleToggleInterest(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-sm'
                      : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '} {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
