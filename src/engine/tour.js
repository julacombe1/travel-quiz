import CrowdCoefficient from "./CrowdCoefficient.js";

export default function tour(answers, destination) {
  const stars = Number(answers?.tour) || 0;

  if (stars <= 0) {
    return {
      score: 1,
      commentaire: "",
    };
  }

  const freqScore = Number(destination?.tour) || 0;
  const score = CrowdCoefficient(stars, freqScore);

  return {
    score,
    commentaire: `Fréquentation touristique : ${freqScore}/100`,
  };
}