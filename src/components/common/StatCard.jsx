import React from 'react';

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
  badge,
  className = '',
}) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/90 p-5 shadow-2xs hover:shadow-xs transition-all ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{value}</h3>
            {badge && <span>{badge}</span>}
          </div>
          {subtext && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">{subtext}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
