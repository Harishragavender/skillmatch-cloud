import React from 'react';
import { Sparkles, CheckCircle, Zap, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function MatchBadge({ score, label, tier, size = 'md', showIcon = true, className = '' }) {
  // If only score is provided, determine tier
  let resolvedTier = tier;
  let resolvedLabel = label;

  if (score !== undefined && (!resolvedTier || !resolvedLabel)) {
    if (score >= 90) {
      resolvedTier = 'excellent';
      resolvedLabel = resolvedLabel || 'Excellent Match';
    } else if (score >= 75) {
      resolvedTier = 'strong';
      resolvedLabel = resolvedLabel || 'Strong Match';
    } else if (score >= 60) {
      resolvedTier = 'good';
      resolvedLabel = resolvedLabel || 'Good Match';
    } else if (score >= 40) {
      resolvedTier = 'moderate';
      resolvedLabel = resolvedLabel || 'Moderate Match';
    } else {
      resolvedTier = 'low';
      resolvedLabel = resolvedLabel || 'Low Match';
    }
  }

  const styles = {
    excellent: {
      bg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 shadow-glow-emerald',
      icon: Sparkles,
      dot: 'bg-emerald-400',
    },
    strong: {
      bg: 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300 shadow-glow-cyan',
      icon: Zap,
      dot: 'bg-cyan-400',
    },
    good: {
      bg: 'bg-amber-500/15 border-amber-500/35 text-amber-300 shadow-sm',
      icon: CheckCircle,
      dot: 'bg-amber-400',
    },
    moderate: {
      bg: 'bg-orange-500/15 border-orange-500/35 text-orange-300 shadow-sm',
      icon: AlertCircle,
      dot: 'bg-orange-400',
    },
    low: {
      bg: 'bg-rose-500/15 border-rose-500/35 text-rose-300 shadow-sm',
      icon: AlertCircle,
      dot: 'bg-rose-400',
    },
  };

  const current = styles[resolvedTier] || styles.good;
  const IconComponent = current.icon;

  const sizeClass = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    lg: 'px-4 py-2 text-sm font-bold gap-2',
  }[size];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border backdrop-blur-md transition-all duration-300",
        current.bg,
        sizeClass,
        className
      )}
    >
      {showIcon && <IconComponent className={clsx(size === 'xs' ? 'w-2.5 h-2.5' : size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5', 'shrink-0 animate-pulse')} />}
      {score !== undefined && <span className="font-mono font-bold tracking-tight">{score}%</span>}
      {score !== undefined && resolvedLabel && <span className="opacity-40">•</span>}
      {resolvedLabel && <span>{resolvedLabel}</span>}
    </span>
  );
}
