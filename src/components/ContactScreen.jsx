import { useMemo, useState } from "react";
import "./ContactScreen.css";

const CONTACT_MODES = [
  {
    id: "phone",
    icon: "📞",
    title: "Par téléphone",
    subtitle: "Aurélie vous rappelle directement",
  },
  {
    id: "whatsapp",
    icon: "💬",
    title: "Par WhatsApp",
    subtitle: "Pratique pour échanger rapidement",
  },
  {
    id: "email",
    icon: "✉️",
    title: "Par mail",
    subtitle: "Vous recevez une réponse détaillée",
  },
];

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const TIME_SLOTS = [
  "Plutôt le matin",
  "Entre midi et deux",
  "Plutôt l’après-midi",
  "En début de soirée",
  "Peu importe",
];

function normalizePhone(value) {
  return value.replace(/[.\s\-()]/g, "");
}

function isValidPhone(value) {
  const cleaned = normalizePhone(value);

  // Format France : 06..., 07..., 01..., etc.
  const frenchPhoneRegex = /^0[1-9]\d{8}$/;

  // Format international simple : +336..., +324..., etc.
  const internationalPhoneRegex = /^\+[1-9]\d{7,14}$/;

  return frenchPhoneRegex.test(cleaned) || internationalPhoneRegex.test(cleaned);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export default function ContactScreen({
  contactRequest,
  onBack,
  onSubmitContact,
}) {
  const [form, setForm] = useState({
    contactMode: "",
    phone: "",
    whatsapp: "",
    email: "",
    firstName: "",
    lastName: "",
    preferredDays: [],
    preferredTimeSlot: "",
    comment: "",
  });

  const [errors, setErrors] = useState({});

  const [isSending, setIsSending] = useState(false);
const [successInfo, setSuccessInfo] = useState(null);

  const destinationName = useMemo(() => {
    if (contactRequest?.customDestination) {
      return contactRequest.customDestination;
    }

    if (contactRequest?.destination?.nom) {
      return contactRequest.destination.nom;
    }

    if (contactRequest?.result?.destination?.nom) {
      return contactRequest.result.destination.nom;
    }

    return "votre voyage";
  }, [contactRequest]);

  const requiresPhone = form.contactMode === "phone";
  const requiresWhatsapp = form.contactMode === "whatsapp";
  const requiresEmail = form.contactMode === "email";
  const showCallPreferences = requiresPhone || requiresWhatsapp;

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
      submit: undefined,
    }));
  }

  function toggleDay(day) {
    setForm((prev) => {
      const alreadySelected = prev.preferredDays.includes(day);

      return {
        ...prev,
        preferredDays: alreadySelected
          ? prev.preferredDays.filter((item) => item !== day)
          : [...prev.preferredDays, day],
      };
    });
  }

  function validateForm(currentForm = form) {
    const nextErrors = {};

    if (!currentForm.contactMode) {
      nextErrors.contactMode = "Choisissez un mode de contact.";
    }

    if (currentForm.contactMode === "phone") {
      if (!currentForm.phone.trim()) {
        nextErrors.phone = "Le numéro de téléphone est obligatoire.";
      } else if (!isValidPhone(currentForm.phone)) {
        nextErrors.phone =
          "Le numéro semble invalide. Exemple : 0612345678 ou +33612345678.";
      }

      if (currentForm.email.trim() && !isValidEmail(currentForm.email)) {
        nextErrors.email = "L’adresse email semble invalide.";
      }
    }

    if (currentForm.contactMode === "whatsapp") {
      if (!currentForm.whatsapp.trim()) {
        nextErrors.whatsapp = "Le numéro WhatsApp est obligatoire.";
      } else if (!isValidPhone(currentForm.whatsapp)) {
        nextErrors.whatsapp =
          "Le numéro WhatsApp semble invalide. Exemple : 0612345678 ou +33612345678.";
      }

      if (currentForm.email.trim() && !isValidEmail(currentForm.email)) {
        nextErrors.email = "L’adresse email semble invalide.";
      }
    }

    if (currentForm.contactMode === "email") {
      if (!currentForm.email.trim()) {
        nextErrors.email = "L’adresse email est obligatoire.";
      } else if (!isValidEmail(currentForm.email)) {
        nextErrors.email = "L’adresse email semble invalide.";
      }

      if (currentForm.phone.trim() && !isValidPhone(currentForm.phone)) {
        nextErrors.phone =
          "Le numéro semble invalide. Exemple : 0612345678 ou +33612345678.";
      }
    }

    return nextErrors;
  }

async function handleSubmit(event) {
  event.preventDefault();

  const nextErrors = validateForm();

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }

  const contactPayload = {
    contact: {
      contactMode: form.contactMode,
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      preferredDays: form.preferredDays,
      preferredTimeSlot: form.preferredTimeSlot,
      comment: form.comment.trim(),
    },

    request: contactRequest,
  };

  try {
    setIsSending(true);
    setErrors({});
    setSuccessInfo(null);

    const apiBaseUrl = import.meta.env.VITE_API_URL || "";

    const response = await fetch(`${apiBaseUrl}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactPayload),
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data?.message || "Erreur pendant l'envoi de la demande.");
    }

    setSuccessInfo({
      orderId: data.orderId,
      message:
        "Votre demande a bien été envoyée. Aurélie reviendra vers vous prochainement.",
    });

    if (onSubmitContact) {
      onSubmitContact(data);
    }
  } catch (error) {
    console.error("Erreur envoi contact :", error);

    setErrors({
      submit:
        error?.message ||
        "Impossible d'envoyer la demande pour le moment. Merci de réessayer.",
    });
  } finally {
    setIsSending(false);
  }
}

  return (
    <div className="contact-bg">
      <main className="contact-screen">
        <form className="contact-card" onSubmit={handleSubmit}>
          <header className="contact-header">
            <p className="contact-eyebrow">Demande de voyage sur mesure</p>

            <h1>Comment veux-tu être contacté ?</h1>

            <p>
              Pour continuer avec{" "}
              <strong>{destinationName}</strong>, choisis le moyen le plus
              simple pour être recontacté.
            </p>
          </header>

          <section className="contact-modes">
            {CONTACT_MODES.map((mode) => {
              const isSelected = form.contactMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  className={`contact-mode-card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => updateField("contactMode", mode.id)}
                >
                  <span className="contact-mode-icon">{mode.icon}</span>

                  <span className="contact-mode-text">
                    <strong>{mode.title}</strong>
                    <small>{mode.subtitle}</small>
                  </span>

                  <span className="contact-mode-check">
                    {isSelected ? "✓" : ""}
                  </span>
                </button>
              );
            })}
          </section>

          {errors.contactMode && (
            <p className="contact-error">{errors.contactMode}</p>
          )}

          {form.contactMode && (
            <section className="contact-fields-section">
              <h2>Tes coordonnées</h2>

              <div className="contact-fields-grid">
                {requiresPhone && (
                  <label className="contact-field full">
                    <span>
                      Numéro de téléphone <strong>*</strong>
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      placeholder="Ex : 0612345678"
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      onBlur={() => setErrors(validateForm())}
                    />
                    {errors.phone && (
                      <small className="contact-error">{errors.phone}</small>
                    )}
                  </label>
                )}

                {requiresWhatsapp && (
                  <label className="contact-field full">
                    <span>
                      Numéro WhatsApp <strong>*</strong>
                    </span>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      placeholder="Ex : +33612345678"
                      onChange={(event) =>
                        updateField("whatsapp", event.target.value)
                      }
                      onBlur={() => setErrors(validateForm())}
                    />
                    {errors.whatsapp && (
                      <small className="contact-error">
                        {errors.whatsapp}
                      </small>
                    )}
                  </label>
                )}

                {requiresEmail && (
                  <label className="contact-field full">
                    <span>
                      Adresse email <strong>*</strong>
                    </span>
                    <input
                      type="email"
                      value={form.email}
                      placeholder="Ex : contact@email.com"
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      onBlur={() => setErrors(validateForm())}
                    />
                    {errors.email && (
                      <small className="contact-error">{errors.email}</small>
                    )}
                  </label>
                )}

                <label className="contact-field">
                  <span>Prénom</span>
                  <input
                    type="text"
                    value={form.firstName}
                    placeholder="Facultatif"
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                  />
                </label>

                <label className="contact-field">
                  <span>Nom</span>
                  <input
                    type="text"
                    value={form.lastName}
                    placeholder="Facultatif"
                    onChange={(event) =>
                      updateField("lastName", event.target.value)
                    }
                  />
                </label>

                {(requiresPhone || requiresWhatsapp) && (
                  <label className="contact-field full">
                    <span>Email complémentaire</span>
                    <input
                      type="email"
                      value={form.email}
                      placeholder="Facultatif"
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      onBlur={() => setErrors(validateForm())}
                    />
                    {errors.email && (
                      <small className="contact-error">{errors.email}</small>
                    )}
                  </label>
                )}

                {requiresEmail && (
                  <label className="contact-field full">
                    <span>Téléphone complémentaire</span>
                    <input
                      type="tel"
                      value={form.phone}
                      placeholder="Facultatif"
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      onBlur={() => setErrors(validateForm())}
                    />
                    {errors.phone && (
                      <small className="contact-error">{errors.phone}</small>
                    )}
                  </label>
                )}
              </div>
            </section>
          )}

          {showCallPreferences && (
            <section className="contact-fields-section">
              <h2>Préférences de contact</h2>

              <p className="contact-section-help">
                Ces informations sont facultatives, mais elles permettent de te
                recontacter au meilleur moment.
              </p>

              <div className="contact-days">
                {DAYS.map((day) => (
                  <button
                    key={day}
                    type="button"
                    className={`contact-day-chip ${
                      form.preferredDays.includes(day) ? "selected" : ""
                    }`}
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <label className="contact-field full">
                <span>Plage horaire préférée</span>
                <select
                  value={form.preferredTimeSlot}
                  onChange={(event) =>
                    updateField("preferredTimeSlot", event.target.value)
                  }
                >
                  <option value="">Aucune préférence</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </label>
            </section>
          )}

          {form.contactMode && (
            <section className="contact-fields-section">
              <label className="contact-field full">
                <span>Commentaire</span>
                <textarea
                  value={form.comment}
                  placeholder="Ex : dates flexibles, envie particulière, contrainte importante, surprise, voyage en couple, famille, etc."
                  onChange={(event) =>
                    updateField("comment", event.target.value)
                  }
                  rows={5}
                />
              </label>
            </section>
          )}

{successInfo && (
  <div className="contact-success">
    <strong>Demande envoyée ✅</strong>
    <p>{successInfo.message}</p>

    {successInfo.orderId && (
      <p>
        Numéro de dossier : <strong>{successInfo.orderId}</strong>
      </p>
    )}
  </div>
)}

{errors.submit && (
  <p className="contact-error contact-submit-error">{errors.submit}</p>
)}
          <footer className="contact-actions">
            <button type="button" className="contact-back-btn" onClick={onBack}>
              BACK
            </button>

<button
  type="submit"
  className="contact-submit-btn"
  disabled={isSending || !!successInfo}
>
  {isSending ? "ENVOI..." : successInfo ? "DEMANDE ENVOYÉE" : "ENVOYER"}
</button>
          </footer>
        </form>
      </main>
    </div>
  );
}