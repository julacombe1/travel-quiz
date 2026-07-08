// engine/chaleur.js

import { normalizeMonthKey } from "./coefftemp.js";
import { CHAL_MIN, CHAL_MAX } from "./constants.js";


const OUTSIDE_RANGE_COEFS = {
  0: 1,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
};

const MAX_DELTA_BEFORE_ZERO = 4;

function toNumber(value, fallback = null) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function getCoefFromDelta(delta) {
  const roundedDelta = Math.ceil(delta);

  if (roundedDelta > MAX_DELTA_BEFORE_ZERO) {
    return 0;
  }

  return OUTSIDE_RANGE_COEFS[roundedDelta] ?? 0;
}

export function chaleur(answers, destination) {
  const min = toNumber(answers?.chalMin);
  const max = toNumber(answers?.chalMax);
  const chalRating = Number(answers?.chal) || 0;
  const isFullRange =
  min === CHAL_MIN &&
  max === CHAL_MAX;

if (isFullRange) {
  return {
    key: "chaleur",
    type: "coef",
    score: 1,
    comment: null,
  };
}

  if (chalRating <= 0) {
    return {
      key: "chaleur",
      type: "coef",
      score: 1,
      comment: null,
    };
  }

  const monthKey =
    normalizeMonthKey(answers?._month) ||
    normalizeMonthKey(answers?.selectedMonth);

  if (!monthKey) {
    return {
      key: "chaleur",
      type: "coef",
      score: 1,
      comment: null,
    };
  }

  const temperature = toNumber(destination?.[`chal.${monthKey}`]);

  if (temperature == null) {
    return {
      key: "chaleur",
      type: "coef",
      score: 0,
      comment: `Température indisponible (${monthKey})`,
    };
  }

let delta = 0;

// Limite basse seulement si l'utilisateur a monté le minimum
if (
  min != null &&
  min > CHAL_MIN &&
  temperature < min
) {
  delta = min - temperature;
}

// Limite haute seulement si l'utilisateur a baissé le maximum
if (
  max != null &&
  max < CHAL_MAX &&
  temperature > max
) {
  delta = temperature - max;
}

  const score = getCoefFromDelta(delta);

  return {
    key: "chaleur",
    type: "coef",
    score,
    comment:
      score > 0
        ? `${temperature}°C`
        : `${temperature}°C hors critère chaleur`,
    temperature,
    monthKey,
  };
}