import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MONTH_LABELS = {
  janvier: "Janvier",
  fevrier: "Février",
  février: "Février",
  mars: "Mars",
  avril: "Avril",
  mai: "Mai",
  juin: "Juin",
  juillet: "Juillet",
  aout: "Août",
  août: "Août",
  septembre: "Septembre",
  octobre: "Octobre",
  novembre: "Novembre",
  decembre: "Décembre",
  décembre: "Décembre",
  best: "Meilleur mois demandé automatiquement",
};

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

const AVENTURE_LABELS = {
  7: "Full aventure",
  6: "Aventure",
  5: "Plus aventure",
  4: "Mixte",
  3: "Plus farniente",
  2: "Farniente",
  1: "Full farniente",
  0: "Aucun des deux",
};

const VILLE_LABELS = {
  7: "Full ville",
  6: "Ville",
  5: "Plus ville",
  4: "Mixte",
  3: "Plus activité",
  2: "Activité",
  1: "Full activité",
  0: "Aucun des deux",
};

const THEMES_GROUPS = [
  {
    title: "Thèmes 1",
    items: [
      { key: "trek", label: "Trek", max: 5 },
      { key: "rando", label: "Randonnée", max: 5 },
      { key: "faune", label: "Faune", max: 5 },
      { key: "bain", label: "Baignade", max: 5 },
      { key: "inso", label: "Baignade insolite", max: 5 },
      { key: "mer", label: "Baignade mer", max: 5 },
      { key: "bala", label: "Balade", max: 5 },
      { key: "nature", label: "Nature", max: 5 },
      { key: "infra", label: "All Inclusive", max: 5 },
      { key: "fete", label: "Animation, Club, Bar", max: 5 },
    ],
  },
  {
    title: "Thèmes 2 — Ville",
    items: [
      { key: "histo", label: "Monument historique", max: 3 },
      { key: "reli", label: "Monument religieux", max: 3 },
      { key: "musees", label: "Musée", max: 3 },
      { key: "arch", label: "Site archéologique", max: 3 },
      { key: "monu", label: "Monument", max: 3 },
      { key: "shop", label: "Shopping", max: 3 },
      { key: "moder", label: "Ville moderne", max: 3 },
      { key: "spec", label: "Spectacle", max: 3 },
      { key: "noctu", label: "Nocturne", max: 3 },
      { key: "quar", label: "Quartier atypique", max: 3 },
      { key: "streetart", label: "Street Art", max: 3 },
      { key: "soin", label: "Bien-être", max: 3 },
      { key: "massage", label: "Massage", max: 3 },
      { key: "carna", label: "Fête locale", max: 3 },
      { key: "festi", label: "Festival de musique", max: 3 },
      { key: "attrac", label: "Parc d’attractions", max: 3 },
      { key: "attracsens", label: "Parc à sensations", max: 3 },
      { key: "zoo", label: "Zoo", max: 3 },
      { key: "aqua", label: "Aquarium", max: 3 },
    ],
  },
  {
    title: "Thèmes 2 — Activités",
    items: [
      { key: "snork", label: "Snorkeling", max: 3 },
      { key: "plongee", label: "Plongée", max: 3 },
      { key: "visite", label: "Visite", max: 3 },
      { key: "planta", label: "Plantation", max: 3 },
      { key: "velo", label: "Vélo", max: 3 },
      { key: "cyclisme", label: "Cyclisme", max: 3 },
      { key: "canoe", label: "Canoë / Kayak", max: 3 },
      { key: "rafting", label: "Rafting", max: 3 },
      { key: "canyon", label: "Canyoning", max: 3 },
      { key: "accro", label: "Accrobranche", max: 3 },
      { key: "viaferrata", label: "Via Ferrata", max: 3 },
      { key: "motor", label: "Quad / Buggy", max: 3 },
      { key: "jetski", label: "Jet-ski", max: 3 },
      { key: "bateau", label: "Bateau", max: 3 },
      { key: "surf", label: "Surf", max: 3 },
      { key: "grot", label: "Grottes", max: 3 },
      { key: "speleo", label: "Spéléologie", max: 3 },
      { key: "aerien", label: "Évasion aérienne", max: 3 },
      { key: "extreme", label: "Frissons aériens", max: 3 },
      { key: "esca", label: "Escalade", max: 3 },
    ],
  },
  {
    title: "Thèmes 3 — Nourriture",
    items: [
      { key: "streetfood", label: "Street Food", max: 3 },
      { key: "stvege", label: "Street Food végé", max: 3 },
      { key: "cuisineloc", label: "Cuisine locale", max: 3 },
      { key: "cuivege", label: "Cuisine locale végé", max: 3 },
      { key: "gastro", label: "Restaurant gastronomique", max: 3 },
      { key: "gasvege", label: "Gastronomique végé", max: 3 },
      { key: "alcool", label: "Alcool local / bière", max: 3 },
      { key: "vin", label: "Vin", max: 3 },
      { key: "doux", label: "Doux", max: 3 },
      { key: "epice", label: "Pimenté", max: 3 },
      { key: "atelcul", label: "Atelier de cuisine", max: 3 },
    ],
  },
  {
    title: "Thèmes 3 — Logement",
    items: [
      { key: "confort", label: "Confort", max: 3 },
      { key: "luxe", label: "Luxe", max: 3 },
      { key: "popu", label: "Accueil population locale", max: 3 },
      { key: "camp", label: "Camping", max: 3 },
      { key: "sauvage", label: "Camping sauvage", max: 3 },
      { key: "jacuz", label: "Jacuzzi", max: 3 },
      { key: "pisci", label: "Piscine", max: 3 },
      { key: "roman", label: "Romantique", max: 3 },
      { key: "coquin", label: "Coquin", max: 3 },
      { key: "atyp", label: "Atypique", max: 3 },
      { key: "eco", label: "Eco-tourisme", max: 3 },
    ],
  },
];

const COMMENT_CONFIG = [
  { key: "trek", label: "Trek", icon: "🧗" },
  { key: "rando", label: "Randonnée", icon: "🥾" },
  { key: "faune", label: "Faune", icon: "🦜" },
  { key: "inso", label: "Baignade insolite", icon: "🛁" },
  { key: "bain", label: "Baignade", icon: "🏄" },
  { key: "mer", label: "Baignade mer", icon: "🌊" },
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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

function normalizeMonthKey(value) {
  if (!value) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getParisOrderId() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
  }).formatToParts(now);

  const get = (type) => parts.find((part) => part.type === type)?.value || "00";

  return `TP-${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}${get("second")}-${get("fractionalSecond")}`;
}

function formatMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "Non renseigné";
  return `${Math.round(number).toLocaleString("fr-FR")} €`;
}

function formatNumber(value, suffix = "") {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return `${number.toLocaleString("fr-FR")}${suffix}`;
}

function getDestinationName(request) {
  if (request?.mode === "customDestination" && request?.customDestination) {
    return request.customDestination;
  }

  return (
    request?.destination?.nom ||
    request?.destination?.name ||
    "Destination non renseignée"
  );
}

function getDestinationRankLabel(rank) {
  const number = Number(rank);

  if (!Number.isFinite(number) || number <= 0) return "";
  if (number === 1) return "1ère destination proposée par l’application";

  return `${number}e destination proposée par l’application`;
}

function getContactModeLabel(mode) {
  const labels = {
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    email: "Email",
  };

  return labels[mode] || mode || "";
}

function compactRow(label, value) {
  if (!hasValue(value)) return "";

  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return `
    <tr>
      <td class="mini-label">${escapeHtml(label)}</td>
      <td class="mini-value">${escapeHtml(displayValue)}</td>
    </tr>
  `;
}

function formatContactTable(contact = {}) {
  const rows = [
    compactRow("Mode de contact", getContactModeLabel(contact.contactMode)),
    compactRow("Prénom", contact.firstName),
    compactRow("Nom", contact.lastName),
    compactRow("Téléphone", contact.phone),
    compactRow("WhatsApp", contact.whatsapp),
    compactRow("Email", contact.email),
    compactRow("Jours préférés", contact.preferredDays),
    compactRow("Plage horaire préférée", contact.preferredTimeSlot),
    compactRow("Commentaire", contact.comment),
  ].join("");

  if (!rows.trim()) return "";

  return `
    <h2 class="section-title">Coordonnées client</h2>
    <table class="mini-table">
      ${rows}
    </table>
  `;
}

function getBudgetValue(budgetBreakdown, keys = []) {
  for (const key of keys) {
    const value = budgetBreakdown?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function getBudgetLevelLabel(value) {
  const labels = {
    1: "Strict minimum",
    2: "Économe",
    3: "Équilibré",
    4: "Confort",
    5: "Plaisir",
  };

  return labels[Number(value)] || "";
}

function getMonthLabel(monthKey) {
  const normalized = normalizeMonthKey(monthKey);
  return MONTH_LABELS[monthKey] || MONTH_LABELS[normalized] || monthKey || "";
}

function formatDateFr(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("fr-FR");
}

function getTravelPeriodLabel(userAnswers = {}) {
  const exactDates = userAnswers.exactDates;

  if (exactDates?.from || exactDates?.to) {
    return `${formatDateFr(exactDates.from) || "?"} → ${
      formatDateFr(exactDates.to) || "?"
    }`;
  }

  if (userAnswers.selectedMonth === "best") {
    return "Meilleur mois demandé automatiquement";
  }

  if (userAnswers.selectedMonth) {
    return getMonthLabel(userAnswers.selectedMonth);
  }

  return "";
}

function getMonthKeyForDestinationInfo(userAnswers = {}, request = {}) {
  if (userAnswers.selectedMonth && userAnswers.selectedMonth !== "best") {
    return normalizeMonthKey(userAnswers.selectedMonth);
  }

  if (userAnswers.exactDates?.from) {
    const date = new Date(userAnswers.exactDates.from);

    if (!Number.isNaN(date.getTime())) {
      return MONTH_KEYS[date.getMonth()];
    }
  }

  return normalizeMonthKey(
    request?.monthKey ||
      request?.bestMonthKey ||
      request?.destination?.bestMonthKey ||
      request?.destination?.bestMonth ||
      ""
  );
}

function formatDestinationBlock(request, destinationName) {
  if (request?.mode === "customDestination") {
    return `
      <div class="destination-block">
        <div class="destination-name">${escapeHtml(destinationName)}</div>
        <div class="destination-meta">Destination renseignée manuellement par l’utilisateur</div>
      </div>
    `;
  }

  const rankLabel = getDestinationRankLabel(request?.destinationRank);

  return `
    <div class="destination-block">
      <div class="destination-name">${escapeHtml(destinationName)}</div>
      ${
        rankLabel
          ? `<div class="destination-meta">${escapeHtml(rankLabel)}</div>`
          : ""
      }
    </div>
  `;
}

function formatRelaunchInfo(userAnswers = {}) {
  const rows = [];

  if (userAnswers.usedFinalBudgetRelaunch === true) {
    rows.push(["Relance budget", "Oui"]);

    if (hasValue(userAnswers.initialBudgetBeforeRelaunch)) {
      rows.push([
        "Budget initialement renseigné",
        formatMoney(userAnswers.initialBudgetBeforeRelaunch),
      ]);
    }
  }

  if (userAnswers.usedStrictMinBudgetRelaunch === true) {
    const initialLevels = [
      userAnswers.initialBudgetLogementBeforeRelaunch
        ? `Logement : ${getBudgetLevelLabel(
            userAnswers.initialBudgetLogementBeforeRelaunch
          )}`
        : null,

      userAnswers.initialBudgetFoodBeforeRelaunch
        ? `Nourriture : ${getBudgetLevelLabel(
            userAnswers.initialBudgetFoodBeforeRelaunch
          )}`
        : null,

      userAnswers.initialBudgetActiviteBeforeRelaunch
        ? `Activités : ${getBudgetLevelLabel(
            userAnswers.initialBudgetActiviteBeforeRelaunch
          )}`
        : null,
    ].filter(Boolean);

    if (initialLevels.length) {
      rows.push([
        "Critères budget initialement renseignés",
        initialLevels.join(" — "),
      ]);
    }

    rows.push([
      "Relance strict minimum",
      "Logement, nourriture et activités passés en strict minimum",
    ]);
  }

  if (userAnswers.usedFinalHeatRelaunch === true) {
    rows.push(["Relance chaleur", "Oui"]);

    const initialHeatRange = formatRange(
      userAnswers.initialChalMinBeforeRelaunch,
      userAnswers.initialChalMaxBeforeRelaunch
    );

    if (initialHeatRange) {
      rows.push([
        "Intervalle chaleur initialement sélectionné",
        initialHeatRange,
      ]);
    }
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Relances effectuées</h2>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}


function formatSummaryTable(userAnswers = {}, budgetBreakdown = {}, request = {}, destinationName = "") {
  const estimatedBudget = getBudgetValue(budgetBreakdown, ["total"]);
  const periodLabel = getTravelPeriodLabel(userAnswers);
  const rankLabel = getDestinationRankLabel(request?.destinationRank);

  const rows = [
    ["Destination", destinationName],
    rankLabel ? ["Classement", rankLabel] : null,
    ["Voyageurs", userAnswers.travelers || ""],
    ["Durée", userAnswers.tripDays ? `${userAnswers.tripDays} jours` : ""],
    ["Période", periodLabel],
    ["Budget renseigné", formatMoney(userAnswers.budgetTotal)],
    ["Budget estimé", formatMoney(estimatedBudget)],
    userAnswers.usedFinalBudgetRelaunch === true
      ? ["Relance budget", "Utilisée depuis l’écran résultat"]
      : null,
  ].filter(Boolean);

  return `
    <div class="summary-card">
      <h2 class="summary-card-title">Résumé du voyage</h2>

      <table class="mini-table summary-table">
        ${rows.map(([label, value]) => compactRow(label, value)).join("")}
      </table>
    </div>
  `;
}

function formatDuelPreferences(userAnswers = {}) {
  const rows = [];

  const aventureValue = Number(userAnswers.aventure);
  const villeValue = Number(userAnswers.ville);

  if (Number.isFinite(aventureValue)) {
    rows.push([
      "Duel Aventure / Farniente",
      AVENTURE_LABELS[aventureValue] ?? aventureValue,
    ]);
  }

  if (Number.isFinite(villeValue)) {
    rows.push([
      "Duel Ville / Activité",
      VILLE_LABELS[villeValue] ?? villeValue,
    ]);
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Profil général</h2>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}

function formatBudgetPreferences(userAnswers = {}) {
  const rows = [
    ["Logement", getBudgetLevelLabel(userAnswers?.budgetLogement)],
    ["Nourriture", getBudgetLevelLabel(userAnswers?.budgetFood)],
    ["Activités", getBudgetLevelLabel(userAnswers?.budgetActivite)],
  ].filter(([, value]) => value);

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Niveaux de budget choisis</h2>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}

function getYesNoIndifferentLabel(value) {
  const labels = {
    oui: "Oui",
    non: "Non",
    indifferent: "Indifférent",
  };

  return labels[value] || value || "";
}

function isDefaultTransportModes(modes = {}) {
  return (
    modes.indifferent === true &&
    modes.voiture === false &&
    modes.commun === false &&
    modes.taxi === false &&
    modes.vtc === false
  );
}

function getSelectedTransportModes(userAnswers = {}) {
  const modes = userAnswers.transportModes || {};
  const labels = [];

  if (modes.voiture) {
    labels.push(
      userAnswers?.avion === "non"
        ? "Voiture personnelle"
        : "Voiture de location"
    );
  }

  if (modes.commun) labels.push("Transports en commun");
  if (modes.taxi) labels.push("Taxi");
  if (modes.vtc) labels.push("VTC");

  return labels;
}

function getSelectedPapers(userAnswers = {}) {
  const papiers = userAnswers.papiers || {};
  const labels = [];

  if (papiers.carte) labels.push("Carte d’identité");
  if (papiers.passeport) labels.push("Passeport");
  if (papiers.visa) labels.push("Visa");
  if (papiers.evisa) labels.push("E-visa");
  if (papiers.complex) labels.push("Complexité administrative");

  return labels;
}

function formatTransportAnswers(userAnswers = {}) {
  const rows = [];

  if (userAnswers.avion && userAnswers.avion !== "indifferent") {
    rows.push(["Avion", getYesNoIndifferentLabel(userAnswers.avion)]);
  }

  if (userAnswers.hmaxEnabled) {
    rows.push(["Limiter la durée du trajet", `${userAnswers.hmax} h maximum`]);
  }

  if (userAnswers.transportEnabled === false) {
    rows.push(["Transport sur place", "Non"]);
  }

  if (
    userAnswers.transportEnabled !== false &&
    userAnswers.transportModes &&
    !isDefaultTransportModes(userAnswers.transportModes)
  ) {
    const selectedModes = getSelectedTransportModes(userAnswers);

    if (selectedModes.length) {
      rows.push(["Transports sur place sélectionnés", selectedModes.join(", ")]);
    }
  }

  if (userAnswers.fran && userAnswers.fran !== "indifferent") {
    rows.push([
      "Destination francophone",
      getYesNoIndifferentLabel(userAnswers.fran),
    ]);
  }

  if (userAnswers.papiersEnabled) {
    const selectedPapers = getSelectedPapers(userAnswers);

    rows.push([
      "Exigence administrative",
      selectedPapers.length ? selectedPapers.join(", ") : "Oui",
    ]);
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Préférences transport et administratif</h2>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}

function formatRange(min, max, unit = "°C") {
  const hasMin = min !== null && min !== undefined && min !== "";
  const hasMax = max !== null && max !== undefined && max !== "";

  if (!hasMin && !hasMax) return "";
  if (hasMin && hasMax) return `${min}${unit} à ${max}${unit}`;
  if (hasMin) return `${min}${unit} ou plus`;

  return `jusqu’à ${max}${unit}`;
}

function getReliefLabels(userAnswers = {}) {
  const relief = userAnswers.relief || {};
  const labels = {
    indifferent: "Indifférent",
    vegetalise: "Végétalisé",
    alpin: "Alpin",
    cotier: "Côtier",
    volcanique: "Volcanique",
    tropical: "Tropical",
    desertique: "Désertique",
    foret: "Forêt",
  };

  if (typeof userAnswers.relief === "string") {
    const value = userAnswers.relief;
    if (!value || value === "indifferent") return [];
    return [labels[value] || value];
  }

  return Object.entries(labels)
    .filter(([key]) => key !== "indifferent" && relief[key] === true)
    .map(([, label]) => label);
}

function formatClimateSecurityRelief(userAnswers = {}) {
  const rows = [];
  const reliefLabels = getReliefLabels(userAnswers);

  if (reliefLabels.length) {
    rows.push(["Relief souhaité", reliefLabels.join(", ")]);
  }

  if (Number(userAnswers.chal) > 0) {
    const heatRange = formatRange(userAnswers.chalMin, userAnswers.chalMax);

    rows.push([
      "Chaleur",
      heatRange
        ? `${userAnswers.chal}/5 — ${heatRange}`
        : `${userAnswers.chal}/5`,
    ]);
  }

  const waterRange = formatRange(userAnswers.teauMin, userAnswers.teauMax);

  const selectedWaterThemes = [];

  if (Number(userAnswers.mer) > 0) {
    selectedWaterThemes.push(`Baignade mer ${userAnswers.mer}/5`);
  }

  if (Number(userAnswers.bain) > 0) {
    selectedWaterThemes.push(`Baignade ${userAnswers.bain}/5`);
  }

  if (Number(userAnswers.inso) > 0) {
    selectedWaterThemes.push(`Baignade insolite ${userAnswers.inso}/5`);
  }

  if (waterRange && selectedWaterThemes.length) {
    rows.push([
      "Température de l’eau souhaitée",
      `${waterRange} — ${selectedWaterThemes.join(", ")}`,
    ]);
  }

  if (Number(userAnswers.secu) > 0) {
    rows.push(["Sécurité", `${userAnswers.secu}/5`]);
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Températures, sécurité et relief</h2>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}

function formatThemeGroup(group, userAnswers = {}) {
  const rows = group.items
    .map((theme) => {
      const score = Number(userAnswers?.[theme.key]);

      if (!Number.isFinite(score) || score <= 0) return "";

      return compactRow(theme.label, `${score}/${theme.max}`);
    })
    .filter(Boolean)
    .join("");

  if (!rows.trim()) return "";

  return `
    <h3 class="subsection-title">${escapeHtml(group.title)}</h3>
    <table class="mini-table">
      ${rows}
    </table>
  `;
}

function formatGroupedThemes(userAnswers = {}) {
  const html = THEMES_GROUPS
    .map((group) => formatThemeGroup(group, userAnswers))
    .join("");

  if (!html.trim()) return "";

  return `
    <h2 class="section-title">Thèmes activés</h2>
    ${html}
  `;
}

function formatBudgetBreakdown(budgetBreakdown = {}) {
  const rows = [
    ["Transport initial", getBudgetValue(budgetBreakdown, ["avion", "initialTransport"])],
    ["Transport local", getBudgetValue(budgetBreakdown, ["transport", "localTransport"])],
    ["Logement", getBudgetValue(budgetBreakdown, ["logement"])],
    ["Nourriture", getBudgetValue(budgetBreakdown, ["bouffe", "food"])],
    ["Activités", getBudgetValue(budgetBreakdown, ["activites", "activities"])],
    ["Rémunération Travel Planner", getBudgetValue(budgetBreakdown, ["travelPlanner", "planner"])],
    ["Total estimé", getBudgetValue(budgetBreakdown, ["total"])],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Budget estimé par l'application</h2>
    <table class="mini-table">
      ${rows
        .map(
          ([label, value]) => `
            <tr>
              <td class="mini-label">${escapeHtml(label)}</td>
              <td class="mini-value align-right">${escapeHtml(formatMoney(value))}</td>
            </tr>
          `
        )
        .join("")}
    </table>
  `;
}

function getDestinationForComments(request = {}) {
  return request?.destination || request?.result?.destination || request?.result || {};
}

function getCommentFromDestination(destination = {}, key) {
  const possibleKeys = [
    `${key}c`,
    `${key}C`,
    `${key}_comment`,
    `${key}Comment`,
    `${key}comment`,
    `${key}Commentaires`,
    `${key}commentaire`,
  ];

  for (const possibleKey of possibleKeys) {
    const value = destination[possibleKey];

    if (hasValue(value)) {
      return value;
    }
  }

  return "";
}

function readMonthlyValue(destination = {}, possibleBases = [], monthKey) {
  if (!destination || !monthKey) return null;

  const normalizedMonth = normalizeMonthKey(monthKey);
  const capitalizedMonth =
    normalizedMonth.charAt(0).toUpperCase() + normalizedMonth.slice(1);

  for (const base of possibleBases) {
    const possibleKeys = [
      `${base}${normalizedMonth}`,
      `${base}_${normalizedMonth}`,
      `${base}.${normalizedMonth}`,
      `${base}${capitalizedMonth}`,
      `${base}_${capitalizedMonth}`,
    ];

    if (
      destination[base] &&
      typeof destination[base] === "object" &&
      destination[base][normalizedMonth] !== undefined
    ) {
      return destination[base][normalizedMonth];
    }

    for (const key of possibleKeys) {
      if (destination[key] !== undefined) {
        return destination[key];
      }
    }
  }

  return null;
}

function formatDestinationTemperatures({ request, userAnswers }) {
  if (request?.mode === "customDestination") return "";

  const destination = request?.destination || {};
  const monthKey = getMonthKeyForDestinationInfo(userAnswers, request);
  const monthLabel = getMonthLabel(monthKey);

  const rows = [];

  const airTemp = readMonthlyValue(
    destination,
    [
      "temp",
      "temperature",
      "temperatureAir",
      "tempAir",
      "tempmoy",
      "temperatureMoy",
      "chaleur",
      "chal",
      "t",
    ],
    monthKey
  );

  if (hasValue(airTemp)) {
    rows.push([
      `Température destination ${monthLabel ? `(${monthLabel})` : ""}`,
      formatNumber(airTemp, "°C"),
    ]);
  }

  const hasSeaWaterTheme =
    Number(userAnswers.mer) > 0 || Number(userAnswers.bain) > 0;

  const hasInsoWaterTheme = Number(userAnswers.inso) > 0;

  const merTemp = readMonthlyValue(
    destination,
    [
      "mer",
      "teau",
      "eau",
      "tempMer",
      "temperatureMer",
      "merTemp",
      "tempEauMer",
      "temperatureEauMer",
    ],
    monthKey
  );

  const insoTemp = readMonthlyValue(
    destination,
    [
      "inso",
      "tempInso",
      "temperatureInso",
      "eauInso",
      "tempEauInso",
      "temperatureEauInso",
    ],
    monthKey
  );

  if (hasSeaWaterTheme && hasValue(merTemp)) {
    rows.push([
      `Température de l’eau mer ${monthLabel ? `(${monthLabel})` : ""}`,
      formatNumber(merTemp, "°C"),
    ]);
  }

  if (hasInsoWaterTheme && hasValue(insoTemp)) {
    rows.push([
      `Température de baignade insolite ${
        monthLabel ? `(${monthLabel})` : ""
      }`,
      formatNumber(insoTemp, "°C"),
    ]);
  }

  if (!rows.length) return "";

  return `
    <h3 class="subsection-title">Températures affichées</h3>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}

function formatDisplayedComments({ request, userAnswers }) {
  if (request?.mode === "customDestination") {
    return "";
  }

  const destination = getDestinationForComments(request);
  const temperaturesHtml = formatDestinationTemperatures({ request, userAnswers });

  const rows = COMMENT_CONFIG
    .map((item) => {
      const answerValue = Number(userAnswers?.[item.key]);

      if (!Number.isFinite(answerValue) || answerValue <= 0) return "";

      const comment = getCommentFromDestination(destination, item.key);

      if (!hasValue(comment)) return "";

      return `
        <li>
          <strong>${escapeHtml(item.icon)} ${escapeHtml(item.label)} :</strong>
          ${escapeHtml(comment)}
        </li>
      `;
    })
    .filter(Boolean)
    .join("");

  if (!rows.trim() && !temperaturesHtml.trim()) return "";

  return `
    <h2 class="section-title">Informations affichées à l'utilisateur</h2>
    ${temperaturesHtml}
    ${
      rows.trim()
        ? `
          <ul class="comment-list">
            ${rows}
          </ul>
        `
        : ""
    }
  `;
}

function buildEmailHtml(payload, orderId) {
  const { contact, request } = payload;

  const userAnswers = request?.emailContext?.userAnswers || {};
  const destinationName = getDestinationName(request);
  const budgetBreakdown = request?.budgetBreakdown || {};

  return `
    <div style="font-family:Arial,sans-serif; color:#2f2440; background:#f7f1fb; padding:18px;">
      <style>
        .section-title {
          margin: 18px 0 8px;
          font-size: 16px;
          color: #3b284c;
          border-bottom: 1px solid #eadcf4;
          padding-bottom: 5px;
        }

        .subsection-title {
          margin: 12px 0 5px;
          font-size: 14px;
          color: #6c3b85;
        }

        .destination-block {
          margin: 10px 0 14px;
          padding: 14px;
          border-radius: 14px;
          background: #f9eefc;
        }

        .destination-name {
          font-size: 24px;
          font-weight: 900;
          color: #d94b8c;
        }

        .destination-meta {
          margin-top: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #6c5b75;
        }

        .summary-grid {
          width: 100%;
          border-collapse: separate;
          border-spacing: 6px;
          margin: 6px 0 10px;
        }

        .summary-cell {
          background: #f9eefc;
          border-radius: 12px;
          padding: 9px;
          vertical-align: top;
          width: 20%;
        }

        .summary-label {
          font-size: 11px;
          color: #7a5b8d;
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 17px;
          font-weight: 900;
          color: #2f2440;
        }

        .summary-value.small {
          font-size: 13px;
          line-height: 1.25;
        }

        .mini-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 4px;
        }

        .mini-label {
          width: 42%;
          padding: 6px 7px;
          border-bottom: 1px solid #eee;
          color: #6c5b75;
          font-size: 12px;
        }

        .mini-value {
          padding: 6px 7px;
          border-bottom: 1px solid #eee;
          font-weight: 700;
          font-size: 12px;
        }

        .align-right {
          text-align: right;
        }

        .comment-list {
          margin-top: 6px;
          padding-left: 18px;
        }

        .comment-list li {
          margin-bottom: 5px;
          font-size: 13px;
          line-height: 1.35;
        }
        .summary-card {
  margin: 14px 0 18px;
  padding: 14px;
  border-radius: 16px;
  background: #f9eefc;
  border: 1px solid #eadcf4;
}

.summary-card-title {
  margin: 0 0 10px;
  font-size: 19px;
  color: #8d45b5;
}

.summary-card .mini-table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.summary-card .mini-label {
  font-size: 13px;
  font-weight: 700;
  color: #6c3b85;
}

.summary-card .mini-value {
  font-size: 13px;
  font-weight: 800;
  color: #2f2440;
}  
      </style>

      <div style="max-width:760px; margin:0 auto; background:white; border-radius:18px; padding:20px;">
        <h1 style="margin:0 0 12px; color:#8d45b5; font-size:22px;">
          Nouvelle demande Travel Planner — ${escapeHtml(orderId)}
        </h1>

        ${formatContactTable(contact)}
        ${formatSummaryTable(userAnswers, budgetBreakdown, request, destinationName)}
        ${formatRelaunchInfo(userAnswers)}
        ${formatDuelPreferences(userAnswers)}
        ${formatBudgetPreferences(userAnswers)}
        ${formatTransportAnswers(userAnswers)}
        ${formatClimateSecurityRelief(userAnswers)}
        ${formatGroupedThemes(userAnswers)}
        ${formatBudgetBreakdown(budgetBreakdown)}
        ${formatDisplayedComments({ request, userAnswers })}
      </div>
    </div>
  `;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      success: true,
      message: "API contact Vercel OK",
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
      hasMailFrom: Boolean(process.env.MAIL_FROM),
      hasMailTo: Boolean(process.env.MAIL_TO),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Méthode non autorisée.",
    });
  }

  try {
    const payload = req.body;

    if (!payload?.contact || !payload?.request) {
      return res.status(400).json({
        message: "Données invalides.",
      });
    }

    const orderId = getParisOrderId();
    const destinationName = getDestinationName(payload.request);

    const subject = `${orderId} — Nouvelle demande Travel Planner — ${destinationName}`;

    const result = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject,
      html: buildEmailHtml(payload, orderId),
    });

    if (result?.error) {
      throw new Error(
        result.error?.message || "Erreur Resend pendant l'envoi de l'email."
      );
    }

    return res.status(200).json({
      success: true,
      orderId,
      emailId: result?.data?.id,
    });
  } catch (error) {
    console.error("ERREUR DETAILLEE /api/contact :", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause,
    });

    return res.status(500).json({
      message:
        error?.message || "Erreur serveur pendant l'envoi de la demande.",
      name: error?.name || "UnknownError",
    });
  }
}