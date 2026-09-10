import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatDate } from '../../utils/formatters';

function MealEditFormInner({ mealRecord, members, onSave, onClose }) {
  const [entries, setEntries] = useState(() => mealRecord.entries || {});
  const [note, setNote] = useState(() => mealRecord.note || '');

  function handleMealChange(memberId, val) {
    const num = val === '' ? '' : Math.max(0, Number(val));
    setEntries((prev) => ({
      ...prev,
      [memberId]: num,
    }));
  }

  function handleAddDelta(memberId, delta) {
    setEntries((prev) => {
      const curr = Number(prev[memberId]) || 0;
      const nextVal = Math.max(0, Math.round((curr + delta) * 10) / 10);
      return { ...prev, [memberId]: nextVal };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const cleanEntries = {};
    members.forEach((m) => {
      cleanEntries[m.id] = Math.max(0, Number(entries[m.id]) || 0);
    });

    onSave({
      ...mealRecord,
      entries: cleanEntries,
      note: note.trim(),
    });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        {members.map((member) => {
          const count = entries[member.id] !== undefined ? entries[member.id] : 0;
          return (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {member.name.charAt(0)}
                </div>
                <span className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200">{member.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAddDelta(member.id, -0.5)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  -
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={count}
                  onChange={(e) => handleMealChange(member.id, e.target.value)}
                  className="w-20 text-center font-black text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => handleAddDelta(member.id, 0.5)}
                  className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 flex items-center justify-center cursor-pointer shadow-2xs"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Note
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note"
          className="w-full text-sm sm:text-base bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}

export function MealEditModal({ isOpen, onClose, mealRecord, members = [], onSave }) {
  if (!isOpen || !mealRecord) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Meals \u2022 ${formatDate(mealRecord.date)}`}
      subtitle="Modify meal counts for household members on this date"
      maxWidth="max-w-lg"
    >
      <MealEditFormInner
        key={mealRecord.id || mealRecord.date}
        mealRecord={mealRecord}
        members={members}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}
