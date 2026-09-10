import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { formatMonthYear, getCurrentYearMonth } from '../../utils/formatters';

export function MonthSelector({ currentMonth, onChangeMonth }) {
  const currentActualMonth = getCurrentYearMonth();
  const isCurrentActual = currentMonth === currentActualMonth;

  function handlePrev() {
    const [year, month] = currentMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month - 1;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onChangeMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  }

  function handleNext() {
    const [year, month] = currentMonth.split('-').map(Number);
    let newYear = year;
    let newMonth = month + 1;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onChangeMonth(`${newYear}-${String(newMonth).padStart(2, '0')}`);
  }

  function handleInputChange(e) {
    if (e.target.value) {
      onChangeMonth(e.target.value);
    }
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 bg-white dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-2xs">
      <button
        onClick={handlePrev}
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Previous Month"
        aria-label="Previous Month"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="relative flex items-center group">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="whitespace-nowrap">{formatMonthYear(currentMonth)}</span>
        </div>
        <input
          type="month"
          value={currentMonth}
          onChange={handleInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Select Month and Year"
        />
      </div>

      <button
        onClick={handleNext}
        className="p-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Next Month"
        aria-label="Next Month"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {!isCurrentActual && (
        <button
          onClick={() => onChangeMonth(currentActualMonth)}
          className="ml-1 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md transition-colors border border-emerald-200/80 dark:border-emerald-800/80 cursor-pointer hidden sm:inline-block"
        >
          Today
        </button>
      )}
    </div>
  );
}
