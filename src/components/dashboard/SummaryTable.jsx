import React from 'react';
import { Badge } from '../ui/Badge';
import { formatTaka, formatMeals } from '../../utils/formatters';

export function SummaryTable({ memberSummaries = [], totalContributions = 0, totalMeals = 0 }) {
  if (memberSummaries.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm sm:text-base">
        No active household members found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 -mb-6">
      <table className="w-full text-left text-sm sm:text-base">
        <thead className="bg-slate-100/80 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 text-xs sm:text-sm uppercase tracking-wider text-slate-600 dark:text-slate-300 font-black">
          <tr>
            <th className="px-6 py-3.5">Member</th>
            <th className="px-5 py-3.5 text-right">Meals</th>
            <th className="px-5 py-3.5 text-right">Contribution</th>
            <th className="px-5 py-3.5 text-right">Meal Cost</th>
            <th className="px-5 py-3.5 text-right">Balance</th>
            <th className="px-6 py-3.5 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
          {memberSummaries.map((m) => {
            const isPositive = m.balance > 0.01;
            const isNegative = m.balance < -0.01;

            return (
              <tr key={m.memberId} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors">
                {/* Member Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs border border-transparent dark:border-slate-600">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base block">{m.name}</span>
                    </div>
                  </div>
                </td>

                {/* Meals Taken */}
                <td className="px-5 py-4 text-right font-semibold text-slate-700 dark:text-slate-300">
                  <span className="inline-block bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formatMeals(m.meals)}
                  </span>
                </td>

                {/* Contribution */}
                <td className="px-5 py-4 text-right font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                  {formatTaka(m.contribution)}
                </td>

                {/* Meal Cost */}
                <td className="px-5 py-4 text-right text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  {formatTaka(m.mealCost)}
                </td>

                {/* Balance */}
                <td className="px-5 py-4 text-right font-extrabold text-sm sm:text-base">
                  <span
                    className={
                      isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isNegative
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }
                  >
                    {isPositive ? `+${formatTaka(m.balance)}` : formatTaka(m.balance)}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <Badge status={m.status}>
                    {m.status === 'receives' && `Receives ${formatTaka(m.balance)}`}
                    {m.status === 'owes' && `Owes ${formatTaka(Math.abs(m.balance))}`}
                    {m.status === 'settled' && 'Settled'}
                  </Badge>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot className="bg-slate-100/90 dark:bg-slate-800 font-black text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-t-2 border-slate-300 dark:border-slate-700">
          <tr>
            <td className="px-6 py-4 text-slate-800 dark:text-slate-200">Total / Summary</td>
            <td className="px-5 py-4 text-right text-slate-900 dark:text-slate-100">{formatMeals(totalMeals)}</td>
            <td className="px-5 py-4 text-right text-slate-900 dark:text-slate-100">{formatTaka(totalContributions)}</td>
            <td className="px-5 py-4 text-right text-slate-900 dark:text-slate-100">{formatTaka(totalContributions)}</td>
            <td className="px-5 py-4 text-right text-slate-400 dark:text-slate-400">৳0.00</td>
            <td className="px-6 py-4 text-center text-slate-400 dark:text-slate-400">—</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
