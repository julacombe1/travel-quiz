import { useEffect, useState } from "react";
import "./ResultsScreen.css";
import {
getDestinationMonthValue,
getWeightedMonthValue,
normalizeMonthKey,
} from "../engine/coefftemp";
import { calculateBudgetBreakdown } from "../engine/budget";


function formatMonth(monthKey) {
const map = {
janvier: "Janvier",
fevrier: "Février",
mars: "Mars",
avril: "Avril",
mai: "Mai",
juin: "Juin",
juillet: "Juillet",
aout: "Août",
septembre: "Septembre",
octobre: "Octobre",
novembre: "Novembre",
decembre: "Décembre",
};

return map[monthKey] || monthKey;
}

function formatDate(dateValue) {
if (!dateValue) return null;

const date = new Date(dateValue);
if (Number.isNaN(date.getTime())) return null;

return date.toLocaleDateString("fr-FR", {
day: "numeric",
month: "long",
year: "numeric",
});
}

function formatTemperature(value) {
if (value == null) return null;
return `${Math.round(value * 10) / 10}°C`;
}

function getPeriodLabel(selectedMonth, exactDates, res) {
if (exactDates?.from && exactDates?.to) {
const from = formatDate(exactDates.from);
const to = formatDate(exactDates.to);

if (from && to) {
  return `📅 Voyage prévu : du ${from} au ${to}`;
}

}

if (selectedMonth === "best" && res.bestMonth) {
return `📅 Meilleur mois : ${formatMonth(res.bestMonth)}`;
}

if (selectedMonth && selectedMonth !== "best") {
return `📅 Voyage prévu : ${formatMonth(selectedMonth)}`;
}

return null;
}

function getPeriodCardInfo(selectedMonth, exactDates, res) {
  if (exactDates?.from && exactDates?.to) {
    const from = formatDate(exactDates.from);
    const to = formatDate(exactDates.to);

    if (from && to) {
      return {
        label: "📅 Dates",
        value: `du ${from} au ${to}`,
        isBestMonth: false,
        isExactDates: true,
      };
    }
  }

  if (selectedMonth === "best" && res.bestMonth) {
    return {
      label: "📅 Meilleur mois",
      value: formatMonth(res.bestMonth),
      isBestMonth: true,
      isExactDates: false,
    };
  }

  if (selectedMonth && selectedMonth !== "best") {
    return {
      label: "📅 Mois choisi",
      value: formatMonth(selectedMonth),
      isBestMonth: false,
      isExactDates: false,
    };
  }

  if (res.bestMonth) {
    return {
      label: "📅 Meilleur mois",
      value: formatMonth(res.bestMonth),
      isBestMonth: true,
      isExactDates: false,
    };
  }

  return null;
}

function getDisplayedMonthKey(selectedMonth, exactDates, res) {
if (exactDates?.from && exactDates?.to) return null;

if (selectedMonth === "best" && res.bestMonth) {
return normalizeMonthKey(res.bestMonth);
}

if (selectedMonth && selectedMonth !== "best") {
return normalizeMonthKey(selectedMonth);
}

return null;
}

function getDisplayedTemperature(res, themeKey, selectedMonth, exactDates) {
if (exactDates?.from && exactDates?.to) {
return getWeightedMonthValue(res, themeKey, exactDates.from, exactDates.to);
}

const monthKey = getDisplayedMonthKey(selectedMonth, exactDates, res);
if (!monthKey) return null;

return getDestinationMonthValue(res, themeKey, monthKey);
}

function getThemeComment(res, themeKey, selectedMonth, exactDates) {
if (res?.comments?.[themeKey]) {
return res.comments[themeKey];
}

const isMonthlyTheme = ["festi", "carna"].includes(themeKey);

if (isMonthlyTheme) {
const monthKey =
res?.bestMonth || getDisplayedMonthKey(selectedMonth, exactDates, res);

if (monthKey) {
  return res?.[`${themeKey}.${monthKey}c`] ?? null;
}

return null;

}

if (themeKey === "transportModes") {
return res?.comments?.transportModes ?? null;
}

return res?.[`${themeKey}c`] || res?.[themeKey]?.c || null;
}

const COMMENT_CONFIG = [
{ key: "trek", label: "Trek", icon: "🧗" },
{ key: "rando", label: "Randonnée", icon: "🥾" },
{ key: "faune", label: "Faune", icon: "🦜" },

{ key: "inso", label: "Baignade insolite", icon: "🛁" },
{ key: "bain", label: "Baignade", icon: "🏄" },
{ key: "mer", label: "Baignade", icon: "🌊" },

{ key: "infra", label: "All Inclusive", icon: "🏨" },
{ key: "nature", label: "Nature", icon: "🌲" },
{ key: "bala", label: "Balade", icon: "🥾" },
{ key: "fete", label: "Animation, Club, Bar", icon: "🎉" },

{ key: "histo", label: "Monument historique", icon: "🏛️" },
{ key: "reli", label: "Monument religieux", icon: "⛪" },
{ key: "musees", label: "Musée", icon: "🖼️" },
{ key: "arch", label: "Site archéologique", icon: "🏺" },
{ key: "monu", label: "Monument", icon: "🏛️" },

{ key: "shop", label: "Shopping", icon: "🛍️" },
{ key: "moder", label: "Ville moderne", icon: "🏙️" },

{ key: "spec", label: "Spectacle", icon: "🎭" },
{ key: "noctu", label: "Nocturne", icon: "🌙" },

{ key: "quar", label: "Quartier atypique", icon: "🎨" },
{ key: "streetart", label: "Street Art", icon: "🎨" },

{ key: "soin", label: "Bien-être", icon: "💆" },
{ key: "massage", label: "Massage", icon: "💆" },

{ key: "carna", label: "Fête locale", icon: "🎉" },
{ key: "festi", label: "Festival de musique", icon: "🎶" },

{ key: "attrac", label: "Parc d'attractions", icon: "🎢" },
{ key: "attracsens", label: "Parc à sensations", icon: "⚡" },

{ key: "zoo", label: "Zoo", icon: "🐘" },
{ key: "aqua", label: "Aquarium", icon: "🐠" },

{ key: "snork", label: "Snorkeling", icon: "🤿" },
{ key: "plongee", label: "Plongée", icon: "🤿" },

{ key: "visite", label: "Visite", icon: "🗺️" },
{ key: "planta", label: "Plantation", icon: "🌴" },

{ key: "velo", label: "Vélo", icon: "🚴" },
{ key: "cyclisme", label: "Cyclisme", icon: "⛰️" },

{ key: "canoe", label: "Canoë / Kayak", icon: "🛶" },
{ key: "rafting", label: "Rafting", icon: "🛶" },
{ key: "canyon", label: "Canyoning", icon: "🏞️" },

{ key: "accro", label: "Accrobranche", icon: "🧗" },
{ key: "viaferrata", label: "Via Ferrata", icon: "🧗" },

{ key: "motor", label: "Quad / Buggy", icon: "🏎️" },
{ key: "bateau", label: "Bateau", icon: "⛴️" },

{ key: "surf", label: "Surf", icon: "🏄" },
{ key: "jetski", label: "Jet-ski", icon: "🚤" },

{ key: "grot", label: "Grottes", icon: "🕳️" },
{ key: "speleo", label: "Spéléologie", icon: "⛏️" },

{ key: "aerien", label: "Évasion aérienne", icon: "🚁" },
{ key: "extreme", label: "Frissons aériens", icon: "🪂" },

{ key: "esca", label: "Escalade", icon: "🧗" },

{ key: "transportModes_voiture", label: "Voiture", icon: "🚗" },
{ key: "transportModes_commun", label: "Transports en commun", icon: "🚆" },
{ key: "transportModes_taxi", label: "Taxi", icon: "🚕" },
{ key: "transportModes_vtc", label: "VTC", icon: "🚖" },
{ key: "admin", label: "Papiers", icon: "🛂" },

{ key: "streetfood", label: "Street Food", icon: "🥙" },
{ key: "stvege", label: "Street Food végé", icon: "🥦" },

{ key: "cuisineloc", label: "Cuisine locale", icon: "🍲" },
{ key: "cuivege", label: "Cuisine locale végé", icon: "🥦" },

{ key: "gastro", label: "Restaurant gastronomique", icon: "🍽️" },
{ key: "gasvege", label: "Gastronomique végé", icon: "🥦" },

{ key: "alcool", label: "Alcool local / bière", icon: "🍸" },
{ key: "vin", label: "Vin", icon: "🍷" },

{ key: "doux", label: "Doux", icon: "🍯" },
{ key: "epice", label: "Pimenté", icon: "🌶️" },

{ key: "atelcul", label: "Atelier de cuisine", icon: "👨‍🍳" },

{ key: "confort", label: "Confort", icon: "🛏️" },
{ key: "luxe", label: "Luxe", icon: "💎" },
{ key: "popu", label: "Accueil population locale", icon: "🤝" },

{ key: "camp", label: "Camping", icon: "⛺" },
{ key: "sauvage", label: "Camping sauvage", icon: "🏕️" },

{ key: "jacuz", label: "Jacuzzi", icon: "🫧" },
{ key: "pisci", label: "Piscine", icon: "🏊" },

{ key: "roman", label: "Romantique", icon: "💘" },
{ key: "coquin", label: "Coquin", icon: "🔥" },

{ key: "atyp", label: "Atypique", icon: "🌿" },
{ key: "eco", label: "Eco-tourisme", icon: "🌱" },
];

const THEMES_HIDE_COMMENT_IF_SCORE_ZERO = ["mer", "inso", "festi", "carna"];
const THEMES_REQUIRE_USER_STARS = ["mer", "inso"];

function hasInvertedRange(userAnswers, minKey, maxKey) {
const min = Number(userAnswers?.[minKey]);
const max = Number(userAnswers?.[maxKey]);

return Number.isFinite(min) && Number.isFinite(max) && min > max;
}

function getTripDaysFromAnswers(userAnswers) {
const from = userAnswers?.exactDates?.from;
const to = userAnswers?.exactDates?.to;

if (from && to) {
const start = new Date(from);
const end = new Date(to);

if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
  const diffMs = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

}

return Number(userAnswers?.tripDays) || 15;
}

function getNoResultsTitle(diagnostic) {
if (diagnostic?.mainReason === "budget") {
return "Aucune destination trouvée : budget trop serré";
}

if (diagnostic?.mainReason === "temperature") {
return "Aucune destination trouvée : filtres de température trop restrictifs";
}

return "Aucune destination trouvée";
}

function getNoResultsIntro(diagnostic) {
  if (diagnostic?.mainReason === "budget") {
    return `Certaines destinations correspondent à tes critères mais elles dépassent le budget disponible.`;
  }

  if (diagnostic?.mainReason === "temperature") {
    return `Les critères de température semblent trop restrictifs pour les destinations disponibles.`;
  }

  return "Aucune destination ne correspond actuellement à l’ensemble de tes critères.";
}

function getActiveExpensiveActivities(userAnswers) {
const expensiveActivities = [
{ key: "extreme", label: "sports extrêmes" },
{ key: "aerien", label: "évasion aérienne" },
{ key: "canyon", label: "canyoning" },
{ key: "viaferrata", label: "via ferrata" },
{ key: "plongee", label: "plongée" },
{ key: "speleo", label: "spéléologie" },
{ key: "bateau", label: "bateau" },
{ key: "motor", label: "quad / buggy" },
{ key: "jetski", label: "jet-ski" },
{ key: "massage", label: "massages" },
{ key: "attrac", label: "parcs d’attractions" },
{ key: "attracsens", label: "parcs à sensations" },
];

return expensiveActivities.filter(
(item) => Number(userAnswers?.[item.key]) > 0
);
}

function getActiveExpensiveLogementThemes(userAnswers) {
  const expensiveThemes = [
    { key: "confort", label: "confort" },
    { key: "luxe", label: "luxe" },
    { key: "pisci", label: "piscine" },
    { key: "jacuz", label: "jacuzzi" },
    { key: "roman", label: "romantique" },
    { key: "coquin", label: "coquin" },
    { key: "atyp", label: "atypique" },
  ];

  return expensiveThemes.filter(
    (item) => Number(userAnswers?.[item.key]) > 0
  );
}

function getNoResultsAdvice(userAnswers, diagnostic) {
const advices = [];

const tripDays = getTripDaysFromAnswers(userAnswers);

const budgetLogement = Number(userAnswers?.budgetLogement ?? 3);
const budgetFood = Number(userAnswers?.budgetFood ?? 3);
const budgetActivite = Number(userAnswers?.budgetActivite ?? 3);

const hasGastro =
Number(userAnswers?.gastro) > 0 || Number(userAnswers?.gasvege) > 0;

const hasLuxe = Number(userAnswers?.luxe) > 0;

const expensiveActivities = getActiveExpensiveActivities(userAnswers);
const expensiveLogementThemes =
  getActiveExpensiveLogementThemes(userAnswers);

const heatRangeInverted = hasInvertedRange(
userAnswers,
"chalMin",
"chalMax"
);

const seaRangeInverted = hasInvertedRange(
userAnswers,
"teauMin",
"teauMax"
);

const temperatureBlockerKeys = new Set(
(diagnostic?.temperatureBlockers ?? []).map((item) => item.key)
);

if (diagnostic?.mainReason === "budget") {
advices.push("- légèrement augmenter le budget total");

if (tripDays > 3) {
  advices.push("- réduire la durée du voyage");
}

if (budgetLogement > 1 || budgetFood > 1 || budgetActivite > 1) {
  advices.push("- passer les styles de dépenses au niveau « strict minimum »");
}

if (expensiveActivities.length > 0) {
  advices.push(
    `- réduire certaines activités coûteuses : ${expensiveActivities
      .map((item) => item.label)
      .join(" • ")}`
  );
}
if (expensiveLogementThemes.length > 0) {
  advices.push(
    `- réduire certains critères logement : ${expensiveLogementThemes
      .map((item) => item.label)
      .join(" • ")}`
  );
}
if (hasGastro) {
  advices.push("- retirer ou réduire le critère restaurant gastronomique");
}

if (hasLuxe) {
  advices.push("- retirer ou réduire le critère luxe");
}

}
const hasMerSelected = Number(userAnswers?.mer) > 0;
const hasInsoSelected = Number(userAnswers?.inso) > 0;

if (diagnostic?.hasTemperatureIssue) {
  if (!hasMerSelected && !hasInsoSelected) {
    advices.push("- plus élargir la plage de température chaleur acceptée");
  } else {
    if (temperatureBlockerKeys.has("chal")) {
      if (heatRangeInverted) {
        advices.push(
          "- vérifier le filtre chaleur : la température minimale est supérieure à la maximale"
        );
      } else {
        advices.push("- plus élargir la plage de température chaleur acceptée");
      }
    }

    if (
      temperatureBlockerKeys.has("mer") ||
      temperatureBlockerKeys.has("inso")
    ) {
      if (seaRangeInverted) {
        advices.push(
          "- vérifier la température de l’eau : la température minimale est supérieure à la maximale"
        );
      } else {
        advices.push("- plus élargir la plage de température acceptée");
      }
    }
  }
}

if (!advices.length) {
advices.push(
"- renseigner plus de critères",
);
}

return [...new Set(advices)].slice(0, 5);
}

function getVisibleComments(res, userAnswers, selectedMonth, exactDates) {
return COMMENT_CONFIG.map(({ key, label, icon }) => {
let comment = null;
let userInterest = 0;
let score = 0;

let displayLabel = label;
let displayIcon = icon;

if (key === "admin") {
  comment = res?.comments?.admin ?? res?.adminc ?? null;

  const papiers = userAnswers?.papiers;

  userInterest = papiers && !papiers.indifferent ? 1 : 0;
  score = 1;
} else if (key.startsWith("transportModes")) {
  const subKey = key.split("_")[1];

  const transportComments = res?.comments?.transportModes;
  comment = transportComments?.[subKey];

  const modes = userAnswers?.transportModes;

  userInterest =
    modes && !modes.indifferent && modes[subKey] ? 1 : 0;

  score = 1;
} else {
  comment = getThemeComment(res, key, selectedMonth, exactDates);
  userInterest = Number(userAnswers?.[key]) || 0;
  score = Number(res.scores?.[key]) || 0;
}

if (key === "roman" && Number(userAnswers?.romanCoquin) === 1) {
  displayLabel = "Coquins";
  displayIcon = "🔥";
}

if (key === "jacuz" && Number(userAnswers?.jacuzPiscine) === 1) {
  displayLabel = "Piscines";
  displayIcon = "🏊";
}

if (key === "atyp" && Number(userAnswers?.atypEco) === 1) {
  displayLabel = "Eco-tourisme";
  displayIcon = "🌱";
}

const mustHideIfScoreZero =
  THEMES_HIDE_COMMENT_IF_SCORE_ZERO.includes(key);

const mustRequireUserStars =
  THEMES_REQUIRE_USER_STARS.includes(key);

return comment &&
  (!mustRequireUserStars || userInterest > 0) &&
  (!mustHideIfScoreZero || score > 0) &&
  userInterest > 0
  ? { key, label: displayLabel, icon: displayIcon, comment }
  : null;

}).filter(Boolean);
}

function getTravelInfo(res, userAnswers) {
  const avionChoice = userAnswers?.avion ?? "indifferent";

  const hasPlane =
    String(res?.avion ?? "").toUpperCase() === "Y";

  const avionTime =
    Number(res?.aviont) > 0 ? `${res.aviont} h` : null;

  const communTime =
    Number(res?.communt) > 0 ? `${res.communt} h` : null;

  // =====================
  // AVION OUI
  // =====================

  if (avionChoice === "oui") {
    return {
      label: "✈️ Durée du vol",
      value: avionTime,
    };
  }

  // =====================
  // AVION NON
  // =====================

  if (avionChoice === "non") {
    return {
      label: "🧭 Temps de trajet",
      value: communTime,
    };
  }

  // =====================
  // AVION INDIFFÉRENT
  // =====================

  if (hasPlane && avionTime) {
    return {
      label: "✈️ Durée du vol",
      value: avionTime,
    };
  }

  if (communTime) {
    return {
      label: "🧭 Temps de trajet",
      value: communTime,
    };
  }

  return {
    label: null,
    value: null,
  };
}

function LegacyResultsScreen({
  results,
  selectedMonth,
  exactDates,
  userAnswers,
  onBack,
  onRestart,
}) {
if (!Array.isArray(results) || results.length === 0) {
const diagnostic = results?.noResultsDiagnostic;
const noResultsAdvice = getNoResultsAdvice(userAnswers, diagnostic);

return (
  <div className="results-screen">
    <div className="result-card">
      <h2>{getNoResultsTitle(diagnostic)}</h2>

      <p>{getNoResultsIntro(diagnostic)}</p>

      <div className="no-results-advice">
        <p>Pour débloquer plus de destinations, tu peux essayer de :</p>

        <ul>
          {noResultsAdvice.map((advice) => (
            <li key={advice}>{advice}</li>
          ))}
        </ul>
      </div>

<div className="app-actions two-buttons">
  {onBack && (
    <button type="button" className="app-btn back" onClick={onBack}>
      BACK
    </button>
  )}

  {onRestart && (
    <button type="button" className="app-btn dark" onClick={onRestart}>
      REJOUER
    </button>
  )}
</div>
    </div>
  </div>
);

}

return ( <div className="results-screen">
{results.map((res, i) => {
const periodLabel = getPeriodLabel(selectedMonth, exactDates, res);

    const budgetBreakdown = calculateBudgetBreakdown(res, {
      ...userAnswers,
      _month: res.bestMonth,
    });

    const visibleComments = getVisibleComments(
      res,
      userAnswers,
      selectedMonth,
      exactDates
    );

    const hasInso = Number(res.scores?.inso) > 0;
    const hasMer = Number(res.scores?.mer) > 0;
    const hasBain = Number(res.scores?.bain) > 0;

    const insoTemp = hasInso
      ? getDisplayedTemperature(res, "inso", selectedMonth, exactDates)
      : null;

    const merTemp =
      hasMer || hasBain
        ? getDisplayedTemperature(res, "mer", selectedMonth, exactDates)
        : null;

    const heatTemp = getDisplayedTemperature(
      res,
      "chal",
      selectedMonth,
      exactDates
    );

    const travelInfo = getTravelInfo(res, userAnswers);

    const tourSelected = Number(userAnswers?.tour) > 0;
    const secuSelected = Number(userAnswers?.secu) > 0;
    const displayedBudgetPressure = res.budgetPressureCount ?? 0;

const displayedHeatPressure = res.heatPressureCount ?? 0;
    const selectedReliefs = Object.entries(userAnswers?.relief ?? {})
      .filter(([key, value]) => key !== "indifferent" && value === true)
      .map(([key]) => key);

    return (
      <div key={res.id ?? res.nom ?? i} className="result-card">
        <h2>{res.nom}</h2>

        {periodLabel && <p>{periodLabel}</p>}

        <div className="budget-result-block">
          <p>
            💰 Budget estimé :{" "}
            <strong>{budgetBreakdown.total.toLocaleString("fr-FR")} €</strong>
          </p>

          <p>
            {userAnswers?.avion !== "non" ? "✈️ Avion" : "🧭 Trajet"} :{" "}
            {budgetBreakdown.avion.toLocaleString("fr-FR")} €
          </p>

          <p>
            🚕 Transport local :{" "}
            {budgetBreakdown.transport.toLocaleString("fr-FR")} €
          </p>

          <p>
            🏨 Logement :{" "}
            {budgetBreakdown.logement.toLocaleString("fr-FR")} €
          </p>

          <p>
            🍽️ Nourriture :{" "}
            {(budgetBreakdown.bouffe ?? 0).toLocaleString("fr-FR")} €
          </p>

          <p>
            🎟️ Activités :{" "}
            {(budgetBreakdown.activites ?? 0).toLocaleString("fr-FR")} €
          </p>

          <p>
            🧭 Travel planner :{" "}
            {budgetBreakdown.travelPlanner.toLocaleString("fr-FR")} €
          </p>
        </div>

        {insoTemp != null && (
          <p>🛁 T° baignades insolites : {formatTemperature(insoTemp)}</p>
        )}

        {merTemp != null && (
          <p>🌊 T° de l’eau : {formatTemperature(merTemp)}</p>
        )}

        {heatTemp != null && (
          <p>☀️ T° chaleur : {formatTemperature(heatTemp)}</p>
        )}

        {visibleComments.map(({ key, label, icon, comment }) => (
          <p key={key}>
            {icon} {label} : {comment}
          </p>
        ))}

        {travelInfo.label && travelInfo.value && (
          <p>
            {travelInfo.label} : {travelInfo.value}
          </p>
        )}

        {tourSelected && res.tour != null && (
          <p>👥 Fréquentation touristique : {res.tour}</p>
        )}

        {secuSelected && res.secu != null && (
          <p>🛡️ Sécurité : {res.secu}</p>
        )}

        {selectedReliefs.map((reliefKey) => (
          <p key={reliefKey}>
            🏔️ Relief {reliefKey} :{" "}
            {res?.[`relief.${reliefKey}`] ?? "N/A"}
          </p>
        ))}

{displayedBudgetPressure > 0 && (
  <p className="budget-pressure-info">
    Nb de destinations mieux classées :{" "}
    <strong>{displayedBudgetPressure}</strong>.
  </p>
)}
{displayedHeatPressure > 0 && (
  <p className="heat-pressure-info">
    Nb de destinations mieux classées hors température :{" "}
    <strong>{displayedHeatPressure}</strong>.
  </p>
)}

        <p>
          <strong>Score : {Math.round(res.score)}</strong>
        </p>
      </div>
    );
  })}

<div className="app-actions two-buttons">
  {onBack && (
    <button type="button" className="app-btn back" onClick={onBack}>
      BACK
    </button>
  )}

  {onRestart && (
    <button type="button" className="app-btn dark" onClick={onRestart}>
      REJOUER
    </button>
  )}
</div>
</div>

);
}
function getPressureQuantity(count) {
  const n = Number(count) || 0;

  if (n <= 0) return null;
  if (n === 1) return "au moins une";
  if (n >= 2 && n <= 4) return "quelques";
  if (n >= 5 && n <= 9) return "pas mal de";
  if (n >= 10 && n <= 19) return "beaucoup de";
  return "énormément de";
}

function getBudgetPressureMessage(count) {
  const n = Number(count) || 0;
  const quantity = getPressureQuantity(n);

  if (!quantity) return null;

  if (n === 1) {
    return `Tu as ${quantity} destination mieux classée mais supérieure à ton budget`;
  }

  return `Tu as ${quantity} destinations mieux classées mais supérieures à ton budget`;
}

function getHeatPressureMessage(count) {
  const n = Number(count) || 0;
  const quantity = getPressureQuantity(n);

  if (!quantity) return null;

  if (n === 1) {
    return `Tu as ${quantity} destination mieux classée hors température de chaleur`;
  }

  return `Tu as ${quantity} destinations mieux classées hors température de chaleur`;
}


function getDisplayBudgetBreakdown(res, userAnswers, selectedMonth) {
  const monthForBudget =
    selectedMonth && selectedMonth !== "best"
      ? normalizeMonthKey(selectedMonth)
      : res.bestMonth;

  return calculateBudgetBreakdown(res, {
    ...userAnswers,
    _month: monthForBudget,
  });
}
const MIN_BUDGET = 500;
const DEFAULT_BUDGET_FOR_2 = 10000;
const LOG_POWER = 1.35;

// Si tu as déjà CHAL_MIN / CHAL_MAX dans un fichier constants,
// tu peux les importer à la place de ces 2 lignes.
const CHAL_MIN = 14;
const CHAL_MAX = 34;

const MONTH_KEYS = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
];

const getMaxBudget = (travelers) => {
  return travelers * 10000 + 5000;
};

const budgetToSlider = (budget, maxBudget) => {
  const min = MIN_BUDGET;
  const max = Number(maxBudget) || min + 1;

  const ratio = (Number(budget) - min) / (max - min);
  const clampedRatio = Math.min(1, Math.max(0, ratio));

  return Math.round(Math.pow(clampedRatio, 1 / LOG_POWER) * 100);
};

const sliderToBudget = (slider, maxBudget) => {
  const min = MIN_BUDGET;
  const max = Number(maxBudget) || min + 1;

  const sliderNumber = Number(slider);
  if (!Number.isFinite(sliderNumber)) return min;

  const ratio = Math.pow(sliderNumber / 100, LOG_POWER);
  const rawBudget = min + ratio * (max - min);

  return Math.round(rawBudget / 100) * 100;
};

function getCleanBudgetAdvice(userAnswers) {
  return getNoResultsAdvice(userAnswers, { mainReason: "budget" })
    .filter((advice) => !advice.includes("augmenter le budget total"))
    .map((advice) => advice.replace(/^- /, ""));
}

function getHeatValueLabel(value, type) {
  const numberValue = Number(value);

  if (type === "min" && numberValue === CHAL_MIN) {
    return `${CHAL_MIN}°C ou moins`;
  }

  if (type === "max" && numberValue === CHAL_MAX) {
    return `${CHAL_MAX}°C ou plus`;
  }

  return `${numberValue}°C`;
}

function getHeatRangeLabel(userAnswers) {
  const min = Number.isFinite(Number(userAnswers?.chalMin))
    ? Number(userAnswers.chalMin)
    : CHAL_MIN;

  const max = Number.isFinite(Number(userAnswers?.chalMax))
    ? Number(userAnswers.chalMax)
    : CHAL_MAX;

  return `${getHeatValueLabel(min, "min")} à ${getHeatValueLabel(max, "max")}`;
}

function getDominantMonthKeyFromExactDates(exactDates) {
  if (!exactDates?.from || !exactDates?.to) return null;

  const start = new Date(exactDates.from);
  const end = new Date(exactDates.to);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const counts = {};

  const cursor = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );

  const limit = new Date(
    end.getFullYear(),
    end.getMonth(),
    end.getDate()
  );

  while (cursor <= limit) {
    const monthKey = MONTH_KEYS[cursor.getMonth()];
    counts[monthKey] = (counts[monthKey] || 0) + 1;
    cursor.setDate(cursor.getDate() + 1);
  }

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

function getMonthTextComplement(selectedMonth, exactDates) {
  let monthKey = null;

  if (exactDates?.from && exactDates?.to) {
    monthKey = getDominantMonthKeyFromExactDates(exactDates);
  } else if (selectedMonth && selectedMonth !== "best") {
    monthKey = normalizeMonthKey(selectedMonth);
  }

  if (!monthKey) return "";

  const monthLabel = formatMonth(monthKey).toLowerCase();

  const useApostrophe = ["avril", "aout", "octobre"].includes(monthKey);

  return useApostrophe
    ? ` pour le mois d’${monthLabel}`
    : ` pour le mois de ${monthLabel}`;
}

function getHeatPopupMessage(userAnswers, selectedMonth, exactDates) {
  const rangeLabel = getHeatRangeLabel(userAnswers);
  const monthText = getMonthTextComplement(selectedMonth, exactDates);

  return `Ton intervalle de température de la chaleur (${rangeLabel})${monthText} est trop restrictif. Veux-tu relancer sans le critère chaleur ?`;
}

function NoResultsRestitutionScreen({
  results,
  userAnswers,
  onBack,
  onRestart,
  onRelaunchWithMaxBudget,
  onRelaunchWithoutHeat,
}) {
  const diagnostic = results?.noResultsDiagnostic;
  const noResultsAdvice = getNoResultsAdvice(userAnswers, diagnostic);

  const isBudgetIssue = diagnostic?.mainReason === "budget";
  const isTemperatureIssue = diagnostic?.mainReason === "temperature";

  const travelers = Number(userAnswers?.travelers) || 2;
  const maxBudget = getMaxBudget(travelers);

  const currentBudget = userAnswers?.budgetMaxSelected
    ? maxBudget
    : Number(userAnswers?.budgetTotal) || DEFAULT_BUDGET_FOR_2;

  const [popupBudgetTotal, setPopupBudgetTotal] = useState(currentBudget);
  const [popupBudgetMaxSelected, setPopupBudgetMaxSelected] = useState(
    userAnswers?.budgetMaxSelected ?? false
  );
  const [relaunchLoading, setRelaunchLoading] = useState(false);

  const shouldApplyStrictMinimum =
    Number(userAnswers?.budgetLogement) !== 1 ||
    Number(userAnswers?.budgetFood) !== 1 ||
    Number(userAnswers?.budgetActivite) !== 1;

  const cleanAdvice = noResultsAdvice.filter(
    (advice) =>
      !String(advice).toLowerCase().includes("budget total") &&
      !String(advice).toLowerCase().includes("augmenter ton budget")
  );

  const handleBudgetSliderChange = (sliderValue) => {
    const nextBudget = sliderToBudget(sliderValue, maxBudget);

    setPopupBudgetTotal(nextBudget);
    setPopupBudgetMaxSelected(false);
  };

  const handleBudgetMax = () => {
    setPopupBudgetTotal(maxBudget);
    setPopupBudgetMaxSelected(true);
  };

  const handleBudgetRelaunch = () => {
    setRelaunchLoading(true);

    setTimeout(() => {
      onRelaunchWithMaxBudget?.({
        budgetTotal: popupBudgetMaxSelected ? maxBudget : popupBudgetTotal,
        budgetMaxSelected: popupBudgetMaxSelected,
        budgetManuallyEdited: true,
        applyStrictMinimum: shouldApplyStrictMinimum,
      });

      setRelaunchLoading(false);
    }, 450);
  };

  return (
    <div className="new-results-screen">
      <section className="new-results-top-block">
        <h1 className="new-results-main-title">Aucune destination trouvée</h1>
      </section>

      <section className="new-main-destination-card no-result-destination-card">
        <div className="new-result-rank-pill">À ajuster</div>

        <h2>{getNoResultsTitle(diagnostic)}</h2>

        <p className="new-result-period">{getNoResultsIntro(diagnostic)}</p>

        {relaunchLoading ? (
          <div className="date-loading-box">
            <div className="date-hourglass">⏳</div>

            <div className="date-loading-text">
              <strong>Calcul de ta destination...</strong>
            </div>
          </div>
        ) : (
          <>
            <div className="no-results-advice no-results-advice-card">
              <p>Pour débloquer plus de destinations, tu peux essayer de :</p>

              <ul>
                {cleanAdvice.map((advice) => (
                  <li key={advice}>{advice}</li>
                ))}

                {isBudgetIssue && (
                  <li>
                    Augmenter ton budget total :

                    <div className="popup-budget-block">
                      <div className="popup-budget-value">
                        {popupBudgetMaxSelected
                          ? `> ${maxBudget.toLocaleString("fr-FR")} €`
                          : `${popupBudgetTotal.toLocaleString("fr-FR")} €`}
                      </div>

                      <input
                        className="popup-budget-slider"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={
                          popupBudgetMaxSelected
                            ? 100
                            : budgetToSlider(popupBudgetTotal, maxBudget)
                        }
                        onChange={(event) =>
                          handleBudgetSliderChange(event.target.value)
                        }
                      />

                      <button
                        type="button"
                        className={`popup-max-btn ${
                          popupBudgetMaxSelected ? "active" : ""
                        }`}
                        onClick={handleBudgetMax}
                      >
                        MAX
                      </button>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {isBudgetIssue && (
              <button
                type="button"
                className="app-btn relaunch no-result-action-btn two-lines"
                onClick={handleBudgetRelaunch}
              >
                <span>Relancer avec</span>
                <span>ce budget</span>
                {shouldApplyStrictMinimum && (
                  <strong>et en strict minimum</strong>
                )}
              </button>
            )}

            {isTemperatureIssue && (
              <button
                type="button"
                className="app-btn ok no-result-action-btn two-lines"
                onClick={() => onRelaunchWithoutHeat?.()}
              >
                <span>Relancer sans</span>
                <span>critère chaleur</span>
              </button>
            )}
          </>
        )}
      </section>

      <div className="app-actions two-buttons sticky-bottom">
        {onBack && (
          <button type="button" className="app-btn back" onClick={onBack}>
            BACK
          </button>
        )}

        {onRestart && (
          <button type="button" className="app-btn dark" onClick={onRestart}>
            REJOUER
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({
  results,
  selectedMonth,
  exactDates,
  userAnswers,
  onBack,
  onRestart,
  onPlanTrip,
  onRelaunchWithMaxBudget,
  onRelaunchWithoutHeat,
}) {
const [selectedIndex, setSelectedIndex] = useState(0);
const [showTop10, setShowTop10] = useState(false);
const [showLegacyResults, setShowLegacyResults] = useState(false);
const [infoPopup, setInfoPopup] = useState(null);
const [popupLoading, setPopupLoading] = useState(false);

const travelers = Number(userAnswers?.travelers) || 2;
const maxBudget = getMaxBudget(travelers);

const currentBudget = userAnswers?.budgetMaxSelected
  ? maxBudget
  : Number(userAnswers?.budgetTotal) || DEFAULT_BUDGET_FOR_2;

const [popupBudgetTotal, setPopupBudgetTotal] = useState(currentBudget);
const [popupBudgetMaxSelected, setPopupBudgetMaxSelected] = useState(
  userAnswers?.budgetMaxSelected ?? false
);

const shouldApplyStrictMinimum =
  Number(userAnswers.budgetLogement) !== 1 ||
  Number(userAnswers.budgetFood) !== 1 ||
  Number(userAnswers.budgetActivite) !== 1;

if (showLegacyResults) {
  return (
    <LegacyResultsScreen
      results={results}
      selectedMonth={selectedMonth}
      exactDates={exactDates}
      userAnswers={userAnswers}
      onBack={onBack}
      onRestart={onRestart}
    />
  );
}

if (!Array.isArray(results) || results.length === 0) {
  return (
    <NoResultsRestitutionScreen
      results={results}
      userAnswers={userAnswers}
      onBack={onBack}
      onRestart={onRestart}
      onRelaunchWithMaxBudget={onRelaunchWithMaxBudget}
      onRelaunchWithoutHeat={onRelaunchWithoutHeat}
    />
  );
}

const positiveResults = results.filter((item) => Number(item?.score) > 0);
const topResults = positiveResults.slice(0, 10);
const topResultsCount = topResults.length;
  const res = results[selectedIndex] ?? results[0];

  const periodLabel = getPeriodLabel(selectedMonth, exactDates, res);

  const budgetBreakdown = getDisplayBudgetBreakdown(
    res,
    userAnswers,
    selectedMonth
  );

  const visibleComments = getVisibleComments(
    res,
    userAnswers,
    selectedMonth,
    exactDates
  );

const showInsoTemp = Number(userAnswers?.inso) > 0;
const showMerTemp = Number(userAnswers?.mer) > 0;

// Chaleur toujours affichée sur le nouvel écran.
const heatTemp = getDisplayedTemperature(
  res,
  "chal",
  selectedMonth,
  exactDates
);

const merTemp = showMerTemp
  ? getDisplayedTemperature(res, "mer", selectedMonth, exactDates)
  : null;

const insoTemp = showInsoTemp
  ? getDisplayedTemperature(res, "inso", selectedMonth, exactDates)
  : null;

const tripDays = getTripDaysFromAnswers(userAnswers);
const travelersCount = Number(userAnswers?.travelers) || 1;

const miniInfoCards = [
  {
    key: "days",
    icon: "🗓️",
    value: `${tripDays}j`,
  },
  {
    key: "travelers",
    icon: "👥",
    value: `${travelersCount}`,
  },
  {
    key: "chal",
    icon: "☀️",
    value: heatTemp != null ? formatTemperature(heatTemp) : null,
  },
  {
    key: "mer",
    icon: "🌊",
    value: merTemp != null ? formatTemperature(merTemp) : null,
  },
  {
    key: "inso",
    icon: "🛁",
    value: insoTemp != null ? formatTemperature(insoTemp) : null,
  },
].filter((item) => item.value != null);

const periodCardInfo = getPeriodCardInfo(selectedMonth, exactDates, res);

  const budgetPressureCount = Number(res.budgetPressureCount ?? 0);
  const heatPressureCount = Number(res.heatPressureCount ?? 0);

  const budgetMessage = getBudgetPressureMessage(budgetPressureCount);
  const heatMessage = getHeatPressureMessage(heatPressureCount);

  const hasTopInfoMessage = !!budgetMessage || !!heatMessage;

  const shouldShowMonthInTop10 =
    !exactDates?.from &&
    !exactDates?.to &&
    (!selectedMonth || selectedMonth === "best");

  const popupDiagnostic =
    infoPopup === "budget"
      ? { mainReason: "budget" }
      : {
          mainReason: "temperature",
          hasTemperatureIssue: true,
          temperatureBlockers: [{ key: "chal" }],
        };

const openBudgetPopup = () => {
  setPopupBudgetTotal(currentBudget);
  setPopupBudgetMaxSelected(userAnswers?.budgetMaxSelected ?? false);
  setInfoPopup("budget");
};

const handleBudgetPopupSliderChange = (sliderValue) => {
  const nextBudget = sliderToBudget(sliderValue, maxBudget);

  setPopupBudgetTotal(nextBudget);
  setPopupBudgetMaxSelected(false);
};

const handleBudgetPopupMax = () => {
  setPopupBudgetTotal(maxBudget);
  setPopupBudgetMaxSelected(true);
};

const handleBudgetPopupRelaunch = () => {
  setPopupLoading(true);

  setTimeout(() => {
    setSelectedIndex(0);
    setShowTop10(false);
    setShowLegacyResults(false);

    onRelaunchWithMaxBudget?.({
      budgetTotal: popupBudgetMaxSelected ? maxBudget : popupBudgetTotal,
      budgetMaxSelected: popupBudgetMaxSelected,
      budgetManuallyEdited: true,
    });

    setPopupLoading(false);
    setInfoPopup(null);
  }, 450);
};

const handleHeatPopupRelaunch = () => {
  setPopupLoading(true);

  setTimeout(() => {
    setSelectedIndex(0);
    setShowTop10(false);
    setShowLegacyResults(false);

    onRelaunchWithoutHeat?.();

    setPopupLoading(false);
    setInfoPopup(null);
  }, 450);
};
const cleanBudgetAdvice = getCleanBudgetAdvice(userAnswers);
  return (
    <div className="new-results-screen">
{hasTopInfoMessage && (
  <section className="new-results-top-block">
    {budgetMessage && (
      <div className="new-results-info-line budget-info-line">
        <span>{budgetMessage}</span>

        <button
          type="button"
          className="new-results-info-btn"
          onClick={openBudgetPopup}
        >
          Plus d&apos;info
        </button>
      </div>
    )}

    {heatMessage && (
      <div className="new-results-info-line heat-info-line">
        <span>{heatMessage}</span>

        <button
          type="button"
          className="new-results-info-btn"
          onClick={() => setInfoPopup("heat")}
        >
          Plus d&apos;info
        </button>
      </div>
    )}
  </section>
)}
      <section className="new-main-destination-card">
        <div className="new-result-rank-pill">TOP {selectedIndex + 1}</div>

        <h2>{res.nom}</h2>


<div className="new-result-highlight-grid has-period">
{periodCardInfo && (
  <div
    className={`new-result-highlight period-highlight ${
      periodCardInfo.isBestMonth ? "best-month-highlight" : ""
    } ${periodCardInfo.isExactDates ? "exact-dates-highlight" : ""}`}
  >
    <span>{periodCardInfo.label}</span>
    <strong>{periodCardInfo.value}</strong>
  </div>
)}

  <div className="new-result-highlight">
    <span>💰 Budget estimé</span>
    <strong>{budgetBreakdown.total.toLocaleString("fr-FR")} €</strong>
  </div>
</div>

{miniInfoCards.length > 0 && (
  <div className={`new-result-mini-grid count-${miniInfoCards.length}`}>
    {miniInfoCards.map((item) => (
      <div key={item.key} className="new-result-mini-card">
        <span className="new-result-mini-icon">{item.icon}</span>
        <strong>{item.value}</strong>
      </div>
    ))}
  </div>
)}

        {visibleComments.length > 0 && (
          <div className="new-result-comments">
            {visibleComments.map(({ key, label, icon, comment }) => (
              <p key={key}>
                <strong>
                  {icon} {label}
                </strong>{" "}
                : {comment}
              </p>
            ))}
          </div>
        )}
      </section>

{!showTop10 && !infoPopup && (
  <div className="app-actions grid-4 results-actions sticky-bottom">
    <button type="button" className="app-btn back" onClick={onBack}>
      BACK
    </button>

    <button
      type="button"
      className="app-btn dark"
      onClick={() => setShowLegacyResults(true)}
    >
      Rejouer
    </button>

<button
  type="button"
  className="app-btn dark two-lines"
  onClick={() => setShowTop10(true)}
>
  <span>Voir mon</span>
  <span>TOP {topResultsCount}</span>
</button>

 <button
  type="button"
  className="app-btn gold two-lines main"
  onClick={() => {
    const hasExactDates = exactDates?.from && exactDates?.to;

    const finalTravelPeriodLabel = hasExactDates
      ? ""
      : selectedMonth === "best" && res.bestMonth
      ? formatMonth(res.bestMonth)
      : selectedMonth && selectedMonth !== "best"
      ? formatMonth(selectedMonth)
      : "";

    const finalTravelPeriodType = hasExactDates
      ? "exact"
      : selectedMonth === "best"
      ? "best"
      : "fixed";

    onPlanTrip?.({
      destination: res,
      budgetBreakdown,
      destinationRank: selectedIndex + 1,

      selectedMonth,
      exactDates,

      travelPeriodLabel: finalTravelPeriodLabel,
      travelPeriodType: finalTravelPeriodType,
    });
  }}
>
  <span>Planifie-moi</span>
  <span>un voyage</span>
</button>
  </div>
)}
      {showTop10 && (
        <div className="new-results-modal-backdrop">
          <div className="new-results-modal top10-modal">
            <h2>Ton TOP {topResultsCount}</h2>

            <div className="top10-list">
              {topResults.map((item, index) => {
                const itemBudgetBreakdown = getDisplayBudgetBreakdown(
                  item,
                  userAnswers,
                  selectedMonth
                );

                return (
                  <button
                    key={item.id ?? item.nom ?? index}
                    type="button"
                    className={`top10-item ${
                      selectedIndex === index ? "active" : ""
                    }`}
 onClick={() => {
  const realIndex = results.findIndex((result) => result === item);

  if (realIndex !== -1) {
    setSelectedIndex(realIndex);
  }

  setShowTop10(false);
}}
                  >
                    <div>
                      <strong>
                        {index + 1}. {item.nom}
                      </strong>

                      {shouldShowMonthInTop10 && item.bestMonth && (
                        <span>{formatMonth(item.bestMonth)}</span>
                      )}
                    </div>

                    <strong>
                      {itemBudgetBreakdown.total.toLocaleString("fr-FR")} €
                    </strong>
                  </button>
                );
              })}
            </div>

<div className="app-actions">
  <button
    type="button"
    className="app-btn back compact"
    onClick={() => setShowTop10(false)}
  >
    BACK
  </button>
</div>
          </div>
        </div>
      )}

{infoPopup === "budget" && (
  <div className="new-results-modal-backdrop">
    <div className="new-results-modal">
      <h2>Budget trop serré</h2>

      {popupLoading ? (
        <div className="date-loading-box">
          <div className="date-hourglass">⏳</div>

          <div className="date-loading-text">
            <strong>Calcul de ta destination...</strong>
          </div>
        </div>
      ) : (
        <>
{cleanBudgetAdvice.length > 0 && (
  <div className="no-results-advice">
    <p>Pour débloquer plus de destinations, tu peux essayer de :</p>

    <ul>
      {cleanBudgetAdvice.map((advice) => (
        <li key={advice}>{advice}</li>
      ))}
    </ul>
  </div>
)}

<div className="popup-budget-block">
  <p className="popup-budget-title">
    Augmenter ton budget total :
  </p>

            <div className="popup-budget-value">
              {popupBudgetMaxSelected
                ? `> ${maxBudget.toLocaleString("fr-FR")} €`
                : `${popupBudgetTotal.toLocaleString("fr-FR")} €`}
            </div>

            <input
              className="popup-budget-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={
                popupBudgetMaxSelected
                  ? 100
                  : budgetToSlider(popupBudgetTotal, maxBudget)
              }
              onChange={(e) =>
                handleBudgetPopupSliderChange(e.target.value)
              }
            />

            <button
              type="button"
              className={`popup-max-btn ${
                popupBudgetMaxSelected ? "active" : ""
              }`}
              onClick={handleBudgetPopupMax}
            >
              MAX
            </button>
          </div>

<div className="app-actions popup-actions">
  <button
    type="button"
    className="app-btn back popup-back-btn"
    onClick={() => setInfoPopup(null)}
  >
    BACK
  </button>

  <button
    type="button"
    className="app-btn relaunch two-lines"
    onClick={handleBudgetPopupRelaunch}
  >
    <span>Relancer avec</span>
    <span>ce budget</span>
      {shouldApplyStrictMinimum && (
    <strong>et en strict minimum</strong>
  )}
  </button>
</div>
        </>
      )}
    </div>
  </div>
)}

{infoPopup === "heat" && (
  <div className="new-results-modal-backdrop">
    <div className="new-results-modal">
      {popupLoading ? (
        <div className="date-loading-box">
          <div className="date-hourglass">⏳</div>

          <div className="date-loading-text">
            <strong>Calcul de ta destination...</strong>
          </div>
        </div>
      ) : (
        <>
          <h2>Température trop restrictive</h2>

          <p className="heat-popup-message">
            {getHeatPopupMessage(userAnswers, selectedMonth, exactDates)}
          </p>
<div className="app-actions popup-actions">
  <button
    type="button"
    className="app-btn back popup-back-btn"
    onClick={() => setInfoPopup(null)}
  >
    BACK
  </button>

  <button
    type="button"
    className="app-btn relaunch"
    onClick={handleHeatPopupRelaunch}
  >
    OUI
  </button>
</div>
        </>
      )}
    </div>
  </div>
)}
    </div>
  );
}
export default ResultsScreen;