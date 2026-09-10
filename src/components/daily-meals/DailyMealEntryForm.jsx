import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Calendar, Check, Sparkles } from 'lucide-react';
import { formatDate, getCurrentDateStr } from '../../utils/formatters';

function DailyMealFormInner({
  date,
  members,
  existingMeal,
  onSaveDayMeals,
}) {
  const [entries, setEntries] = useState(() => {
    if (existingMeal?.entries) {
      return { ...existingMeal.entries };
    }
    const defaultEntries = {};
    members.forEach((m) => {
      defaultEntries[m.id] = 2; // sensible default
    });
    return defaultEntries;
  });

  const [note, setNote] = useState(existingMeal?.note || '');
  const [savedFeedback, setSavedFeedback] = useState(false);

  function handleMealChange(memberId, val) {
    const num = val === '' ? '' : Math.max(0, Number(val));
    setEntries((prev) => ({
      ...prev,
      [memberId]: num,
    }));
  }

  function handleSetPreset(memberId, amount) {
    setEntries((prev) => ({
      ...prev,
      [memberId]: amount,
    }));
  }

  function handleAddDelta(memberId, delta) {
    setEntries((prev) => {
      const curr = Number(prev[memberId]) || 0;
      const nextVal = Math.max(0, Math.round((curr + delta) * 10) / 10);
      return { ...prev, [memberId]: nextVal };
    });
  }

  function handleQuickSetAll(amount) {
    const next = {};
    members.forEach((m) => {
      next[m.id] = amount;
    });
    setEntries(next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const cleanEntries = {};
    members.forEach((m) => {
      const val = Number(entries[m.id]) || 0;
      cleanEntries[m.id] = Math.max(0, val);
    });

    onSaveDayMeals({
      date,
      entries: cleanEntries,
      note: note.trim(),
    });

    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  }

  const dayTotal = members.reduce((sum, m) => sum + (Number(entries[m.id]) || 0), 0);
  const isExisting = Boolean(existingMeal);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Date Header Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100/90 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Selected Date:
          </span>
          <span className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100">
            {formatDate(date)}
          </span>
          {isExisting && (
            <span className="ml-2 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              Editing saved record
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-semibold">
            <span className="hidden sm:inline">Set all:</span>
            {[0, 1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleQuickSetAll(num)}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold border border-slate-200 dark:border-slate-600 cursor-pointer transition-colors shadow-2xs"
              >
                {num}
              </button>
            ))}
          </div>
          <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium pl-3 border-l border-slate-300 dark:border-slate-700">
            Total: <strong className="text-emerald-700 dark:text-emerald-400 text-sm sm:text-base font-black">{dayTotal}</strong> meals
          </div>
        </div>
      </div>

      {/* Member Meal Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {members.map((member) => {
          const count = entries[member.id] !== undefined ? entries[member.id] : 0;

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              {/* Member Header */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0 border border-transparent dark:border-slate-600">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 truncate" title={member.name}>
                    {member.name}
                  </span>
                </div>
              </div>

              {/* Input with Quick Buttons */}
              <div className="space-y-2.5">
                <div className="relative flex items-center">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="20"
                    value={count}
                    onChange={(e) => handleMealChange(member.id, e.target.value)}
                    className="w-full text-center font-black text-xl text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50 dark:bg-slate-900 shadow-2xs"
                  />
                  <span className="absolute right-3 text-xs font-semibold text-slate-400 dark:text-slate-500 pointer-events-none">
                    meals
                  </span>
                </div>

                {/* Partial / quick step buttons */}
                <div className="grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleSetPreset(member.id, val)}
                      className={`text-xs sm:text-sm py-1.5 rounded font-bold border transition-colors cursor-pointer shadow-2xs ${
                        count === val
                          ? 'bg-emerald-600 text-white border-emerald-600 font-black'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {/* Incremental fractional adjustments (+0.5, +1) */}
                <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => handleAddDelta(member.id, -0.5)}
                    className="flex-1 text-xs py-1 rounded bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold cursor-pointer"
                    title="Decrease by 0.5"
                  >
                    -0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDelta(member.id, 0.5)}
                    className="flex-1 text-xs py-1 rounded bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold cursor-pointer border border-emerald-200/50 dark:border-emerald-800/50"
                    title="Increase by 0.5"
                  >
                    +0.5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddDelta(member.id, 1)}
                    className="flex-1 text-xs py-1 rounded bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold cursor-pointer border border-emerald-200/50 dark:border-emerald-800/50"
                    title="Increase by 1"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note & Submit Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Optional note (e.g. Friday special biryani, guest meals)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            type="submit"
            variant="taka"
            size="md"
            icon={savedFeedback ? Check : Sparkles}
            className="w-full sm:w-auto"
          >
            {savedFeedback ? 'Saved Successfully!' : isExisting ? 'Update Meals' : 'Save Meals for Date'}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function DailyMealEntryForm({
  members,
  currentMonth,
  existingMeals = [],
  onSaveDayMeals,
}) {
  const todayStr = getCurrentDateStr();
  const initialDate = todayStr.startsWith(currentMonth)
    ? todayStr
    : `${currentMonth}-01`;

  const [date, setDate] = useState(initialDate);

  const activeDate = date.startsWith(currentMonth) ? date : `${currentMonth}-01`;
  const existingRecord = existingMeals.find((m) => m.date === activeDate);

  return (
    <Card
      title="Daily Meal Rapid Entry"
      subtitle="Select date and record meals for each member"
      className="border-emerald-200/80 dark:border-emerald-900/60 ring-1 ring-emerald-500/10"
      action={
        <div className="flex items-center gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
            Date:
          </label>
          <input
            type="date"
            value={activeDate}
            onChange={(e) => e.target.value && setDate(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      }
    >
      <DailyMealFormInner
        key={activeDate}
        date={activeDate}
        members={members}
        existingMeal={existingRecord}
        onSaveDayMeals={onSaveDayMeals}
      />
    </Card>
  );
}
