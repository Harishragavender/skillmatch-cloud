import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { SEED_SKILLS, SEED_CATEGORIES, SOFT_SKILLS_LIST } from '../../services/seedData';
import { Button } from '../../components/common/Button';
import { SkillChip } from '../../components/common/SkillChip';
import {
  Cloud,
  User,
  Mail,
  Lock,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

export function RegisterPage({ onNavigate }) {
  const { register } = useAuth();
  const { addToast } = useNotifications();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: 'School of Computing & Data Sciences',
    department: 'Computer Science & Engineering',
    year: '3rd Year',
    experienceLevel: 'Intermediate',
    bio: '',
    technicalSkills: [
      { name: 'Python', level: 'Intermediate' },
      { name: 'React', level: 'Beginner' }
    ],
    softSkills: ['Teamwork', 'Communication'],
    interests: ['Artificial Intelligence', 'Web Development'],
  });

  const handleAddSkill = (skillName) => {
    if (!formData.technicalSkills.some(s => s.name === skillName)) {
      setFormData({
        ...formData,
        technicalSkills: [...formData.technicalSkills, { name: skillName, level: 'Intermediate' }]
      });
    }
  };

  const handleRemoveSkill = (skillName) => {
    setFormData({
      ...formData,
      technicalSkills: formData.technicalSkills.filter(s => s.name !== skillName)
    });
  };

  const handleToggleInterest = (interestName) => {
    if (formData.interests.includes(interestName)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter(i => i !== interestName)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestName]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        addToast('Please fill in your name, email, and password.', 'warning');
        return;
      }
      setStep(2);
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      addToast('Account created successfully! Welcome to SkillMatch Cloud.', 'success');
      onNavigate('dashboard');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-400 p-0.5 shadow-glow mb-2">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Cloud className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
            Create Student Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Step {step} of 2: {step === 1 ? 'Account Credentials & Academic Info' : 'Skills & Interests Setup'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-cyan-400 h-full rounded-full transition-all duration-300"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Form Container */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-3d">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
                        placeholder="e.g. Jordan Lee"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      University Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
                        placeholder="jordan@clouduniv.edu"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
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
              </>
            )}

            {step === 2 && (
              <>
                {/* Technical Skills Picker */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Selected Technical Skills ({formData.technicalSkills.length})
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-900/60 border border-white/5 min-h-[60px] mb-3">
                    {formData.technicalSkills.map((sk) => (
                      <SkillChip
                        key={sk.name}
                        name={sk.name}
                        level={sk.level}
                        onRemove={handleRemoveSkill}
                        size="sm"
                      />
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400 block mb-2">
                    Click to add popular skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {SEED_SKILLS.map((sk) => {
                      const isAdded = formData.technicalSkills.some(s => s.name === sk.name);
                      return (
                        <button
                          key={sk.id}
                          type="button"
                          onClick={() => handleAddSkill(sk.name)}
                          disabled={isAdded}
                          className={`px-2.5 py-1 rounded-xl text-xs border transition-all ${
                            isAdded
                              ? 'opacity-30 border-transparent bg-slate-800 cursor-not-allowed text-slate-500'
                              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border-white/5'
                          }`}
                        >
                          + {sk.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interests Selection */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Select Your Project Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SEED_CATEGORIES.slice(0, 8).map((cat) => {
                      const isSelected = formData.interests.includes(cat.name);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => handleToggleInterest(cat.name)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-glow-sm'
                              : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Short Bio */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Short Bio & Project Goals
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-800/80 border border-white/10 rounded-2xl text-slate-200 focus:outline-none focus:border-brand-400"
                    placeholder="Tell potential teammates what you're interested in building..."
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3 pt-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setStep(1)}
                  icon={ArrowLeft}
                >
                  Back
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                loading={loading}
                icon={step === 1 ? ArrowRight : Check}
                iconPosition="right"
              >
                {step === 1 ? 'Continue to Skills' : 'Finish & Match Projects'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-brand-400 hover:text-brand-300 font-semibold"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
