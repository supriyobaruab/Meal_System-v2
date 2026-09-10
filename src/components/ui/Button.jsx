import React from 'react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
}) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white focus:ring-slate-900 dark:focus:ring-emerald-500 shadow-sm',
    taka:
      'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 focus:ring-emerald-500 shadow-sm',
    secondary:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 focus:ring-slate-400',
    outline:
      'border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 focus:ring-slate-400 shadow-sm',
    danger:
      'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60 dark:hover:bg-rose-950/70 focus:ring-rose-500',
    dangerSolid:
      'bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 focus:ring-rose-500 shadow-sm',
    ghost:
      'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 focus:ring-slate-500',
    subtle:
      'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'text-xs sm:text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm sm:text-base px-4 py-2 gap-2',
    lg: 'text-base sm:text-lg px-5 py-2.5 gap-2.5',
    icon: 'p-2 text-sm',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
}
