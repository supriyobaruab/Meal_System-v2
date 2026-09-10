/**
 * Calculation utilities for House Meal Management & Cost Sharing
 */

/**
 * Calculate total meals taken by all members in a given list of meal records
 * @param {Array} mealRecords - List of meal entries for the period
 * @param {Array} members - List of member objects
 * @returns {number}
 */
export function calculateTotalMeals(mealRecords = [], members = []) {
  const memberIdSet = new Set(members.map((m) => m.id));
  let total = 0;

  for (const record of mealRecords) {
    if (record.entries) {
      for (const [memberId, count] of Object.entries(record.entries)) {
        // Only count if member exists in the household
        if (memberIdSet.has(memberId)) {
          const num = Number(count) || 0;
          if (num > 0) total += num;
        }
      }
    }
  }

  return Math.round(total * 100) / 100;
}

/**
 * Calculate total meals taken by a single member
 * @param {Array} mealRecords
 * @param {string} memberId
 * @returns {number}
 */
export function calculateMemberMeals(mealRecords = [], memberId) {
  let total = 0;
  for (const record of mealRecords) {
    if (record.entries && record.entries[memberId]) {
      const num = Number(record.entries[memberId]) || 0;
      if (num > 0) total += num;
    }
  }
  return Math.round(total * 100) / 100;
}

/**
 * Calculate total contributions recorded in a given list of contribution records
 * @param {Array} contributions - List of contribution records
 * @param {Array} members - List of members
 * @returns {number}
 */
export function calculateTotalContributions(contributions = [], members = []) {
  const memberIdSet = new Set(members.map((m) => m.id));
  let total = 0;

  for (const c of contributions) {
    if (memberIdSet.has(c.memberId)) {
      const amt = Number(c.amount) || 0;
      if (amt > 0) total += amt;
    }
  }

  return Math.round(total * 100) / 100;
}

/**
 * Calculate total contributions made by a single member
 * @param {Array} contributions
 * @param {string} memberId
 * @returns {number}
 */
export function calculateMemberContribution(contributions = [], memberId) {
  let total = 0;
  for (const c of contributions) {
    if (c.memberId === memberId) {
      const amt = Number(c.amount) || 0;
      if (amt > 0) total += amt;
    }
  }
  return Math.round(total * 100) / 100;
}

/**
 * Calculate current meal rate: Total Contributions / Total Meals
 * Total Meal Cost = Total Contributions
 * @param {number} totalContributions
 * @param {number} totalMeals
 * @returns {number}
 */
export function calculateMealRate(totalContributions, totalMeals) {
  if (!totalMeals || totalMeals <= 0) return 0;
  return totalContributions / totalMeals;
}

/**
 * Calculate a member's meal cost: memberMeals * mealRate
 * @param {number} memberMeals
 * @param {number} mealRate
 * @returns {number}
 */
export function calculateMemberMealCost(memberMeals, mealRate) {
  return (Number(memberMeals) || 0) * (Number(mealRate) || 0);
}

/**
 * Calculate a member's balance: memberContribution - memberMealCost
 * @param {number} memberContribution
 * @param {number} memberMealCost
 * @returns {number}
 */
export function calculateMemberBalance(memberContribution, memberMealCost) {
  return (Number(memberContribution) || 0) - (Number(memberMealCost) || 0);
}

/**
 * Determine status based on balance
 * Positive: Receives
 * Negative: Owes
 * Zero: Settled
 * @param {number} balance
 * @returns {'receives' | 'owes' | 'settled'}
 */
export function getBalanceStatus(balance) {
  const rounded = Math.round(balance * 100) / 100;
  if (rounded > 0.01) return 'receives';
  if (rounded < -0.01) return 'owes';
  return 'settled';
}

/**
 * Generate full monthly calculation summary for all members
 * @param {Array} members
 * @param {Array} mealRecords
 * @param {Array} contributions
 */
export function calculateMonthlySummary(members = [], mealRecords = [], contributions = []) {
  const totalMeals = calculateTotalMeals(mealRecords, members);
  const totalContributions = calculateTotalContributions(contributions, members);
  const mealRate = calculateMealRate(totalContributions, totalMeals);

  const memberSummaries = members.map((member) => {
    const meals = calculateMemberMeals(mealRecords, member.id);
    const contribution = calculateMemberContribution(contributions, member.id);
    const mealCost = calculateMemberMealCost(meals, mealRate);
    const balance = calculateMemberBalance(contribution, mealCost);
    const status = getBalanceStatus(balance);

    return {
      memberId: member.id,
      name: member.name,
      meals,
      contribution,
      mealCost,
      balance,
      status,
    };
  });

  // Calculate total owed and total receivable
  const totalOwed = memberSummaries
    .filter((m) => m.status === 'owes')
    .reduce((sum, m) => sum + Math.abs(m.balance), 0);

  const totalReceivable = memberSummaries
    .filter((m) => m.status === 'receives')
    .reduce((sum, m) => sum + m.balance, 0);

  return {
    totalMeals,
    totalContributions,
    mealRate,
    totalMealCost: totalContributions,
    totalOwed,
    totalReceivable,
    memberSummaries,
  };
}

/**
 * Settlement Algorithm (Min Cash Flow Algorithm)
 * Minimizes the number of payment transactions between debtors and creditors.
 * 
 * @param {Array} memberSummaries - Array of member summary objects with memberId, name, balance
 * @returns {Array<{ fromId: string, fromName: string, toId: string, toName: string, amount: number }>}
 */
export function calculateSettlements(memberSummaries = []) {
  // Filter into creditors (> 0.01) and debtors (< -0.01)
  const creditors = [];
  const debtors = [];

  for (const m of memberSummaries) {
    const net = Math.round(m.balance * 100) / 100;
    if (net > 0.01) {
      creditors.push({
        id: m.memberId,
        name: m.name,
        amount: net,
      });
    } else if (net < -0.01) {
      debtors.push({
        id: m.memberId,
        name: m.name,
        amount: Math.abs(net),
      });
    }
  }

  // Sort descending by amount to settle largest debts first
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transfers = [];
  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const settledAmount = Math.min(creditor.amount, debtor.amount);
    const roundedSettledAmount = Math.round(settledAmount * 100) / 100;

    if (roundedSettledAmount > 0) {
      transfers.push({
        id: `transfer-${debtor.id}-${creditor.id}-${transfers.length}`,
        fromId: debtor.id,
        fromName: debtor.name,
        toId: creditor.id,
        toName: creditor.name,
        amount: roundedSettledAmount,
      });
    }

    creditor.amount = Math.round((creditor.amount - settledAmount) * 100) / 100;
    debtor.amount = Math.round((debtor.amount - settledAmount) * 100) / 100;

    if (creditor.amount <= 0.01) {
      cIdx++;
    }
    if (debtor.amount <= 0.01) {
      dIdx++;
    }
  }

  return transfers;
}
