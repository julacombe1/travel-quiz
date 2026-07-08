// src/engine/trek.js

import extractComment from "./extractComment.js";
import { ZERO_SCORE_PENALTY } from "./constants.js";

const pick = (obj, keys) => {
  for (const k of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
  }
  return undefined;
};
export const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};
export default function trek(userAnswers, destination) {
  const userTrek = toNumber(userAnswers?.trek, 0); // étoiles trek
  const trekDuration = toNumber(userAnswers?.trekDuration, 1); // curseur 1..5

  if (userTrek <= 0) {
    return {
      lieu: destination.lieu,
      pays: destination.pays,
      score: 0,
      commentaire: "",
    };
  }

  const N = Math.min(5, Math.max(1, Math.round(trekDuration)));

  const baseS = toNumber(
    pick(destination, [`trek.${N}s`, `trek_${N}s`, `trek${N}s`]),
    0
  );

  const commentFromField = pick(destination, [
    `trek.${N}c`,
    `trek_${N}c`,
    `trek${N}c`,
  ]);

  const commentFallback = extractComment(destination?.comm, "trek");


const commentaireRaw =
  commentFromField && String(commentFromField).trim()
    ? String(commentFromField).trim()
    : commentFallback || "";

let score = baseS * userTrek;

if (!commentaireRaw.trim()) {
  score = ZERO_SCORE_PENALTY * userTrek;
}

return {
  lieu: destination.lieu,
  pays: destination.pays,
  score,
  commentaire: commentaireRaw ? ` ${commentaireRaw}` : "",
};
}