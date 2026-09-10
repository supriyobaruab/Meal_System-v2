import React from 'react';

export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  prefix,
  suffix,
  disabled = false,
  required = false,
  min,
  max,
  step,
  className = '',
  inputClassName = '',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center rounded-lg shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 dark:text-slate-400 font-bold text-sm sm:text-base">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`block w-full rounded-lg border text-sm sm:text-base transition-all focus:outline-none focus:ring-2 disabled:bg-slate-50 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 ${
            prefix ? 'pl-9' : 'pl-3.5'
          } ${suffix ? 'pr-9' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-rose-300 text-rose-900 dark:border-rose-700 dark:text-rose-200 focus:border-rose-500 focus:ring-rose-200 dark:focus:ring-rose-900/50'
              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/40'
          } ${inputClassName}`}
          {...props}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 text-sm sm:text-base">
            {suffix}
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs sm:text-sm text-rose-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
}
