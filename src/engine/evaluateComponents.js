import { SCORE_COMPONENTS } from "./scoreComponents.js";

const safeScore = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const hasUserInterest = (answers, key) => {
  if (key === "transportModes") {
    const modes = answers?.transportModes;
    return modes && !modes.indifferent;
  }

  return safeScore(answers?.[key]) > 0;
};

export function evaluateComponents(answers, dest) {
  return SCORE_COMPONENTS.map((component) => {
    const { key, engine, type, alwaysRun = false } = component;

    if (type === "sum" && !alwaysRun && !hasUserInterest(answers, key)) {
      return {
        key,
        type,
        score: 0,
        commentaire: null,
        comment: null,
        monthKey: null,
      };
    }

    const result = engine(answers, dest) || {};

    return {
      key,
      type,
      score: safeScore(result.score),
      commentaire: result.commentaire ?? result.comment ?? null,
      comment: result.comment ?? result.commentaire ?? null,
      requiredBudget: result.requiredBudget ?? null,
      userBudget: result.userBudget ?? null,
      monthKey: result.monthKey ?? null,
    };
  });
}