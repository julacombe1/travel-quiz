import { coeffTempForMonth } from "./coefftemp.js";

import { ZERO_SCORE_PENALTY } from "./constants.js";

const toNumber = (v, fallback = 0) => {
  if (v === "#N/A" || v === "" || v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function inso(userAnswers, destination) {
  const userInso = toNumber(userAnswers.inso, 0);

  if (userInso <= 0) {
    return { score: 0, commentaire: "" };
  }

  const baseScore = toNumber(destination.inso, 0);
  const comment = destination.insoc ?? "";

  const monthKey = userAnswers._month;

  const coefTemp = monthKey
    ? coeffTempForMonth(userAnswers, destination, monthKey)
    : 1;


  const rawScore = baseScore * userInso;
  const finalScore = rawScore * coefTemp;

  // Malus si :
  // - destination impossible
  // - OU température incompatible
  if (baseScore === 0 || coefTemp <= 0 || finalScore === 0) {
    return {
      score: userInso * ZERO_SCORE_PENALTY,
      commentaire: comment,
    };
  }

  return {
    score: finalScore,
    commentaire: comment,
  };
}