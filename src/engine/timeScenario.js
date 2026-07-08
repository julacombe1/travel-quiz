import {
  coeffTempForMonth,
  countDaysByMonth,
  MONTH_KEYS,
  normalizeMonthKey,
} from "./coefftemp.js";

const safeNumber = (value) => {
  if (value === "#N/A" || value == null || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

function getExactDatesWeightedCoef(answers, dest) {
  const from = answers?.exactDates?.from
    ? new Date(answers.exactDates.from)
    : null;
  const to = answers?.exactDates?.to
    ? new Date(answers.exactDates.to)
    : null;

  if (
    !from ||
    !to ||
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime()) ||
    from > to
  ) {
    return 1;
  }

  const daysByMonth = countDaysByMonth(from, to);
  const totalDays = Object.values(daysByMonth).reduce((sum, n) => sum + n, 0);

  if (totalDays <= 0) return 1;

  let weightedCoef = 0;

  for (const [monthKey, days] of Object.entries(daysByMonth)) {
    const coef = safeNumber(coeffTempForMonth(answers, dest, monthKey)) || 1;
    weightedCoef += coef * (days / totalDays);
  }

  return weightedCoef;
}

function getBestMonthEvaluation(answers, dest, scoreBeforeTime) {
  const monthKey = answers?._month;

  if (!monthKey) {
    return {
      mode: "best",
      score: safeNumber(scoreBeforeTime),
      timeCoef: 1,
      bestMonth: null,
    };
  }

  const coef = safeNumber(coeffTempForMonth(answers, dest, monthKey)) || 1;

  return {
    mode: "best",
    score: safeNumber(scoreBeforeTime) * coef,
    timeCoef: coef,
    bestMonth: monthKey,
  };
}

export function evaluateTimeScenario(answers, dest, scoreBeforeTime) {
  const safeBase = safeNumber(scoreBeforeTime);

  const hasExactDates =
    answers?.exactDates?.from && answers?.exactDates?.to;

  const normalizedSelectedMonth = normalizeMonthKey(answers?.selectedMonth);

  if (hasExactDates) {
    const timeCoef = getExactDatesWeightedCoef(answers, dest);

    return {
      mode: "exactDates",
      score: safeBase * timeCoef,
      timeCoef,
      bestMonth: answers?._month ?? null,
    };
  }

  if (normalizedSelectedMonth && normalizedSelectedMonth !== "best") {
    const timeCoef =
      safeNumber(coeffTempForMonth(answers, dest, normalizedSelectedMonth)) || 1;

    return {
      mode: "selectedMonth",
      score: safeBase * timeCoef,
      timeCoef,
      bestMonth: normalizedSelectedMonth,
    };
  }

  return getBestMonthEvaluation(answers, dest, safeBase);
}