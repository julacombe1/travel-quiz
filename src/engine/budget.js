import { clamp, toNumber, getTripDays, MIN_BUDGET } from "./budgetUtils.js";
import { calculateInitialTransportBudget } from "./budgetInitialTransport.js";
import { calculateLocalTransportBudget } from "./budgetLocalTransport.js";
import { calculateLogementBudget } from "./budgetLogement.js";
import { calculateFoodBudget } from "./budgetFood.js";
import { calculateActivityBudget } from "./budgetActivities.js";
import { calculateTravelPlannerBudget } from "./budgetTravelPlanner.js";

export function calculateBudgetBreakdown(destination, userAnswers) {
  const travelers = clamp(toNumber(userAnswers?.travelers, 2), 1, 20);
  const tripDays = getTripDays(userAnswers);

const initialTransportPrice = calculateInitialTransportBudget({
  destination,
  userAnswers,
  travelers,
});

const localTransportTotal = calculateLocalTransportBudget({
  destination,
  userAnswers,
  travelers,
  tripDays,
});

  const lodgingTotal = calculateLogementBudget({
    destination,
    userAnswers,
    travelers,
    tripDays,
  });

const foodBudget = calculateFoodBudget({
  destination,
  userAnswers,
  travelers,
  tripDays,
});

const foodTotal =
  typeof foodBudget === "number"
    ? foodBudget
    : toNumber(foodBudget?.totalFoodBudget, 0);

  const activityTotal = calculateActivityBudget({
    destination,
    userAnswers,
    travelers,
    tripDays,
  });

  const travelPlannerPrice = calculateTravelPlannerBudget({
    travelers,
    tripDays,
  });

const total =
  initialTransportPrice +
  localTransportTotal +
  lodgingTotal +
  foodTotal +
  activityTotal +
  travelPlannerPrice;

return {
  total: Math.round(total),

  avion: Math.round(initialTransportPrice),
  transport: Math.round(localTransportTotal),

  logement: Math.round(lodgingTotal),
  bouffe: Math.round(foodTotal),
  activites: Math.round(activityTotal),
  boufact: Math.round(foodTotal + activityTotal),
  travelPlanner: Math.round(travelPlannerPrice),

  tripDays,
  travelers,
};
}

export function calculateBudgetRequired(destination, userAnswers) {
  return calculateBudgetBreakdown(destination, userAnswers).total;
}

export function budget(destination, userAnswers) {
  if (userAnswers?.budgetMaxSelected) {
    return {
      key: "budget",
      type: "coef",
      score: 1,
      comment: "Budget maximum sélectionné.",
    };
  }

  const userBudget = Math.max(
    MIN_BUDGET,
    toNumber(userAnswers?.budgetTotal, MIN_BUDGET)
  );

  const requiredBudget = calculateBudgetRequired(destination, userAnswers);

  return {
    key: "budget",
    type: "coef",
    score: userBudget >= requiredBudget ? 1 : 0,
    requiredBudget,
    userBudget,
    comment:
      userBudget >= requiredBudget
        ? `Budget compatible : environ ${requiredBudget.toLocaleString(
            "fr-FR"
          )} € estimés.`
        : `Budget insuffisant : environ ${requiredBudget.toLocaleString(
            "fr-FR"
          )} € estimés.`,
  };
}