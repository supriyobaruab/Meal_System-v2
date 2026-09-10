import React from 'react';
import {
  Users,
  Utensils,
  Wallet,
  TrendingUp,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  PiggyBank,
} from 'lucide-react';
import { StatCard } from '../common/StatCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SummaryTable } from './SummaryTable';
import { formatTaka, formatMeals, formatMonthYear } from '../../utils/formatters';

export function DashboardView({
  summary,
  members,
  currentMonth,
  onNavigateTab,
  onOpenQuickMeal,
  onOpenAddContribution,
}) {
  const {
    totalMeals,
    totalContributions,
    mealRate,
    totalMealCost,
    totalOwed,
    totalReceivable,
    memberSummaries,
  } = summary;

  const owingMembers = memberSummaries.filter((m) => m.status === 'owes');
  const receivingMembers = memberSummaries.filter((m) => m.status === 'receives');

  const hasData = totalMeals > 0 || totalContributions > 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Month Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Monthly Overview &bull; {formatMonthYear(currentMonth)}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Household meal accounting, expense rates, and balance ledger.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={onOpenQuickMeal}
            icon={PlusCircle}
          >
            Record Daily Meals
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onOpenAddContribution}
            icon={PiggyBank}
          >
            Add Contribution
          </Button>
        </div>
      </div>

      {/* Empty State Banner if no data for the selected month */}
      {!hasData && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 text-sm sm:text-base text-amber-800 dark:text-amber-300 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-400 font-black text-base">
            !
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 text-base">
              No records for {formatMonthYear(currentMonth)} yet
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              Start by recording meals or adding household grocery funds for this month.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={onOpenQuickMeal}>
                + Enter Daily Meals
              </Button>
              <Button size="sm" variant="taka" onClick={onOpenAddContribution}>
                + Add Contribution
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Members */}
        <StatCard
          title="Members"
          value={members.length}
          subtext="Active in house"
          icon={Users}
          iconBg="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
        />

        {/* Total Meals */}
        <StatCard
          title="Total Meals"
          value={formatMeals(totalMeals)}
          subtext={totalMeals > 0 ? `Avg ${(totalMeals / (members.length || 1)).toFixed(1)} / person` : '0 meals'}
          icon={Utensils}
          iconBg="bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400"
        />

        {/* Total Contribution */}
        <StatCard
          title="Total Fund"
          value={formatTaka(totalContributions, false)}
          subtext="Total contributions"
          icon={Wallet}
          iconBg="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        />

        {/* Current Meal Rate */}
        <StatCard
          title="Meal Rate"
          value={formatTaka(mealRate)}
          subtext="Per meal cost"
          icon={TrendingUp}
          iconBg="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
          className="col-span-2 sm:col-span-1"
        />

        {/* Total Meal Cost */}
        <StatCard
          title="Total Meal Cost"
          value={formatTaka(totalMealCost, false)}
          subtext="Matches contributions"
          icon={Receipt}
          iconBg="bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400"
          className="col-span-2 sm:col-span-1"
        />
      </div>

      {/* Debtor & Creditor summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Needs to Pay (Debtors) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">People Who Owe Money</h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {owingMembers.length} {owingMembers.length === 1 ? 'member' : 'members'} need to pay into fund
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
              {formatTaka(totalOwed)}
            </span>
          </div>

          <div className="mt-3.5 divide-y divide-slate-100 dark:divide-slate-800/80">
            {owingMembers.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-3 text-center">No outstanding debts.</p>
            ) : (
              owingMembers.map((m) => (
                <div key={m.memberId} className="flex items-center justify-between py-2.5 text-sm sm:text-base">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="font-extrabold text-rose-600 dark:text-rose-400">
                    Owes {formatTaka(Math.abs(m.balance))}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Should Receive (Creditors) */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ArrowDownRight className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">People Who Should Receive</h4>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {receivingMembers.length} {receivingMembers.length === 1 ? 'member' : 'members'} will get refunds
                </p>
              </div>
            </div>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {formatTaka(totalReceivable)}
            </span>
          </div>

          <div className="mt-3.5 divide-y divide-slate-100 dark:divide-slate-800/80">
            {receivingMembers.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500 py-3 text-center">No pending receivables.</p>
            ) : (
              receivingMembers.map((m) => (
                <div key={m.memberId} className="flex items-center justify-between py-2.5 text-sm sm:text-base">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.name}</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    Receives {formatTaka(m.balance)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main Household Summary Table Card */}
      <Card
        title="Member Meal & Cost Summary"
        subtitle={`Summary calculation for ${formatMonthYear(currentMonth)}`}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateTab('settlement')}
          >
            View Full Settlement
          </Button>
        }
      >
        <SummaryTable
          memberSummaries={memberSummaries}
          totalContributions={totalContributions}
          totalMeals={totalMeals}
        />
      </Card>
    </div>
  );
}
