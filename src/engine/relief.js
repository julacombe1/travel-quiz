// src/engine/relief.js

const MAIN_RELIEF_KEYS = [
  "alpin",
  "cotier",
  "volcanique",
  "tropical",
  "foret",
];

const OPPOSITE_RELIEF_KEYS = [
  "desertique",
  "vegetalise",
];

const DEFAULT_COEF = 1;
const MAX_RELIEF_COEF = 1.3;
const MAX_RELIEF_BONUS = MAX_RELIEF_COEF - 1;

const FIELD_PREFIX = "relief";

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getReliefValue(destination, key) {
  return toNumber(
    destination?.[`${FIELD_PREFIX}.${key}`] ??
      destination?.[`${FIELD_PREFIX}_${key}`] ??
      destination?.[FIELD_PREFIX]?.[key],
    0
  );
}

function getMainReliefCoef(destination, selectedKeys) {
  const selectedCount = selectedKeys.length;

  if (!selectedCount) {
    return DEFAULT_COEF;
  }

  const maxBonusPerRelief = MAX_RELIEF_BONUS / selectedCount;
  const threshold = 100 / selectedCount;

  const bonus = selectedKeys.reduce((sum, key) => {
    const value = clamp(getReliefValue(destination, key), 0, 100);

    const reliefRatio = clamp(value / threshold, 0, 1);

    return sum + reliefRatio * maxBonusPerRelief;
  }, 0);

  return DEFAULT_COEF + clamp(bonus, 0, MAX_RELIEF_BONUS);
}

function getOppositeReliefCoef(destination, selectedKeys) {
  if (!selectedKeys.length) {
    return DEFAULT_COEF;
  }

  const coefs = selectedKeys.map((key) => {
    const value = clamp(getReliefValue(destination, key), 0, 100);

    if (value <= 20) {
      return DEFAULT_COEF;
    }

    if (value >= 80) {
      return MAX_RELIEF_COEF;
    }

    const ratio = (value - 20) / 60;

    return DEFAULT_COEF + ratio * MAX_RELIEF_BONUS;
  });

  return coefs.reduce((sum, coef) => sum + coef, 0) / coefs.length;
}

export default function relief(answers, destination) {
  const showRelief = answers?.showRelief ?? false;
  const reliefAnswers = answers?.relief ?? {};

  if (!showRelief || reliefAnswers.indifferent) {
    return {
      score: DEFAULT_COEF,
      commentaire: "",
    };
  }

  const selectedMainKeys = MAIN_RELIEF_KEYS.filter(
    (key) => reliefAnswers[key]
  );

  const selectedOppositeKeys = OPPOSITE_RELIEF_KEYS.filter(
    (key) => reliefAnswers[key]
  );

  const mainCoef = getMainReliefCoef(destination, selectedMainKeys);
  const oppositeCoef = getOppositeReliefCoef(destination, selectedOppositeKeys);

  return {
    score: mainCoef * oppositeCoef,
    commentaire: "",
  };
}