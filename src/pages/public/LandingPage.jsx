import React, { useState } from 'react';
import { HeroMatching3D } from '../../components/visualizer/HeroMatching3D';
import { Button } from '../../components/common/Button';
import { MatchBadge } from '../../components/common/MatchBadge';
import { SkillChip } from '../../components/common/SkillChip';
import {
  Sparkles,
  ArrowRight,
  Brain,
  Users,
  Layers,
  Cloud,
  CheckCircle2,
  Shield,
  Zap,
  Target,
  GraduationCap,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export function LandingPage({ onNavigate }) {
  // Interactive mini-match preview state on landing page
  const [selectedDemoSkill, setSelectedDemoSkill] = useState(['Python', 'Machine Learning']);
  const availableSkills = ['Python', 'Machine Learning', 'Computer Vision', 'Firebase', 'Docker', 'React', 'UI/UX Design'];

  const toggleSkill = (skill) => {
    if (selectedDemoSkill.includes(skill)) {
      setSelectedDemoSkill(selectedDemoSkill.filter(s => s !== skill));
    } else {
      setSelectedDemoSkill([...selectedDemoSkill, skill]);
    }
  };

  // Demo score calculation for landing preview
  const demoTargetProject = ['Python', 'Computer Vision', 'Machine Learning', 'Firebase'];
  const matchedCount = selectedDemoSkill.filter(s => demoTargetProject.includes(s)).length;
  const demoScore = Math.min(98, Math.round((matchedCount / demoTargetProject.length) * 50 + 44));

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-300 text-xs font-semibold shadow-glow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Next-Gen Academic Project & Team Matching</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-[1.1]">
              Find the right project.{' '}
              <span className="gradient-text-cyan block mt-1">Build the right team.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              SkillMatch Cloud connects your skills and interests with the projects and teammates that fit you best using weighted matching algorithms and cloud intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                variant="primary"
                size="xl"
                onClick={() => onNavigate('projects')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Find Your Project
              </Button>
              <Button
                variant="secondary"
                size="xl"
                onClick={() => onNavigate('projects')}
              >
                Explore Projects
              </Button>
            </div>

            {/* Quick Metrics Counter */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-md mx-auto lg:mx-0">
              <div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">4-Factor</span>
                <p className="text-xs text-slate-400 mt-0.5">Weighted Matching</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-cyan-400">100%</span>
                <p className="text-xs text-slate-400 mt-0.5">Complementary Synergy</p>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-purple-400">Cloud DB</span>
                <p className="text-xs text-slate-400 mt-0.5">Real-Time Sync</p>
              </div>
            </div>
          </div>

          {/* Hero Right 3D Visualizer */}
          <div className="lg:col-span-6">
            <HeroMatching3D />
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE MATCHING PREVIEW PLAYGROUND */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl glass-panel border border-brand-500/30 shadow-card-3d relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5" /> Interactive Algorithm Test
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                Experience Dynamic Weighted Matching
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Toggle skills below to watch how our algorithm re-calculates compatibility and identifies remaining skill gaps in real-time against <em>"AI-Based Campus Waste Classification"</em>.
              </p>

              {/* Toggleable Skills */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Select your current skills:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableSkills.map((sk) => {
                    const isSelected = selectedDemoSkill.includes(sk);
                    return (
                      <button
                        key={sk}
                        onClick={() => toggleSkill(sk)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-brand-500/30 border-brand-400 text-cyan-200 shadow-glow-sm'
                            : 'bg-slate-800/80 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {sk}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Calculated Result Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col items-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Calculated Project Match
              </span>
              <div className="text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300 my-1 font-mono">
                {demoScore}%
              </div>
              <MatchBadge
                score={demoScore}
                size="sm"
                className="mt-1 mb-4"
              />

              <div className="w-full text-left p-3 rounded-xl bg-slate-800/60 border border-white/5 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-300">
                  <span>Required Skills Met:</span>
                  <span className="font-mono font-bold text-emerald-400">{matchedCount} of 4</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Missing Gaps:</span>
                  <span className="font-mono text-rose-400">{4 - matchedCount} skills</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                className="w-full mt-4"
                onClick={() => onNavigate('projects')}
              >
                Match With Real Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            How SkillMatch Cloud Works
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            A frictionless 4-step pipeline turning student skillsets into high-performing capstone teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Build Skill Profile',
              desc: 'Select technical skills with proficiencies (Beginner, Intermediate, Advanced), soft skills, and domain interests.',
              icon: Brain,
              color: 'from-brand-500 to-cyan-400',
            },
            {
              step: '02',
              title: 'Algorithmic Discovery',
              desc: 'Our 4-factor formula scores projects on skills (50%), interests (25%), tech stack (15%), and difficulty (10%).',
              icon: Target,
              color: 'from-purple-500 to-indigo-400',
            },
            {
              step: '03',
              title: 'Skill Gap Analysis',
              desc: 'Inspect exact missing skills per project with simulated "what-if" score jumps and curated learning paths.',
              icon: TrendingUp,
              color: 'from-emerald-500 to-teal-400',
            },
            {
              step: '04',
              title: 'Complementary Teams',
              desc: 'Discover peers whose domains (e.g. Frontend + ML) complement your skillset to build balanced, complete squads.',
              icon: Users,
              color: 'from-pink-500 to-rose-400',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-6 rounded-3xl border border-white/10 relative group hover:border-brand-400/40 transition-all duration-300"
              >
                <span className="font-mono text-3xl font-extrabold text-white/10 group-hover:text-cyan-400/20 transition-colors block mb-4">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} p-0.5 mb-4 shadow-glow-sm`}>
                  <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-display font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLOUD COMPUTING ARCHITECTURE HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel border border-white/10 p-8 sm:p-12 relative overflow-hidden bg-gradient-to-b from-slate-900/90 to-brand-950/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold">
                <Cloud className="w-3.5 h-3.5" /> Built For Cloud Computing Evaluation
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
                Enterprise Cloud Architecture & Scalability
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                SkillMatch Cloud leverages Google Firebase Authentication, Cloud Firestore document collections, and reactive client state to guarantee sub-50ms query speeds, zero-downtime persistence, and hardened role-based authorization.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cloud Authentication & Security Rules</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-Time Cloud Firestore Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Multi-Tenant Role-Based Access Control</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Decoupled Matching Microservices</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg">
                <span className="text-[11px] font-mono text-cyan-400 uppercase block mb-1">Architecture Flow</span>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  React SPA → Cloud Auth → Weighted Calculation Engine → Cloud Firestore → Reactive Client Store
                </p>
              </div>

              <Button
                variant="accent"
                size="lg"
                onClick={() => onNavigate('cloud_architecture')}
                icon={ChevronRight}
                iconPosition="right"
              >
                Inspect Cloud Architecture
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION & FOOTER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
          Ready to discover your next capstone project?
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Join hundreds of students building cutting-edge AI, cloud, and engineering projects with perfect teammates.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            variant="primary"
            size="xl"
            onClick={() => onNavigate('register')}
            icon={ArrowRight}
            iconPosition="right"
          >
            Create Your Profile
          </Button>
          <Button
            variant="secondary"
            size="xl"
            onClick={() => onNavigate('dashboard')}
          >
            Open Live Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2 text-slate-400">
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">SkillMatch Cloud</span>
          <span>© 2026. Academic Cloud Computing Platform.</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => onNavigate('projects')} className="hover:text-slate-300">Projects</button>
          <button onClick={() => onNavigate('teammates')} className="hover:text-slate-300">Teammates</button>
          <button onClick={() => onNavigate('cloud_architecture')} className="hover:text-slate-300">Cloud Specs</button>
        </div>
      </footer>
    </div>
  );
}
