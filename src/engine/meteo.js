// engine/meteo.js

import { normalizeMonthKey } from "./coefftemp.js";

const DEFAULT_METEO_COEF = 1;
const COEF_DIVIDER = 100;

const MONTH_KEYS = [
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

function toNumber(value, fallback = null) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function getMonthKeyFromDate(dateValue) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return null;

  return MONTH_KEYS[date.getMonth()];
}

function getMeteoCoefForMonth(destination, monthKey) {
  if (!monthKey) return DEFAULT_METEO_COEF;

  const rawCoef = toNumber(
    destination?.[`coef.${monthKey}`] ??
      destination?.[`coef_${monthKey}`] ??
      destination?.[`coef${monthKey}`],
    null
  );

  if (rawCoef == null) return DEFAULT_METEO_COEF;

  return rawCoef / COEF_DIVIDER;
}

function getWeightedMeteoCoef(destination, from, to) {
  const start = new Date(from);
  const end = new Date(to);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return DEFAULT_METEO_COEF;
  }

  const monthDays = {};
  const current = new Date(start);

  while (current <= end) {
    const monthKey = MONTH_KEYS[current.getMonth()];
    monthDays[monthKey] = (monthDays[monthKey] || 0) + 1;
    current.setDate(current.getDate() + 1);
  }

  const totalDays = Object.values(monthDays).reduce(
    (sum, days) => sum + days,
    0
  );

  if (!totalDays) return DEFAULT_METEO_COEF;

  return Object.entries(monthDays).reduce((sum, [monthKey, days]) => {
    const coef = getMeteoCoefForMonth(destination, monthKey);
    return sum + coef * (days / totalDays);
  }, 0);
}

export function meteo(answers, destination) {
  if (answers?.exactDates?.from && answers?.exactDates?.to) {
    const score = getWeightedMeteoCoef(
      destination,
      answers.exactDates.from,
      answers.exactDates.to
    );

    return {
      key: "meteo",
      type: "coef",
      score,
      comment: null,
    };
  }

  const monthKey =
    normalizeMonthKey(answers?._month) ||
    normalizeMonthKey(answers?.selectedMonth) ||
    getMonthKeyFromDate(new Date());

  const score = getMeteoCoefForMonth(destination, monthKey);

  return {
    key: "meteo",
    type: "coef",
    score,
    comment: null,
  };
}