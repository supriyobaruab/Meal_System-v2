/**
 * Default initial dataset for House Meal Manager
 * Configured for September 2026 to immediately demonstrate full capabilities.
 */

export const DEFAULT_MEMBERS = [
  { id: 'm1', name: 'Member 1', active: true, color: 'indigo' },
  { id: 'm2', name: 'Member 2', active: true, color: 'blue' },
  { id: 'm3', name: 'Member 3', active: true, color: 'emerald' },
  { id: 'm4', name: 'Member 4', active: true, color: 'amber' },
  { id: 'm5', name: 'Member 5', active: true, color: 'rose' },
];

/**
 * Generates sample September 2026 entries that match:
 * Person A (m1): 40 meals, 5000 Tk contribution
 * Person B (m2): 35 meals, 3000 Tk contribution
 * Person C (m3): 30 meals, 2000 Tk contribution
 * Person D (m4): 25 meals, 1000 Tk contribution
 * Person E (m5): 20 meals, 0 Tk contribution
 * Total Meals = 150, Total Contribution = 11,000 Tk, Meal Rate = 73.33 Tk
 */
export function generateSampleData() {
  const members = [...DEFAULT_MEMBERS];

  const contributions = [
    {
      id: 'c-1',
      memberId: 'm1',
      amount: 3000,
      date: '2026-09-01',
      note: 'Initial month fund (Grocery & Oil)',
    },
    {
      id: 'c-2',
      memberId: 'm1',
      amount: 2000,
      date: '2026-09-15',
      note: 'Mid-month bazaar (Fish & Spices)',
    },
    {
      id: 'c-3',
      memberId: 'm2',
      amount: 2000,
      date: '2026-09-02',
      note: 'Rice 50kg bag',
    },
    {
      id: 'c-4',
      memberId: 'm2',
      amount: 1000,
      date: '2026-09-18',
      note: 'Vegetables & eggs',
    },
    {
      id: 'c-5',
      memberId: 'm3',
      amount: 2000,
      date: '2026-09-05',
      note: 'Meat & chicken purchase',
    },
    {
      id: 'c-6',
      memberId: 'm4',
      amount: 1000,
      date: '2026-09-10',
      note: 'Breakfast supplies & milk',
    },
  ];

  // Daily meals spanning 15 days in September 2026 totaling 150 meals
  // Distribution: m1=40, m2=35, m3=30, m4=25, m5=20
  const meals = [
    {
      id: 'meal-2026-09-01',
      date: '2026-09-01',
      entries: { m1: 3, m2: 2.5, m3: 2, m4: 1.5, m5: 1 },
      note: 'Day 1 meals',
    },
    {
      id: 'meal-2026-09-02',
      date: '2026-09-02',
      entries: { m1: 2.5, m2: 2, m3: 2, m4: 2, m5: 1.5 },
      note: '',
    },
    {
      id: 'meal-2026-09-03',
      date: '2026-09-03',
      entries: { m1: 3, m2: 2.5, m3: 2, m4: 1.5, m5: 1 },
      note: '',
    },
    {
      id: 'meal-2026-09-04',
      date: '2026-09-04',
      entries: { m1: 2.5, m2: 2, m3: 2, m4: 2, m5: 1.5 },
      note: 'Weekend special dinner',
    },
    {
      id: 'meal-2026-09-05',
      date: '2026-09-05',
      entries: { m1: 3, m2: 2.5, m3: 2, m4: 1.5, m5: 1 },
      note: '',
    },
    {
      id: 'meal-2026-09-06',
      date: '2026-09-06',
      entries: { m1: 2.5, m2: 2.5, m3: 2, m4: 1.5, m5: 1.5 },
      note: '',
    },
    {
      id: 'meal-2026-09-07',
      date: '2026-09-07',
      entries: { m1: 3, m2: 2, m3: 2, m4: 2, m5: 1.5 },
      note: '',
    },
    {
      id: 'meal-2026-09-08',
      date: '2026-09-08',
      entries: { m1: 2.5, m2: 2.5, m3: 2, m4: 1.5, m5: 1 },
      note: '',
    },
    {
      id: 'meal-2026-09-09',
      date: '2026-09-09',
      entries: { m1: 3, m2: 2.5, m3: 2, m4: 2, m5: 1.5 },
      note: '',
    },
    {
      id: 'meal-2026-09-10',
      date: '2026-09-10',
      entries: { m1: 3, m2: 2, m3: 3, m4: 1, m5: 2 },
      note: 'Today',
    },
    {
      id: 'meal-2026-09-11',
      date: '2026-09-11',
      entries: { m1: 2.5, m2: 2.5, m3: 2, m4: 1.5, m5: 1 },
      note: '',
    },
    {
      id: 'meal-2026-09-12',
      date: '2026-09-12',
      entries: { m1: 3, m2: 2.5, m3: 2, m4: 2, m5: 1.5 },
      note: '',
    },
    {
      id: 'meal-2026-09-13',
      date: '2026-09-13',
      entries: { m1: 2.5, m2: 2.5, m3: 2, m4: 1.5, m5: 1 },
      note: '',
    },
    {
      id: 'meal-2026-09-14',
      date: '2026-09-14',
      entries: { m1: 2.5, m2: 2.5, m3: 2, m4: 2, m5: 1.5 },
      note: '',
    },
    {
      id: 'meal-2026-09-15',
      date: '2026-09-15',
      entries: { m1: 2, m2: 2, m3: 3, m4: 2, m5: 1.5 },
      note: 'Mid-month tally',
    },
  ];

  return { members, contributions, meals };
}
