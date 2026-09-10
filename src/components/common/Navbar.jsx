import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  Wallet,
  Scale,
  Users,
  PlusCircle,
  PiggyBank,
  Sun,
  Moon,
} from 'lucide-react';
import { MonthSelector } from './MonthSelector';

export function Navbar({
  activeTab,
  setActiveTab,
  currentMonth,
  setCurrentMonth,
  onOpenQuickMeal,
  onOpenAddContribution,
  isDarkMode,
  onToggleDarkMode,
}) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meals', label: 'Daily Meals', icon: Utensils },
    { id: 'contributions', label: 'Contributions', icon: Wallet },
    { id: 'settlement', label: 'Settlement', icon: Scale },
    { id: 'members', label: 'Members', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand & controls bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-3.5 gap-3">
          {/* Logo & mobile controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm font-black text-2xl">
                🍲
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 dark:text-slate-100 text-xl sm:text-2xl tracking-tight">
                    MealFlow
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/80">
                    ৳ BDT
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                  House Meal & Cost Sharing
                </p>
              </div>
            </div>

            {/* Mobile dark mode & month */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleDarkMode();
                }}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <MonthSelector
                currentMonth={currentMonth}
                onChangeMonth={setCurrentMonth}
              />
            </div>
          </div>

          {/* Desktop Month Selector, Theme Toggle & Quick Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="hidden sm:block">
              <MonthSelector
                currentMonth={currentMonth}
                onChangeMonth={setCurrentMonth}
              />
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleDarkMode();
              }}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer text-xs sm:text-sm font-bold"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-spin-slow" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onOpenQuickMeal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-all cursor-pointer"
                title="Quick Daily Meal Entry"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden xs:inline">Record</span> Meal
              </button>
              <button
                type="button"
                onClick={onOpenAddContribution}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-2xs border border-transparent dark:border-slate-700 transition-all cursor-pointer"
                title="Add Money Contribution"
              >
                <PiggyBank className="w-4 h-4 text-emerald-400" />
                <span className="hidden xs:inline">Add</span> Money
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-1.5 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-base font-bold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-emerald-400 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
