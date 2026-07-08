const TYPE_CITY = "Ville";
const TYPE_COMBO_CITY = "Comboc";
const TYPE_COMBO_ACTIVITY = "Combov";
const TYPE_COMBO_REGION = "Combor";

const COMBO_GLOBAL_COEFFICIENT = 0.9;

const CITY_ONLY_VALUE = 7;

const COMBO_ACTIVITY_COEFFICIENTS = {
  6: 1,
  5: 0.99,
  4: 0.97,
  3: 0.95,
};

const NON_CITY_COEFFICIENTS = {
  6: 1,
  5: 1,
  4: 1,
  3: 1,
  2: 1,
  1: 1,
  0: 1,
};

function getVilleAnswer(answers) {
  return Number(answers?.ville ?? 0);
}

function isCityType(destination) {
  return destination?.type === TYPE_CITY;
}

function isComboCityType(destination) {
  return destination?.type === TYPE_COMBO_CITY;
}

function isComboActivityType(destination) {
  return destination?.type === TYPE_COMBO_ACTIVITY;
}

function isComboRegionType(destination) {
  return destination?.type === TYPE_COMBO_REGION;
}

function isAnyComboType(destination) {
  return (
    isComboCityType(destination) ||
    isComboActivityType(destination) ||
    isComboRegionType(destination)
  );
}

function isOtherType(destination) {
  return (
    !isCityType(destination) &&
    !isComboCityType(destination) &&
    !isComboActivityType(destination) &&
    !isComboRegionType(destination)
  );
}

export default function cityActivityCoefficient(answers, destination) {
  const villeAnswer = getVilleAnswer(answers);

  let score = 1;
  let commentaire = "";

  /* ========================= */
  /* 100% VILLE */
  /* ========================= */

  if (villeAnswer === CITY_ONLY_VALUE) {
    if (isCityType(destination) || isComboCityType(destination)) {
      score = 1;
      commentaire = "Destination urbaine ✔";
    } else {
      score = 0;
      commentaire = "Exclu (non urbain)";
    }
  }

  /* ========================= */
  /* DESTINATIONS AVEC COMPOSANTE VILLE */
  /* Ville / comboc / combov */
  /* ========================= */

  else if (
    isCityType(destination) ||
    isComboCityType(destination) ||
    isComboActivityType(destination)
  ) {
    score = COMBO_ACTIVITY_COEFFICIENTS[villeAnswer] ?? 0;
  }

  /* ========================= */
  /* DESTINATIONS NON VILLE */
  /* ========================= */

  else if (isOtherType(destination)) {
    score = NON_CITY_COEFFICIENTS[villeAnswer] ?? 0;
  }

  /* ========================= */
  /* MALUS GLOBAL DES COMBOS */
  /* ========================= */

  if (score > 0 && isAnyComboType(destination)) {
    score *= COMBO_GLOBAL_COEFFICIENT;
  }

  return {
    score,
    commentaire,
  };
}