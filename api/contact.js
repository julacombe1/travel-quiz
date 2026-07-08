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

  if (number === 1) return "1ère destination trouvée";

  return `${number}e destination trouvée`;
}

function formatDestinationMeta(request) {
  if (request?.mode === "customDestination") {
    return `
      <p>
        <strong>Destination renseignée manuellement par l'utilisateur</strong>
      </p>
    `;
  }

  const rankLabel = getDestinationRankLabel(request?.destinationRank);

  if (!rankLabel) return "";

  return `
    <p>
      <strong>${escapeHtml(rankLabel)}</strong>
    </p>
  `;
}

function buildEmailHtml(payload, orderId) {
  const { contact, request } = payload;

  const userAnswers = request?.emailContext?.userAnswers || {};
  const destinationName = getDestinationName(request);
  const budgetBreakdown = request?.budgetBreakdown || {};
const estimatedBudget = getBudgetValue(budgetBreakdown, ["total"]);
  return `
    <div style="font-family:Arial,sans-serif; color:#2f2440; line-height:1.45;"

<h2>Coordonnées client</h2>
${infoLine("Mode de contact", getContactModeLabel(contact.contactMode))}
${infoLine("Prénom", contact.firstName)}
${infoLine("Nom", contact.lastName)}
${infoLine("Téléphone", contact.phone)}
${infoLine("WhatsApp", contact.whatsapp)}
${infoLine("Email", contact.email)}
${infoLine("Jours préférés", contact.preferredDays)}
${infoLine("Plage horaire", contact.preferredTimeSlot)}
${infoLine("Commentaire", contact.comment)}

      <h2>Destination</h2>
      <p style="font-size:26px; font-weight:900; color:#d94b8c;">
        ${escapeHtml(destinationName)}
      </p>
    ${formatDestinationMeta(request)}

<h2>Résumé du voyage</h2>

<div style="
  display:grid;
  grid-template-columns:repeat(2, minmax(0, 1fr));
  gap:12px;
  margin:14px 0;
">
  <div style="background:#f9eefc; padding:14px; border-radius:14px;">
    <div style="font-size:13px; color:#7a5b8d;">Voyageurs</div>
    <div style="font-size:24px; font-weight:900;">
      ${escapeHtml(userAnswers.travelers || "")}
    </div>
  </div>

  <div style="background:#f9eefc; padding:14px; border-radius:14px;">
    <div style="font-size:13px; color:#7a5b8d;">Durée</div>
    <div style="font-size:24px; font-weight:900;">
      ${escapeHtml(userAnswers.tripDays || "")} jours
    </div>
  </div>

  <div style="background:#f9eefc; padding:14px; border-radius:14px;">
    <div style="font-size:13px; color:#7a5b8d;">Budget renseigné</div>
    <div style="font-size:24px; font-weight:900;">
      ${escapeHtml(formatMoney(userAnswers.budgetTotal))}
    </div>
  </div>

  <div style="background:#f9eefc; padding:14px; border-radius:14px;">
    <div style="font-size:13px; color:#7a5b8d;">Budget estimé</div>
    <div style="font-size:24px; font-weight:900;">
      ${escapeHtml(formatMoney(estimatedBudget))}
    </div>
  </div>
</div>

${
  userAnswers.usedFinalBudgetRelaunch
    ? "<p><strong>Relance budget :</strong> l'utilisateur a utilisé la relance avec budget maximum depuis l'écran résultat.</p>"
    : ""
}
${formatBudgetPreferences(userAnswers)}
${formatTransportAnswers(userAnswers)}
${formatActivatedThemes(userAnswers)}

${formatBudgetBreakdown(budgetBreakdown)}

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
    console.error("Erreur /api/contact :", error);

    return res.status(500).json({
      message: "Erreur serveur pendant l'envoi de la demande.",
    });
  }
  
}