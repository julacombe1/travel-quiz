import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getContactModeLabel(mode) {
  const labels = {
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    email: "Email",
  };

  return labels[mode] || mode || "";
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  return true;
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


function formatBudgetBreakdown(budgetBreakdown) {
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
    <h2>Budget estimé par l'application</h2>

    <table style="width:100%; border-collapse:collapse;">
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td style="padding:9px 8px; border-bottom:1px solid #eee;">
                  ${escapeHtml(label)}
                </td>
                <td style="padding:9px 8px; border-bottom:1px solid #eee; text-align:right;">
                  <strong>${escapeHtml(formatMoney(value))}</strong>
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}
function infoLine(label, value) {
  if (!hasValue(value)) return "";

  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  return `<p><strong>${escapeHtml(label)} :</strong> ${escapeHtml(displayValue)}</p>`;
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

function formatBudgetPreferences(userAnswers) {
  const rows = [
    ["Logement", getBudgetLevelLabel(userAnswers?.budgetLogement)],
    ["Nourriture", getBudgetLevelLabel(userAnswers?.budgetFood)],
    ["Activités", getBudgetLevelLabel(userAnswers?.budgetActivite)],
  ].filter(([, value]) => value);

  if (!rows.length) return "";

  return `
    <h2>Niveaux de budget choisis</h2>
    <ul>
      ${rows
        .map(
          ([label, value]) =>
            `<li><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value)}</li>`
        )
        .join("")}
    </ul>
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

function getSelectedTransportModes(userAnswers) {
  const modes = userAnswers?.transportModes || {};
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

function getSelectedPapers(userAnswers) {
  const papiers = userAnswers?.papiers || {};
  const labels = [];

  if (papiers.carte) labels.push("Carte d’identité");
  if (papiers.passeport) labels.push("Passeport");
  if (papiers.visa) labels.push("Visa");
  if (papiers.evisa) labels.push("E-visa");
  if (papiers.complex) labels.push("Complexité administrative");

  return labels;
}

function formatTransportAnswers(userAnswers) {
  const rows = [];

  if (userAnswers?.avion && userAnswers.avion !== "indifferent") {
    rows.push([
      "Avion",
      getYesNoIndifferentLabel(userAnswers.avion),
    ]);
  }

  if (userAnswers?.hmaxEnabled) {
    rows.push([
      "Limiter la durée du trajet",
      `${userAnswers.hmax} h maximum`,
    ]);
  }

  if (userAnswers?.transportEnabled === false) {
    rows.push([
      "Transport sur place",
      "Non",
    ]);
  }

  if (
    userAnswers?.transportEnabled !== false &&
    userAnswers?.transportModes &&
    !isDefaultTransportModes(userAnswers.transportModes)
  ) {
    const selectedModes = getSelectedTransportModes(userAnswers);

    if (selectedModes.length) {
      rows.push([
        "Transports sur place sélectionnés",
        selectedModes.join(", "),
      ]);
    }
  }

  if (userAnswers?.fran && userAnswers.fran !== "indifferent") {
    rows.push([
      "Destination francophone",
      getYesNoIndifferentLabel(userAnswers.fran),
    ]);
  }

  if (userAnswers?.papiersEnabled) {
    const selectedPapers = getSelectedPapers(userAnswers);

    rows.push([
      "Exigence administrative",
      selectedPapers.length ? selectedPapers.join(", ") : "Oui",
    ]);
  }

  if (!rows.length) return "";

  return `
    <h2>Préférences transport et administratif</h2>
    <ul>
      ${rows
        .map(
          ([label, value]) =>
            `<li><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value)}</li>`
        )
        .join("")}
    </ul>
  `;
}

function getDestinationRankLabel(rank) {
  const number = Number(rank);

  if (!Number.isFinite(number) || number <= 0) return "";

  if (number === 1) return "1ère destination proposée par l’application";

  return `${number}e destination proposée par l’application`;
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

  return `
    <div class="destination-block">
      <div class="destination-name">${escapeHtml(destinationName)}</div>
      ${
        getDestinationRankLabel(request?.destinationRank)
          ? `<div class="destination-meta">${escapeHtml(
              getDestinationRankLabel(request.destinationRank)
            )}</div>`
          : ""
      }
    </div>
  `;
}

function formatDestinationMeta(request) {
  if (request?.mode === "customDestination") {
    return `
      <p style="margin-top:4px;">
        <strong>Destination renseignée manuellement par l’utilisateur</strong>
      </p>
    `;
  }

  const rankLabel = getDestinationRankLabel(request?.destinationRank);

  if (!rankLabel) return "";

  return `
    <p style="margin-top:4px;">
      <strong>${escapeHtml(rankLabel)}</strong>
    </p>
  `;
}
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

function formatThemeGroup(group, userAnswers = {}) {
  const rows = group.items
    .map((theme) => {
      const score = Number(userAnswers?.[theme.key]);

      if (!Number.isFinite(score) || score <= 0) return null;

      return `
        <tr>
          <td class="mini-label">${escapeHtml(theme.label)}</td>
          <td class="mini-value">${escapeHtml(score)}/${escapeHtml(theme.max)}</td>
        </tr>
      `;
    })
    .filter(Boolean);

  if (!rows.length) return "";

  return `
    <h3 class="subsection-title">${escapeHtml(group.title)}</h3>
    <table class="mini-table">
      ${rows.join("")}
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

function getCommentFromDestination(destination, key) {
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
    const value = destination?.[possibleKey];

    if (hasValue(value)) {
      return value;
    }
  }

  return "";
}

function getDestinationForComments(request) {
  return (
    request?.destination ||
    request?.result?.destination ||
    request?.result ||
    {}
  );
}

function formatDisplayedComments({ request, userAnswers }) {
  if (request?.mode === "customDestination") {
    return "";
  }

  const destination = getDestinationForComments(request);

  const rows = COMMENT_CONFIG
    .map((item) => {
      const answerValue = Number(userAnswers?.[item.key]);

      if (!Number.isFinite(answerValue) || answerValue <= 0) {
        return null;
      }

      const comment = getCommentFromDestination(destination, item.key);

      if (!hasValue(comment)) {
        return null;
      }

      return `
        <li>
          <strong>${escapeHtml(item.icon)} ${escapeHtml(item.label)} :</strong>
          ${escapeHtml(comment)}
        </li>
      `;
    })
    .filter(Boolean);

  if (!rows.length) {
    return "";
  }

  return `
    <h2>Commentaires affichés à l'utilisateur</h2>
    <ul>
      ${rows.join("")}
    </ul>
  `;
}

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

function formatDuelPreferences(userAnswers = {}) {
  const aventureValue = Number(userAnswers.aventure);
  const villeValue = Number(userAnswers.ville);

  const rows = [];

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

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td class="mini-label">${escapeHtml(label)}</td>
          <td class="mini-value">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");
}

function getMonthLabel(monthKey) {
  const months = {
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
    best: "Meilleur mois demandé automatiquement",
  };

  return months[monthKey] || monthKey || "";
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

function getBudgetValue(budgetBreakdown, keys = []) {
  for (const key of keys) {
    const value = budgetBreakdown?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function formatSummaryTable(userAnswers = {}, budgetBreakdown = {}) {
  const estimatedBudget = getBudgetValue(budgetBreakdown, ["total"]);

  return `
    <h2 class="section-title">Résumé du voyage</h2>

    <table class="summary-grid">
      <tr>
        <td class="summary-cell">
          <div class="summary-label">Voyageurs</div>
          <div class="summary-value">${escapeHtml(userAnswers.travelers || "")}</div>
        </td>

        <td class="summary-cell">
          <div class="summary-label">Durée</div>
          <div class="summary-value">${escapeHtml(userAnswers.tripDays || "")} jours</div>
        </td>

        <td class="summary-cell">
          <div class="summary-label">Période</div>
          <div class="summary-value small">${escapeHtml(getTravelPeriodLabel(userAnswers))}</div>
        </td>

        <td class="summary-cell">
          <div class="summary-label">Budget renseigné</div>
          <div class="summary-value">${escapeHtml(formatMoney(userAnswers.budgetTotal))}</div>
        </td>

        <td class="summary-cell">
          <div class="summary-label">Budget estimé</div>
          <div class="summary-value">${escapeHtml(formatMoney(estimatedBudget))}</div>
        </td>
      </tr>
    </table>

    ${
      userAnswers.usedFinalBudgetRelaunch === true
        ? `
          <table class="mini-table">
            <tr>
              <td class="mini-label">Relance budget</td>
              <td class="mini-value">Utilisée depuis l’écran résultat</td>
            </tr>
          </table>
        `
        : ""
    }
  `;
}

function formatDateFr(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("fr-FR");
}

function formatTravelPeriod(userAnswers = {}) {
  const exactDates = userAnswers.exactDates;

  if (exactDates?.from || exactDates?.to) {
    return `
      <tr>
        <td class="mini-label">Période de voyage</td>
        <td class="mini-value">
          ${escapeHtml(formatDateFr(exactDates.from) || "Date début non renseignée")}
          →
          ${escapeHtml(formatDateFr(exactDates.to) || "Date fin non renseignée")}
        </td>
      </tr>
    `;
  }

  if (userAnswers.selectedMonth === "best") {
    return `
      <tr>
        <td class="mini-label">Période de voyage</td>
        <td class="mini-value">Meilleur mois demandé automatiquement</td>
      </tr>
    `;
  }

  if (userAnswers.selectedMonth) {
    return `
      <tr>
        <td class="mini-label">Mois choisi</td>
        <td class="mini-value">${escapeHtml(getMonthLabel(userAnswers.selectedMonth))}</td>
      </tr>
    `;
  }

  return "";
}

function formatRange(min, max, unit = "°C") {
  const hasMin = min !== null && min !== undefined && min !== "";
  const hasMax = max !== null && max !== undefined && max !== "";

  if (!hasMin && !hasMax) return "";

  if (hasMin && hasMax) {
    return `${min}${unit} à ${max}${unit}`;
  }

  if (hasMin) {
    return `${min}${unit} ou plus`;
  }

  return `jusqu’à ${max}${unit}`;
}

function formatTemperaturePreferences(userAnswers = {}) {
  const rows = [];

  const heatRange = formatRange(userAnswers.chalMin, userAnswers.chalMax);

  if (heatRange) {
    rows.push(["Température souhaitée", heatRange]);
  }

  const waterRange = formatRange(userAnswers.teauMin, userAnswers.teauMax);

  if (waterRange && (Number(userAnswers.mer) > 0 || Number(userAnswers.bain) > 0)) {
    rows.push(["Température baignade", waterRange]);
  }

  if (waterRange && Number(userAnswers.inso) > 0) {
    rows.push(["Température baignade insolite", waterRange]);
  }

  if (!rows.length) return "";

  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td class="mini-label">${escapeHtml(label)}</td>
          <td class="mini-value">${escapeHtml(value)}</td>
        </tr>
      `
    )
    .join("");
}

function getContactModeLabel(mode) {
  const labels = {
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    email: "Email",
  };

  return labels[mode] || mode || "";
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim() !== "";
  return true;
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

function getReliefLabels(userAnswers = {}) {
  const relief = userAnswers.relief || {};

  const labels = {
    vegetalise: "Végétalisé",
    alpin: "Alpin",
    cotier: "Côtier",
    volcanique: "Volcanique",
    tropical: "Tropical",
    desertique: "Désertique",
    foret: "Forêt",
  };

  return Object.entries(labels)
    .filter(([key]) => relief[key] === true)
    .map(([, label]) => label);
}

function formatRange(min, max, unit = "°C") {
  const hasMin = min !== null && min !== undefined && min !== "";
  const hasMax = max !== null && max !== undefined && max !== "";

  if (!hasMin && !hasMax) return "";
  if (hasMin && hasMax) return `${min}${unit} à ${max}${unit}`;
  if (hasMin) return `${min}${unit} ou plus`;
  return `jusqu’à ${max}${unit}`;
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
      heatRange ? `${userAnswers.chal}/5 — ${heatRange}` : `${userAnswers.chal}/5`,
    ]);
  }

  if (Number(userAnswers.secu) > 0) {
    rows.push(["Sécurité", `${userAnswers.secu}/5`]);
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Chaleur, sécurité et relief</h2>
    <table class="mini-table">
      ${rows
        .map(
          ([label, value]) => `
            <tr>
              <td class="mini-label">${escapeHtml(label)}</td>
              <td class="mini-value">${escapeHtml(value)}</td>
            </tr>
          `
        )
        .join("")}
    </table>
  `;
}

function getMonthKeyForDestinationInfo(userAnswers = {}, request = {}) {
  if (userAnswers.selectedMonth && userAnswers.selectedMonth !== "best") {
    return userAnswers.selectedMonth;
  }

  if (userAnswers.exactDates?.from) {
    const date = new Date(userAnswers.exactDates.from);

    if (!Number.isNaN(date.getTime())) {
      const monthKeys = [
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

      return monthKeys[date.getMonth()];
    }
  }

  return (
    request?.monthKey ||
    request?.bestMonthKey ||
    request?.destination?.bestMonthKey ||
    request?.destination?.bestMonth ||
    ""
  );
}

function readMonthlyValue(destination = {}, possibleBases = [], monthKey) {
  if (!monthKey) return null;

  for (const base of possibleBases) {
    if (destination?.[base]?.[monthKey] !== undefined) {
      return destination[base][monthKey];
    }

    const possibleKeys = [
      `${base}${monthKey}`,
      `${base}_${monthKey}`,
      `${base}.${monthKey}`,
      `${base}${monthKey.charAt(0).toUpperCase()}${monthKey.slice(1)}`,
    ];

    for (const key of possibleKeys) {
      if (destination?.[key] !== undefined) {
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

  const rows = [];

  const airTemp = readMonthlyValue(
    destination,
    ["temp", "temperature", "chal", "chaleur", "tempmoy", "temperatureMoy"],
    monthKey
  );

  if (airTemp !== null && airTemp !== undefined && airTemp !== "") {
    rows.push([
      `Température destination (${getMonthLabel(monthKey)})`,
      `${airTemp}°C`,
    ]);
  }

  const waterTemp = readMonthlyValue(
    destination,
    ["teau", "eau", "merTemp", "temperatureEau", "tempEau"],
    monthKey
  );

  if (
    waterTemp !== null &&
    waterTemp !== undefined &&
    waterTemp !== "" &&
    (Number(userAnswers.mer) > 0 ||
      Number(userAnswers.bain) > 0 ||
      Number(userAnswers.inso) > 0)
  ) {
    rows.push([
      `Température de l’eau (${getMonthLabel(monthKey)})`,
      `${waterTemp}°C`,
    ]);
  }

  if (!rows.length) return "";

  return `
    <h3 class="subsection-title">Températures affichées</h3>
    <table class="mini-table">
      ${rows
        .map(
          ([label, value]) => `
            <tr>
              <td class="mini-label">${escapeHtml(label)}</td>
              <td class="mini-value">${escapeHtml(value)}</td>
            </tr>
          `
        )
        .join("")}
    </table>
  `;
}

function buildEmailHtml(payload, orderId) {
  const { contact, request } = payload;

  const userAnswers = request?.emailContext?.userAnswers || {};
  const destinationName = getDestinationName(request);
  const budgetBreakdown = request?.budgetBreakdown || {};
const estimatedBudget = getBudgetValue(budgetBreakdown, ["total"]);
  return `
  <div style="font-family:Arial,sans-serif; color:#2f2440; background:#f7f1fb; padding:18px;">
    <div style="max-width:760px; margin:0 auto; background:white; border-radius:18px; padding:20px;">
      <h1 style="margin:0 0 12px; color:#8d45b5; font-size:22px;">
        Nouvelle demande Travel Planner — ${escapeHtml(orderId)}
      </h1>

      <style>
        .section-title {
          margin: 20px 0 10px;
          font-size: 17px;
          color: #3b284c;
          border-bottom: 1px solid #eadcf4;
          padding-bottom: 6px;
        }

        .summary-grid {
          width: 100%;
          border-collapse: separate;
          border-spacing: 8px;
          margin: 8px 0 12px;
        }

        .summary-cell {
          background: #f9eefc;
          border-radius: 12px;
          padding: 10px;
          vertical-align: top;
          width: 25%;
        }

        .summary-label {
          font-size: 12px;
          color: #7a5b8d;
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 19px;
          font-weight: 900;
          color: #2f2440;
        }

        .mini-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }

        .mini-label {
          width: 42%;
          padding: 7px 8px;
          border-bottom: 1px solid #eee;
          color: #6c5b75;
          font-size: 13px;
        }

        .mini-value {
          padding: 7px 8px;
          border-bottom: 1px solid #eee;
          font-weight: 700;
          font-size: 13px;
        }

        ul {
          margin-top: 6px;
        }

        li {
          margin-bottom: 4px;
        }
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
</style>
      </style>
${formatContactTable(contact)}

      <h2 class="section-title">Destination</h2>

      <p style="font-size:26px; font-weight:900; color:#d94b8c; margin:4px 0;">
        ${escapeHtml(destinationName)}
      </p>

      ${formatDestinationMeta(request)}
${formatDestinationBlock(request, destinationName)}
${formatSummaryTable(userAnswers, budgetBreakdown)}


${formatBudgetPreferences(userAnswers)}
${formatTransportAnswers(userAnswers)}

${formatClimateSecurityRelief(userAnswers)}

${formatGroupedThemes(userAnswers)}

${formatBudgetBreakdown(budgetBreakdown)}
${formatDestinationTemperatures({ request, userAnswers })}
${formatDisplayedComments({ request, userAnswers })}
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