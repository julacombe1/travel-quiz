import {
  toNumber,
  normalizeMonth,
  getMonthFromDate,
  getWeightedBudgetMonthCoef,
} from "./budgetUtils.js";
import { MAX_TRAVELERS_FOR_TRANSPORT } from "./constants.js";

const PERSONAL_CAR_DAILY_PRICE = 10;

const JULY_LOCAL_TRANSPORT_COEF = 1.13;
const AUGUST_LOCAL_TRANSPORT_COEF = 1.15;

const USER_BUDGET_PROFILE_COEFS = {
  1: 0.8,  // Strict minimum
  2: 0.9,  // Économe
  3: 1,    // Équilibré
  4: 1.2, // Confort
  5: 1.4,  // Plaisir
};


function getLinearVehicleMultiplier(travelers, capacity) {
  const safeTravelers = Math.min(
    MAX_TRAVELERS_FOR_TRANSPORT,
    Math.max(1, Number(travelers) || 1)
  );

  if (safeTravelers <= capacity) {
    return 1;
  }

  return safeTravelers / capacity;
}

function getCarRentalMultiplier(travelers) {
  return getLinearVehicleMultiplier(travelers, 5);
}

function getTaxiMultiplier(travelers) {
  return getLinearVehicleMultiplier(travelers, 4);
}

function getSelectedMonth(userAnswers) {
  const from = userAnswers?.exactDates?.from;

  return (
    normalizeMonth(userAnswers?._month) ||
    normalizeMonth(userAnswers?.selectedMonth) ||
    getMonthFromDate(from)
  );
}

function getSummerLocalTransportCoef(userAnswers) {
  const month = getSelectedMonth(userAnswers);

  if (month === "juillet") return JULY_LOCAL_TRANSPORT_COEF;
  if (month === "aout") return AUGUST_LOCAL_TRANSPORT_COEF;

  return 1;
}

function getUserBudgetProfileCoef(userAnswers) {
  const budgetLogement = toNumber(userAnswers?.budgetLogement, 3);
  const budgetFood = toNumber(userAnswers?.budgetFood, 3);
  const budgetActivite = toNumber(userAnswers?.budgetActivite, 3);

  const averageBudgetLevel =
    (budgetLogement + budgetFood + budgetActivite) / 3;

  if (averageBudgetLevel <= 1) return USER_BUDGET_PROFILE_COEFS[1];
  if (averageBudgetLevel >= 5) return USER_BUDGET_PROFILE_COEFS[5];

  const lowerLevel = Math.floor(averageBudgetLevel);
  const upperLevel = Math.ceil(averageBudgetLevel);

  if (lowerLevel === upperLevel) {
    return USER_BUDGET_PROFILE_COEFS[lowerLevel] ?? 1;
  }

  const lowerCoef = USER_BUDGET_PROFILE_COEFS[lowerLevel] ?? 1;
  const upperCoef = USER_BUDGET_PROFILE_COEFS[upperLevel] ?? 1;

  const ratio = averageBudgetLevel - lowerLevel;

  return lowerCoef + (upperCoef - lowerCoef) * ratio;
}

function getLocalTransportSeasonCoef(destination, userAnswers) {
  const budgetMonthCoef = getWeightedBudgetMonthCoef(destination, userAnswers);
  const summerCoef = getSummerLocalTransportCoef(userAnswers);

  return Math.pow(budgetMonthCoef, 2) * summerCoef;
}

function getIndifferentLocalTransportPrice({
  destination,
  carPrice,
  busPrice,
  taxiPrice,
  vtcPrice,
}) {
  const carWeight = toNumber(destination?.voitu, 0) / 100;
  const busWeight = toNumber(destination?.bus, 0) / 100;
  const taxiWeight = toNumber(destination?.taxi, 0) / 100;
  const vtcWeight = toNumber(destination?.vtc, 0) / 100;

  return (
    carPrice * carWeight +
    busPrice * busWeight +
    taxiPrice * taxiWeight +
    vtcPrice * vtcWeight
  );
}

export function calculateLocalTransportDailyBudget({
  destination,
  userAnswers,
  travelers,
}) {
  const avion = userAnswers?.avion ?? "indifferent";
  const transportModes = userAnswers?.transportModes ?? {};

  const carPrice =
    toNumber(destination?.prixvoit, 0) * getCarRentalMultiplier(travelers);

  const busPrice = toNumber(destination?.prixbus, 0) * travelers;

  const taxiPrice =
    toNumber(destination?.prixtaxi, 0) * getTaxiMultiplier(travelers);

  const vtcPrice =
    toNumber(destination?.prixvtc, 0) * getTaxiMultiplier(travelers);

  const seasonCoef = getLocalTransportSeasonCoef(destination, userAnswers);

  const userBudgetProfileCoef = getUserBudgetProfileCoef(userAnswers);


  if (avion === "non" && transportModes.voiture) {
return (
  PERSONAL_CAR_DAILY_PRICE *
  getCarRentalMultiplier(travelers) *
  seasonCoef *
  userBudgetProfileCoef
);
  }

  if (transportModes.indifferent) {
return (
  getIndifferentLocalTransportPrice({
    destination,
    carPrice,
    busPrice,
    taxiPrice,
    vtcPrice,
  }) *
  seasonCoef *
  userBudgetProfileCoef
);
  }

  const selectedPrices = [];

  if (transportModes.voiture) {
    selectedPrices.push(carPrice);
  }

  if (transportModes.commun) {
    selectedPrices.push(busPrice);
  }

  if (transportModes.taxi) {
    if (transportModes.vtc) {
      selectedPrices.push((taxiPrice + vtcPrice) / 2);
    } else {
      selectedPrices.push(taxiPrice);
    }
  }

  if (!selectedPrices.length) {
    return (
      getIndifferentLocalTransportPrice({
        destination,
        carPrice,
        busPrice,
        taxiPrice,
        vtcPrice,
      }) * seasonCoef
    );
  }

return (
  (selectedPrices.reduce((sum, price) => sum + price, 0) /
    selectedPrices.length) *
  seasonCoef *
  userBudgetProfileCoef
);
}

export function calculateLocalTransportBudget({
  destination,
  userAnswers,
  travelers,
  tripDays,
}) {
  return (
    calculateLocalTransportDailyBudget({
      destination,
      userAnswers,
      travelers,
    }) * tripDays
  );
}