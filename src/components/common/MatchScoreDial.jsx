import React from 'react';
import { clsx } from 'clsx';

export function MatchScoreDial({
  score = 88,
  tierLabel = 'Strong Match',
  size = 'md',
  breakdown = null,
  showBreakdown = true,
  className = '',
}) {
  const radius = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;
  const stroke = size === 'sm' ? 6 : size === 'lg' ? 10 : 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeGradient = 'url(#cyan-gradient)';
  let glowColor = 'rgba(56, 189, 248, 0.4)';
  let textColor = 'text-cyan-400';

  if (score >= 90) {
    strokeGradient = 'url(#emerald-gradient)';
    glowColor = 'rgba(16, 185, 129, 0.45)';
    textColor = 'text-emerald-400';
  } else if (score >= 75) {
    strokeGradient = 'url(#cyan-gradient)';
    glowColor = 'rgba(0, 240, 255, 0.45)';
    textColor = 'text-cyan-400';
  } else if (score >= 60) {
    strokeGradient = 'url(#amber-gradient)';
    glowColor = 'rgba(245, 158, 11, 0.4)';
    textColor = 'text-amber-400';
  } else if (score >= 40) {
    strokeGradient = 'url(#orange-gradient)';
    glowColor = 'rgba(249, 115, 22, 0.4)';
    textColor = 'text-orange-400';
  } else {
    strokeGradient = 'url(#rose-gradient)';
    glowColor = 'rgba(244, 63, 94, 0.4)';
    textColor = 'text-rose-400';
  }

  const dim = radius * 2;

  return (
    <div className={clsx("flex flex-col items-center", className)}>
      <div
        className="relative flex items-center justify-center select-none"
        style={{ width: dim, height: dim }}
      >
        {/* Glow ambient */}
        <div
          className="absolute inset-2 rounded-full blur-xl opacity-40 transition-all duration-700"
          style={{ background: glowColor }}
        />

        <svg height={dim} width={dim} className="transform -rotate-90">
          <defs>
            <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="cyan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
            <linearGradient id="amber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="rose-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>

          {/* Track background */}
          <circle
            stroke="rgba(255, 255, 255, 0.08)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Animated active stroke */}
          <circle
            stroke={strokeGradient}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={clsx("font-display font-extrabold tracking-tight", textColor, size === 'sm' ? 'text-base' : size === 'lg' ? 'text-3xl' : 'text-2xl')}>
            {score}%
          </span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
            Match
          </span>
        </div>
      </div>

      {tierLabel && (
        <span className={clsx("mt-2 font-semibold text-center", textColor, size === 'sm' ? 'text-xs' : 'text-sm')}>
          {tierLabel}
        </span>
      )}

      {/* Multi-Factor Breakdown Bars */}
      {showBreakdown && breakdown && (
        <div className="w-full mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Skills (50% max)</span>
            <span className="font-mono font-medium text-slate-200">{breakdown.skill || 0}/50</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-brand-400 h-full rounded-full transition-all duration-500" style={{ width: `${((breakdown.skill || 0) / 50) * 100}%` }} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400">Interests (25% max)</span>
            <span className="font-mono font-medium text-slate-200">{breakdown.interest || 0}/25</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-400 h-full rounded-full transition-all duration-500" style={{ width: `${((breakdown.interest || 0) / 25) * 100}%` }} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400">Tech Stack (15% max)</span>
            <span className="font-mono font-medium text-slate-200">{breakdown.technology || 0}/15</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-cyan-400 h-full rounded-full transition-all duration-500" style={{ width: `${((breakdown.technology || 0) / 15) * 100}%` }} />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-400">Difficulty (10% max)</span>
            <span className="font-mono font-medium text-slate-200">{breakdown.difficulty || 0}/10</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${((breakdown.difficulty || 0) / 10) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
