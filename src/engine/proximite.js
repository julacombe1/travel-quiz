// src/engine/proximite.js

const PARAMS = {
  franceCoeff: 0.9,
  neighborCoeff: 0.92,
  minFlightTime: 2,
  maxFlightTime: 10,
  minCoeff: 0.93,
  maxCoeff: 1,
};


const NEIGHBOR_COUNTRIES = [
  "ITALIE",
  "ANDORRE",
  "ESPAGNE",
  "ALLEMAGNE",
  "BELGIQUE",
  "LUXEMBOURG",
  "SUISSE",
  "ANGLETERRE",
];

const normalize = (value) =>
  String(value ?? "").trim().toUpperCase();

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export default function proximite(answers, destination) {
  const pays = normalize(destination?.pays);
  const continent = normalize(destination?.continent);
  const aviont = toNumber(destination?.aviont, null);

  if (pays === "FRANCE" && continent === "EU") {
    return {
      score: PARAMS.franceCoeff,
      commentaire: "Destination proche de la France",
    };
  }

  if (NEIGHBOR_COUNTRIES.includes(pays)) {
    return {
      score: PARAMS.neighborCoeff,
      commentaire: "Destination européenne proche",
    };
  }

  if (aviont == null || aviont >= PARAMS.maxFlightTime) {
    return {
      score: PARAMS.maxCoeff,
      commentaire: "",
    };
  }

  if (aviont <= PARAMS.minFlightTime) {
    return {
      score: PARAMS.minCoeff,
      commentaire: "",
    };
  }

  const ratio =
    (aviont - PARAMS.minFlightTime) /
    (PARAMS.maxFlightTime - PARAMS.minFlightTime);

  const coeff =
    PARAMS.minCoeff +
    ratio * (PARAMS.maxCoeff - PARAMS.minCoeff);

  return {
    score: coeff,
    commentaire: "",
  };
}