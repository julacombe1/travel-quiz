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

function buildEmailHtml(payload, orderId) {
  const { contact, request } = payload;

  const userAnswers = request?.emailContext?.userAnswers || {};
  const destinationName = getDestinationName(request);
  const budgetBreakdown = request?.budgetBreakdown || {};

  return `
    <div style="font-family:Arial,sans-serif; color:#2f2440; background:#f7f1fb; padding:18px;">
      <div style="max-width:760px; margin:0 auto; background:white; border-radius:18px; padding:20px;">
        <h1 style="margin:0 0 12px; color:#8d45b5; font-size:22px;">
          Nouvelle demande Travel Planner — ${escapeHtml(orderId)}
        </h1>

        <p><strong>Destination :</strong> ${escapeHtml(destinationName)}</p>
        <p><strong>Voyageurs :</strong> ${escapeHtml(userAnswers.travelers || "")}</p>
        <p><strong>Durée :</strong> ${escapeHtml(userAnswers.tripDays || "")} jours</p>
        <p><strong>Budget renseigné :</strong> ${escapeHtml(formatMoney(userAnswers.budgetTotal))}</p>
        <p><strong>Budget estimé :</strong> ${escapeHtml(formatMoney(getBudgetValue(budgetBreakdown, ["total"])) )}</p>

        <h2>Coordonnées client</h2>
        <p><strong>Mode :</strong> ${escapeHtml(getContactModeLabel(contact?.contactMode))}</p>
        <p><strong>Prénom :</strong> ${escapeHtml(contact?.firstName || "")}</p>
        <p><strong>Nom :</strong> ${escapeHtml(contact?.lastName || "")}</p>
        <p><strong>Téléphone :</strong> ${escapeHtml(contact?.phone || "")}</p>
        <p><strong>WhatsApp :</strong> ${escapeHtml(contact?.whatsapp || "")}</p>
        <p><strong>Email :</strong> ${escapeHtml(contact?.email || "")}</p>
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