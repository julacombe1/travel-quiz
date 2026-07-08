import { ZERO_SCORE_PENALTY } from "./constants.js";
const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export default function genericTheme(themeKey) {
  return function (userAnswers, destination) {
    const stars = toNumber(userAnswers?.[themeKey], 0);
    const base = toNumber(destination?.[themeKey], 0);

    const commentaire =
      destination?.[`${themeKey}c`] ?? "";

    // si pas de commentaire => gros malus
    if (!commentaire || !String(commentaire).trim()) {
      return {
        score: ZERO_SCORE_PENALTY * stars,
        commentaire: "",
      };
    }

    const score = stars * base;

    return {
      score,
      commentaire,
    };
  };
}