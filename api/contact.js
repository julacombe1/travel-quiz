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




function buildEmailHtml(payload, orderId) {
  const { contact, request } = payload;

  const userAnswers = request?.emailContext?.userAnswers || {};
  const destinationName = getDestinationName(request);
  const budgetBreakdown = request?.budgetBreakdown || {};

  return `
    <div style="font-family:Arial,sans-serif; color:#2f2440; line-height:1.45;">
      <h1>Nouvelle demande Travel Planner — ${escapeHtml(orderId)}</h1>

      <h2>Coordonnées client</h2>
      <p><strong>Mode de contact :</strong> ${escapeHtml(contact.contactMode)}</p>
      <p><strong>Prénom :</strong> ${escapeHtml(contact.firstName || "Non renseigné")}</p>
      <p><strong>Nom :</strong> ${escapeHtml(contact.lastName || "Non renseigné")}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(contact.phone || "Non renseigné")}</p>
      <p><strong>WhatsApp :</strong> ${escapeHtml(contact.whatsapp || "Non renseigné")}</p>
      <p><strong>Email :</strong> ${escapeHtml(contact.email || "Non renseigné")}</p>
      <p><strong>Jours préférés :</strong> ${escapeHtml(contact.preferredDays?.join(", ") || "Non renseigné")}</p>
      <p><strong>Plage horaire :</strong> ${escapeHtml(contact.preferredTimeSlot || "Non renseigné")}</p>
      <p><strong>Commentaire :</strong> ${escapeHtml(contact.comment || "Aucun")}</p>

      <h2>Destination</h2>
      <p style="font-size:26px; font-weight:900; color:#d94b8c;">
        ${escapeHtml(destinationName)}
      </p>
      <p><strong>Type :</strong> ${
        request?.mode === "customDestination"
          ? "Destination saisie manuellement par l'utilisateur"
          : "Destination proposée par l'application"
      }</p>

      <h2>Voyage</h2>
      <p><strong>Nombre de voyageurs :</strong> ${escapeHtml(userAnswers.travelers || "Non renseigné")}</p>
      <p><strong>Nombre de jours :</strong> ${escapeHtml(userAnswers.tripDays || "Non renseigné")}</p>
      <p><strong>Budget renseigné :</strong> ${escapeHtml(formatMoney(userAnswers.budgetTotal))}</p>
      ${
        userAnswers.usedFinalBudgetRelaunch
          ? "<p><strong>Relance budget :</strong> l'utilisateur a utilisé la relance avec budget maximum depuis l'écran résultat.</p>"
          : ""
      }

      <h2>Budget proposé par l'application</h2>
      <ul>
        <li><strong>Transport initial :</strong> ${escapeHtml(formatMoney(budgetBreakdown.initialTransport))}</li>
        <li><strong>Transport local :</strong> ${escapeHtml(formatMoney(budgetBreakdown.localTransport))}</li>
        <li><strong>Logement :</strong> ${escapeHtml(formatMoney(budgetBreakdown.logement))}</li>
        <li><strong>Nourriture :</strong> ${escapeHtml(formatMoney(budgetBreakdown.food))}</li>
        <li><strong>Activités :</strong> ${escapeHtml(formatMoney(budgetBreakdown.activities))}</li>
        <li><strong>Rémunération Travel Planner :</strong> ${escapeHtml(formatMoney(budgetBreakdown.travelPlanner))}</li>
        <li><strong>Total :</strong> ${escapeHtml(formatMoney(budgetBreakdown.total))}</li>
      </ul>

<h2>Résumé de la demande</h2>
<ul>
  <li><strong>Mode :</strong> ${escapeHtml(request?.mode || "Non renseigné")}</li>
  <li><strong>Destination :</strong> ${escapeHtml(destinationName)}</li>
  <li><strong>Voyageurs :</strong> ${escapeHtml(userAnswers.travelers || "Non renseigné")}</li>
  <li><strong>Durée :</strong> ${escapeHtml(userAnswers.tripDays || "Non renseigné")} jours</li>
  <li><strong>Budget utilisateur :</strong> ${escapeHtml(formatMoney(userAnswers.budgetTotal))}</li>
</ul>
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