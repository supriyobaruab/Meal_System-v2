import React from 'react';

export function Badge({ children, status, variant = 'default', size = 'md', className = '' }) {
  // If status is provided, automatically choose color
  let colorStyles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';

  if (status === 'receives') {
    colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/80';
  } else if (status === 'owes') {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/80';
  } else if (status === 'settled') {
    colorStyles = 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
  } else if (variant === 'primary') {
    colorStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800';
  } else if (variant === 'amber') {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
  }

  const sizes = {
    sm: 'text-xs px-2.5 py-0.5 font-semibold',
    md: 'text-xs sm:text-sm px-3 py-1 font-bold',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs uppercase tracking-wider ${sizes[size] || sizes.md} ${colorStyles} ${className}`}
    >
      {status === 'receives' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
      {status === 'owes' && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
      {status === 'settled' && <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500"></span>}
      {children}
    </span>
  );
}
