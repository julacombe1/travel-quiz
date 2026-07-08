import { clamp, toNumber } from "./budgetUtils.js";

/* =========================================================
   BUDGET ACTIVITÉS
   ========================================================= */

const BUDGET_ACTIVITY_LEVEL_COEFS = {
  1: 0.5, // Strict minimum
  2: 0.75, // Économe
  3: 1.00, // Équilibré
  4: 1.20, // Confort
  5: 1.50, // Plaisir
};

/* =========================================================
   COEFFICIENT NOMBRE DE VOYAGEURS
   Remplace le simple × travelers.
   Permet une petite économie de groupe.
   ========================================================= */

const ACTIVITY_TRAVELERS_COEFS = {
  1: 1,
  2: 1.9,
  3: 2.75,
  4: 3.55,
  5: 4.35,
  6: 5.1,
  7: 5.85,
  8: 6.6,
  9: 7.35,
  10: 8.1,
  11: 8.85,
  12: 9.6,
  13: 10.35,
  14: 11.1,
  15: 11.85,
  16: 12.6,
  17: 13.35,
  18: 14.1,
  19: 14.85,
  20: 15.6,
};

/* =========================================================
   AUGMENTATION PAR TYPE D’ACTIVITÉ
   Valeur = augmentation de base pour 1 étoile.
   2 étoiles = +25% sur cette augmentation
   3 étoiles = +50% sur cette augmentation
   ========================================================= */

const ACTIVITY_THEME_INCREASES = {
  // Activités chères / premium
  extreme: 0.35,
  aerien: 0.42,
  jetski: 0.28,
  motor: 0.25,
  plongee: 0.25,

  // Activités sportives encadrées
  canyon: 0.18,
  rafting: 0.16,
  viaferrata: 0.12,
  speleo: 0.12,
  bateau: 0.15,
  surf: 0.08,
  esca: 0.08,
  accro: 0.06,
  canoe: 0.06,
  velo: 0.01,
  cyclisme: 0.01,

  // Loisirs / parcs
  attrac: 0.17,
  attracsens: 0.22,
  zoo: 0.08,
  aqua: 0.08,

  // Bien-être
  massage: 0.15,
  soin: 0.09,

  // Visites / culture
  visite: 0.02,
  grot: 0.02,
  planta: 0.02,
  musees: 0.02,
  histo: 0.02,
  monu: 0.02,
  arch: 0.02,
  reli: 0.02,
  shop: 0.12,
};

/* =========================================================
   PARAMÈTRES DE CONTRÔLE
   ========================================================= */

const STAR_2_BONUS = 1.25;
const STAR_3_BONUS = 1.5;

const ACTIVITY_INCREASE_DAMPING = 0.35;
const MAX_ACTIVITY_STYLE_COEF = 3.2;

/* =========================================================
   OUTILS
   ========================================================= */

function getBudgetActivityLevelCoef(userAnswers) {
  const level = clamp(toNumber(userAnswers?.budgetActivite, 3), 1, 5);
  return BUDGET_ACTIVITY_LEVEL_COEFS[level] ?? 1;
}

function getActivityTravelersCoef(travelers) {
  const safeTravelers = clamp(toNumber(travelers, 1), 1, 20);
  return ACTIVITY_TRAVELERS_COEFS[safeTravelers] ?? safeTravelers;
}

function getActivityDailyPrice(destination) {
  return toNumber(
    destination?.prixact ??
      destination?.prix_act ??
      destination?.["prix act"],
    0
  );
}

function getStarMultiplier(stars) {
  if (stars <= 1) return 1;
  if (stars === 2) return STAR_2_BONUS;
  return STAR_3_BONUS;
}

function getActivityStyleCoef(userAnswers) {
  let rawIncrease = 0;

  Object.entries(ACTIVITY_THEME_INCREASES).forEach(([theme, increase]) => {
    const stars = clamp(toNumber(userAnswers?.[theme], 0), 0, 3);

    if (!stars) return;

    rawIncrease += increase * getStarMultiplier(stars);
  });

  if (rawIncrease <= 0) {
    return 1;
  }

  const dampedIncrease =
    rawIncrease / (1 + rawIncrease * ACTIVITY_INCREASE_DAMPING);

  return Math.min(
    1 + dampedIncrease,
    MAX_ACTIVITY_STYLE_COEF
  );
}

/* =========================================================
   CALCUL PRINCIPAL
   ========================================================= */

export function calculateActivityBudget({
  destination,
  userAnswers,
  travelers,
  tripDays,
}) {
  const baseDailyActivityPrice = getActivityDailyPrice(destination);

  const budgetActivityCoef = getBudgetActivityLevelCoef(userAnswers);
  const activityTravelersCoef = getActivityTravelersCoef(travelers);
  const activityStyleCoef = getActivityStyleCoef(userAnswers);

  return (
    baseDailyActivityPrice *
    activityTravelersCoef *
    budgetActivityCoef *
    activityStyleCoef *
    tripDays
  );
}