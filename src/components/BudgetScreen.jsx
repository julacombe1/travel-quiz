import React, { useEffect, useState } from "react";
import "./BudgetScreen.css";

const TRAVELER_OPTIONS = [1, 2, 3, 4, 5];

const DEFAULT_TRAVELERS = 2;
const DEFAULT_BUDGET_FOR_2 = 10000;
const MIN_BUDGET = 500;
const LOG_POWER = 1.5;

const BUDGET_LEVEL_LABELS = [
  "Strict minimum",
  "Économe",
  "Équilibré",
  "Confort",
  "Plaisir",
];

const getMaxBudget = (travelers) => {
  return travelers * 10000 + 5000;
};

function BudgetPreference({ icon, label, value, color, onChange }) {
  const safeValue = value ?? 1;

  return (
    <div className="budget-pref-card" style={{ "--pref-color": color }}>
      <div className="budget-pref-header">
        <span className="budget-pref-icon">{icon}</span>
        <h3>{label}</h3>
      </div>

      <div className="budget-segmented">
        {BUDGET_LEVEL_LABELS.map((level, index) => {
          const levelValue = index + 1;

          return (
            <button
              key={level}
              type="button"
              className={`budget-segment-btn ${
                safeValue === levelValue ? "active" : ""
              }`}
              onClick={() => onChange?.(levelValue)}
            >
              {level}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function BudgetScreen({
  values = {},
  onChange,
  onValidate,
  onBack,
}) {
  const travelers = values.travelers ?? DEFAULT_TRAVELERS;
  const budgetMaxSelected = values.budgetMaxSelected ?? false;
  const budgetManuallyEdited = values.budgetManuallyEdited ?? false;

  const maxBudget = getMaxBudget(travelers);

  const budgetTotal = budgetMaxSelected
    ? maxBudget
    : values.budgetTotal ?? DEFAULT_BUDGET_FOR_2;

const safeMaxBudget = Number(maxBudget) || MIN_BUDGET + 1;
const safeBudgetTotal = Number(budgetTotal) || MIN_BUDGET;

const budgetToSlider = (budget) => {
  const min = MIN_BUDGET;
  const max = safeMaxBudget;

  if (!Number.isFinite(Number(budget)) || max <= min) return 0;

  const ratio = (Number(budget) - min) / (max - min);
  const clampedRatio = Math.min(1, Math.max(0, ratio));

  return Math.round(Math.pow(clampedRatio, 1 / LOG_POWER) * 100);
};

const sliderToBudget = (slider) => {
  const min = MIN_BUDGET;
  const max = safeMaxBudget;

  const sliderNumber = Number(slider);
  if (!Number.isFinite(sliderNumber)) return MIN_BUDGET;

  const ratio = Math.pow(sliderNumber / 100, LOG_POWER);

const rawBudget = min + ratio * (max - min);

return Math.round(rawBudget / 100) * 100;
};
    
const [budgetInputValue, setBudgetInputValue] = useState(String(budgetTotal));

useEffect(() => {
  if (!budgetMaxSelected) {
    setBudgetInputValue(String(budgetTotal));
  }
}, [budgetTotal, budgetMaxSelected]);

const commitBudgetInput = () => {
  const numericValue = Number(budgetInputValue);

  if (!Number.isFinite(numericValue) || budgetInputValue === "") {
    setBudgetInputValue(String(budgetTotal));
    return;
  }

  const safeBudget = Math.max(
    MIN_BUDGET,
    Math.min(numericValue, maxBudget)
  );

  onChange?.({
    budgetTotal: safeBudget,
    budgetMaxSelected: false,
    budgetManuallyEdited: true,
  });

  setBudgetInputValue(String(safeBudget));
};

  const customTravelers = travelers >= 6;

  const getAutomaticBudget = (nextTravelers) => {
    return Math.max(
      MIN_BUDGET,
      Math.round((DEFAULT_BUDGET_FOR_2 / DEFAULT_TRAVELERS) * nextTravelers)
    );
  };

  const updateTravelers = (nextTravelers) => {
    const safeTravelers = Math.max(1, Number(nextTravelers) || 1);
    const nextMaxBudget = getMaxBudget(safeTravelers);

    const patch = {
      travelers: safeTravelers,
    };

    if (budgetMaxSelected) {
      patch.budgetTotal = nextMaxBudget;
      patch.budgetMaxSelected = true;
      patch.budgetManuallyEdited = true;
    } else if (!budgetManuallyEdited) {
      patch.budgetTotal = getAutomaticBudget(safeTravelers);
      patch.budgetMaxSelected = false;
    } else if (budgetTotal > nextMaxBudget) {
      patch.budgetTotal = nextMaxBudget;
      patch.budgetMaxSelected = false;
    }

    onChange?.(patch);
  };

  const updateBudget = (nextBudget) => {
    const safeBudget = Math.max(
      MIN_BUDGET,
      Math.min(Number(nextBudget) || MIN_BUDGET, maxBudget)
    );

    onChange?.({
      budgetTotal: safeBudget,
      budgetMaxSelected: false,
      budgetManuallyEdited: true,
    });
  };

  const selectMaxBudget = () => {
    onChange?.({
      budgetTotal: maxBudget,
      budgetMaxSelected: true,
      budgetManuallyEdited: true,
    });
  };

  const handleValidate = () => {
    onValidate?.({
      ...values,
      travelers,
      budgetTotal,
      budgetMaxSelected,
      budgetManuallyEdited,
budgetLogement: values.budgetLogement ?? 1,
budgetFood: values.budgetFood ?? 1,
budgetActivite: values.budgetActivite ?? 1,
    });
  };

  return (
    <div className="budget-bg">
      <div className="budget-screen">
        <h1 className="budget-title">Budget</h1>

        <section className="budget-card">
          <h2>👥 Nombre de voyageurs</h2>

          <div className="budget-travelers-grid">
            {TRAVELER_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`choice-btn ${
                  travelers === option && !customTravelers ? "active" : ""
                }`}
                onClick={() => updateTravelers(option)}
              >
                {option}
              </button>
            ))}

            <button
              type="button"
              className={`choice-btn ${customTravelers ? "active" : ""}`}
              onClick={() => updateTravelers(Math.max(travelers, 6))}
            >
              6+
            </button>
          </div>

          {customTravelers && (
            <div className="budget-custom-block">
              <label>{travelers} voyageurs</label>

              <input
                type="range"
                min="6"
                max="20"
                step="1"
                value={travelers}
                onChange={(e) => updateTravelers(e.target.value)}
              />
            </div>
          )}
        </section>

        <section className="budget-card budget-total-card">
          <h2>💰 Budget total du voyage</h2>

          <div className="budget-main-value">
            {budgetMaxSelected
              ? `> ${maxBudget.toLocaleString("fr-FR")} €`
              : `${Number(budgetTotal).toLocaleString("fr-FR")} €`}
          </div>

<input
  className="budget-main-slider"
  type="range"
  min="0"
  max="100"
  step="1"
  value={budgetMaxSelected ? 100 : budgetToSlider(safeBudgetTotal)}
  onChange={(e) => updateBudget(sliderToBudget(e.target.value))}
/>

          <div className="budget-row budget-row-aligned">
            <div className="budget-manual-display">
              {budgetMaxSelected ? (
                `> ${maxBudget.toLocaleString("fr-FR")} €`
              ) : (
<input
  className="budget-input"
  type="number"
  step="100"
  value={budgetInputValue}
  onChange={(e) => {
    setBudgetInputValue(e.target.value);
    onChange?.({
      budgetMaxSelected: false,
      budgetManuallyEdited: true,
    });
  }}
  onBlur={commitBudgetInput}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }}
/>
              )}
            </div>

            <button
              type="button"
              className={`budget-max-btn ${budgetMaxSelected ? "active" : ""}`}
              onClick={selectMaxBudget}
            >
              MAX
            </button>

            <div className="budget-helper-inline">
              {budgetMaxSelected ? "Plus de " : "Environ "}
              <strong>
                {Math.round(budgetTotal / travelers).toLocaleString("fr-FR")} €
              </strong>
              <span>/ pers.</span>
            </div>
          </div>
        </section>

        <section className="budget-card budget-preferences-section">
          <h2>🎛️ Style de dépenses</h2>

          <div className="budget-pref-list">
            <BudgetPreference
              icon="🏨"
              label="Budget Logement"
              value={values.budgetLogement ?? 1}
              color="rgba(255, 105, 180, 0.65)"
              onChange={(value) => onChange?.({ budgetLogement: value })}
            />

            <BudgetPreference
              icon="🍽️"
              label="Budget Nourriture & Boissons"
              value={values.budgetFood ?? 1}
              color="rgba(255, 215, 0, 0.65)"
              onChange={(value) => onChange?.({ budgetFood: value })}
            />

            <BudgetPreference
              icon="🎟️"
              label="Budget Activité"
              value={values.budgetActivite ?? 1}
              color="rgba(87, 212, 235, 0.45)"
              onChange={(value) => onChange?.({ budgetActivite: value })}
            />
          </div>
        </section>

<div className="app-actions two-buttons">
  <button type="button" className="app-btn back" onClick={onBack}>
    BACK
  </button>

  <button type="button" className="app-btn ok" onClick={handleValidate}>
    OK
  </button>
</div>
      </div>
    </div>
  );
}