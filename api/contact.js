import { Resend } from "resend";
import {
  getDestinationMonthValue as getCoeffMonthValue,
  getWeightedMonthValue as getCoeffWeightedMonthValue,
} from "../src/engine/coefftemp.js";

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
0: "AUCUN DES DEUX",
1: "FARNIENTE DE L’EXTRÊME",
2: "FARNIENTE",
3: "PLUS FARNIENTE",
4: "LES DEUX !",
5: "PLUS AVENTURIER",
6: "AVENTURIER",
7: "AVENTURIER DE L’EXTRÊME",
  fullAventure: "AVENTURIER DE L’EXTRÊME",
  fullAdventure: "AVENTURIER DE L’EXTRÊME",
  aventure: "AVENTURIER",
  adventure: "AVENTURIER",
  aventureMore: "PLUS AVENTURIER",
  adventureMore: "PLUS AVENTURIER",
  mixed: "LES DEUX !",
  lesDeux: "LES DEUX !",
  neutral: "AUCUN DES DEUX",
  none: "AUCUN DES DEUX",
  farnienteMore: "PLUS FARNIENTE",
  relaxMore: "PLUS FARNIENTE",
  farniente: "FARNIENTE",
  relax: "FARNIENTE",
  fullFarniente: "FARNIENTE DE L’EXTRÊME",
  fullRelax: "FARNIENTE DE L’EXTRÊME",
};

const VILLE_ACTIVITE_LABELS = {
0: "AUCUN DES DEUX",
1: "ACTIVITÉS DE L’EXTRÊME",
2: "ACTIVITÉS",
3: "PLUS ACTIVITÉS",
4: "LES DEUX !",
5: "PLUS VILLE",
6: "VILLE",
7: "100 % CITADIN",    
  fullVille: "100 % CITADIN",
  fullCity: "100 % CITADIN",
  ville: "VILLE",
  city: "VILLE",
  villeMore: "PLUS VILLE",
  cityMore: "PLUS VILLE",
  mixed: "LES DEUX !",
  mixed2: "LES DEUX !",
  lesDeux: "LES DEUX !",
  neutral: "AUCUN DES DEUX",
  none: "AUCUN DES DEUX",
  activiteMore: "PLUS ACTIVITÉS",
  activityMore: "PLUS ACTIVITÉS",
  activite: "ACTIVITÉS",
  activity: "ACTIVITÉS",
  fullActivite: "ACTIVITÉS DE L’EXTRÊME",
  fullActivity: "ACTIVITÉS DE L’EXTRÊME",
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
{ key: "transportModes_voiture", label: "Voiture", icon: "🚗" },
{ key: "transportModes_commun", label: "Transports en commun", icon: "🚆" },
{ key: "transportModes_taxi", label: "Taxi", icon: "🚕" },
{ key: "transportModes_vtc", label: "VTC", icon: "🚖" },
{ key: "admin", label: "Papiers", icon: "🛂" },      
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

const TREK_LEVELS = {
  1: "1 grosse journée",
  2: "2/3 jours",
  3: "4/5 jours",
  4: "6/7 jours",
  5: "plus d'une semaine",
};

function getThemeDisplayValue(theme, score, userAnswers = {}) {
  if (theme.key !== "trek") {
    return `${score}/${theme.max}`;
  }

  const trekLevel = Number(
    userAnswers?.trekLevel ||
      userAnswers?.trekDuration ||
      userAnswers?.trek
  );

  const trekLabel = TREK_LEVELS[trekLevel];

  if (!trekLabel) {
    return `${score}/${theme.max}`;
  }

  return `${score}/${theme.max} — ${trekLabel}`;
}


function getChoiceLabel(value, labelsMap) {
  if (!hasValue(value)) return "";

  const key = String(value).trim();

  return labelsMap[key] || key;
}

function pickFirstValue(source = {}, keys = []) {
  for (const key of keys) {
    if (hasValue(source[key])) return source[key];
  }

  return "";
}

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
function formatMoneyNoWrapHtml(value) {
  return `<span style="white-space:nowrap; display:inline-block;">${escapeHtml(
    formatMoney(value)
  ).replace(/\s/g, "&nbsp;")}</span>`;
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

function compactRow(label, value, options = {}) {
  if (!hasValue(value)) return "";

  const displayValue = Array.isArray(value) ? value.join(", ") : value;

  const labelStyle = options.labelEmphasis
    ? "width:42%; padding:9px 8px; border-bottom:1px solid #eee; color:#5b2b72; font-size:13px; font-weight:bold;"
    : "width:42%; padding:7px 8px; border-bottom:1px solid #eee; color:#6c5b75; font-size:13px;";

  const valueStyle = options.valueBig
    ? "padding:9px 8px; border-bottom:1px solid #eee; color:#2f2440; font-size:16px; font-weight:bold;"
    : "padding:9px 8px; border-bottom:1px solid #eee; color:#2f2440; font-size:13px; font-weight:700;";

  const labelHtml = options.labelEmphasis
    ? `<strong style="font-weight:bold;">${escapeHtml(label)}</strong>`
    : escapeHtml(label);

  const finalValue = options.rawHtml
    ? displayValue
    : options.valueEmphasis
    ? `<strong style="font-weight:bold;">${escapeHtml(displayValue)}</strong>`
    : escapeHtml(displayValue);

  return `
    <tr>
      <td style="${labelStyle}">${labelHtml}</td>
      <td style="${valueStyle}">${finalValue}</td>
    </tr>
  `;
}

function formatPeriodHtml(periodLabel) {
  if (!hasValue(periodLabel)) return "";

  const text = String(periodLabel);
  const match = text.match(/^(.*?)\s*(\(.+\))$/);

  if (!match) {
    return `<strong style="font-size:16px; font-weight:bold; color:#2f2440;">${escapeHtml(
      text
    )}</strong>`;
  }

  return `
    <strong style="font-size:16px; font-weight:bold; color:#2f2440;">
      ${escapeHtml(match[1].trim())}
    </strong>
    <span style="font-size:12px; font-weight:400; color:#7a6a85;">
      ${escapeHtml(match[2])}
    </span>
  `;
}

function normalizePhoneForTel(value) {
  if (!hasValue(value)) return "";

  return String(value)
    .trim()
    .replace(/[^\d+]/g, "");
}

function normalizePhoneForWhatsapp(value) {
  if (!hasValue(value)) return "";

  const raw = String(value).trim();

  // Si le numéro est déjà en +33..., on enlève juste le +
  if (raw.startsWith("+")) {
    return raw.replace(/[^\d]/g, "");
  }

  const digits = raw.replace(/\D/g, "");

  // 0033... => 33...
  if (digits.startsWith("00")) {
    return digits.slice(2);
  }

  // Numéro français local : 0612345678 => 33612345678
  if (digits.startsWith("0")) {
    return `33${digits.slice(1)}`;
  }

  return digits;
}

function formatPhoneLink(value) {
  if (!hasValue(value)) return "";

  const cleanPhone = normalizePhoneForTel(value);

  if (!cleanPhone) {
    return escapeHtml(value);
  }

  return `<a class="phone-link" href="tel:${escapeHtml(cleanPhone)}">${escapeHtml(
    value
  )}</a>`;
}

function formatWhatsappLink(value) {
  if (!hasValue(value)) return "";

  const whatsappNumber = normalizePhoneForWhatsapp(value);

  if (!whatsappNumber) {
    return escapeHtml(value);
  }

  return `<a class="phone-link" href="https://wa.me/${escapeHtml(
    whatsappNumber
  )}" target="_blank" rel="noopener noreferrer">${escapeHtml(value)}</a>`;
}

function formatContactTable(contact = {}) {
  const rows = [];

  rows.push(compactRow("Mode de contact", getContactModeLabel(contact.contactMode)));
  rows.push(compactRow("Prénom", contact.firstName));
  rows.push(compactRow("Nom", contact.lastName));

  if (contact.contactMode === "whatsapp") {
    const whatsappNumber = contact.whatsapp || contact.phone;

    rows.push(
      compactRow("WhatsApp", formatWhatsappLink(whatsappNumber), {
        rawHtml: true,
        labelEmphasis: true,
      })
    );
  } else if (contact.contactMode === "phone") {
    const phoneNumber = contact.phone || contact.whatsapp;

    rows.push(
      compactRow("Téléphone", formatPhoneLink(phoneNumber), {
        rawHtml: true,
        labelEmphasis: true,
      })
    );
  } else if (contact.contactMode === "email") {
    rows.push(compactRow("Email", contact.email));

    if (hasValue(contact.phone)) {
      rows.push(
        compactRow("Téléphone complémentaire", formatPhoneLink(contact.phone), {
          rawHtml: true,
        })
      );
    }

    if (hasValue(contact.whatsapp)) {
      rows.push(
        compactRow("WhatsApp complémentaire", formatWhatsappLink(contact.whatsapp), {
          rawHtml: true,
        })
      );
    }
  } else {
    if (hasValue(contact.phone)) {
      rows.push(
        compactRow("Téléphone", formatPhoneLink(contact.phone), {
          rawHtml: true,
        })
      );
    }

    if (hasValue(contact.whatsapp)) {
      rows.push(
        compactRow("WhatsApp", formatWhatsappLink(contact.whatsapp), {
          rawHtml: true,
        })
      );
    }

    if (hasValue(contact.email)) {
      rows.push(compactRow("Email", contact.email));
    }
  }

  rows.push(compactRow("Jours préférés", contact.preferredDays));
  rows.push(compactRow("Plage horaire préférée", contact.preferredTimeSlot));
  rows.push(compactRow("Commentaire", contact.comment));

  const htmlRows = rows.filter(Boolean).join("");

  if (!htmlRows.trim()) return "";

  return `
    <h2 class="section-title">Coordonnées client</h2>
    <table class="mini-table">
      ${htmlRows}
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

  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getTripDaysForMail(userAnswers = {}, request = {}) {
  const exactDates =
    userAnswers?.exactDates ||
    request?.exactDates ||
    request?.travelDates ||
    {};

  const from = exactDates?.from;
  const to = exactDates?.to;

  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }
  }

  return Number(userAnswers?.tripDays) || "";
}

function getBestMonthFromRequest(request = {}) {
  const destination = request?.destination || request?.result?.destination || request?.result || {};

  return normalizeMonthKey(
    request?.travelPeriodMonth ||
      request?.monthKey ||
      request?.bestMonthKey ||
      request?.destination?.bestMonth ||
      request?.destination?.bestMonthKey ||
      destination?.bestMonth ||
      destination?.bestMonthKey ||
      ""
  );
}

function getTravelPeriodLabel(userAnswers = {}, request = {}) {
  const exactDates = userAnswers.exactDates;

  if (exactDates?.from || exactDates?.to) {
    return `${formatDateFr(exactDates.from) || "?"} → ${
      formatDateFr(exactDates.to) || "?"
    }`;
  }

  if (userAnswers.selectedMonth === "best") {
    const bestMonth = getBestMonthFromRequest(request);

    if (bestMonth) {
      return `${getMonthLabel(bestMonth)} (Meilleur mois demandé)`;
    }

    return "Meilleur mois demandé";
  }

  if (userAnswers.selectedMonth) {
    return `${getMonthLabel(userAnswers.selectedMonth)} (Mois fixé par l'utilisateur)`;
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


function formatSummaryTable(
  userAnswers = {},
  budgetBreakdown = {},
  request = {},
  destinationName = ""
) {
  const estimatedBudget = getBudgetValue(budgetBreakdown, ["total"]);
  const periodLabel = getTravelPeriodLabel(userAnswers, request);
  const rankLabel = getDestinationRankLabel(request?.destinationRank);
const tripDays = getTripDaysForMail(userAnswers, request);
  const rows = [
    [
      "Destination",
      destinationName,
      {
        labelEmphasis: true,
        valueEmphasis: true,
        valueBig: true,
      },
    ],
    [
      "Voyageurs",
      userAnswers.travelers ? `${userAnswers.travelers}` : "",
      {
        labelEmphasis: true,
        valueEmphasis: true,
        valueBig: true,
      },
    ],
[
  "Durée",
  tripDays ? `${tripDays} jours` : "",
  {
    labelEmphasis: true,
    valueEmphasis: true,
    valueBig: true,
  },
],
    [
      "Période",
      formatPeriodHtml(periodLabel),
      {
        labelEmphasis: true,
        rawHtml: true,
        valueBig: true,
      },
    ],

    [
      "Budget renseigné",
      formatMoney(userAnswers.budgetTotal),
      {
        labelEmphasis: true,
      },
    ],
    [
      "Budget estimé par l'application",
      formatMoney(estimatedBudget),
      {
        labelEmphasis: true,
      },
    ],
    rankLabel
      ? [
          "Position au classement",
          rankLabel,
          {
            labelEmphasis: true,
          },
        ]
      : null,
  ].filter(Boolean);

  return `
    <div class="summary-card">
      <h2 class="summary-card-title">Résumé du voyage</h2>

      <table class="mini-table summary-table">
        ${rows
          .map(([label, value, options]) => compactRow(label, value, options))
          .join("")}
      </table>
    </div>
  `;
}

function formatDuelPreferences(userAnswers = {}) {
  const adventureValue = pickFirstValue(userAnswers, [
    "profile1",
    "_profile1",
    "aventure",
    "aventureFarniente",
    "adventureRelax",
  ]);

  const villeValue = pickFirstValue(userAnswers, [
    "profile2",
    "_profile2",
    "ville",
    "villeActivite",
    "cityActivity",
  ]);

  const rows = [];

  if (hasValue(adventureValue)) {
    rows.push([
      "Duel aventure / farniente",
      getChoiceLabel(adventureValue, AVENTURE_LABELS),
    ]);
  }

  if (hasValue(villeValue)) {
    rows.push([
      "Duel ville / activités",
      getChoiceLabel(villeValue, VILLE_ACTIVITE_LABELS),
    ]);
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Préférences principales</h2>
    <table class="mini-table">
      ${rows.map(([label, value]) => compactRow(label, value)).join("")}
    </table>
  `;
}

function isChecked(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "oui" ||
    value === "yes"
  );
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

function isTransportModeActive(value) {
  return (
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true" ||
    value === "oui" ||
    value === "yes"
  );
}

function isModeActive(value) {
  return value === true || value === 1 || value === "1" || value === "true";
}

function getSelectedTransportModes(userAnswers = {}) {
  const modes = userAnswers?.transportModes || {};
  const labels = [];

  if (isModeActive(modes.voiture)) {
    labels.push(
      userAnswers?.avion === "non"
        ? "Voiture personnelle"
        : "Voiture de location"
    );
  }

  if (isModeActive(modes.commun)) {
    labels.push("Transports en commun");
  }

  // IMPORTANT :
  // Dans ton écran, VTC est une sous-option de Taxi.
  // Donc si vtc = true, taxi = true aussi.
  // Pour le mail, on affiche VTC à la place de Taxi.
  if (isModeActive(modes.vtc)) {
    labels.push("VTC");
  } else if (isModeActive(modes.taxi)) {
    labels.push("Taxi");
  }

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

  const hasWaterTheme =
    Number(userAnswers.mer) > 0 ||
    Number(userAnswers.bain) > 0 ||
    Number(userAnswers.inso) > 0;

  if (waterRange && hasWaterTheme) {
    rows.push(["Température de l’eau souhaitée", waterRange]);
  }

  if (Number(userAnswers.tour) > 0) {
    rows.push(["Fréquentation touristique", `${userAnswers.tour}/5`]);
  }

  if (Number(userAnswers.secu) > 0) {
    rows.push(["Sécurité", `${userAnswers.secu}/5`]);
  }

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Températures, fréquentation, sécurité et relief</h2>
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

      return compactRow(
        theme.label,
        getThemeDisplayValue(theme, score, userAnswers)
      );
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

function formatBudgetBreakdown(budgetBreakdown) {
  const rows = [
    ["Transport initial", getBudgetValue(budgetBreakdown, ["avion", "initialTransport"]), false],
    ["Transport local", getBudgetValue(budgetBreakdown, ["transport", "localTransport"]), false],
    ["Logement", getBudgetValue(budgetBreakdown, ["logement"]), false],
    ["Nourriture", getBudgetValue(budgetBreakdown, ["bouffe", "food"]), false],
    ["Activités", getBudgetValue(budgetBreakdown, ["activites", "activities"]), false],
    ["Rémunération Travel Planner", getBudgetValue(budgetBreakdown, ["travelPlanner", "planner"]), false],
    ["Total estimé", getBudgetValue(budgetBreakdown, ["total"]), true],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  if (!rows.length) return "";

  return `
    <h2 class="section-title">Budget estimé par l'application</h2>

    <table class="mini-table">
      <tbody>
        ${rows
          .map(([label, value, isTotal]) => {
            const labelStyle = isTotal
              ? "padding:13px 8px; border-top:2px solid #eadcf4; font-size:15px; font-weight:900; color:#5b2b72;"
              : "padding:9px 8px; border-bottom:1px solid #eee; color:#6c5b75;";

const valueStyle = isTotal
  ? "padding:12px 8px; border-top:2px solid #eadcf4; text-align:right; font-size:16px; font-weight:bold; color:#8d45b5; white-space:nowrap;"
  : "padding:9px 8px; border-bottom:1px solid #eee; text-align:right; font-weight:800; color:#2f2440; white-space:nowrap;";

            return `
              <tr>
                <td style="${labelStyle}">
                  ${escapeHtml(label)}
                </td>
<td style="${valueStyle}">
  ${formatMoneyNoWrapHtml(value)}
</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function getDestinationForComments(request = {}) {
  return request?.destination || request?.result?.destination || request?.result || {};
}

function getCommentFromDestination(destination = {}, key, userAnswers = {}) {
  if (hasValue(destination?.comments?.[key])) {
    return destination.comments[key];
  }

  if (key.startsWith("transportModes_")) {
    const subKey = key.split("_")[1];

    if (hasValue(destination?.comments?.transportModes?.[subKey])) {
      return destination.comments.transportModes[subKey];
    }
  }

  if (key === "trek") {
    const trekLevel = Number(
      userAnswers?.trekLevel ||
        userAnswers?.trekDuration ||
        userAnswers?.trek
    );

    const trekKeys = [
      `trek.${trekLevel}c`,
      `trek_${trekLevel}c`,
      `trek${trekLevel}c`,
      `trek.${trekLevel}.c`,
      `trek.${trekLevel}C`,
      `trek_${trekLevel}C`,
      `trek${trekLevel}C`,
      "trekc",
      "trekC",
    ];

    for (const trekKey of trekKeys) {
      if (hasValue(destination?.[trekKey])) {
        return destination[trekKey];
      }
    }

    if (destination?.trek && typeof destination.trek === "object") {
      if (hasValue(destination.trek?.[`${trekLevel}c`])) {
        return destination.trek[`${trekLevel}c`];
      }

      if (hasValue(destination.trek?.[trekLevel]?.c)) {
        return destination.trek[trekLevel].c;
      }

      if (hasValue(destination.trek?.c)) {
        return destination.trek.c;
      }
    }
  }

  const aliasKeys = {
    transportModes_voiture: [
      "voiturec",
      "voitureC",
      "transportModes.voiturec",
      "transportModes_voiturec",
    ],
    transportModes_commun: [
      "communc",
      "communC",
      "busc",
      "busC",
      "transportModes.communc",
      "transportModes_communc",
    ],
    transportModes_taxi: [
      "taxic",
      "taxiC",
      "transportModes.taxic",
      "transportModes_taxic",
    ],
    transportModes_vtc: [
      "vtcc",
      "vtcC",
      "transportModes.vtcc",
      "transportModes_vtcc",
    ],
    admin: [
      "adminc",
      "adminC",
      "papierc",
      "papiersc",
      "papiersC",
    ],
  };

  const possibleKeys = [
    ...(aliasKeys[key] || []),
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

function getDisplayedTemperatureForMail(destination, themeKey, userAnswers = {}, request = {}) {
  const exactDates = userAnswers?.exactDates;

  if (exactDates?.from && exactDates?.to) {
    return getCoeffWeightedMonthValue(
      destination,
      themeKey,
      exactDates.from,
      exactDates.to
    );
  }

  const monthKey = getMonthKeyForDestinationInfo(userAnswers, request);

  if (!monthKey) return null;

  return getCoeffMonthValue(destination, themeKey, monthKey);
}

function formatDestinationTemperatures({ request, userAnswers }) {
  if (request?.mode === "customDestination") return "";

  const destination = request?.destination || {};
  const exactDates = userAnswers?.exactDates;
  const hasExactDates = exactDates?.from && exactDates?.to;

  const monthKey = getMonthKeyForDestinationInfo(userAnswers, request);
  const monthLabel = getMonthLabel(monthKey);

  const periodLabel = hasExactDates
    ? "intervalle sélectionné"
    : monthLabel || "";

  const rows = [];

  const airTemp = getDisplayedTemperatureForMail(
    destination,
    "chal",
    userAnswers,
    request
  );

  if (hasValue(airTemp)) {
    rows.push([
      `Température destination ${periodLabel ? `(${periodLabel})` : ""}`,
      formatNumber(Math.round(Number(airTemp) * 10) / 10, "°C"),
    ]);
  }

  const hasSeaWaterTheme =
    Number(userAnswers.mer) > 0 || Number(userAnswers.bain) > 0;

  const hasInsoWaterTheme = Number(userAnswers.inso) > 0;

  const merTemp = getDisplayedTemperatureForMail(
    destination,
    "mer",
    userAnswers,
    request
  );

  const insoTemp = getDisplayedTemperatureForMail(
    destination,
    "inso",
    userAnswers,
    request
  );

  if (hasSeaWaterTheme && hasValue(merTemp)) {
    rows.push([
      `Température de l’eau mer ${periodLabel ? `(${periodLabel})` : ""}`,
      formatNumber(Math.round(Number(merTemp) * 10) / 10, "°C"),
    ]);
  }

  if (hasInsoWaterTheme && hasValue(insoTemp)) {
    rows.push([
      `Température de baignade insolite ${periodLabel ? `(${periodLabel})` : ""}`,
      formatNumber(Math.round(Number(insoTemp) * 10) / 10, "°C"),
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

function isDisplayedCommentActive(item, userAnswers = {}) {
  const key = item.key;

  if (key === "admin") {
    const selectedPapers = getSelectedPapers(userAnswers);

    return userAnswers.papiersEnabled === true || selectedPapers.length > 0;
  }

  if (key.startsWith("transportModes_")) {
    const subKey = key.split("_")[1];
    const modes = userAnswers.transportModes || {};

    if (isModeActive(modes.indifferent)) return false;

    if (subKey === "vtc") {
      return isModeActive(modes.vtc);
    }

    if (subKey === "taxi") {
      return isModeActive(modes.taxi) && !isModeActive(modes.vtc);
    }

    return isModeActive(modes[subKey]);
  }

  const answerValue = Number(userAnswers?.[key]);

  return Number.isFinite(answerValue) && answerValue > 0;
}

const COMMENTS_HIDE_IF_SCORE_ZERO = ["mer", "inso", "festi", "carna"];

function getDisplayedCommentScore(destination = {}, key) {
  if (key === "admin" || key.startsWith("transportModes_")) {
    return 1;
  }

  return Number(destination?.scores?.[key]) || 0;
}

function shouldDisplayUserComment(item, destination = {}, userAnswers = {}) {
  const key = item.key;

  if (key === "admin") {
    const selectedPapers = getSelectedPapers(userAnswers);
    return userAnswers.papiersEnabled === true || selectedPapers.length > 0;
  }

  if (key.startsWith("transportModes_")) {
    const subKey = key.split("_")[1];
    const modes = userAnswers.transportModes || {};

    if (isModeActive(modes.indifferent)) return false;

    if (subKey === "vtc") {
      return isModeActive(modes.vtc);
    }

    if (subKey === "taxi") {
      return isModeActive(modes.taxi) && !isModeActive(modes.vtc);
    }

    return isModeActive(modes[subKey]);
  }

  const answerValue = Number(userAnswers?.[key]);

  if (!Number.isFinite(answerValue) || answerValue <= 0) {
    return false;
  }

  const score = getDisplayedCommentScore(destination, key);

  if (COMMENTS_HIDE_IF_SCORE_ZERO.includes(key) && score <= 0) {
    return false;
  }

  return true;
}

function formatDisplayedComments({ request, userAnswers }) {
  if (request?.mode === "customDestination") {
    return "";
  }

  const destination = getDestinationForComments(request);

  const temperaturesHtml = formatDestinationTemperatures({
    request,
    userAnswers,
  });

  const rows = COMMENT_CONFIG
    .map((item) => {
      if (!shouldDisplayUserComment(item, destination, userAnswers)) {
        return "";
      }

      const comment = getCommentFromDestination(
        destination,
        item.key,
        userAnswers
      );

      if (!hasValue(comment)) return "";

      return `
        <tr>
          <td style="width:28px; padding:6px 6px 6px 0; vertical-align:top; font-size:15px;">
            ${escapeHtml(item.icon)}
          </td>

          <td style="padding:6px 0; vertical-align:top; font-size:13px; line-height:1.35; color:#2f2440;">
            <strong style="font-weight:bold;">${escapeHtml(item.label)} :</strong>
            ${escapeHtml(comment)}
          </td>
        </tr>
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
          <table style="width:100%; border-collapse:collapse; margin-top:6px;">
            ${rows}
          </table>
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
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}

.comment-list li {
  margin: 0 0 8px;
  padding: 0;
  list-style: none;
  font-size: 13px;
  line-height: 1.35;
}

.comment-row {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.comment-icon {
  display: table-cell;
  width: 28px;
  min-width: 28px;
  padding-right: 6px;
  vertical-align: top;
  font-size: 15px;
  line-height: 1.35;
}

.comment-content {
  display: table-cell;
  vertical-align: top;
}

.comment-title {
  font-weight: bold;
  color: #2f2440;
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
  .important-row .mini-label {
  font-weight: 800;
  color: #5b2b72;
}

.important-value {
  font-size: 15px;
  font-weight: 900;
  color: #2f2440;
}

.total-budget-value {
  display: inline-block;
  font-size: 20px;
  font-weight: 950;
  color: #8d45b5;
}

.phone-link {
  color: #8d45b5;
  font-weight: 900;
  text-decoration: none;
}

.period-main {
  font-size: 15px;
  font-weight: 900;
  color: #2f2440;
}

.period-note {
  display: inline-block;
  margin-left: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #7a6a85;
.summary-important-value {
  font-size: 16px;
  font-weight: 950;
  color: #2f2440;
}

.period-note {
  display: inline-block;
  margin-left: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #7a6a85;
}

.budget-total-highlight {
  margin: 10px 0 12px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #f9eefc;
  border: 1px solid #eadcf4;
  text-align: center;
}

.budget-total-highlight span {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  font-weight: 700;
  color: #6c3b85;
}

.budget-total-highlight strong {
  display: block;
  font-size: 24px;
  font-weight: 950;
  color: #8d45b5;
}  
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