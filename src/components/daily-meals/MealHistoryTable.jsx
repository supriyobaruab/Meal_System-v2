import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ConfirmModal } from '../ui/ConfirmModal';
import { formatDate, formatMeals, formatMonthYear } from '../../utils/formatters';
import { Edit2, Trash2, CalendarDays } from 'lucide-react';

export function MealHistoryTable({
  meals = [],
  members = [],
  currentMonth,
  onEditMeal,
  onDeleteMeal,
}) {
  const [deleteTarget, setDeleteTarget] = useState(null);

  const monthMeals = meals
    .filter((m) => m.date.startsWith(currentMonth))
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalMonthMeals = monthMeals.reduce((sum, record) => {
    const dayTotal = members.reduce(
      (mSum, m) => mSum + (Number(record.entries?.[m.id]) || 0),
      0
    );
    return sum + dayTotal;
  }, 0);

  return (
    <>
      <Card
        title={`Meal Log History (${monthMeals.length} days recorded)`}
        subtitle={`All entries for ${formatMonthYear(currentMonth)} — Total ${formatMeals(totalMonthMeals)} meals`}
      >
        {monthMeals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-3">
              <CalendarDays className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No meal records for {formatMonthYear(currentMonth)}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Use the daily entry form above to log meals taken by household members on any date.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100/80 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 text-xs sm:text-sm uppercase tracking-wider text-slate-600 dark:text-slate-300 font-black">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  {members.map((m) => (
                    <th key={m.id} className="px-4 py-3.5 text-center">
                      <span className="truncate block max-w-[90px]" title={m.name}>
                        {m.name}
                      </span>
                    </th>
                  ))}
                  <th className="px-5 py-3.5 text-right">Day Total</th>
                  <th className="px-5 py-3.5">Note</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {monthMeals.map((record) => {
                  const dayTotal = members.reduce(
                    (sum, m) => sum + (Number(record.entries?.[m.id]) || 0),
                    0
                  );

                  return (
                    <tr key={record.id || record.date} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      {/* Date */}
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap text-sm sm:text-base">
                        {formatDate(record.date)}
                      </td>

                      {/* Member Columns */}
                      {members.map((m) => {
                        const count = record.entries?.[m.id] || 0;
                        return (
                          <td key={m.id} className="px-4 py-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-md font-bold text-xs sm:text-sm ${
                                count > 0
                                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700'
                                  : 'text-slate-300 dark:text-slate-600'
                              }`}
                            >
                              {formatMeals(count)}
                            </span>
                          </td>
                        );
                      })}

                      {/* Day Total */}
                      <td className="px-5 py-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm sm:text-base whitespace-nowrap">
                        {formatMeals(dayTotal)} meals
                      </td>

                      {/* Note */}
                      <td className="px-5 py-4 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={record.note}>
                        {record.note || <span className="text-slate-300 dark:text-slate-600">—</span>}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditMeal(record)}
                            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(record)}
                            className="p-2 text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            onDeleteMeal(deleteTarget.date);
            setDeleteTarget(null);
          }
        }}
        title="Delete Daily Meal Entry"
        message={
          deleteTarget
            ? `Are you sure you want to delete meal records for ${formatDate(
                deleteTarget.date
              )}? This will recalculate everyone's meal counts and balance immediately.`
            : ''
        }
      />
    </>
  );
}
