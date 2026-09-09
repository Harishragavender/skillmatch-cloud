import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none";

  const sizeStyles = {
    xs: "px-2.5 py-1 text-xs gap-1.5",
    sm: "px-3.5 py-1.5 text-xs font-semibold gap-2",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
    xl: "px-6 py-3.5 text-base font-semibold gap-3 shadow-lg",
  };

  const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-cyan-500 text-white shadow-glow hover:shadow-glow-cyan hover:brightness-110 border border-brand-400/30",
    secondary: "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 dark:border-white/10 hover:border-slate-600",
    outline: "bg-transparent border border-brand-500/40 text-brand-400 hover:bg-brand-500/10 hover:border-brand-400",
    ghost: "bg-transparent hover:bg-slate-800/60 dark:hover:bg-white/5 text-slate-300 hover:text-white",
    danger: "bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-rose-300",
    success: "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300",
    accent: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-glow-purple hover:brightness-110 border border-purple-400/30",
    glass: "glass-panel hover:bg-slate-800/90 text-white border-white/10 hover:border-cyan-400/40 shadow-card-3d",
  };

  return (
    <button
      disabled={disabled || loading}
      className={twMerge(clsx(baseStyles, sizeStyles[size], variants[variant], className))}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className={clsx(size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className={clsx(size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4')} />}
        </>
      )}
    </button>
  );
}
