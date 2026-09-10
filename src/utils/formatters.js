/**
 * Format number as Bangladeshi Taka (৳)
 * @param {number} amount
 * @param {boolean} [includeDecimals=true]
 * @returns {string}
 */
export function formatTaka(amount, includeDecimals = true) {
  if (amount === undefined || amount === null || isNaN(amount)) return '৳0';
  
  const num = Number(amount);
  const isInteger = Number.isInteger(num);
  
  const formatted = num.toLocaleString('en-BD', {
    minimumFractionDigits: includeDecimals ? (isInteger ? 0 : 2) : 0,
    maximumFractionDigits: 2,
  });

  return `৳${formatted}`;
}

/**
 * Format meal count nicely (e.g. 1, 1.5, 2)
 * @param {number} count
 * @returns {string}
 */
export function formatMeals(count) {
  if (count === undefined || count === null || isNaN(count)) return '0';
  const num = Number(count);
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
}

/**
 * Format YYYY-MM into readable month (e.g. "September 2026")
 * @param {string} yearMonth - "2026-09"
 * @returns {string}
 */
export function formatMonthYear(yearMonth) {
  if (!yearMonth) return '';
  const [year, month] = yearMonth.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Format YYYY-MM-DD into readable date (e.g. "Thu, Sep 10, 2026")
 * @param {string} dateStr - "2026-09-10"
 * @param {boolean} [short=false]
 * @returns {string}
 */
export function formatDate(dateStr, short = false) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  
  if (short) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Get current year-month in YYYY-MM format
 */
export function getCurrentYearMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDateStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
