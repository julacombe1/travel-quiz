export const MONTH_KEYS = [
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

export const normalizeMonthKey = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const TEMP_MIN = 18;
const TEMP_MAX = 30;
const MAX_TEMP_GAP = 2;

const CHAL_RANGES = {
  1: { min: 14, max: 18 },
  2: { min: 18, max: 22 },
  3: { min: 22, max: 26 },
  4: { min: 26, max: 30 },
  5: { min: 30, max: 40 },
};

const ACCENTED_MONTH_MAP = {
  fevrier: "février",
  aout: "août",
  decembre: "décembre",
};

function toNumber(v, fallback = 0) {
  if (v == null || v === "") return fallback;

  const normalized = typeof v === "string" ? v.replace(",", ".").trim() : v;
  const n = Number(normalized);

  return Number.isFinite(n) ? n : fallback;
}

function getMonthKeyFromDate(date) {
  return MONTH_KEYS[date.getMonth()];
}

export function getDestinationMonthValue(destination, themeKey, monthKey) {
  const nested = destination?.[themeKey]?.[monthKey];
  if (nested != null) return toNumber(nested, null);

  const flat = destination?.[`${themeKey}.${monthKey}`];
  if (flat != null) return toNumber(flat, null);

  const accented = ACCENTED_MONTH_MAP[monthKey];

  if (accented) {
    const flatAccented = destination?.[`${themeKey}.${accented}`];
    if (flatAccented != null) return toNumber(flatAccented, null);

    const nestedAccented = destination?.[themeKey]?.[accented];
    if (nestedAccented != null) return toNumber(nestedAccented, null);
  }

  return null;
}


function coefficientFromTemperature(
  value,
  min,
  max,
  { acceptBelowMin = false, acceptAboveMax = false } = {}
) {
  if (!Number.isFinite(value)) return 1;

  if (value >= min && value <= max) {
    return 1;
  }

  if (value < min) {
    if (acceptBelowMin) return 1;

    const gap = min - value;
    if (gap >= MAX_TEMP_GAP) return 0;

    return Math.max(0, 1 - gap / MAX_TEMP_GAP);
  }

  if (value > max) {
    if (acceptAboveMax) return 1;

    const gap = value - max;
    if (gap >= MAX_TEMP_GAP) return 0;

    return Math.max(0, 1 - gap / MAX_TEMP_GAP);
  }

  return 1;
}

function getUserTempRangeForTheme(answers, themeKey) {
  const stars = toNumber(answers?.[themeKey], 0);

  // 0 étoile => thème ignoré => coef 1
  if (stars <= 0) {
    return null;
  }

  if (themeKey === "chal") {
    const chalMin = Number(answers?.chalMin);
    const chalMax = Number(answers?.chalMax);

    if (!Number.isFinite(chalMin) || !Number.isFinite(chalMax)) {
      return null;
    }

    return {
      min: Math.min(chalMin, chalMax),
      max: Math.max(chalMin, chalMax),
      acceptBelowMin: false,
      acceptAboveMax: false,
    };
  }

  const tempMin = Number(answers?.teauMin);
  const tempMax = Number(answers?.teauMax);

  if (!Number.isFinite(tempMin) || !Number.isFinite(tempMax)) {
    return null;
  }

  const min = Math.min(tempMin, tempMax);
  const max = Math.max(tempMin, tempMax);

  return {
    min,
    max,
    acceptBelowMin: min <= TEMP_MIN,
    acceptAboveMax: max >= TEMP_MAX,
  };
}

function getActiveThemeCoefficient(answers, destination, themeKey, monthKey) {
  const range = getUserTempRangeForTheme(answers, themeKey);

  // Thème ignoré ou plage non exploitable => pas de pénalité
  if (!range) {
    return 1;
  }

  const value = getDestinationMonthValue(destination, themeKey, monthKey);

  return coefficientFromTemperature(value, range.min, range.max, {
    acceptBelowMin: range.acceptBelowMin,
    acceptAboveMax: range.acceptAboveMax,
  });
}



export function coeffTempForMonth(answers, destination, monthKey) {
  const normalizedMonth = normalizeMonthKey(monthKey);

  const coefs = [
    getActiveThemeCoefficient(answers, destination, "inso", normalizedMonth),
    getActiveThemeCoefficient(answers, destination, "mer", normalizedMonth),
    getActiveThemeCoefficient(answers, destination, "chal", normalizedMonth),
  ];

  return Math.min(...coefs);
}

export function countDaysByMonth(from, to) {
  const result = {};

  const current = new Date(from);
  current.setHours(0, 0, 0, 0);

  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const monthKey = getMonthKeyFromDate(current);
    result[monthKey] = (result[monthKey] ?? 0) + 1;
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function getWeightedMonthValue(destination, themeKey, from, to) {
  if (
    !from ||
    !to ||
    Number.isNaN(new Date(from).getTime()) ||
    Number.isNaN(new Date(to).getTime())
  ) {
    return null;
  }

  const fromDate = new Date(from);
  const toDate = new Date(to);

  if (fromDate > toDate) {
    return null;
  }

  const daysByMonth = countDaysByMonth(fromDate, toDate);

  let weightedSum = 0;
  let countedDays = 0;

  for (const [monthKey, days] of Object.entries(daysByMonth)) {
    const value = getDestinationMonthValue(destination, themeKey, monthKey);

    if (value != null) {
      weightedSum += value * days;
      countedDays += days;
    }
  }

  if (countedDays <= 0) {
    return null;
  }

  return weightedSum / countedDays;
}