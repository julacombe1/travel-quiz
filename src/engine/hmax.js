const CAR_BASE_MAX_HOURS = 8;
const PLANE_BASE_MAX_HOURS = 2;

const BASE_TRIP_DAYS = 3;

function getTripDays(answers) {
  const from = answers?.exactDates?.from;
  const to = answers?.exactDates?.to;

  if (from && to) {
    const start = new Date(from);
    const end = new Date(to);

    const diffMs = end.getTime() - start.getTime();

    return Math.max(
      1,
      Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    );
  }

  return Number(answers?.tripDays ?? 15);
}

function getDynamicMaxTravelTime(isAvion, tripDays) {
  const extraDays = Math.max(0, tripDays - BASE_TRIP_DAYS);

  if (isAvion) {
    return PLANE_BASE_MAX_HOURS + extraDays;
  }

  return CAR_BASE_MAX_HOURS + extraDays * 2;
}

function getTravelTimes(destination, isAvion) {
  const baseTime = isAvion
    ? Number(destination?.aviont) || 0
    : Number(destination?.communt) || 0;

  const comboTime = isAvion
    ? Number(destination?.aviontcombo) || 0
    : Number(destination?.communtcombo) || 0;

  return {
    baseTime,
    comboTime,
    totalAutoTime: baseTime + comboTime,
  };
}

export default function hmax(answers, destination) {
  const avionChoice = answers?.avion ?? "indifferent";

  const hasPlane =
    String(destination?.avion ?? "").toUpperCase() === "Y";

  const hasCommun =
    String(destination?.commun ?? "").toUpperCase() === "Y";

  const isAvion =
    avionChoice === "oui" ||
    (avionChoice === "indifferent" && hasPlane);

  if (!isAvion && !hasCommun) {
    return {
      score: 1,
      commentaire: "",
    };
  }

  const { baseTime, comboTime, totalAutoTime } = getTravelTimes(
    destination,
    isAvion
  );

  if (!baseTime) {
    return {
      score: 1,
      commentaire: "",
    };
  }

  const tripDays = getTripDays(answers);

  /* ========================= */
  /* AUTO COEF SELON DUREE */
  /* utilise base + combo */
  /* ========================= */

  const autoMax = getDynamicMaxTravelTime(isAvion, tripDays);

  if (totalAutoTime > autoMax) {
    return {
      score: 0,
      commentaire: isAvion
        ? `✈️ Trajet trop long (${totalAutoTime}h) pour ${tripDays} jours de voyage`
        : `🚗 Trajet trop long (${totalAutoTime}h) pour ${tripDays} jours de voyage`,
    };
  }

  /* ========================= */
  /* FILTRE MANUEL */
  /* utilise base uniquement */
  /* ========================= */

  const enabled = answers?.hmaxEnabled;
  const userMax = Number(answers?.hmax);

  const commentaire = isAvion
    ? destination?.aviontc ?? `✈️ Trajet ≈ ${baseTime}h`
    : destination?.communtc ?? `🚗 Trajet ≈ ${baseTime}h`;

  if (!enabled || !userMax) {
    return {
      score: 1,
      commentaire,
    };
  }

  const score = userMax < baseTime ? 0 : 1;

  return {
    score,
    commentaire,
  };
}