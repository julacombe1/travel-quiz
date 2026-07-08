import {
  clamp,
  toNumber,
  getWeightedBudgetMonthCoef,
} from "./budgetUtils.js";

/* =========================================================
   COEFFICIENT NOMBRE DE VOYAGEURS
   ========================================================= */

const LOGEMENT_COEFS = {
  1: 0.83,
  2: 1,
  3: 1.35,
  4: 1.63,
  5: 2.02,
  6: 2.4,
  7: 2.69,
  8: 3.06,
  9: 3.35,
  10: 3.73,
  11: 4.02,
  12: 4.4,
  13: 4.69,
  14: 5.06,
  15: 5.35,
  16: 6.73,
  17: 6.02,
  18: 6.4,
  19: 6.69,
  20: 7.06,
};

/* =========================================================
   BUDGET LOGEMENT
   ========================================================= */

const STRICT_MINIMUM_COEF = 0.75;
const CONFORT_COEF = 0.90;
const PLAISIR_COEF = 1.20;

const ECONOME_FROM_MOY_COEF = 0.80;
const ECONOME_EQUAL_MIN_MOY_COEF = 0.90;

/* =========================================================
   SAISON
   ========================================================= */

const JULY_COEF = 1.09;
const AUGUST_COEF = 1.10;

/* =========================================================
   THEMES QUI BAISSENT LE PRIX
   ========================================================= */

const LODGING_DOWNSTYLE_COEFS = {
  trek: 0.82,
  camp: 0.72,
  sauvage: 0.55,
};

const TREK_DURATION_COEFS = {
  1: 0.95, // 1 jour
  2: 0.90, // 3 jours
  3: 0.85, // 5 jours
  4: 0.80, // 1 semaine
  5: 0.72, // +1 semaine
};

const MIN_DOWNSTYLE_COEF = 0.55;

/* =========================================================
   THEMES QUI AUGMENTENT LE PRIX
   ========================================================= */

const LODGING_UPSTYLE_COEFS = {
  confort: 1.08,
  luxe: 1.55,
  pisci: 1.15,
  jacuz: 1.15,
  roman: 1.15,
  coquin: 1.15,
  atyp: 1.18,
  eco: 1.05,
};

const MAX_UPSTYLE_COEF = 1.75;

/* =========================================================
   OUTILS
   ========================================================= */

function getLodgingTravelersCoef(travelers) {
  const safeTravelers = clamp(travelers, 1, 20);
  return LOGEMENT_COEFS[safeTravelers] ?? LOGEMENT_COEFS[20];
}

function getReferenceLodgingPrice(destination, userAnswers) {
  const prixMin = toNumber(destination?.prixlogemin, 0);
  const prixMoy = toNumber(destination?.prixlogemoy, prixMin);

  const budgetLevel = clamp(
    toNumber(userAnswers?.budgetLogement, 3),
    1,
    5
  );

  let equilibrePrice;

  if (prixMin === prixMoy) {
    equilibrePrice = prixMoy * 0.9;
  } else {
    equilibrePrice = Math.min(
      prixMin,
      prixMoy * 0.8
    );
  }

  const confortPrice = prixMoy;

  switch (budgetLevel) {
    case 1:
      return equilibrePrice * 0.75; // Strict minimum

    case 2:
      return equilibrePrice * 0.9; // Économe

    case 3:
      return equilibrePrice; // Équilibré

    case 4:
      return confortPrice; // Confort

    case 5:
      return confortPrice * 1.2; // Plaisir

    default:
      return equilibrePrice;
  }
}

function getSeasonCoef(destination, userAnswers) {
  const monthCoef = getWeightedBudgetMonthCoef(
    destination,
    userAnswers
  );

  const selectedMonth =
    userAnswers?._month ||
    userAnswers?.selectedMonth;

  const month = String(selectedMonth || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let summerCoef = 1;

  if (month === "juillet") {
    summerCoef = JULY_COEF;
  }

  if (month === "aout") {
    summerCoef = AUGUST_COEF;
  }

  return monthCoef * summerCoef;
}

function getLodgingStyleCoef(userAnswers) {
  const trekStars = clamp(toNumber(userAnswers?.trek, 0), 0, 5);
  const campStars = clamp(toNumber(userAnswers?.camp, 0), 0, 3);
  const sauvageStars = clamp(toNumber(userAnswers?.sauvage, 0), 0, 3);

  const trekDurationLevel = clamp(
    toNumber(userAnswers?.trekDuration, 1),
    1,
    5
  );

  const trekCoef =
    LODGING_DOWNSTYLE_COEFS.trek *
    TREK_DURATION_COEFS[trekDurationLevel];

  const themes = [
    { stars: trekStars, coef: trekCoef },
    { stars: campStars, coef: LODGING_DOWNSTYLE_COEFS.camp },
    { stars: sauvageStars, coef: LODGING_DOWNSTYLE_COEFS.sauvage },

    { stars: clamp(toNumber(userAnswers?.confort, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.confort },
    { stars: clamp(toNumber(userAnswers?.luxe, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.luxe },
    { stars: clamp(toNumber(userAnswers?.pisci, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.pisci },
    { stars: clamp(toNumber(userAnswers?.jacuz, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.jacuz },
    { stars: clamp(toNumber(userAnswers?.roman, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.roman },
    { stars: clamp(toNumber(userAnswers?.coquin, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.coquin },
    { stars: clamp(toNumber(userAnswers?.atyp, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.atyp },
    { stars: clamp(toNumber(userAnswers?.eco, 0), 0, 3), coef: LODGING_UPSTYLE_COEFS.eco },
  ];

  const totalStars = themes.reduce((sum, item) => sum + item.stars, 0);

  if (!totalStars) {
    return 1;
  }

  const weightedCoef =
    themes.reduce((sum, item) => {
      return sum + item.stars * item.coef;
    }, 0) / totalStars;

  return clamp(weightedCoef, 0.55, 1.85);
}

/* =========================================================
   CALCUL PRINCIPAL
   ========================================================= */

export function calculateLogementBudget({
  destination,
  userAnswers,
  travelers,
  tripDays,
}) {
  const lodgingReferencePrice =
    getReferenceLodgingPrice(
      destination,
      userAnswers
    );

  const travelersCoef =
    getLodgingTravelersCoef(travelers);

  const seasonCoef = getSeasonCoef(
    destination,
    userAnswers
  );

  const lodgingStyleCoef = getLodgingStyleCoef(userAnswers);

const dailyLodgingBudget =
  lodgingReferencePrice *
  travelersCoef *
  seasonCoef *
  lodgingStyleCoef;

  return dailyLodgingBudget * tripDays;
}