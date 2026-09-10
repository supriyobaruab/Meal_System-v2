import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { getCurrentDateStr } from '../../utils/formatters';

function ContributionFormInner({
  editItem,
  members,
  currentMonth,
  onSave,
  onClose,
}) {
  const [memberId, setMemberId] = useState(() => {
    return editItem?.memberId || members[0]?.id || '';
  });
  const [amount, setAmount] = useState(() => {
    return editItem?.amount ? editItem.amount.toString() : '';
  });
  const [date, setDate] = useState(() => {
    if (editItem?.date) return editItem.date;
    const today = getCurrentDateStr();
    return today.startsWith(currentMonth) ? today : `${currentMonth}-01`;
  });
  const [note, setNote] = useState(() => editItem?.note || '');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!memberId) {
      setError('Please select a member');
      return;
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount greater than ৳0');
      return;
    }

    if (!date) {
      setError('Please select a valid date');
      return;
    }

    onSave({
      id: editItem ? editItem.id : `c-${Date.now()}`,
      memberId,
      amount: numAmount,
      date,
      note: note.trim(),
    });

    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-lg text-xs sm:text-sm font-bold border border-rose-200 dark:border-rose-900/60">
          {error}
        </div>
      )}

      {/* Member Selector */}
      <div>
        <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
          Member <span className="text-rose-500">*</span>
        </label>
        <select
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2.5 text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        >
          {members.map((m) => (
            <option
              key={m.id}
              value={m.id}
              className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1"
            >
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Input */}
      <Input
        label="Amount"
        type="number"
        min="1"
        step="any"
        placeholder="e.g. 2000"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        prefix="৳"
        required
      />

      {/* Quick Amount presets */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold">Quick:</span>
        {[500, 1000, 2000, 3000, 5000].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(preset.toString())}
            className="text-xs sm:text-sm px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold cursor-pointer transition-colors"
          >
            ৳{preset}
          </button>
        ))}
      </div>

      {/* Date Selector */}
      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {/* Note / Purpose */}
      <Input
        label="Note / Purpose"
        placeholder="e.g. Bazaar fund, rice bag, meat market"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        helperText="Optional description for accounting record"
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="taka" type="submit">
          {editItem ? 'Update Contribution' : 'Save Contribution'}
        </Button>
      </div>
    </form>
  );
}

export function ContributionModal({
  isOpen,
  onClose,
  onSave,
  editItem = null,
  members = [],
  currentMonth,
}) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? 'Edit Contribution' : 'Add Household Fund Contribution'}
      subtitle="Record money contributed by a member towards the meal fund"
      maxWidth="max-w-md"
    >
      <ContributionFormInner
        key={editItem ? editItem.id : 'new'}
        editItem={editItem}
        members={members}
        currentMonth={currentMonth}
        onSave={onSave}
        onClose={onClose}
      />
    </Modal>
  );
}
