import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { ConfirmModal } from '../ui/ConfirmModal';
import {
  UserPlus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { exportDataAsJSON } from '../../utils/storage';

export function MemberManager({
  members = [],
  onUpdateMembers,
  meals = [],
  contributions = [],
  onResetToSample,
  onResetToEmpty,
  onImportData,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');

  const [editingMember, setEditingMember] = useState(null);
  const [editName, setEditName] = useState('');

  const [deletingMember, setDeletingMember] = useState(null);

  const [confirmSampleReset, setConfirmSampleReset] = useState(false);
  const [confirmBlankReset, setConfirmBlankReset] = useState(false);

  function handleAddMember(e) {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newId = `m-${Date.now()}`;
    const newMember = {
      id: newId,
      name: newMemberName.trim(),
      active: true,
    };

    onUpdateMembers([...members, newMember]);
    setNewMemberName('');
    setIsAddOpen(false);
  }

  function handleEditMember(e) {
    e.preventDefault();
    if (!editingMember || !editName.trim()) return;

    const updated = members.map((m) =>
      m.id === editingMember.id ? { ...m, name: editName.trim() } : m
    );

    onUpdateMembers(updated);
    setEditingMember(null);
  }

  function handleDeleteMember(memberId) {
    const updated = members.filter((m) => m.id !== memberId);
    onUpdateMembers(updated);
    setDeletingMember(null);
  }

  function handleFileImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json && Array.isArray(json.members)) {
          onImportData(json);
          alert('Data imported successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        console.error('Backup import error:', err);
        alert('Could not parse JSON backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Household Members & Settings
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Manage your roommates, customize names, and backup or restore data.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={UserPlus}
          onClick={() => setIsAddOpen(true)}
        >
          Add New Member
        </Button>
      </div>

      {/* Member Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member, index) => {
          const memberMealsCount = meals.reduce(
            (sum, m) => sum + (Number(m.entries?.[member.id]) || 0),
            0
          );
          const memberContributionsCount = contributions.filter(
            (c) => c.memberId === member.id
          ).length;

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-2xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-black text-base shadow-2xs border border-transparent dark:border-slate-600">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                      {member.name}
                    </h3>
                    <span className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 font-medium">
                      Member #{index + 1}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(member);
                      setEditName(member.name);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Rename Member"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setDeletingMember(member)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span>{memberMealsCount} meals recorded</span>
                <span>{memberContributionsCount} deposits</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Data Management & Backup Card */}
      <Card
        title="Data Backup & Reset Options"
        subtitle="Your data is saved locally on your computer in your browser."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Backup / Export */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Export / Import Backup</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Download your entire meal records and contribution ledger as a JSON file to transfer between devices.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() =>
                  exportDataAsJSON({ members, meals, contributions })
                }
              >
                Download Backup (.json)
              </Button>

              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-4 h-4" />
                Restore File
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset / Sample Data */}
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 space-y-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Sample & Reset Controls</h4>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Reload the realistic September 2026 example or clear the ledger to start fresh.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={() => setConfirmSampleReset(true)}
              >
                Load Sample Data
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmBlankReset(true)}
              >
                Clear All Logs
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Household Member"
        subtitle="Add a roommate to share meals with"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMember}>
              Add Member
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddMember} className="space-y-3">
          <Input
            label="Member Name"
            placeholder="e.g. Member 6, Rahim, Karim"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            required
            autoFocus
          />
        </form>
      </Modal>

      {/* Rename Member Modal */}
      <Modal
        isOpen={Boolean(editingMember)}
        onClose={() => setEditingMember(null)}
        title="Rename Household Member"
        subtitle="Update this member's display name"
        footer={
          <>
            <Button variant="outline" onClick={() => setEditingMember(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleEditMember}>
              Save Name
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditMember} className="space-y-3">
          <Input
            label="Member Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            required
            autoFocus
          />
        </form>
      </Modal>

      {/* Delete Member Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={() => {
          if (deletingMember) handleDeleteMember(deletingMember.id);
        }}
        title="Remove Member from Household?"
        message={
          deletingMember
            ? `Are you sure you want to remove "${deletingMember.name}"? Existing meal records and contributions associated with this member will no longer be counted in totals.`
            : ''
        }
      />

      {/* Confirm Load Sample Data Modal */}
      <ConfirmModal
        isOpen={confirmSampleReset}
        onClose={() => setConfirmSampleReset(false)}
        onConfirm={() => {
          onResetToSample();
          setConfirmSampleReset(false);
        }}
        title="Load September 2026 Sample Scenario?"
        message="This will replace current entries with the 150 meals, ৳11,000 contribution demonstration scenario for September 2026."
        confirmText="Load Sample"
        confirmVariant="primary"
      />

      {/* Confirm Clear Blank Reset */}
      <ConfirmModal
        isOpen={confirmBlankReset}
        onClose={() => setConfirmBlankReset(false)}
        onConfirm={() => {
          onResetToEmpty();
          setConfirmBlankReset(false);
        }}
        title="Clear All Meals & Contributions?"
        message="This will reset your database to 5 clean default members with 0 meals and 0 contributions. Are you sure?"
        confirmText="Clear Everything"
        confirmVariant="dangerSolid"
      />
    </div>
  );
}
