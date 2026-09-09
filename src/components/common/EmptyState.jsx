import React from 'react';
import { Button } from './Button';
import { FolderSearch, Sparkles, Users, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function EmptyState({
  icon: Icon = FolderSearch,
  title = "No results found",
  description = "Try adjusting your search criteria or clearing filters.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}) {
  return (
    <div className={clsx("flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl glass-panel border border-white/5", className)}>
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-brand-500/20 rounded-2xl blur-xl" />
        <div className="relative w-16 h-16 rounded-2xl bg-slate-800/90 border border-white/10 flex items-center justify-center text-brand-400">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-xl font-display font-bold text-white tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {actionLabel && onAction && (
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
