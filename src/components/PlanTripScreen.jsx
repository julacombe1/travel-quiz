import { useState } from "react";
import "./PlanTripScreen.css";


function formatEuro(value) {
  const numberValue = Number(value) || 0;
  return `${numberValue.toLocaleString("fr-FR")} €`;
}

function getBudgetRows(budgetBreakdown = {}) {
  return [
    {
      key: "avion",
      icon: "✈️",
      label: "Avion / trajet",
      value: budgetBreakdown.avion,
    },
    {
      key: "transport",
      icon: "🚕",
      label: "Transport local",
      value: budgetBreakdown.transport,
    },
    {
      key: "logement",
      icon: "🏨",
      label: "Logement",
      value: budgetBreakdown.logement,
    },
    {
      key: "bouffe",
      icon: "🍽️",
      label: "Nourriture",
      value: budgetBreakdown.bouffe,
    },
    {
      key: "activites",
      icon: "🎟️",
      label: "Activités",
      value: budgetBreakdown.activites,
    },
    {
      key: "travelPlanner",
      icon: "🧭",
      label: "Travel planner",
      value: budgetBreakdown.travelPlanner,
    },
  ];
}



export default function PlanTripScreen({
  destination,
  budgetBreakdown,
  destinationRank,
  selectedMonth,
  exactDates,
  travelPeriodLabel,
  travelPeriodType,
  onBack,
  onInterested,
}) {
  const destinationName =
    destination?.nom || destination?.name || "votre destination";

  const budgetRows = getBudgetRows(budgetBreakdown);
  const totalBudget = Number(budgetBreakdown?.total) || 0;

  const [showOtherDestinationPopup, setShowOtherDestinationPopup] =
    useState(false);

  const [otherDestinationName, setOtherDestinationName] = useState("");

  const cleanTravelPeriodLabel = travelPeriodLabel || "";

  function formatPlanDateFr(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString("fr-FR");
  }

  const hasExactDates = exactDates?.from || exactDates?.to;

const planTripPeriodSuffix = hasExactDates
  ? ` entre le ${formatPlanDateFr(exactDates.from)} et le ${formatPlanDateFr(
      exactDates.to
    )}`
  : selectedMonth === "best" && cleanTravelPeriodLabel
  ? ` en ${cleanTravelPeriodLabel}`
  : selectedMonth && selectedMonth !== "best"
  ? ` en ${selectedMonth}`
  : "";


  const openRequestForDestination = (
    name,
    isCustomDestination = false
  ) => {
    const cleanName = String(name ?? "").trim();

    if (!cleanName) return;

    const nextDestination = isCustomDestination
      ? {
          ...destination,
          nom: cleanName,
          name: cleanName,
        }
      : destination;

    onInterested?.({
      mode: isCustomDestination ? "customDestination" : "selectedDestination",
      type: isCustomDestination
        ? "custom-destination"
        : "selected-destination",

      destination: nextDestination,
      originalDestination: destination,

      destinationName: cleanName,
      customDestination: isCustomDestination ? cleanName : null,
      customDestinationName: isCustomDestination ? cleanName : null,
      isCustomDestination,

      budgetBreakdown,

      destinationRank: isCustomDestination ? null : destinationRank,
      selectedMonth,
      exactDates,
      travelPeriodLabel,
      travelPeriodType,
    });
  };

  const handleOtherDestinationSubmit = () => {
    const cleanDestinationName = otherDestinationName.trim();

    if (!cleanDestinationName) return;

    setShowOtherDestinationPopup(false);
    setOtherDestinationName("");

    openRequestForDestination(cleanDestinationName, true);
  };

  return (
    <div className="plan-trip-screen">
      <div className="plan-trip-overlay">
        <section className="plan-trip-card">
          <div className="plan-trip-logo-space">
            {/* Ton logo sera ajouté ici plus tard */}
          </div>

          <p className="plan-trip-kicker">Terre d&apos;Aur Travel Planner</p>

          <h1>
            Ton voyage sur-mesure,
            <br />
            sans le stress de l&apos;organisation !
          </h1>

<p className="plan-trip-destination">
  Projet pour :{" "}
  <strong>
    {destinationName}
    {planTripPeriodSuffix}
  </strong>
</p>

          <div className="plan-trip-text-block">
            <p>
              Pour concevoir ce séjour, nous te confions à Terre d&apos;Aur
              Travel Planner, avec Aurélie, ancienne professeure des écoles
              reconvertie avec passion dans la création de voyages.
            </p>

            <p>
              <strong>Important à savoir :</strong> Sa mission est de te
              conseiller et te guider pas à pas. Elle crée ton itinéraire
              idéal et sélectionne les meilleurs prestataires, mais ce n&apos;est
              pas une agence. C&apos;est toi qui réserve en direct via ses
              liens : elle t&apos; aide à réaliser le projet, mais sa responsabilité
              s&apos;arrête là et ne s&apos;applique pas pendant le voyage.
            </p>
          </div>

          <section className="plan-trip-budget-card">
            <div className="plan-trip-budget-header">
              <span>Budget estimé</span>
              <strong>{formatEuro(totalBudget)}</strong>
            </div>

            <div className="plan-trip-budget-list">
              {budgetRows.map((row) => (
                <div key={row.key} className="plan-trip-budget-row">
                  <span>
                    {row.icon} {row.label}
                  </span>
                  <strong>{formatEuro(row.value)}</strong>
                </div>
              ))}
            </div>
          </section>

          <div className="plan-trip-text-block final">
            <h2>Prêt à concrétiser ce projet ?</h2>

            <p>
              La rémunération de ton Travel Planner pour toutes ses recherches
              est déjà incluse et transparente dans le budget ci-dessus.
            </p>

            <p>
              En cliquant sur <strong>“Ça m&apos;intéresse !”</strong>, tu
              lances la création de ton voyage unique par notre experte.
            </p>
          </div>
        </section>
      </div>

<div className="plan-trip-actions">
  <button type="button" className="app-btn back" onClick={onBack}>
    BACK
  </button>

<button
  type="button"
  className="app-btn gold plan-trip-interest-btn"
  onClick={() =>
    onInterested?.({
      destination,
      budgetBreakdown,
      destinationRank,
      selectedMonth,
      exactDates,
      travelPeriodLabel,
      travelPeriodType,
    })
  }
>
  Ça m’intéresse pour {destinationName}
  {planTripPeriodSuffix}
</button>

  <button
    type="button"
    className="app-btn gold plan-trip-interest-btn secondary-interest"
    onClick={() => setShowOtherDestinationPopup(true)}
  >
    <span>Ça m&apos;intéresse pour</span>
    <span>une autre destination</span>
  </button>
</div>
{showOtherDestinationPopup && (
  <div className="plan-trip-popup-backdrop">
    <div className="plan-trip-popup">
      <h2>Quelle destination souhaitez-vous ?</h2>

      <p>
        Indiquez la destination que vous aimeriez confier à Terre d&apos;Aur
        Travel Planner.
      </p>

      <input
        type="text"
        className="plan-trip-popup-input"
        value={otherDestinationName}
        onChange={(e) => setOtherDestinationName(e.target.value)}
        placeholder="Ex : Japon, Bali, Costa Rica..."
        autoFocus
      />

      <div className="plan-trip-popup-actions">
        <button
          type="button"
          className="app-btn back"
          onClick={() => {
            setShowOtherDestinationPopup(false);
            setOtherDestinationName("");
          }}
        >
          BACK
        </button>

        <button
          type="button"
          className="app-btn gold"
          onClick={handleOtherDestinationSubmit}
          disabled={!otherDestinationName.trim()}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}