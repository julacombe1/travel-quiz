import { clamp, toNumber } from "./budgetUtils.js";

/* =========================================================
   BUDGET NOURRITURE
   ========================================================= */

const BUDGET_FOOD_LEVEL_COEFS = {
  1: 0.65, // Strict minimum
  2: 0.80, // Économe
  3: 1.00, // Équilibré
  4: 1.20, // Confort
  5: 1.50, // Plaisir
};

/* =========================================================
   STYLE DE RESTAURATION
   ========================================================= */

const FOOD_STYLE_COEFS = {
  streetfood: 0.65,
  stvege: 0.6,

  cuisineloc: 1.05,
  cuivege: 0.95,

  gastro: 1.95,
  gasvege: 1.80,
};

/* =========================================================
   BOISSONS
   ========================================================= */

const ALCOHOL_PER_STAR_COEF = 0.05;
const WINE_PER_STAR_COEF = 0.07;

/* =========================================================
   CALCUL
   ========================================================= */

export function calculateFoodBudget({
  destination,
  userAnswers,
  travelers,
  tripDays,
}) {
  const prixBouffe = toNumber(destination?.prixbouf, 0);

  /* -------------------------
     Niveau Budget Nourriture
     ------------------------- */

  const budgetFoodLevel = clamp(
    toNumber(userAnswers?.budgetFood, 3),
    1,
    5
  );

  const budgetFoodCoef =
    BUDGET_FOOD_LEVEL_COEFS[budgetFoodLevel] ?? 1;

  /* -------------------------
     Préférences nourriture
     ------------------------- */

  const streetfood = toNumber(userAnswers?.streetfood, 0);
  const stvege = toNumber(userAnswers?.stvege, 0);

  const cuisineloc = toNumber(userAnswers?.cuisineloc, 0);
  const cuivege = toNumber(userAnswers?.cuivege, 0);

  const gastro = toNumber(userAnswers?.gastro, 0);
  const gasvege = toNumber(userAnswers?.gasvege, 0);

const totalFoodStars =
  streetfood +
  stvege +
  cuisineloc +
  cuivege +
  gastro +
  gasvege;

let foodStyleCoef;

if (totalFoodStars === 0) {
  foodStyleCoef = FOOD_STYLE_COEFS.streetfood;
} else {
  foodStyleCoef =
    (
      streetfood * FOOD_STYLE_COEFS.streetfood +
      stvege * FOOD_STYLE_COEFS.stvege +

      cuisineloc * FOOD_STYLE_COEFS.cuisineloc +
      cuivege * FOOD_STYLE_COEFS.cuivege +

      gastro * FOOD_STYLE_COEFS.gastro +
      gasvege * FOOD_STYLE_COEFS.gasvege
    ) /
    totalFoodStars;
}

  /* -------------------------
     Alcool & Vin
     ------------------------- */

  const alcoolStars = toNumber(userAnswers?.alcool, 0);
  const vinStars = toNumber(userAnswers?.vin, 0);

  const drinkCoef =
    1 +
    alcoolStars * ALCOHOL_PER_STAR_COEF +
    vinStars * WINE_PER_STAR_COEF;

  /* -------------------------
     Budget final
     ------------------------- */

  const dailyFoodBudgetPerPerson =
    prixBouffe *
    budgetFoodCoef *
    foodStyleCoef *
    drinkCoef;

  const totalFoodBudget =
    dailyFoodBudgetPerPerson *
    travelers *
    tripDays;

  return {
    dailyFoodBudgetPerPerson,
    totalFoodBudget,

    budgetFoodCoef,
    foodStyleCoef,
    drinkCoef,
  };
}