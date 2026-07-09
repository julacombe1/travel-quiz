// src/engine/mer.js

import { ZERO_SCORE_PENALTY } from "./constants.js";

const toNumber = (v, fallback = 0) => {
  if (v === "#N/A" || v === "" || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

function getWaterTempCoef(userAnswers, destination, monthKey) {
  const min = toNumber(userAnswers?.teauMin, null);
  const max = toNumber(userAnswers?.teauMax, null);

  const waterTemp = toNumber(destination?.[`mer.${monthKey}`], null);

  if (waterTemp == null) return 0;

  let delta = 0;

  if (min != null && waterTemp < min) {
    delta = min - waterTemp;
  } else if (max != null && waterTemp > max) {
    delta = waterTemp - max;
  }

  if (delta <= 0) return 1;
  if (delta <= 1) return 0.5;
  if (delta <= 2) return 0;
  if (delta <= 3) return 0;
  if (delta <= 4) return 0;

  return 0;
}

export default function mer(userAnswers, destination) {
  const userMer = toNumber(userAnswers?.mer, 0);

  if (userMer <= 0) {
    return { score: 0, commentaire: "" };
  }

  const baseScore = toNumber(destination?.mer, 0);
  const comment = destination?.merc ?? "";

  const monthKey = userAnswers?._month;

  const coefTemp = monthKey
    ? getWaterTempCoef(userAnswers, destination, monthKey)
    : 1;

  const rawScore = baseScore * userMer;
  const finalScore = rawScore * coefTemp;

  if (baseScore === 0 || coefTemp <= 0 || finalScore === 0) {
    return {
      score: userMer * ZERO_SCORE_PENALTY,
      commentaire: comment,
    };
  }

  return {
    score: finalScore,
    commentaire: comment,
  };
}