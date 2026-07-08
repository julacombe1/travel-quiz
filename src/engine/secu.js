import CrowdCoefficient from "./CrowdCoefficient.js";

const SECURITY_COEF_25 = 0.95;
const SECURITY_COEF_0 = 0.8;

export default function secu(answers, destination) {
  const stars = Number(answers?.secu) || 0;
  const freqScore = Number(destination?.secu) || 0;

  // 🔹 Pas de préférence sécurité exprimée
  if (stars <= 0) {
    if (freqScore === 0) {
      return {
        score: SECURITY_COEF_0,
        commentaire: "",
      };
    }

    if (freqScore === 25) {
      return {
        score: SECURITY_COEF_25,
        commentaire: "",
      };
    }

    return {
      score: 1,
      commentaire: "",
    };
  }

  const score = CrowdCoefficient(stars, freqScore);

  return {
    score,
    commentaire: `Sécurité : ${freqScore}/100`,
  };
}