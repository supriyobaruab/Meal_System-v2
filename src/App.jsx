import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { DailyMealEntryForm } from './components/daily-meals/DailyMealEntryForm';
import { MealHistoryTable } from './components/daily-meals/MealHistoryTable';
import { MealEditModal } from './components/daily-meals/MealEditModal';
import { ContributionList } from './components/contributions/ContributionList';
import { ContributionModal } from './components/contributions/ContributionModal';
import { SettlementView } from './components/settlement/SettlementView';
import { MemberManager } from './components/members/MemberManager';
import { Modal } from './components/ui/Modal';
import {
  loadAppData,
  saveAppData,
  resetToSample,
  resetToEmptyDefaults,
} from './utils/storage';
import { calculateMonthlySummary } from './utils/calculations';

export function App() {
  // Theme state: dark / light
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const stored = localStorage.getItem('meal_theme');
      if (stored === 'dark') return true;
      if (stored === 'light') return false;
      return document.documentElement.classList.contains('dark') ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch {
      return false;
    }
  });

  // Ensure <html> always has or removes the dark class synchronously
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('meal_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('meal_theme', 'light');
      }
    } catch (e) {
      console.error('Failed to sync theme:', e);
    }
  }, [isDarkMode]);

  function handleToggleDarkMode() {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('meal_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('meal_theme', 'light');
        }
      } catch (e) {
        console.error('Failed to set theme in storage:', e);
      }
      return next;
    });
  }

  // Initialize data from localStorage
  const [data, setData] = useState(() => loadAppData());

  const members = data.members;
  const meals = data.meals;
  const contributions = data.contributions;

  // Default month: set to "2026-09" to match the prompt's scenario and sample data
  const [currentMonth, setCurrentMonth] = useState('2026-09');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [editingContribution, setEditingContribution] = useState(null);

  const [isQuickMealModalOpen, setIsQuickMealModalOpen] = useState(false);
  const [editingMealRecord, setEditingMealRecord] = useState(null);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  // Compute month records and monthly summary
  const monthMeals = useMemo(() => {
    return (meals || []).filter((m) => m.date.startsWith(currentMonth));
  }, [meals, currentMonth]);

  const monthContributions = useMemo(() => {
    return (contributions || []).filter((c) => c.date.startsWith(currentMonth));
  }, [contributions, currentMonth]);

  const summary = useMemo(() => {
    return calculateMonthlySummary(members || [], monthMeals, monthContributions);
  }, [members, monthMeals, monthContributions]);

  // Handler: Save daily meals (add or update)
  function handleSaveDayMeals(dayMealObj) {
    setData((prev) => {
      const existingIdx = prev.meals.findIndex((m) => m.date === dayMealObj.date);
      let updatedMeals;

      if (existingIdx >= 0) {
        updatedMeals = [...prev.meals];
        updatedMeals[existingIdx] = {
          ...updatedMeals[existingIdx],
          ...dayMealObj,
        };
      } else {
        updatedMeals = [
          ...prev.meals,
          {
            id: `meal-${dayMealObj.date}`,
            ...dayMealObj,
          },
        ];
      }

      return {
        ...prev,
        meals: updatedMeals,
      };
    });

    if (isQuickMealModalOpen) {
      setIsQuickMealModalOpen(false);
    }
  }

  // Handler: Delete day meal
  function handleDeleteDayMeal(dateStr) {
    setData((prev) => ({
      ...prev,
      meals: prev.meals.filter((m) => m.date !== dateStr),
    }));
  }

  // Handler: Save contribution (add or edit)
  function handleSaveContribution(contributionObj) {
    setData((prev) => {
      const existingIdx = prev.contributions.findIndex(
        (c) => c.id === contributionObj.id
      );
      let updatedContributions;

      if (existingIdx >= 0) {
        updatedContributions = [...prev.contributions];
        updatedContributions[existingIdx] = contributionObj;
      } else {
        updatedContributions = [contributionObj, ...prev.contributions];
      }

      return {
        ...prev,
        contributions: updatedContributions,
      };
    });
  }

  // Handler: Delete contribution
  function handleDeleteContribution(contributionId) {
    setData((prev) => ({
      ...prev,
      contributions: prev.contributions.filter((c) => c.id !== contributionId),
    }));
  }

  // Handler: Update members
  function handleUpdateMembers(updatedMembers) {
    setData((prev) => ({
      ...prev,
      members: updatedMembers,
    }));
  }

  // Reset helpers
  function handleResetToSample() {
    const sample = resetToSample();
    setData(sample);
    setCurrentMonth('2026-09');
  }

  function handleResetToEmpty() {
    const empty = resetToEmptyDefaults();
    setData(empty);
  }

  function handleImportData(imported) {
    setData(imported);
    saveAppData(imported);
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white transition-colors duration-200`}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        onOpenQuickMeal={() => setIsQuickMealModalOpen(true)}
        onOpenAddContribution={() => {
          setEditingContribution(null);
          setIsContributionModalOpen(true);
        }}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {activeTab === 'dashboard' && (
          <DashboardView
            summary={summary}
            members={members}
            currentMonth={currentMonth}
            onNavigateTab={setActiveTab}
            onOpenQuickMeal={() => setIsQuickMealModalOpen(true)}
            onOpenAddContribution={() => {
              setEditingContribution(null);
              setIsContributionModalOpen(true);
            }}
          />
        )}

        {activeTab === 'meals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  Daily Meal Management
                </h1>
                <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                  Record and manage daily meals for household members with decimal meal support.
                </p>
              </div>
            </div>

            {/* Quick entry form */}
            <DailyMealEntryForm
              members={members}
              currentMonth={currentMonth}
              existingMeals={meals}
              onSaveDayMeals={handleSaveDayMeals}
            />

            {/* Meal History Table */}
            <MealHistoryTable
              meals={meals}
              members={members}
              currentMonth={currentMonth}
              onEditMeal={(record) => setEditingMealRecord(record)}
              onDeleteMeal={handleDeleteDayMeal}
            />
          </div>
        )}

        {activeTab === 'contributions' && (
          <ContributionList
            contributions={contributions}
            members={members}
            currentMonth={currentMonth}
            onAddClick={() => {
              setEditingContribution(null);
              setIsContributionModalOpen(true);
            }}
            onEditClick={(item) => {
              setEditingContribution(item);
              setIsContributionModalOpen(true);
            }}
            onDeleteClick={handleDeleteContribution}
          />
        )}

        {activeTab === 'settlement' && (
          <SettlementView summary={summary} currentMonth={currentMonth} />
        )}

        {activeTab === 'members' && (
          <MemberManager
            members={members}
            onUpdateMembers={handleUpdateMembers}
            meals={meals}
            contributions={contributions}
            onResetToSample={handleResetToSample}
            onResetToEmpty={handleResetToEmpty}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-14 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <span>MealFlow</span>
            <span>&bull;</span>
            <span className="font-normal text-slate-500 dark:text-slate-400">House Meal & Cost Sharing System</span>
          </div>
          <div>
            Built with React &amp; Tailwind CSS &bull; Currency in Bangladeshi Taka (৳)
          </div>
        </div>
      </footer>

      {/* Global Quick Contribution Modal */}
      <ContributionModal
        isOpen={isContributionModalOpen}
        onClose={() => {
          setIsContributionModalOpen(false);
          setEditingContribution(null);
        }}
        onSave={handleSaveContribution}
        editItem={editingContribution}
        members={members}
        currentMonth={currentMonth}
      />

      {/* Global Quick Daily Meal Modal */}
      <Modal
        isOpen={isQuickMealModalOpen}
        onClose={() => setIsQuickMealModalOpen(false)}
        title="Record Daily Meals"
        subtitle="Quickly log meals for all household members"
        maxWidth="max-w-3xl"
      >
        <DailyMealEntryForm
          members={members}
          currentMonth={currentMonth}
          existingMeals={meals}
          onSaveDayMeals={handleSaveDayMeals}
        />
      </Modal>

      {/* Edit Meal Record Modal */}
      <MealEditModal
        isOpen={Boolean(editingMealRecord)}
        onClose={() => setEditingMealRecord(null)}
        mealRecord={editingMealRecord}
        members={members}
        onSave={handleSaveDayMeals}
      />
    </div>
  );
}

export default App;
