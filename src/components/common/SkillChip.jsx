import React from 'react';
import { clsx } from 'clsx';
import { X, Check, Star } from 'lucide-react';

export function SkillChip({
  name,
  level,
  onRemove,
  onClick,
  selected = false,
  status = 'default', // 'default' | 'matched' | 'missing' | 'recommended'
  size = 'md',
  className = '',
}) {
  const levelBadgeColor = {
    'Advanced': 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    'Intermediate': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    'Beginner': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  }[level] || 'bg-slate-700/50 text-slate-300 border-slate-600/50';

  const statusStyles = {
    default: selected
      ? 'bg-brand-500/20 border-brand-400 text-brand-200 shadow-glow-sm'
      : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-200 hover:border-slate-600',
    matched: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
    missing: 'bg-rose-500/10 border-rose-500/30 text-rose-300/90 line-through opacity-80',
    recommended: 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 border-dashed animate-pulse',
  }[status];

  const sizeClass = {
    xs: 'px-2 py-0.5 text-[10px] gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs font-medium gap-2',
    lg: 'px-4 py-2 text-sm font-medium gap-2.5',
  }[size];

  return (
    <div
      onClick={onClick}
      className={clsx(
        "inline-flex items-center rounded-xl border transition-all duration-200 select-none group",
        onClick && "cursor-pointer hover:scale-105",
        statusStyles,
        sizeClass,
        className
      )}
    >
      {status === 'matched' && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
      {status === 'recommended' && <Star className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
      
      <span className="truncate">{name}</span>

      {level && (
        <span className={clsx("text-[10px] px-1.5 py-0.2 rounded-md border font-mono uppercase tracking-wider", levelBadgeColor)}>
          {level}
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
