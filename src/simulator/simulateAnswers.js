import fs from "fs";
import Papa from "papaparse";
import answers2 from "../data/answers2.js";


const MONTHS = [
  "Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre",
];

const THEME_CLICK_PROBABILITY = 0.65;
const DUO_MAIN_PROBABILITY = 0.70;

const THEMES1_BY_PROFILE = {
  fullAventure: [
    { id: "trek" }, { id: "faune" }, { id: "inso" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  aventure: [
    { id: "rando" }, { id: "faune" }, { id: "inso" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  farniente: [
    { id: "mer" }, { id: "fete" }, { id: "bala" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  mixte: [
    { id: "rando" }, { id: "nature" }, { id: "mer" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  plusAventure: [
    { id: "rando" }, { id: "faune" }, { id: "mer" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  plusFarniente: [
    { id: "mer" }, { id: "nature" }, { id: "bala" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  fullFarniente: [
    { id: "mer" }, { id: "infra" }, { id: "fete" },
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
  aucundesdeux: [
    { id: "chal" }, { id: "tour" }, { id: "secu" },
  ],
};

const THEMES2_BY_PROFILE = {
  fullVille: [
    { id: "histo" }, { id: "reli" }, { id: "musees" }, { id: "arch" },
    { id: "shop" }, { id: "moder" },
    { id: "spec", duoId: "noctu" },
    { id: "quar", duoId: "streetart" },
    { id: "soin", duoId: "massage" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],

  Ville: [
    { id: "histo" }, { id: "reli" }, { id: "musees" }, { id: "arch" },
    { id: "shop" }, { id: "moder" },
    { id: "spec", duoId: "noctu" },
    { id: "quar", duoId: "streetart" },
    { id: "soin", duoId: "massage" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],

  mixte: [
    { id: "monu", duoId: "arch" },
    { id: "musees" },
    { id: "shop" },
    { id: "moder", duoId: "noctu" },
    { id: "soin", duoId: "massage" },
    { id: "snork", duoId: "bateau" },
    { id: "grot", duoId: "planta" },
    { id: "velo", duoId: "cyclisme" },
    { id: "canoe", duoId: "canyon" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],

  plusVille: [
    { id: "monu" },
    { id: "musees" },
    { id: "arch" },
    { id: "shop" },
    { id: "moder", duoId: "noctu" },
    { id: "quar", duoId: "streetart" },
    { id: "soin", duoId: "massage" },
    { id: "snork", duoId: "velo" },
    { id: "grot", duoId: "planta" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],

  plusActivite: [
    { id: "monu", duoId: "arch" },
    { id: "shop" },
    { id: "moder", duoId: "noctu" },
    { id: "snork", duoId: "plongee" },
    { id: "grot", duoId: "planta" },
    { id: "velo", duoId: "cyclisme" },
    { id: "canoe", duoId: "canyon" },
    { id: "accro", duoId: "viaferrata" },
    { id: "bateau", duoId: "motor" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],

  Activite: [
    { id: "surf", duoId: "jetski" },
    { id: "planta" },
    { id: "grot", duoId: "speleo" },
    { id: "snork", duoId: "plongee" },
    { id: "velo", duoId: "cyclisme" },
    { id: "canoe", duoId: "canyon" },
    { id: "accro", duoId: "viaferrata" },
    { id: "bateau", duoId: "motor" },
    { id: "aerien", duoId: "extreme" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],

  fullActivite: [
    { id: "surf", duoId: "jetski" },
    { id: "extreme" },
    { id: "esca" },
    { id: "plongee", duoId: "snork" },
    { id: "cyclisme", duoId: "velo" },
    { id: "speleo", duoId: "grot" },
    { id: "rafting", duoId: "canoe" },
    { id: "canyon", duoId: "viaferrata" },
    { id: "motor", duoId: "bateau" },
    { id: "attrac", duoId: "attracsens" },
    { id: "zoo", duoId: "aqua" },
    { id: "carna", duoId: "festi" },
  ],
};

const THEMES3 = [
  { id: "streetfood", duoId: "stvege" },
  { id: "cuisineloc", duoId: "cuivege" },
  { id: "gastro", duoId: "gasvege" },
  { id: "alcool", duoId: "vin" },
  { id: "epice", duoId: "doux" },
  { id: "atelcul" },
  { id: "confort", duoId: "luxe" },
  { id: "popu" },
  { id: "camp", duoId: "sauvage" },
  { id: "jacuz", duoId: "pisci" },
  { id: "roman", duoId: "coquin" },
  { id: "atyp", duoId: "eco" },
];


const DEFAULT_THEME_PROBABILITY = {
  clickProb: 0.65,
  mainProb: 0.70,

  p1: 0.20,
  p2: 0.20,
  p3: 0.20,
  p4: 0.20,
  p5: 0.20,
};

function parseOptionalNumber(value, fallback = null) {
  if (value === "" || value == null) return fallback;

  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function loadProbabilities() {
  const filePath = "src/data/theme-probabilities.csv";

  if (!fs.existsSync(filePath)) {
    console.warn(`CSV probabilités introuvable : ${filePath}`);
    return {
      themeProbabilities: {},
      rows: [],
    };
  }

  const csv = fs.readFileSync(filePath, "utf8");

const parsed = Papa.parse(csv, {
  header: true,
  skipEmptyLines: true,
  delimiter: ";",
});

  const themeProbabilities = {};
  const rows = [];



  for (const rawRow of parsed.data) {
const row = {
  type: rawRow.type?.trim(),
  screen: rawRow.screen?.trim(),
  profile: rawRow.profile?.trim(),
  theme: rawRow.theme?.trim(),
  key: rawRow.key?.trim(),
  value: rawRow.value?.trim(),
  clickProb: rawRow.clickProb,
  mainProb: rawRow.mainProb,
  selectionProb: rawRow.selectionProb,
  minValue: rawRow.minValue,
  maxValue: rawRow.maxValue,
  defaultValue: rawRow.defaultValue,

  p1: rawRow.p1,
  p2: rawRow.p2,
  p3: rawRow.p3,
  p4: rawRow.p4,
  p5: rawRow.p5,
};

    rows.push(row);

    if (row.type !== "theme") continue;
    if (!row.screen || !row.profile || !row.theme) continue;

    const key = `${row.screen}:${row.profile}:${row.theme}`;

themeProbabilities[key] = {
  clickProb: parseOptionalNumber(
    row.clickProb,
    DEFAULT_THEME_PROBABILITY.clickProb
  ),
  mainProb: parseOptionalNumber(
    row.mainProb,
    DEFAULT_THEME_PROBABILITY.mainProb
  ),
  p1: parseOptionalNumber(row.p1, null),
  p2: parseOptionalNumber(row.p2, null),
  p3: parseOptionalNumber(row.p3, null),
  p4: parseOptionalNumber(row.p4, null),
  p5: parseOptionalNumber(row.p5, null),
};
  }

  return {
    themeProbabilities,
    rows,
  };
}

const LOADED_PROBABILITIES = loadProbabilities();
const THEME_PROBABILITIES = LOADED_PROBABILITIES.themeProbabilities;
const PROBABILITY_ROWS = LOADED_PROBABILITIES.rows;

const REQUIRED_ANSWER_KEYS = [
  "ville",
  "avion",
  "hmaxEnabled",
  "hmax",
  "transportEnabled",
  "transportModes",
  "fran",
  "papiersEnabled",
  "papiers",
  "selectedMonth",
  "_month",
  "tripDays",
  "travelers",
  "budgetTotal",
  "budgetLogement",
  "budgetFood",
  "budgetActivite",
  "chalMin",
  "chalMax",
  "teauMin",
  "teauMax",
  "trekDuration",
];

function debugMissingAnswerKeys(answers) {
  const missing = REQUIRED_ANSWER_KEYS.filter((key) => !(key in answers));

  if (missing.length) {
    console.warn("⚠️ Clés answers manquantes :", missing);
  }
}
function getThemeProbability(screen, profile, themeId) {
  return (
    THEME_PROBABILITIES[`${screen}:${profile}:${themeId}`] ??
    THEME_PROBABILITIES[`${screen}:all:${themeId}`] ??
    DEFAULT_THEME_PROBABILITY
  );
}

function randomChoice(values) {
  return values[Math.floor(Math.random() * values.length)];
}

function weightedRandom(options) {
  const validOptions = options.filter((option) => Number(option.weight) > 0);

  if (!validOptions.length) {
    return options[0]?.value;
  }

  const total = validOptions.reduce(
    (sum, option) => sum + Number(option.weight),
    0
  );

  const r = Math.random() * total;

  let cumulative = 0;

  for (const option of validOptions) {
    cumulative += Number(option.weight);

    if (r <= cumulative) {
      return option.value;
    }
  }

  return validOptions.at(-1).value;
}

function getProfileOptions(screen, availableProfiles) {
  const rows = PROBABILITY_ROWS.filter(
    (row) => row.type === "profile" && row.screen === screen
  );

  if (!rows.length) {
    return availableProfiles.map((profile) => ({
      value: profile,
      weight: 1,
    }));
  }

  return availableProfiles.map((profile) => {
    const row = rows.find((item) => item.profile === profile);

    return {
      value: profile,
      weight: Number(row?.selectionProb ?? 0),
    };
  });
}

function randomTri() {
  const r = Math.random();
  if (r < 0.45) return "indifferent";
  if (r < 0.75) return "oui";
  return "non";
}

function randomStars(maxStars, probability = {}) {
  const weights = [];

  for (let star = 1; star <= maxStars; star++) {
    const weight = probability[`p${star}`];

    weights.push(
      weight == null || Number.isNaN(weight)
        ? 1
        : weight
    );
  }

  return weightedRandom(
    weights.map((weight, index) => ({
      value: index + 1,
      weight,
    }))
  );
}
function applyTheme(answers, theme, screen, profile, maxStars) {
  const themeId = theme.id;
  const duoId = theme.duoId;

  const probability = getThemeProbability(screen, profile, themeId);
  const clicked = Math.random() < probability.clickProb;

  if (!clicked) {
    answers[themeId] = 0;
    if (duoId) answers[duoId] = 0;
    return;
  }

const stars = randomStars(maxStars, probability);

  if (!duoId) {
    answers[themeId] = stars;
    return;
  }

  const useMainTheme = Math.random() < probability.mainProb;

  if (useMainTheme) {
    answers[themeId] = stars;
    answers[duoId] = 0;
  } else {
    answers[themeId] = 0;
    answers[duoId] = stars;
  }
}

function applyThemes(answers, themes, screen, profile, maxStars) {
  for (const theme of themes) {
    applyTheme(answers, theme, screen, profile, maxStars);
  }
}

function randomTransport() {
  const avion = drawOption("transport", "avion", "indifferent");

  const hmaxEnabled = toBool(
    drawOption("transport", "hmaxEnabled", "false")
  );

  const hmaxMin = avion === "non" ? 8 : 2;

  const transportEnabled = toBool(
    drawOption("transport", "transportEnabled", "true")
  );

  const transportModes = {
    indifferent: true,
    voiture: false,
    commun: false,
    taxi: false,
    vtc: false,
  };

  if (transportEnabled) {
    const modeRows = getOptionRows("transport", "transportModes");

    transportModes.indifferent = false;

    for (const row of modeRows) {
      const mode = row.value;
      const probability = Number(row.selectionProb || 0) / 100;

      if (mode === "indifferent") continue;

      if (Math.random() < probability) {
        transportModes[mode] = true;
      }
    }

    if (!transportModes.taxi) {
      transportModes.vtc = false;
    }

    const hasAny =
      transportModes.voiture ||
      transportModes.commun ||
      transportModes.taxi ||
      transportModes.vtc;

    if (!hasAny) {
      transportModes.indifferent = true;
    }
  }

  const fran = drawOption("transport", "fran", "indifferent");

  const papiersEnabled = toBool(
    drawOption("transport", "papiersEnabled", "false")
  );

  const papiers = {
    indifferent: !papiersEnabled,
    carte: false,
    passeport: false,
    visa: false,
    evisa: false,
    complex: false,
  };

  if (papiersEnabled) {
    const level = drawOption("transport", "papiers", "carte");

    papiers.indifferent = false;
    papiers.carte = true;

    if (["passeport", "visa", "complex"].includes(level)) {
      papiers.passeport = true;
    }

    if (["visa", "complex"].includes(level)) {
      papiers.visa = true;
    }

    if (level === "complex") {
      papiers.complex = true;
    }
  }

  return {
    avion,
    hmaxEnabled,
    hmax: hmaxEnabled
      ? Math.floor(Math.random() * (30 - hmaxMin + 1)) + hmaxMin
      : null,
    transportEnabled,
    transportModes,
    fran,
    papiersEnabled,
    papiers,
  };
}

function getOptionRows(screen, key) {
  return PROBABILITY_ROWS.filter(
    (row) =>
      row.type === "option" &&
      row.screen === screen &&
      row.key === key
  );
}

function randomDateAnswers() {
  const selectedMonth = drawOption("date", "selectedMonth", "best");
  const tripDays = toNumber(drawOption("date", "tripDays", 15));

  return {
    selectedMonth,
    _month: selectedMonth,
    exactDates: null,
    tripDays,
    customTripDays: false,
  };
}
function randomBudget(tripDays) {
  const travelers = toNumber(drawOption("budget", "travelers", 2));

  const budgetPerTravelerPerWeek = drawRangeOption(
    "budget",
    "budgetPerTravelerPerWeek",
    500,
    1500
  );

  const weeks = Math.max(1, tripDays / 7);

  return {
    travelers,
    budgetTotal: Math.round(travelers * budgetPerTravelerPerWeek * weeks),
    budgetMaxSelected: toBool(drawOption("budget", "budgetMaxSelected", "false")),
    budgetManuallyEdited: toBool(drawOption("budget", "budgetManuallyEdited", "true")),
    budgetLogement: toNumber(drawOption("budget", "budgetLogement", 3)),
    budgetFood: toNumber(drawOption("budget", "budgetFood", 3)),
    budgetActivite: toNumber(drawOption("budget", "budgetActivite", 3)),
  };
}

function drawOption(screen, key, fallbackValue) {
  const rows = getOptionRows(screen, key);

  if (!rows.length) return fallbackValue;

  const options = rows.map((row) => ({
    value: row.value,
    weight: Number(row.selectionProb || 0),
  }));

  return weightedRandom(options);
}

function toBool(value) {
  return value === true || value === "true";
}

function toNumber(value) {
  const n = Number(value);
  return Number.isNaN(n) ? value : n;
}

function drawRangeDefault(screen, key, fallbackValue) {
  const row = PROBABILITY_ROWS.find(
    (item) =>
      item.type === "range" &&
      item.screen === screen &&
      item.key === key
  );

  return row?.defaultValue ?? fallbackValue;
}

function drawRangeValue(screen, key, fallbackMin, fallbackMax) {
  const row = PROBABILITY_ROWS.find(
    (item) =>
      item.type === "range" &&
      item.screen === screen &&
      item.key === key
  );

  const min = Number(row?.minValue ?? fallbackMin);
  const max = Number(row?.maxValue ?? fallbackMax);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


function drawRangeOption(screen, key, fallbackMin, fallbackMax) {
  const rows = PROBABILITY_ROWS.filter(
    (row) =>
      row.type === "rangeOption" &&
      row.screen === screen &&
      row.key === key
  );

  if (!rows.length) {
    return randomInt(fallbackMin, fallbackMax);
  }

  const selectedRow = weightedRandom(
    rows.map((row) => ({
      value: row,
      weight: Number(row.selectionProb || 0),
    }))
  );

  return randomInt(
    Number(selectedRow.minValue ?? fallbackMin),
    Number(selectedRow.maxValue ?? fallbackMax)
  );
}

function buildTemperatureRange(config) {
  const ideal = drawRangeOption(
    "theme1",
    config.idealKey,
    config.fallbackIdealMin,
    config.fallbackIdealMax
  );

  const tolerance = drawRangeOption(
    "theme1",
    config.toleranceKey,
    config.fallbackToleranceMin,
    config.fallbackToleranceMax
  );

  return {
    min: Math.max(config.globalMin, ideal - tolerance),
    max: Math.min(config.globalMax, ideal + tolerance),
    ideal,
    tolerance,
  };
}


function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRelief() {
  const showRelief = toBool(drawOption("relief", "showRelief", "false"));

  const relief = {
    indifferent: true,
    alpin: false,
    cotier: false,
    volcanique: false,
    tropical: false,
    foret: false,
    desertique: false,
    vegetalise: false,
  };

  if (!showRelief) {
    return {
      showRelief: false,
      relief,
    };
  }

  const mode = drawOption("relief", "reliefMode", "indifferent");

  if (mode === "indifferent") {
    return {
      showRelief: true,
      relief,
    };
  }

  relief.indifferent = false;

  const rows = getOptionRows("relief", "reliefKeys");

  for (const row of rows) {
    const key = row.value;
    const probability = Number(row.selectionProb || 0) / 100;

    if (Math.random() < probability) {
      relief[key] = true;
    }
  }

  const hasAnySelected = Object.entries(relief).some(
    ([key, value]) => key !== "indifferent" && value
  );

  if (!hasAnySelected) {
    relief.indifferent = true;
  }

  return {
    showRelief: true,
    relief,
  };
}

function getAnswers2Key(profile2) {
  const map = {
    fullVille: "fullVille",
    Ville: "ville",
    plusVille: "plusVille",
    mixte: "mixte",
    plusActivite: "plusActivite",
    Activite: "activite",
    fullActivite: "fullActivite",
    aucundesdeux: "aucundesdeux",
  };

  return map[profile2] ?? profile2;
}


export function simulateAnswers(debug = false) {
  const dateAnswers = randomDateAnswers();
  const transportAnswers = randomTransport();
  const budgetAnswers = randomBudget(dateAnswers.tripDays);
  const reliefAnswers = randomRelief();



  const answers = {
    ...dateAnswers,
    ...transportAnswers,
    ...budgetAnswers,
    ...reliefAnswers,

    trekDuration: toNumber(drawOption("theme1", "trekDuration", 3)),
  };


const profile1 = weightedRandom(
  getProfileOptions("theme1", Object.keys(THEMES1_BY_PROFILE))
);

const profile2 = weightedRandom(
  getProfileOptions("theme2", Object.keys(THEMES2_BY_PROFILE))
);
  answers._profile1 = profile1;
  answers._profile2 = profile2;
const answers2Key = getAnswers2Key(profile2);

Object.assign(answers, answers2[answers2Key] ?? { ville: 0 });
applyThemes(answers, THEMES1_BY_PROFILE[profile1], "theme1", profile1, 5);
if ((answers.chal ?? 0) > 0) {
  const airTemperature = buildTemperatureRange({
    idealKey: "airIdealTemp",
    toleranceKey: "airTolerance",
    fallbackIdealMin: 18,
    fallbackIdealMax: 32,
    fallbackToleranceMin: 4,
    fallbackToleranceMax: 10,
    globalMin: 0,
    globalMax: 45,
  });

  answers.chalMin = airTemperature.min;
  answers.chalMax = airTemperature.max;
} else {
  answers.chalMin = null;
  answers.chalMax = null;
}
applyThemes(answers, THEMES2_BY_PROFILE[profile2], "theme2", profile2, 3);
applyThemes(answers, THEMES3, "theme3", "all", 3);
if ((answers.mer ?? 0) > 0 || (answers.inso ?? 0) > 0) {
  const waterTemperature = buildTemperatureRange({
    idealKey: "waterIdealTemp",
    toleranceKey: "waterTolerance",
    fallbackIdealMin: 18,
    fallbackIdealMax: 30,
    fallbackToleranceMin: 3,
    fallbackToleranceMax: 8,
    globalMin: 0,
    globalMax: 35,
  });

  answers.teauMin = waterTemperature.min;
  answers.teauMax = waterTemperature.max;
} else {
  answers.teauMin = null;
  answers.teauMax = null;
}
if (debug) {
  console.log("ANSWERS", answers);
  debugMissingAnswerKeys(answers);
}

  return answers;
}