import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Resend } from "resend";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL;
const MAIL_FROM = process.env.MAIL_FROM;
const MAIL_TO = process.env.MAIL_TO;

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
  "http://localhost:5177",
  "http://localhost:5178",
  "http://localhost:5179",
  "http://localhost:5180",
  FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origine CORS non autorisée : ${origin}`));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  "/api/contact",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 8,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const ContactSchema = z.object({
  contact: z.object({
    contactMode: z.enum(["phone", "whatsapp", "email"]),
    phone: z.string().optional().default(""),
    whatsapp: z.string().optional().default(""),
    email: z.string().optional().default(""),
    firstName: z.string().optional().default(""),
    lastName: z.string().optional().default(""),
    preferredDays: z.array(z.string()).optional().default([]),
    preferredTimeSlot: z.string().optional().default(""),
    comment: z.string().optional().default(""),
  }),

  request: z.object({
    mode: z.string().optional(),
    customDestination: z.string().optional(),
    destination: z.any().optional(),
    budgetBreakdown: z.any().optional(),
    emailContext: z.any().optional(),
    results: z.any().optional(),
  }),
});

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "Non renseigné";

  return `${Math.round(number).toLocaleString("fr-FR")} €`;
}

function formatDateFr(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("fr-FR");
}

function getMonthLabel(monthKey) {
  const months = {
    janvier: "janvier",
    fevrier: "février",
    mars: "mars",
    avril: "avril",
    mai: "mai",
    juin: "juin",
    juillet: "juillet",
    aout: "août",
    septembre: "septembre",
    octobre: "octobre",
    novembre: "novembre",
    decembre: "décembre",
    best: "meilleur mois calculé automatiquement",
  };

  return months[monthKey] || monthKey || "Non renseigné";
}

function normalizePhone(value) {
  return String(value || "").replace(/[.\s\-()]/g, "");
}

function isValidPhone(value) {
  const cleaned = normalizePhone(value);
  const frenchPhoneRegex = /^0[1-9]\d{8}$/;
  const internationalPhoneRegex = /^\+[1-9]\d{7,14}$/;

  return frenchPhoneRegex.test(cleaned) || internationalPhoneRegex.test(cleaned);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || "").trim());
}

function validateContactBusinessRules(payload) {
  const { contact } = payload;

  if (contact.contactMode === "phone" && !isValidPhone(contact.phone)) {
    return "Le numéro de téléphone est invalide.";
  }

  if (contact.contactMode === "whatsapp" && !isValidPhone(contact.whatsapp)) {
    return "Le numéro WhatsApp est invalide.";
  }

  if (contact.contactMode === "email" && !isValidEmail(contact.email)) {
    return "L’adresse email est invalide.";
  }

  if (contact.email && !isValidEmail(contact.email)) {
    return "L’adresse email complémentaire est invalide.";
  }

  if (contact.phone && !isValidPhone(contact.phone)) {
    return "Le numéro de téléphone complémentaire est invalide.";
  }

  return null;
}

async function getNextOrderNumber() {
  const dataDir = path.join(__dirname, "data");
  const counterPath = path.join(dataDir, "order-counter.json");

  await fs.mkdir(dataDir, { recursive: true });

  let current = 0;

  try {
    const raw = await fs.readFile(counterPath, "utf-8");
    current = JSON.parse(raw).lastOrderNumber || 0;
  } catch {
    current = 0;
  }

  const next = current + 1;

  await fs.writeFile(
    counterPath,
    JSON.stringify({ lastOrderNumber: next }, null, 2),
    "utf-8"
  );

  return next;
}

function formatOrderNumber(number) {
  const year = new Date().getFullYear();
  return `TP-${year}-${String(number).padStart(5, "0")}`;
}

function getDestinationName(request) {
  if (request?.mode === "customDestination" && request?.customDestination) {
    return request.customDestination;
  }

  return (
    request?.destination?.nom ||
    request?.destination?.name ||
    request?.destination ||
    "Destination non renseignée"
  );
}

function shouldShowDestinationDetails(request) {
  return request?.mode !== "customDestination";
}

function formatTravelDates(userAnswers) {
  if (userAnswers?.exactDates?.from || userAnswers?.exactDates?.to) {
    return `
      <p><strong>Type :</strong> Dates exactes renseignées par l'utilisateur</p>
      <p><strong>Départ :</strong> ${escapeHtml(formatDateFr(userAnswers.exactDates.from) || "Non renseigné")}</p>
      <p><strong>Retour :</strong> ${escapeHtml(formatDateFr(userAnswers.exactDates.to) || "Non renseigné")}</p>
    `;
  }

  if (userAnswers?.selectedMonth === "best") {
    return `
      <p><strong>Type :</strong> L'utilisateur a choisi “trouve-moi le meilleur mois”</p>
      <p><strong>Mois :</strong> meilleur mois calculé automatiquement par l'application</p>
    `;
  }

  return `
    <p><strong>Type :</strong> Mois fixé par l'utilisateur</p>
    <p><strong>Mois :</strong> ${escapeHtml(getMonthLabel(userAnswers?.selectedMonth))}</p>
  `;
}

function formatProfilePreferences(userAnswers, profileType) {
  const aventureValue = userAnswers?.aventure;
  const villeValue = userAnswers?.ville;

  const aventureLabel =
    profileType ||
    (aventureValue !== undefined && aventureValue !== null
      ? aventureValue
      : "Non renseigné");

  const villeLabel =
    villeValue !== undefined && villeValue !== null
      ? villeValue
      : "Non renseigné";

  return `
    <p><strong>Profil Aventure / Farniente :</strong> ${escapeHtml(aventureLabel)}</p>
    <p><strong>Ville / Activité :</strong> ${escapeHtml(villeLabel)}</p>
  `;
}

function formatTransportChanges(userAnswers) {
  const changes = [];

  if (userAnswers?.avion && userAnswers.avion !== "indifferent") {
    changes.push(`Transport initial : ${userAnswers.avion}`);
  }

  if (userAnswers?.hmaxEnabled) {
    changes.push(`Temps de trajet maximum activé : ${userAnswers.hmax} h`);
  }

  const modes = userAnswers?.transportModes || {};
  const defaultLocalTransport =
    modes.indifferent === true &&
    modes.voiture === false &&
    modes.commun === false &&
    modes.taxi === false &&
    modes.vtc === false;

  if (userAnswers?.transportEnabled === false) {
    changes.push("Transport local désactivé");
  }

  if (!defaultLocalTransport) {
    const selectedModes = Object.entries(modes)
      .filter(([, checked]) => checked)
      .map(([mode]) => mode)
      .join(", ");

    changes.push(`Moyens de transport locaux sélectionnés : ${selectedModes || "aucun"}`);
  }

  if (changes.length === 0) {
    return "";
  }

  return `
    <section>
      <h2>Moyens de transport modifiés</h2>
      <ul>
        ${changes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
    </section>
  `;
}

function formatThemesSection(title, themes = []) {
  if (!themes.length) return "";

  return `
    <h3>${escapeHtml(title)}</h3>
    <ul>
      ${themes
        .map(
          (theme) =>
            `<li><strong>${escapeHtml(theme.label)}</strong> = ${escapeHtml(theme.score)}/${escapeHtml(theme.maxScore)}</li>`
        )
        .join("")}
    </ul>
  `;
}

function formatAllThemes(selectedThemes) {
  const html = [
    formatThemesSection("Thèmes 1", selectedThemes?.themes1 || []),
    formatThemesSection("Thèmes 2", selectedThemes?.themes2 || []),
    formatThemesSection("Thèmes 3", selectedThemes?.themes3 || []),
  ].join("");

  if (!html.trim()) {
    return "<p>Aucun thème activé.</p>";
  }

  return html;
}

function getBudgetRows(budgetBreakdown) {
  if (!budgetBreakdown) return [];

  const rows = [
    ["Transport initial", budgetBreakdown.initialTransport],
    ["Transport local", budgetBreakdown.localTransport],
    ["Logement", budgetBreakdown.logement],
    ["Nourriture", budgetBreakdown.food],
    ["Activités", budgetBreakdown.activities],
    ["Rémunération Travel Planner", budgetBreakdown.travelPlanner],
    ["Total", budgetBreakdown.total],
  ];

  return rows.filter(([, value]) => value !== undefined && value !== null);
}

function formatBudgetBreakdown(budgetBreakdown) {
  const rows = getBudgetRows(budgetBreakdown);

  if (!rows.length) {
    return "<p>Répartition détaillée non disponible.</p>";
  }

  return `
    <table>
      <tbody>
        ${rows
          .map(
            ([label, value]) => `
              <tr>
                <td>${escapeHtml(label)}</td>
                <td><strong>${escapeHtml(formatMoney(value))}</strong></td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function formatDisplayedDestinationDetails(request) {
  if (!shouldShowDestinationDetails(request)) {
    return "";
  }

  const destination = request?.destination || {};
  const result = request?.result || {};
  const source = {
    ...destination,
    ...result,
  };

  const items = [
    ["Température", source.temperatureText || source.tempText || source.temperature || source.chalText],
    ["Baignade", source.merText || source.merComment || source.merc],
    ["Baignade insolite", source.insoText || source.insoComment],
    ["Mois affiché", source.monthLabel || source.bestMonth || source.mois],
    ["Temps de trajet", source.travelTimeText || source.transportText || source.aviont || source.communt],
    ["Sécurité", source.secuText || source.secuComment],
    ["Fréquentation", source.tourText || source.tourComment],
    ["Commentaire", source.comment || source.commentaire],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");

  if (!items.length) {
    return "<p>Les détails affichés à l'utilisateur ne sont pas disponibles dans le payload actuel.</p>";
  }

  return `
    <ul>
      ${items
        .map(
          ([label, value]) =>
            `<li><strong>${escapeHtml(label)} :</strong> ${escapeHtml(value)}</li>`
        )
        .join("")}
    </ul>
  `;
}

function buildEmailHtml({ orderId, payload }) {
  const { contact, request } = payload;

  const userAnswers = request?.emailContext?.userAnswers || {};
  const selectedThemes = request?.emailContext?.selectedThemes || {};
  const profileType = request?.emailContext?.profileType || "";
  const destinationName = getDestinationName(request);

  const contactModeLabels = {
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    email: "Mail",
  };

  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #2f2440;
            background: #f7f1fb;
            padding: 24px;
          }

          .container {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 18px;
            padding: 24px;
          }

          h1 {
            margin-top: 0;
            color: #8d45b5;
          }

          h2 {
            margin-top: 28px;
            padding-bottom: 8px;
            border-bottom: 1px solid #eadcf4;
            color: #3b284c;
          }

          h3 {
            color: #6c3b85;
          }

          .destination {
            font-size: 26px;
            font-weight: 900;
            color: #d94b8c;
          }

          .important {
            padding: 14px;
            border-radius: 14px;
            background: #f9eefc;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td {
            padding: 9px 8px;
            border-bottom: 1px solid #eee;
          }

          td:last-child {
            text-align: right;
          }

          li {
            margin-bottom: 6px;
          }
        </style>
      </head>

      <body>
        <div class="container">
          <h1>Nouvelle demande Travel Planner — ${escapeHtml(orderId)}</h1>

          <section class="important">
            <h2>Coordonnées client</h2>
            <p><strong>Mode de contact souhaité :</strong> ${escapeHtml(contactModeLabels[contact.contactMode])}</p>
            <p><strong>Prénom :</strong> ${escapeHtml(contact.firstName || "Non renseigné")}</p>
            <p><strong>Nom :</strong> ${escapeHtml(contact.lastName || "Non renseigné")}</p>
            <p><strong>Téléphone :</strong> ${escapeHtml(contact.phone || "Non renseigné")}</p>
            <p><strong>WhatsApp :</strong> ${escapeHtml(contact.whatsapp || "Non renseigné")}</p>
            <p><strong>Email :</strong> ${escapeHtml(contact.email || "Non renseigné")}</p>
            <p><strong>Jours préférés :</strong> ${escapeHtml(contact.preferredDays?.join(", ") || "Non renseigné")}</p>
            <p><strong>Plage horaire préférée :</strong> ${escapeHtml(contact.preferredTimeSlot || "Non renseigné")}</p>
            <p><strong>Commentaire :</strong> ${escapeHtml(contact.comment || "Aucun")}</p>
          </section>

          <section>
            <h2>Destination demandée</h2>
            <p class="destination">${escapeHtml(destinationName)}</p>
            ${
              request?.mode === "customDestination"
                ? "<p><strong>Type :</strong> Destination renseignée manuellement par l'utilisateur.</p>"
                : "<p><strong>Type :</strong> Destination proposée par l'application.</p>"
            }
          </section>

          <section>
            <h2>Voyage</h2>
            <p><strong>Nombre de voyageurs :</strong> ${escapeHtml(userAnswers.travelers || "Non renseigné")}</p>
            <p><strong>Nombre de jours :</strong> ${escapeHtml(userAnswers.tripDays || "Non renseigné")}</p>
            ${formatTravelDates(userAnswers)}
          </section>

          <section>
            <h2>Budget renseigné par l'utilisateur</h2>
            <p><strong>Budget total :</strong> ${escapeHtml(formatMoney(userAnswers.budgetTotal))}</p>
            ${
              userAnswers.usedFinalBudgetRelaunch
                ? "<p><strong>Relance finale :</strong> l'utilisateur a utilisé la relance avec budget maximum / illimité depuis l'écran résultat.</p>"
                : ""
            }
          </section>

          <section>
            <h2>Préférences principales</h2>
            ${formatProfilePreferences(userAnswers, profileType)}
          </section>

          ${formatTransportChanges(userAnswers)}

          <section>
            <h2>Thèmes activés</h2>
            ${formatAllThemes(selectedThemes)}
          </section>

          <section>
            <h2>Budget proposé par l'application</h2>
            ${formatBudgetBreakdown(request?.budgetBreakdown)}
          </section>

          ${
            shouldShowDestinationDetails(request)
              ? `
                <section>
                  <h2>Informations affichées à l'utilisateur</h2>
                  ${formatDisplayedDestinationDetails(request)}
                </section>
              `
              : ""
          }
        </div>
      </body>
    </html>
  `;
}

app.post("/api/contact", async (req, res) => {
  try {
    const parsed = ContactSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Données invalides.",
      });
    }

    const payload = parsed.data;
    const businessError = validateContactBusinessRules(payload);

    if (businessError) {
      return res.status(400).json({
        message: businessError,
      });
    }

    const nextOrderNumber = await getNextOrderNumber();
    const orderId = formatOrderNumber(nextOrderNumber);

    const destinationName = getDestinationName(payload.request);

    const subject = `${orderId} — Nouvelle demande Travel Planner — ${destinationName}`;

    const html = buildEmailHtml({
      orderId,
      payload,
    });

    const result = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      subject,
      html,
    });

    return res.status(200).json({
      success: true,
      orderId,
      emailId: result?.data?.id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur pendant l'envoi de la demande.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur Travel Planner lancé sur http://localhost:${PORT}`);
});