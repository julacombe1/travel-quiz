import { getDestinationMonthValue, MONTH_KEYS } from "./coefftemp.js";

const safeNumber = (value) => {
  if (value === "#N/A" || value === "" || value == null) return 0;
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

function getMonthKeyFromDate(date) {
  return MONTH_KEYS[date.getMonth()];
}

function getEventForMonth(destination, themeKey, monthKey) {
  return {
    score: safeNumber(getDestinationMonthValue(destination, themeKey, monthKey)),
    min: safeNumber(destination?.[`${themeKey}.${monthKey}min`]),
    max: safeNumber(destination?.[`${themeKey}.${monthKey}max`]),
    commentaire: destination?.[`${themeKey}.${monthKey}c`] ?? null,
  };
}

function computeExactDatesEvent(answers, destination, themeKey) {
  const stars = safeNumber(answers?.[themeKey]);
  if (stars <= 0) return { score: 0, commentaire: null };

  const from = new Date(answers.exactDates.from);
  const to = new Date(answers.exactDates.to);

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(to.getTime()) ||
    from > to
  ) {
    return { score: 0, commentaire: null };
  }

  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  const durationDays =
    Math.round((to - from) / (1000 * 60 * 60 * 24)) + 1;

  let start = new Date(from);
  let end = new Date(to);

  if (durationDays >= 3) {
    start.setDate(start.getDate() + 1);
    end.setDate(end.getDate() - 1);
  }

  let bestScore = 0;
  let bestCommentaire = null;
  let bestMonthKey = null;

  // 🔥 on boucle sur les mois (pas les jours)
  for (const monthKey of MONTH_KEYS) {
    const event = getEventForMonth(destination, themeKey, monthKey);

    if (!event.score || !event.min || !event.max) continue;

    let hasValidDay = false;

    const current = new Date(start);

    // 🔥 on vérifie s'il y a AU MOINS 1 jour valide dans ce mois
    while (current <= end) {
      const currentMonthKey = getMonthKeyFromDate(current);

      if (currentMonthKey !== monthKey) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const day = current.getDate();

      if (day >= event.min && day <= event.max) {
        hasValidDay = true;
        break;
      }

      current.setDate(current.getDate() + 1);
    }

    if (!hasValidDay) continue;

    const score = stars * event.score;

    if (score > bestScore) {
      bestScore = score;
      bestCommentaire = event.commentaire;
      bestMonthKey = monthKey;
    }
  }

  return {
    score: bestScore,
    commentaire: bestCommentaire,
    monthKey: bestMonthKey,
  };
}

export default function eventTheme(themeKey) {
  return function (answers, destination) {
    const stars = safeNumber(answers?.[themeKey]);

    if (stars <= 0) {
      return { score: 0, commentaire: null };
    }

    // Cas 1 : intervalle exact
    if (answers?.exactDates?.from && answers?.exactDates?.to) {
      return computeExactDatesEvent(answers, destination, themeKey);
    }

    // Cas 2 : mois imposé par ton moteur (_month)
    const monthKey = answers?._month;

    if (!monthKey) {
      return { score: 0, commentaire: null };
    }

    const event = getEventForMonth(destination, themeKey, monthKey);

    if (event.score <= 0) {
      return { score: 0, commentaire: null };
    }

    return {
      score: stars * event.score,
      commentaire: event.commentaire,
      monthKey,
    };
  };
}