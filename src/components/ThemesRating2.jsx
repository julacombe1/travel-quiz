import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { THEMES_BY_PROFILE } from "../data/themes2";
import "./ThemesRating2.css";

/* ===================== */
/* ICÔNES */
/* ===================== */

const getEmoji = (id) => {
  const map = {
    histo: "🏛️",
    reli: "⛪",
    musees: "🖼️",
    arch: "🏺",
    shop: "🛍️",
    moder: "🏙️",
    spec: "🎭",
    noctu: "🌙",
    quar: "🎨",
    streetart: "🎨",
    soin: "💆",
    massage: "💆",

    attrac: "🎢",
    attracsens: "⚡",
    zoo: "🐘",
    aqua: "🐠",
    carna: "🎉",
    festi: "🎶",

    monu: "🏛️",
    snork: "🤿",
    plongee: "🤿",
    visite: "🗺️",
    planta: "🌴",
    velo: "🚴",
    cyclisme: "⛰️",
    canoe: "🛶",
    rafting: "🛶",
    canyon: "🏞️",
    accro: "🧗",
    viaferrata: "🧗",
    motor: "🏎️",
    jetski: "🚤",
    bateau: "⛴️",
    surf: "🏄",
    grot: "🕳️",
    speleo: "⛏️",
    aerien: "🚁",
    extreme: "🪂",
    esca: "🧗",
  };

  return map[id] || "⭐";
};

/* ===================== */
/* PROFIL SELON VILLEVALUE */
/* ===================== */

const getVilleProfileKey = (villeValue) => {
  if (villeValue >= 7) return "fullVille";
  if (villeValue === 6) return "Ville";
  if (villeValue === 5) return "plusVille";
  if (villeValue === 4) return "mixte";
  if (villeValue === 3) return "plusActivite";
  if (villeValue === 2) return "Activite";
  if (villeValue === 1) return "fullActivite";

  return "mixte";
};

/* ===================== */
/* COULEURS DES CARTES */
/* ===================== */

const ACTIVITE_THEMES = [
  "snork",
  "plongee",
  "visite",
  "planta",
  "velo",
  "cyclisme",
  "canoe",
  "rafting",
  "canyon",
  "accro",
  "viaferrata",
  "motor",
  "jetski",
  "surf",
  "grot",
  "speleo",
  "aerien",
  "extreme",
  "esca",
];

const YELLOW_THEMES = [
  "festi",
  "carna",
  "attrac",
  "attracsens",
  "zoo",
  "aqua",
];

const getThemeColor = (theme) => {
  if (
    YELLOW_THEMES.includes(theme.id) ||
    YELLOW_THEMES.includes(theme.duoId)
  ) {
    return "rgba(206, 163, 23, 0.55)";
  }

  if (
    ACTIVITE_THEMES.includes(theme.id) ||
    ACTIVITE_THEMES.includes(theme.duoId)
  ) {
    return "rgba(87, 212, 235, 0.45)";
  }

  return "rgba(220, 193, 237, 0.45)";
};

/* ===================== */
/* COMPOSANT */
/* ===================== */

export default function ThemesRating2({
  values = {},
  onChange,
  onValidate,
  onBack,
  onBackKeep,
}) {
  const villeValue = values?.ville ?? 4;
  const profileKey = getVilleProfileKey(villeValue);
  const themes = THEMES_BY_PROFILE[profileKey] || [];

  /*
    État local de l'écran.

    localRatings :
    - contient la note visible sur les 3 étoiles de chaque carte.

    localDuoActive :
    - indique si l'étoile clignotante est cochée.
    - si true, la note ira dans duoId au moment du OK.
    - si false, la note ira dans id.
  */
  const [localRatings, setLocalRatings] = useState({});
  const [localDuoActive, setLocalDuoActive] = useState({});

  /*
    Quand on arrive sur l'écran, ou quand villeValue change,
    on reconstruit l'affichage depuis userAnswers.

    Règle :
    - priorité à id si déjà noté ;
    - sinon on regarde duoId ;
    - si duoId est noté, l'étoile clignotante est activée.
  */
  useEffect(() => {
    const nextRatings = {};
    const nextDuoActive = {};

    themes.forEach((theme) => {
      const idStars = Number(values?.[theme.id]) || 0;
      const duoStars = theme.duoId
        ? Number(values?.[theme.duoId]) || 0
        : 0;

      if (idStars > 0) {
        nextRatings[theme.id] = idStars;
        nextDuoActive[theme.id] = false;
        return;
      }

      if (theme.duoId && duoStars > 0) {
        nextRatings[theme.id] = duoStars;
        nextDuoActive[theme.id] = true;
        return;
      }

      nextRatings[theme.id] = 0;
      nextDuoActive[theme.id] = false;
    });

    setLocalRatings(nextRatings);
    setLocalDuoActive(nextDuoActive);
  }, [profileKey]);

  /*
    Modification des 3 étoiles.

    Si la note passe à 0 :
    - on réinitialise immédiatement id et duoId dans userAnswers ;
    - cela permet que BACK + conserve les étoiles ne garde pas une ancienne note.
  */
  const handleChange = (theme, value) => {
    setLocalRatings((prev) => ({
      ...prev,
      [theme.id]: value,
    }));

    if (value <= 0) {
      setLocalDuoActive((prev) => ({
        ...prev,
        [theme.id]: false,
      }));

      onChange?.({
        [theme.id]: 0,
        ...(theme.duoId ? { [theme.duoId]: 0 } : {}),
      });
    }
  };

  /*
    Clic sur l'étoile clignotante.

    Elle ne modifie pas directement userAnswers.
    Elle choisit seulement si la note ira vers id ou duoId au moment du OK.
  */
  const handleDuoChange = (theme) => {
    if (!theme.duoId) return;

    const stars = Number(localRatings[theme.id]) || 0;
    if (stars <= 0) return;

    setLocalDuoActive((prev) => ({
      ...prev,
      [theme.id]: !prev[theme.id],
    }));
  };

  /*
    Clic sur la carte :
    - 0 → 1
    - 1 → 2
    - 2 → 3
    - 3 → 0
  */
  const handleThemeClick = (theme) => {
    const currentValue = Number(localRatings[theme.id]) || 0;
    const nextValue = currentValue >= 3 ? 0 : currentValue + 1;

    handleChange(theme, nextValue);
  };

  /*
    Validation.

    On écrit proprement dans userAnswers :
    - si duo non coché : id = étoiles, duoId = 0
    - si duo coché : id = 0, duoId = étoiles
    - si 0 étoile : id = 0, duoId = 0

    Ainsi calculateResults ne double-compte jamais id + duoId.
  */
const buildAnswersPatch = ({ keepHiddenDuoTheme = false } = {}) => {
  const patch = {};

  themes.forEach((theme) => {
    const stars = Number(localRatings[theme.id]) || 0;
    const duoActive = theme.duoId && localDuoActive[theme.id];

    // Si toutes les étoiles sont désactivées,
    // on réinitialise toujours id + duoId.
    if (stars <= 0) {
      patch[theme.id] = 0;

      if (theme.duoId) {
        patch[theme.duoId] = 0;
      }

      return;
    }

    // Thème sans duo : comportement normal.
    if (!theme.duoId) {
      patch[theme.id] = stars;
      return;
    }

    // Cas 1 : étoile clignotante activée.
    // La note visible va dans duoId.
    if (duoActive) {
      patch[theme.duoId] = stars;

      // Si on n'est PAS en mode BACK + conserve,
      // on efface le thème principal caché.
      if (!keepHiddenDuoTheme) {
        patch[theme.id] = 0;
      }

      return;
    }

    // Cas 2 : étoile clignotante désactivée.
    // La note visible va dans id.
    patch[theme.id] = stars;

    // Si on n'est PAS en mode BACK + conserve,
    // on efface le duo caché.
    if (!keepHiddenDuoTheme) {
      patch[theme.duoId] = 0;
    }
  });

  return patch;
};

const buildKeepBackPatch = () => {
  const patch = {};

  themes.forEach((theme) => {
    const stars = Number(localRatings[theme.id]) || 0;
    const duoActive = theme.duoId && localDuoActive[theme.id];

    // Cas spécial : si l'utilisateur a retiré toutes les étoiles,
    // on réinitialise bien id + duoId.
    if (stars <= 0) {
      patch[theme.id] = 0;

      if (theme.duoId) {
        patch[theme.duoId] = 0;
      }

      return;
    }

    // Si l'étoile clignotante est activée :
    // on sauvegarde uniquement le duoId.
    // On ne touche pas à theme.id.
    if (theme.duoId && duoActive) {
      patch[theme.duoId] = stars;
      return;
    }

    // Sinon :
    // on sauvegarde uniquement l'id.
    // On ne touche pas au duoId.
    patch[theme.id] = stars;
  });

  return patch;
};

const handleValidate = () => {
  const patch = buildAnswersPatch({
    keepHiddenDuoTheme: values?._theme2KeepDuoScores === true,
  });

  onValidate?.({
    ...values,
    ...patch,
    _theme2KeepDuoScores: false,
  });
};
const handleBackKeep = () => {
  const patch = buildAnswersPatch({
    keepHiddenDuoTheme: true,
  });

  onChange?.({
    ...patch,
    _theme2KeepDuoScores: true,
  });

  onBackKeep?.();
};
  return (
    <div className="themes2-bg">
      <div className="ville-grid-screen">
        <div className="grid">
          {themes.map((theme) => {
            const themeValue = Number(localRatings[theme.id]) || 0;
            const duoValue = localDuoActive[theme.id] ? 1 : 0;
            const label =
              theme.themeLabel ?? theme.themelabel ?? theme.label;

            return (
              <div
                key={`${theme.id}-${theme.duoId ?? "solo"}`}
                className="card"
                style={{ background: getThemeColor(theme) }}
                onClick={() => handleThemeClick(theme)}
              >
                <div
                  className="card-stars"
                  onClick={(e) => e.stopPropagation()}
                >
                  <StarRating
                    value={themeValue}
                    max={3}
                    onChange={(value) => handleChange(theme, value)}
                  />
                </div>

                <div className="emoji">{getEmoji(theme.id)}</div>

                <div className="label">{label}</div>

                {theme.duoId && themeValue > 0 && (
                  <div
                    className="sub-option"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sub-option attrac-star blinking-attrac-star">
                      <StarRating
                        value={duoValue}
                        max={1}
                        variant="blink"
                        onChange={() => handleDuoChange(theme)}
                      />
                    </div>

                    <div className="sub-option-label duo-label">
                      {theme.starLabel}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

<div className="app-actions with-keep">
  <div className="app-actions-left">
    <button
      type="button"
      className="app-btn back compact"
      onClick={onBack}
    >
      BACK
    </button>

    <button
      type="button"
      className="app-btn keep-stars two-lines"
      onClick={handleBackKeep}
    >
      <span>BACK &</span>
      <span>conserve</span>
      <span>les ⭐</span>
    </button>
  </div>

  <button
    type="button"
    className="app-btn ok main-ok"
    onClick={handleValidate}
  >
    OK
  </button>
</div>
      </div>
    </div>
  );
}