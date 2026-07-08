import {
  MONTHS,
  toNumber,
  normalizeMonth,
  getMonthFromDate,
} from "./budgetUtils.js";

const CAR_HOUR_PRICE = 20;
const TRAIN_HOUR_PRICE = 4;
const TAXI_HOUR_PRICE = 6;
const VTC_HOUR_PRICE = 5;

const TRAIN_MONTH_COEFS = {
  janvier: 1.05,
  fevrier: 1.55,
  mars: 1.15,
  avril: 1.7,
  mai: 1.9,
  juin: 1.5,
  juillet: 2.5,
  aout: 2.55,
  septembre: 1.35,
  octobre: 1.4,
  novembre: 1,
  decembre: 2.5,
};

const FLIGHT_DEPARTURE_DATE_COEFS = [
  { maxDays: 30, coef: 1.5 },
  { maxDays: 60, coef: 1.4 },
  { maxDays: 90, coef: 1.3 },
  { maxDays: 120, coef: 1.2 },
  { maxDays: 150, coef: 1.1 },
];

const DEFAULT_FLIGHT_DEPARTURE_DATE_COEF = 1;

const MAX_TRAVELERS_FOR_TRANSPORT = 20;

function getLinearVehicleCount(travelers, capacity) {
  const safeTravelers = Math.min(
    MAX_TRAVELERS_FOR_TRANSPORT,
    Math.max(1, Number(travelers) || 1)
  );

  if (safeTravelers <= capacity) {
    return 1;
  }

  return safeTravelers / capacity;
}

function getFlightDepartureDateCoef(userAnswers) {
  const from = userAnswers?.exactDates?.from;

  if (!from) return DEFAULT_FLIGHT_DEPARTURE_DATE_COEF;

  const departureDate = new Date(from);
  const today = new Date();

  if (Number.isNaN(departureDate.getTime())) {
    return DEFAULT_FLIGHT_DEPARTURE_DATE_COEF;
  }

  today.setHours(0, 0, 0, 0);
  departureDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return DEFAULT_FLIGHT_DEPARTURE_DATE_COEF;

  const rule = FLIGHT_DEPARTURE_DATE_COEFS.find(
    (item) => diffDays <= item.maxDays
  );

  return rule?.coef ?? DEFAULT_FLIGHT_DEPARTURE_DATE_COEF;
}

function getFlightPriceForMonth(destination, month) {
  if (!month) return 0;

  return toNumber(
    destination?.[`avion.${month}`] ??
      destination?.[`avion_${month}`] ??
      destination?.[`avion${month}`] ??
      destination?.avion?.[month],
    0
  );
}

function getAverageFlightPrice(destination) {
  const prices = MONTHS.map((month) =>
    getFlightPriceForMonth(destination, month)
  );

  const validPrices = prices.filter((price) => price > 0);

  if (!validPrices.length) return 0;

  return validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
}

function getTrainMonthCoef(month) {
  if (!month) {
    const values = Object.values(TRAIN_MONTH_COEFS);
    return values.reduce((sum, coef) => sum + coef, 0) / values.length;
  }

  return TRAIN_MONTH_COEFS[month] ?? 1;
}

export function calculateInitialTransportBudget({
  destination,
  userAnswers,
  travelers,
}) {
  const avion = userAnswers?.avion ?? "indifferent";
  const transportModes = userAnswers?.transportModes ?? {};
  const communTime = toNumber(destination?.communt, 0);

  const hasPlane = String(destination?.avion ?? "").toUpperCase() === "Y";

  const from = userAnswers?.exactDates?.from;
  const to = userAnswers?.exactDates?.to;

  const selectedMonth =
    normalizeMonth(userAnswers?._month) ||
    normalizeMonth(userAnswers?.selectedMonth);

  const departureMonth = getMonthFromDate(from);
  const arrivalMonth = getMonthFromDate(to);

  const shouldUsePlane =
    avion === "oui" || (avion === "indifferent" && hasPlane);

  const calculatePlaneBudget = () => {
    const departureDateCoef = getFlightDepartureDateCoef(userAnswers);

    if (departureMonth && arrivalMonth) {
      const departurePrice =
        getFlightPriceForMonth(destination, departureMonth) / 2;

      const arrivalPrice =
        getFlightPriceForMonth(destination, arrivalMonth) / 2;

      return (departurePrice + arrivalPrice) * travelers * departureDateCoef;
    }

    const flightPrice = selectedMonth
      ? getFlightPriceForMonth(destination, selectedMonth)
      : getAverageFlightPrice(destination);

    return flightPrice * travelers * departureDateCoef;
  };

  const calculateCarBudget = () => {
    const carCount = getLinearVehicleCount(travelers, 5);
    return CAR_HOUR_PRICE * communTime * 2 * carCount;
  };

const calculateTrainBudget = () => {
  const monthCoef = selectedMonth
    ? getTrainMonthCoef(selectedMonth)
    : getTrainMonthCoef(null);

  return TRAIN_HOUR_PRICE * 2 * communTime * travelers * monthCoef;
};

const calculateTaxiBudget = () => {
  const monthCoef = selectedMonth
    ? getTrainMonthCoef(selectedMonth)
    : getTrainMonthCoef(null);

  return TAXI_HOUR_PRICE * 2 * communTime * travelers * monthCoef;
};

const calculateVtcBudget = () => {
  const monthCoef = selectedMonth
    ? getTrainMonthCoef(selectedMonth)
    : getTrainMonthCoef(null);

  return VTC_HOUR_PRICE * 2 * communTime * travelers * monthCoef;
};

const calculateGroundBudget = () => {
  const carBudget = calculateCarBudget();
  const trainBudget = calculateTrainBudget();
  const taxiBudget = calculateTaxiBudget();
  const vtcBudget = calculateVtcBudget();

  if (transportModes.voiture) return carBudget;
  if (transportModes.commun) return trainBudget;

  if (transportModes.taxi && transportModes.vtc) {
    return (taxiBudget + vtcBudget) / 2;
  }

  if (transportModes.taxi) return taxiBudget;
  if (transportModes.vtc) return vtcBudget;

  if (transportModes.indifferent) {
    return (carBudget + trainBudget) / 2;
  }

  return trainBudget;
};

if (shouldUsePlane) {
  return calculatePlaneBudget();
}

return calculateGroundBudget();
}