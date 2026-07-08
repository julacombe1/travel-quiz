import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { THEMES3 } from "../data/themes3";
import "./ThemesRating3.css";

/* ===================== */
/* ICÔNES */
/* ===================== */

const getEmoji = (id) => {
  const map = {
    streetfood: "🥙",
    stvege: "🥦",

    cuisineloc: "🍲",
    cuivege: "🥦",

    gastro: "🍽️",
    gasvege: "🥦",

    alcool: "🍸",
    vin: "🍷",

    doux: "🍯",
    epice: "🌶️",

    atelcul: "👨‍🍳",

    confort: "🛏️",
    luxe: "💎",
    
    popu: "🤝",

    camp: "⛺",
    sauvage: "🏕️",

    jacuz: "🫧",
    pisci: "🏊",

    roman: "💘",
    coquin: "🔥",

    atyp: "🌿",
    eco: "🌱",
  };

  return map[id] || "⭐";
};

/* ===================== */
/* COULEURS */
/* ===================== */

const FOOD_THEMES = [
  "streetfood",
  "stvege",
  "cuisineloc",
  "cuivege",
  "gastro",
  "gasvege",
  "alcool",
  "vin",
  "doux",
  "epice",
  "atelcul",
];

const getThemeColor = (theme) => {
  if (
    FOOD_THEMES.includes(theme.id) ||
    FOOD_THEMES.includes(theme.duoId)
  ) {
    return "rgba(255, 215, 0, 0.45)";
  }

  return "rgba(255, 105, 180, 0.45)";
};

/* ===================== */
/* COMPOSANT */
/* ===================== */

export default function ThemesRating3({
  values = {},
  onChange,
  onValidate,
  onBack,
  onBackKeep,
}) {
  const themes = THEMES3 || [];

  const foodThemes = themes.slice(0, 6);
  const lodgingThemes = themes.slice(6);

  /*
    localRatings :
    - note visible sur les 3 étoiles de chaque carte.

    localDuoActive :
    - true si l'étoile clignotante est cochée.
    - si true : la note ira dans duoId.
    - si false : la note ira dans id.
  */
  const [localRatings, setLocalRatings] = useState({});
  const [localDuoActive, setLocalDuoActive] = useState({});

  /*
    À l'arrivée sur l'écran, on reconstruit l'affichage
    depuis userAnswers.

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
}, []);

  /*
    Changement des 3 étoiles.

    Si la note passe à 0 :
    - on remet immédiatement id et duoId à 0 dans userAnswers,
    - même si on fait ensuite BACK + conserve.
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
    Elle choisit seulement si la note ira vers id ou duoId
    au moment du OK ou du BACK + conserve.
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
    0 → 1 → 2 → 3 → 0
  */
  const handleThemeClick = (theme) => {
    const currentValue = Number(localRatings[theme.id]) || 0;
    const nextValue = currentValue >= 3 ? 0 : currentValue + 1;

    handleChange(theme, nextValue);
  };

  /*
    Patch pour OK.

    Si keepHiddenDuoTheme = false :
    - le thème caché est remis à 0.
    - utile après un BACK classique depuis l'écran suivant.

    Si keepHiddenDuoTheme = true :
    - le thème caché est conservé.
    - utile après BACK + conserve les étoiles.
  */
  const buildAnswersPatch = ({ keepHiddenDuoTheme = false } = {}) => {
    const patch = {};

    themes.forEach((theme) => {
      const stars = Number(localRatings[theme.id]) || 0;
      const duoActive = theme.duoId && localDuoActive[theme.id];

      if (stars <= 0) {
        patch[theme.id] = 0;

        if (theme.duoId) {
          patch[theme.duoId] = 0;
        }

        return;
      }

      if (!theme.duoId) {
        patch[theme.id] = stars;
        return;
      }

      if (duoActive) {
        patch[theme.duoId] = stars;

        if (!keepHiddenDuoTheme) {
          patch[theme.id] = 0;
        }

        return;
      }

      patch[theme.id] = stars;

      if (!keepHiddenDuoTheme) {
        patch[theme.duoId] = 0;
      }
    });

    return patch;
  };

  /*
    OK :
    - applique la logique de validation,
    - puis avance à l'écran suivant.
  */
  const handleValidate = () => {
    const patch = buildAnswersPatch({
      keepHiddenDuoTheme: values?._theme3KeepDuoScores === true,
    });

    onValidate?.({
      ...values,
      ...patch,
      _theme3KeepDuoScores: false,
    });
  };

  /*
    BACK + conserve :
    - sauvegarde les étoiles visibles,
    - conserve les notes cachées des duos,
    - puis revient à l'écran précédent.
  */
  const handleBackKeep = () => {
    const patch = buildAnswersPatch({
      keepHiddenDuoTheme: true,
    });

    onChange?.({
      ...patch,
      _theme3KeepDuoScores: true,
    });

    onBackKeep?.();
  };

  const renderThemeCard = (theme) => {
    const themeValue = Number(localRatings[theme.id]) || 0;
    const duoValue = localDuoActive[theme.id] ? 1 : 0;
    const label = theme.themeLabel ?? theme.themelabel ?? theme.label;

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
            <div className="sub-option attrac-star theme3-extra-blink">
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
  };

  return (
    <div className="themes3-bg">
      <div className="ville-grid-screen">
        <div className="themes3-groups">
          <section className="themes3-section">
            <h2 className="themes3-title">Nourriture & boissons</h2>

            <div className="grid themes3-grid">
              {foodThemes.map(renderThemeCard)}
            </div>
          </section>

          <section className="themes3-section">
            <h2 className="themes3-title">Logement</h2>

            <div className="grid themes3-grid">
              {lodgingThemes.map(renderThemeCard)}
            </div>
          </section>
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