// src/engine/adjustmentCoefficient.js

import { THEMES_BY_PROFILE as THEMES_1 } from "../data/themes.js";
import { THEMES_BY_PROFILE as THEMES_2 } from "../data/themes2.js";
import { THEMES3 } from "../data/themes3.js";

const MIN_ACTIVE_THEMES_FOR_FULL_ADJUST = 15;
const DEFAULT_ADJUST_COEF = 1;

function getAllThemeKeys() {
  const themeKeys = new Set();

  const addTheme = (theme) => {
    if (theme?.id) themeKeys.add(theme.id);
    if (theme?.duoId) themeKeys.add(theme.duoId);
    if (theme?.scoreKey) themeKeys.add(theme.scoreKey);
    if (theme?.duoScoreKey) themeKeys.add(theme.duoScoreKey);
  };

  Object.values(THEMES_1).flat().forEach(addTheme);
  Object.values(THEMES_2).flat().forEach(addTheme);
  THEMES3.forEach(addTheme);

  return [...themeKeys];
}

const ALL_THEME_KEYS = getAllThemeKeys();

function countActiveThemes(answers) {
  return ALL_THEME_KEYS.filter((key) => Number(answers?.[key]) !== 0).length;
}

export default function adjustmentCoefficient(answers, destination) {
  const ajust = Number(destination?.ajust);

  if (!Number.isFinite(ajust) || ajust <= 0) {
    return {
      score: DEFAULT_ADJUST_COEF,
      commentaire: "",
    };
  }

  const activeThemeCount = countActiveThemes(answers);

  if (activeThemeCount >= MIN_ACTIVE_THEMES_FOR_FULL_ADJUST) {
    return {
      score: ajust,
      commentaire: "",
    };
  }

  const score =
    1 -
    ((1 - ajust) * activeThemeCount) /
      MIN_ACTIVE_THEMES_FOR_FULL_ADJUST;

  return {
    score,
    commentaire: "",
  };
}