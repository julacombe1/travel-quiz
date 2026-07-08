export const MIN_BUDGET = 500;
export const DEFAULT_TRIP_DAYS = 15;
export const BUDGET_MONTH_COEF_DEFAULT = 1;

export const MONTHS = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
];

export function toNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function normalizeMonth(month) {
  if (!month || month === "best") return null;

  return String(month)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function getMonthFromDate(date) {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  return MONTHS[parsedDate.getMonth()];
}

export function getTripDays(userAnswers) {
  const from = userAnswers?.exactDates?.from;
  const to = userAnswers?.exactDates?.to;

  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);

    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return Math.max(1, diffDays);
  }

  return toNumber(userAnswers?.tripDays, DEFAULT_TRIP_DAYS);
}

export function getBudgetMonthCoef(destination, month) {
  if (!month) return BUDGET_MONTH_COEF_DEFAULT;

  return toNumber(
    destination?.[`coef_bud.${month}`] ??
      destination?.[`coef_bud_${month}`] ??
      destination?.[`coefbud.${month}`] ??
      destination?.[`coefbud_${month}`],
    BUDGET_MONTH_COEF_DEFAULT
  );
}

export function getWeightedBudgetMonthCoef(destination, userAnswers) {
  const from = userAnswers?.exactDates?.from;
  const to = userAnswers?.exactDates?.to;

  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start > end
    ) {
      return BUDGET_MONTH_COEF_DEFAULT;
    }

    const monthDays = {};
    const current = new Date(start);

    while (current <= end) {
      const month = getMonthFromDate(current);

      if (month) {
        monthDays[month] = (monthDays[month] || 0) + 1;
      }

      current.setDate(current.getDate() + 1);
    }

    const totalDays = Object.values(monthDays).reduce(
      (sum, days) => sum + days,
      0
    );

    if (!totalDays) return BUDGET_MONTH_COEF_DEFAULT;

    return Object.entries(monthDays).reduce((sum, [month, days]) => {
      const monthCoef = getBudgetMonthCoef(destination, month);
      return sum + monthCoef * (days / totalDays);
    }, 0);
  }

  const month =
    normalizeMonth(userAnswers?._month) ||
    normalizeMonth(userAnswers?.selectedMonth);

  return getBudgetMonthCoef(destination, month);
}