  import { evaluateComponents } from "./evaluateComponents.js";
  import { aggregateComponents } from "./scoreAggregation.js";
  import { evaluateTimeScenario } from "./timeScenario.js";
  import { MONTH_KEYS, normalizeMonthKey } from "./coefftemp.js";
  import destinationGroups from "../data/destinations_group.js";
  import filterDestinationGroups from "./filterDestinationGroups.js";
  import { CHAL_MIN, CHAL_MAX } from "../engine/constants.js";

  const TEMPERATURE_BLOCKER_LABELS = {
    chal: "température chaleur",
    mer: "température de l’eau",
    inso: "baignade insolite",
  };

  const COMBO_TYPES = new Set(["Comboc", "Combov", "Combor"]);

  function getComboPenalty(destination) {
    return COMBO_TYPES.has(destination?.type) ? 1 : 0;
  }

  function sortResults(a, b) {
    const scoreDiff = b.score - a.score;

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return getComboPenalty(a) - getComboPenalty(b);
  }

  function getMonthsToEvaluate(answers) {
    const hasExactDates = answers?.exactDates?.from && answers?.exactDates?.to;

    if (hasExactDates) {
      const from = new Date(answers.exactDates.from);
      const to = new Date(answers.exactDates.to);

      if (
        Number.isNaN(from.getTime()) ||
        Number.isNaN(to.getTime()) ||
        from > to
      ) {
        return MONTH_KEYS;
      }

      const months = new Set();
      const current = new Date(from);

      while (current <= to) {
        months.add(MONTH_KEYS[current.getMonth()]);
        current.setDate(current.getDate() + 1);
      }

      return [...months];
    }

    const selectedMonth = normalizeMonthKey(answers?.selectedMonth);

    if (selectedMonth && selectedMonth !== "best") {
      return [selectedMonth];
    }

    return MONTH_KEYS;
  }

function getActiveTemperatureBlockerKeys(answers) {
  const keys = [];

  if (Number(answers?.chal) > 0) {
    keys.push("chal");
    keys.push("chaleur");
  }

  if (Number(answers?.mer) > 0) keys.push("mer");
  if (Number(answers?.inso) > 0) keys.push("inso");

  return new Set(keys);
}

  function getComponentScore(component) {
    const score = Number(component?.score);
    return Number.isFinite(score) ? score : 0;
  }

  function evaluateDestinationForMonth(dest, answers, monthKey) {
    const answersWithMonth = {
      ...answers,
      _month: monthKey,
    };

    const components = evaluateComponents(answersWithMonth, dest);
    const budgetComponent = components.find((c) => c.key === "budget");

 const componentsWithoutBudget = components.filter(
  (component) => component.key !== "budget"
);

const componentsWithoutBudgetAndHeat = componentsWithoutBudget.filter(
  (component) => !isHeatComponent(component)
);

const heatComponent = componentsWithoutBudget.find(isHeatComponent);

const aggregatedWithoutBudget = aggregateComponents(componentsWithoutBudget);

const aggregatedWithoutBudgetAndHeat = aggregateComponents(
  componentsWithoutBudgetAndHeat
);


const timeResultWithoutBudget = evaluateTimeScenario(
  answersWithMonth,
  dest,
  aggregatedWithoutBudget.totalBeforeTime
);

const timeResultWithoutBudgetAndHeat = evaluateTimeScenario(
  answersWithMonth,
  dest,
  aggregatedWithoutBudgetAndHeat.totalBeforeTime
);

const baseScore = timeResultWithoutBudget.score;
const baseScoreWithoutHeat = timeResultWithoutBudgetAndHeat.score;

const isBudgetOk = budgetComponent?.score !== 0;

const isHeatBlocked =
  isHeatFilterRestrictive(answers) &&
  Number(answers?.chal) > 0 &&
  heatComponent &&
  getComponentScore(heatComponent) <= 0 &&
  isBudgetOk;

const finalScore = isBudgetOk ? baseScore : 0;

return {
  dest,
  monthKey,
  baseScore,
  baseScoreWithoutHeat,
  timeResultWithoutBudgetAndHeat,
  finalScore,
  isBudgetOk,
  eliminatedOnlyByBudget: baseScore > 0 && !isBudgetOk,
  budgetComponent,
  components,
  componentsWithoutBudget,
  aggregated: aggregatedWithoutBudget,
  aggregatedWithoutBudgetAndHeat,
  timeResult: timeResultWithoutBudget,
  isHeatBlocked,
  heatComponent,
};
  }

  function getBestEvaluationForDestination(dest, answers, monthsToEvaluate) {
  let bestBaseEvaluation = null;
  let bestValidEvaluation = null;
  let bestHeatBlockedEvaluation = null;

  for (const monthKey of monthsToEvaluate) {
    const evaluation = evaluateDestinationForMonth(dest, answers, monthKey);
 
    if (
      !bestBaseEvaluation ||
      evaluation.baseScore > bestBaseEvaluation.baseScore
    ) {
      bestBaseEvaluation = evaluation;
    }

    if (
      evaluation.isBudgetOk &&
      evaluation.finalScore > 0 &&
      (!bestValidEvaluation ||
        evaluation.finalScore > bestValidEvaluation.finalScore)
    ) {
      bestValidEvaluation = evaluation;
    }

    if (
      evaluation.isBudgetOk &&
      evaluation.isHeatBlocked &&
      evaluation.baseScoreWithoutHeat > 0 &&
      (!bestHeatBlockedEvaluation ||
        evaluation.baseScoreWithoutHeat >
          bestHeatBlockedEvaluation.baseScoreWithoutHeat)
    ) {
      bestHeatBlockedEvaluation = evaluation;
    }
  }

  return {
    bestBaseEvaluation,
    bestValidEvaluation,
    bestHeatBlockedEvaluation,
  };
}

  function buildResultFromEvaluation(evaluation) {
    const {
      dest,
      monthKey,
      finalScore,
      budgetComponent,
      aggregated,
      timeResult,
    } = evaluation;

    return {
      ...dest,
      score: finalScore,
      baseScore: evaluation.baseScore,
      bestMonth: monthKey,
      tempCoef: timeResult.timeCoef,
      scores: aggregated.scores,
      comments: aggregated.comments,
      budget: {
        requiredBudget: budgetComponent?.requiredBudget ?? null,
        userBudget: budgetComponent?.userBudget ?? null,
      },
      debug: {
        rawSum: aggregated.rawSum,
        coefProduct: aggregated.coefProduct,
        totalBeforeTime: aggregated.totalBeforeTime,
        evaluatedMonth: monthKey,
        eliminatedOnlyByBudget: evaluation.eliminatedOnlyByBudget,
      },
    };
  }

  function hasTemperatureBlocker(evaluation, answers) {
    const activeKeys = getActiveTemperatureBlockerKeys(answers);

    if (!activeKeys.size) return false;

    return (evaluation?.componentsWithoutBudget ?? []).some((component) => {
      return activeKeys.has(component.key) && getComponentScore(component) <= 0;
    });
  }

  function getTemperatureBlockersForEvaluation(evaluation, answers) {
    const activeKeys = getActiveTemperatureBlockerKeys(answers);

    if (!activeKeys.size) return [];

    return (evaluation?.componentsWithoutBudget ?? [])
      .filter((component) => {
        return activeKeys.has(component.key) && getComponentScore(component) <= 0;
      })
      .map((component) => component.key);
  }

function isHeatFilterRestrictive(answers) {
  const min = Number(answers?.chalMin);
  const max = Number(answers?.chalMax);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return false;
  }

  return min > CHAL_MIN || max < CHAL_MAX;
}

  function buildTemperatureBlockedResults(evaluatedDestinations, answers) {
    return evaluatedDestinations
      .map((item) => {
        const evaluation = item.bestBaseEvaluation;

        if (!evaluation || !hasTemperatureBlocker(evaluation, answers)) {
          return null;
        }

        const result = buildResultFromEvaluation({
          ...evaluation,
          finalScore: evaluation.baseScore,
        });

        return {
          ...result,
          score: evaluation.baseScore,
          temperatureBlocked: true,
          temperatureBlockers: getTemperatureBlockersForEvaluation(
            evaluation,
            answers
          ),
        };
      })
      .filter(Boolean)
      .sort(sortResults)
  }

  function getTemperatureBlockingCounts(filteredTemperatureBlockedResults) {
    const counts = {};

    filteredTemperatureBlockedResults.forEach((result) => {
      (result.temperatureBlockers ?? []).forEach((key) => {
        counts[key] = (counts[key] ?? 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([key, count]) => ({
        key,
        label: TEMPERATURE_BLOCKER_LABELS[key] ?? key,
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }

  function buildNoResultsDiagnostic({
    filteredBudgetEliminatedResults,
    filteredTemperatureBlockedResults,
  }) {
    const budgetBlockedCount = filteredBudgetEliminatedResults.length;
    const temperatureBlockedCount = filteredTemperatureBlockedResults.length;

    const temperatureBlockers = getTemperatureBlockingCounts(
      filteredTemperatureBlockedResults
    );

    let mainReason = "unknown";

  if (budgetBlockedCount > 0) {
    mainReason = "budget";
  } else if (temperatureBlockedCount > 0) {
    mainReason = "temperature";
  } else {
    mainReason = "unknown";
  }

    return {
      mainReason,

      budgetBlockedCount,
      temperatureBlockedCount,

      hasBudgetIssue: budgetBlockedCount > 0,
      hasTemperatureIssue: temperatureBlockedCount > 0,

      temperatureBlockers,
    };
  }

  function attachNoResultsDiagnostic(results, diagnostic) {
    Object.defineProperty(results, "noResultsDiagnostic", {
      value: diagnostic,
      enumerable: false,
      configurable: true,
    });

    return results;
  }

function isHeatComponent(component) {
  return component.key === "chaleur" || component.key === "chal";
}


function buildHeatBlockedResults(evaluatedDestinations) {
  return evaluatedDestinations
    .map((item) => {
      const evaluation = item.bestHeatBlockedEvaluation;

      if (
        !evaluation ||
        !evaluation.isBudgetOk ||
        !evaluation.isHeatBlocked
      ) {
        return null;
      }

const result = buildResultFromEvaluation({
  ...evaluation,
  finalScore: evaluation.baseScoreWithoutHeat,
  aggregated: evaluation.aggregatedWithoutBudgetAndHeat,
  timeResult: evaluation.timeResultWithoutBudgetAndHeat,
});

return {
  ...result,
  score: evaluation.baseScoreWithoutHeat,
  heatBlocked: true,
};
    })
    .filter((res) => res && res.score > 0)
    .sort(sortResults);
}

  export function calculateResults(answers, destinations) {
    const monthsToEvaluate = getMonthsToEvaluate(answers);

    const evaluatedDestinations = destinations.map((dest) => {
      return getBestEvaluationForDestination(dest, answers, monthsToEvaluate);
    });

    const validResults = evaluatedDestinations
      .map((item) => {
        if (!item.bestValidEvaluation) return null;
        return buildResultFromEvaluation(item.bestValidEvaluation);
      })
      .filter((res) => res && res.score > 0)
      .sort(sortResults)

    const budgetEliminatedResults = evaluatedDestinations
      .map((item) => {
        const evaluation = item.bestBaseEvaluation;

        if (!evaluation?.eliminatedOnlyByBudget) return null;

        const result = buildResultFromEvaluation({
          ...evaluation,
          finalScore: evaluation.baseScore,
        });

        return {
          ...result,
          score: evaluation.baseScore,
          eliminatedOnlyByBudget: true,
          debug: {
            ...result.debug,
            eliminatedOnlyByBudget: true,
          },
        };
      })
      .filter((res) => res && res.score > 0)
      .sort(sortResults)

    const temperatureBlockedResults = buildTemperatureBlockedResults(
      evaluatedDestinations,
      answers
    );

    const heatFilterRestrictive = isHeatFilterRestrictive(answers);



const heatBlockedResults = heatFilterRestrictive
  ? buildHeatBlockedResults(evaluatedDestinations)
  : [];

    const filteredValidResults = filterDestinationGroups(
      validResults,
      destinationGroups
    );
const answersWithoutHeat = {
  ...answers,
  chal: 0,
};

const evaluatedDestinationsWithoutHeat = destinations.map((dest) => {
  return getBestEvaluationForDestination(
    dest,
    answersWithoutHeat,
    monthsToEvaluate
  );
});

const validResultsWithoutHeat = evaluatedDestinationsWithoutHeat
  .map((item) => {
    if (!item.bestValidEvaluation) return null;
    return buildResultFromEvaluation(item.bestValidEvaluation);
  })
  .filter((res) => res && res.score > 0)
  .sort(sortResults);

const filteredValidResultsWithoutHeat = filterDestinationGroups(
  validResultsWithoutHeat,
  destinationGroups
);

const currentValidIds = new Set(
  filteredValidResults.map((item) => item.id)
);

    const filteredBudgetEliminatedResults = filterDestinationGroups(
      budgetEliminatedResults,
      destinationGroups
    );

    const filteredTemperatureBlockedResults = filterDestinationGroups(
      temperatureBlockedResults,
      destinationGroups
    );

const filteredHeatBlockedResults = filterDestinationGroups(
  heatBlockedResults,
  destinationGroups
);
const finalResults = filteredValidResults.map((result) => {
  const betterBudgetEliminated = filteredBudgetEliminatedResults.filter(
    (item) => item.score > result.score
  );

const betterHeatBlocked = filteredValidResultsWithoutHeat.filter((item) => {
  return (
    item.score > result.score &&
    !currentValidIds.has(item.id)
  );
});


const resultId = String(result?.id ?? "").trim().toUpperCase();

  const budgetTotal = filteredBudgetEliminatedResults.length;
  const heatTotal = filteredValidResultsWithoutHeat.length;

  return {
    ...result,

    budgetPressureCount: betterBudgetEliminated.length,
    budgetPressureTotal: budgetTotal,
    budgetPressurePct:
      budgetTotal > 0
        ? Math.round((betterBudgetEliminated.length / budgetTotal) * 100)
        : 0,

heatPressureCount: betterHeatBlocked.length,
heatPressureTotal: heatTotal,
heatPressurePct:
  heatTotal > 0
    ? Math.round((betterHeatBlocked.length / heatTotal) * 100)
    : 0,
  };
});

    const noResultsDiagnostic = buildNoResultsDiagnostic({
      filteredBudgetEliminatedResults,
      filteredTemperatureBlockedResults,
    });

    const slicedResults = finalResults.slice(0, 20);

    return attachNoResultsDiagnostic(slicedResults, noResultsDiagnostic);
  }