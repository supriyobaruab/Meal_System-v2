import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ConfirmModal } from '../ui/ConfirmModal';
import { formatTaka, formatDate, formatMonthYear } from '../../utils/formatters';
import { PlusCircle, Edit2, Trash2, Wallet, Filter } from 'lucide-react';

export function ContributionList({
  contributions = [],
  members = [],
  currentMonth,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('ALL');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const monthContributions = contributions.filter((c) =>
    c.date.startsWith(currentMonth)
  );

  const filtered = monthContributions.filter((c) => {
    if (selectedMemberFilter === 'ALL') return true;
    return c.memberId === selectedMemberFilter;
  });

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));

  const totalFiltered = sorted.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalMonth = monthContributions.reduce(
    (sum, c) => sum + (Number(c.amount) || 0),
    0
  );

  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  return (
    <div className="space-y-6">
      {/* Top Header / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Fund Contributions &bull; {formatMonthYear(currentMonth)}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Log of all grocery, bazaar, and meal fund deposits made by members.
          </p>
        </div>

        <Button variant="taka" size="md" icon={PlusCircle} onClick={onAddClick}>
          Add Contribution
        </Button>
      </div>

      {/* Member Contribution Breakdown Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {members.map((member) => {
          const memberTotal = monthContributions
            .filter((c) => c.memberId === member.id)
            .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

          const isSelected = selectedMemberFilter === member.id;

          return (
            <div
              key={member.id}
              onClick={() =>
                setSelectedMemberFilter(isSelected ? 'ALL' : member.id)
              }
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-500 dark:border-emerald-500 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                  {member.name}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {
                    monthContributions.filter((c) => c.memberId === member.id)
                      .length
                  }{' '}
                  txn
                </span>
              </div>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 mt-2">
                {formatTaka(memberTotal)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Table Card */}
      <Card
        title={`Transactions Ledger (${sorted.length})`}
        subtitle={
          selectedMemberFilter !== 'ALL'
            ? `Filtered for ${memberMap.get(selectedMemberFilter)} — Total: ${formatTaka(totalFiltered)}`
            : `Total Monthly Pool: ${formatTaka(totalMonth)}`
        }
        action={
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedMemberFilter}
              onChange={(e) => setSelectedMemberFilter(e.target.value)}
              className="text-xs sm:text-sm font-bold bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="ALL">All Members</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        }
      >
        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500 mb-3">
              <Wallet className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No contributions found
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              {selectedMemberFilter !== 'ALL'
                ? `No contributions recorded for ${memberMap.get(
                    selectedMemberFilter
                  )} this month.`
                : `No contributions have been deposited yet in ${formatMonthYear(
                    currentMonth
                  )}.`}
            </p>
            <div className="mt-4">
              <Button variant="taka" size="sm" onClick={onAddClick}>
                + Add First Contribution
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-slate-100/80 dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700 text-xs sm:text-sm uppercase tracking-wider text-slate-600 dark:text-slate-300 font-black">
                <tr>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Member</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5">Note / Purpose</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {sorted.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    {/* Date */}
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap text-sm sm:text-base">
                      {formatDate(item.date)}
                    </td>

                    {/* Member */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center text-xs font-bold border border-transparent dark:border-slate-600">
                          {(memberMap.get(item.memberId) || '?').charAt(0)}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                          {memberMap.get(item.memberId) || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4 text-right font-black text-emerald-600 dark:text-emerald-400 text-base sm:text-lg whitespace-nowrap">
                      +{formatTaka(item.amount)}
                    </td>

                    {/* Note */}
                    <td
                      className="px-6 py-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-[220px] truncate"
                      title={item.note}
                    >
                      {item.note || <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditClick(item)}
                          className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Edit Contribution"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Contribution"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-100/90 dark:bg-slate-800 font-black text-xs sm:text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 border-t-2 border-slate-300 dark:border-slate-700">
                <tr>
                  <td colSpan={2} className="px-6 py-4">
                    Filtered Total
                  </td>
                  <td className="px-5 py-4 text-right text-emerald-700 dark:text-emerald-400 font-black text-base sm:text-lg">
                    {formatTaka(totalFiltered)}
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
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
            onDeleteClick(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Delete Contribution Record"
        message={
          deleteTarget
            ? `Are you sure you want to delete the deposit of ${formatTaka(
                deleteTarget.amount
              )} made on ${formatDate(
                deleteTarget.date
              )}? This will recalculate everyone's balances immediately.`
            : ''
        }
      />
    </div>
  );
}
