const TRAVEL_PLANNER_BASE_PRICE = 50;
const TRAVEL_PLANNER_3_PEOPLE_PRICE = 52;
const TRAVEL_PLANNER_4_PEOPLE_PRICE = 55;
const TRAVEL_PLANNER_EXTRA_PERSON_PRICE = 10;

const TRAVEL_PLANNER_MIN_PRICE_SHORT_TRIP = 250;
const TRAVEL_PLANNER_MIN_DAYS_FOR_DAILY_RULE = 5;
const TRAVEL_PLANNER_REFERENCE_DAYS_FOR_5_DAYS = 6;

export function getTravelPlannerDailyPrice(travelers) {
  if (travelers <= 2) return TRAVEL_PLANNER_BASE_PRICE;
  if (travelers === 3) return TRAVEL_PLANNER_3_PEOPLE_PRICE;
  if (travelers === 4) return TRAVEL_PLANNER_4_PEOPLE_PRICE;

  return (
    TRAVEL_PLANNER_4_PEOPLE_PRICE +
    (travelers - 4) * TRAVEL_PLANNER_EXTRA_PERSON_PRICE
  );
}

export function calculateTravelPlannerBudget({ travelers, tripDays }) {
  if (tripDays < TRAVEL_PLANNER_MIN_DAYS_FOR_DAILY_RULE) {
    return TRAVEL_PLANNER_MIN_PRICE_SHORT_TRIP;
  }

  const billedDays =
    tripDays === TRAVEL_PLANNER_MIN_DAYS_FOR_DAILY_RULE
      ? TRAVEL_PLANNER_REFERENCE_DAYS_FOR_5_DAYS
      : tripDays;

  return getTravelPlannerDailyPrice(travelers) * billedDays;
}