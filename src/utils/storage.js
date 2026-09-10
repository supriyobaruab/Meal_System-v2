import { DEFAULT_MEMBERS, generateSampleData } from '../data/defaultData';

const STORAGE_KEY = 'meal_system_data_v1';

/**
 * Load app data from localStorage or initialize with sample data
 */
export function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.members) && parsed.members.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load data from localStorage:', err);
  }

  // First time initialization: load rich sample data
  const sample = generateSampleData();
  saveAppData(sample);
  return sample;
}

/**
 * Save app data to localStorage
 */
export function saveAppData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save data to localStorage:', err);
  }
}

/**
 * Export current database as JSON string file download
 */
export function exportDataAsJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `meal_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Reset data to fresh default 5 members with empty logs
 */
export function resetToEmptyDefaults() {
  const empty = {
    members: [...DEFAULT_MEMBERS],
    contributions: [],
    meals: [],
  };
  saveAppData(empty);
  return empty;
}

/**
 * Reset data to rich sample data (September 2026)
 */
export function resetToSample() {
  const sample = generateSampleData();
  saveAppData(sample);
  return sample;
}
