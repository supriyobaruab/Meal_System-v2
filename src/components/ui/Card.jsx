import React from 'react';

export function Card({ children, className = '', title, subtitle, action, footer }) {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/90 shadow-sm overflow-hidden transition-colors duration-200 ${className}`}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
          <div>
            {title && <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">{title}</h3>}
            {subtitle && <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}
