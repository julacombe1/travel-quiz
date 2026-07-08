import { useState, useMemo } from "react";
import StartScreen from "./components/StartScreen";
import AdventureVsFarniente from "./components/AdventureVsFarniente";
import ThemesRating from "./components/ThemesRating";
import DateScreen from "./components/date";
import { THEMES_BY_PROFILE as THEMES_1 } from "./data/themes";
import { THEMES_BY_PROFILE as THEMES_2 } from "./data/themes2";
import { THEMES3 } from "./data/themes3";
import { calculateResults } from "./engine/calculateResults";
import destinations from "./data/destinations";
import ResultsScreen from "./components/ResultsScreen";
import VilleVsActivite from "./components/VilleVsActivite";
import ThemesRating2 from "./components/ThemesRating2";
import ThemesRating3 from "./components/ThemesRating3";
import TransportScreen from "./components/TransportScreen";
import BudgetScreen from "./components/BudgetScreen";
import PlanTripScreen from "./components/PlanTripScreen";
import ContactScreen from "./components/ContactScreen";

const initialAnswers = {
  selectedMonth: "best",
  exactDates: null,
  teauMin: null,
  teauMax: null,

  travelers: 2,
  budgetTotal: 10000,
  budgetMaxSelected: false,
  budgetManuallyEdited: false,
  usedFinalBudgetRelaunch: false,

  tripDays: 15,
  customTripDays: false,
  
  trek: 0,
  rando: 0,
  faune: 0,
  bain: 0,
  inso: 0,
  secu: 0,
  bala: 0,
  mer: 0,
  fete: 0,
  nature: 0,
  infra: 0,
  chal: 0,

    // ThemesRating2 - ville / activités
  histo: 0,
  reli: 0,
  musees: 0,
  arch: 0,
  shop: 0,
  moder: 0,
  spec: 0,
  noctu: 0,
  quar: 0,
  streetart: 0,
  soin: 0,
  massage: 0,
  attrac: 0,
  attracsens: 0,
  zoo: 0,
  aqua: 0,
  carna: 0,
  festi: 0,

  monu: 0,
  snork: 0,
  plongee: 0,
  visite: 0,
  planta: 0,
  velo: 0,
  cyclisme: 0,
  canoe: 0,
  rafting: 0,
  canyon: 0,
  accro: 0,
  viaferrata: 0,
  motor: 0,
  jetski: 0,
  bateau: 0,
  surf: 0,
  grot: 0,
  speleo: 0,
  aerien: 0,
  extreme: 0,
  esca: 0,

  duoModes: {},
  _theme2KeepDuoScores: false,
  _theme3KeepDuoScores: false,

streetfood: 0,
stvege: 0,
cuisineloc: 0,
cuivege: 0,
gastro: 0,
gasvege: 0,
alcool: 0,
vin: 0,
doux: 0,
epice: 0,
atelcul: 0,
confort: 0,
luxe: 0,
popu: 0,
camp: 0,
sauvage: 0,
jacuz: 0,
pisci: 0,
roman: 0,
coquin: 0,
atyp: 0,
eco: 0,


  avion: "indifferent",
  hmaxEnabled: false,
  hmax: 15,
  transportEnabled: true,
  transportModes: {
    indifferent: true,
    voiture: false,
    commun: false,
    taxi: false,
    vtc: false,
  },

  fran: "indifferent",
  papiersEnabled: false,
  papiers: {
    indifferent: true,
    carte: false,
    passeport: false,
    visa: false,
    evisa: false,
    complex: false,
  },

  relief: {
    indifferent: true,
    vegetalise: false,
    alpin: false,
    cotier: false,
    volcanique: false,
    tropical: false,
    desertique: false,
    foret: false,
  },
};

function App() {
  const [history, setHistory] = useState(["start"]);
  const step = history[history.length - 1];

  const [userAnswers, setUserAnswers] = useState(initialAnswers);
  const [profileType, setProfileType] = useState(null);
  const [plannedTrip, setPlannedTrip] = useState(null);
  const [results, setResults] = useState(null);
  const [contactRequest, setContactRequest] = useState(null);

  const normalizedProfileType = useMemo(
    () => String(profileType ?? "").trim(),
    [profileType]
  );


  const goTo = (nextStep) => {
    setHistory((prev) => [...prev, nextStep]);
  };

  const goBack = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  };

  const updateAnswers = (patch) => {
    setUserAnswers((prev) => ({
      ...prev,
      ...patch,
    }));
  };

  const handleDateChange = (patch) => {
    setUserAnswers((prev) => ({
      ...prev,
      ...patch,
    }));
  };

const getAllThemeKeys = (themesObject) => {
  const allKeys = Object.values(themesObject)
    .flat()
    .flatMap((theme) => [
      theme.id,
      theme.duoId,
    ])
    .filter(Boolean);

  return [...new Set(allKeys)];
};

const getTheme3Keys = () => {
  const allKeys = THEMES3.flatMap((theme) => [
    theme.id,
    theme.duoId,
  ]).filter(Boolean);

  return [...new Set(allKeys)];
};

  const getFieldsToReset = (currentStep) => {
    if (currentStep === "themes") {
      return [
        ...getAllThemeKeys(THEMES_1),
        "teauMin",
        "teauMax",
        "chalMin",
        "chalMax",
        "relief",
      ];
    }

if (currentStep === "ville-themes") {
  return [
    ...getAllThemeKeys(THEMES_2),
    "duoModes",
  ];
}

    if (currentStep === "themes3") {
  return [
    ...getTheme3Keys(),
    "_theme3KeepDuoScores",
  ];
    }

    if (currentStep === "ville-activite") return ["ville"];
    if (currentStep === "adventure") return ["aventure", "minTemp"];

    // On ne réinitialise plus transport, budget ni date ici.
    return [];
  };

  const goBackWithReset = () => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;

      const currentStep = prev[prev.length - 1];
      const nextHistory = prev.slice(0, -1);
      const fieldsToReset = getFieldsToReset(currentStep);

      setUserAnswers((prevAnswers) => {
        const updated = { ...prevAnswers };

        fieldsToReset.forEach((key) => {
          updated[key] =
  typeof initialAnswers[key] === "object" && initialAnswers[key] !== null
    ? structuredClone(initialAnswers[key])
    : initialAnswers[key] ?? 0;
        });

        return updated;
      });

      return nextHistory;
    });
  };

  const handleAdventureSelect = (values, profile, minTemp) => {
    updateAnswers({
      aventure: values?.aventure ?? null,
      minTemp,
    });

    setProfileType(profile);
    goTo("themes");
  };

  const handleThemesValidate = (ratings) => {
    updateAnswers(ratings);
    goTo("ville-activite");
  };

  const handleVilleActiviteSelect = (values) => {
    updateAnswers(values);

    if (values?.ville === 0) {
      goTo("transport");
    } else {
      goTo("ville-themes");
    }
  };

  const handleVilleThemesValidate = (ratings) => {
    updateAnswers(ratings);
    goTo("transport");
  };

  const handleTransportValidate = (values) => {
    updateAnswers(values);
    goTo("themes3");
  };

  const handleThemes3Validate = (ratings) => {
    updateAnswers(ratings);
    goTo("budget");
  };

  const handleBudgetValidate = (values) => {
    updateAnswers(values);
    goTo("date");
  };
const handleDateValidate = (selectedMonth) => {
  const nextAnswers = {
    ...userAnswers,
    selectedMonth,
    exactDates: null,
  };

  setUserAnswers(nextAnswers);
  setResults(calculateResults(nextAnswers, destinations));

  goTo("results");
};

const handleExactDatesValidate = (range) => {
  const nextAnswers = {
    ...userAnswers,
    exactDates: range,
    selectedMonth: null,
  };

  setUserAnswers(nextAnswers);
  setResults(calculateResults(nextAnswers, destinations));

  goTo("results");
};


const handleRestart = () => {
  setUserAnswers(initialAnswers);
  setProfileType(null);
  setPlannedTrip(null);
  setResults(null);
  setHistory(["start"]);
};

const handlePlanTrip = (payload) => {
  const destination = payload?.destination ?? payload;
  const budgetBreakdown = payload?.budgetBreakdown ?? null;

  setPlannedTrip({
    destination,
    budgetBreakdown,
  });

  goTo("plan-trip");
};

const handleTripInterest = (payload = {}) => {
  setContactRequest({
    ...payload,

    destination: payload.destination ?? plannedTrip?.destination ?? null,
    budgetBreakdown:
      payload.budgetBreakdown ?? plannedTrip?.budgetBreakdown ?? null,

    emailContext: buildEmailContext(),

    // Important :
    // on n'envoie plus "results", car cela peut contenir tout le classement.
  });

  goTo("contact");
};

const handleContactBack = () => {
  setContactRequest(null);
  goBack();
};

const handleRelaunchWithMaxBudget = (budgetPatch = null) => {
  const travelers = Number(userAnswers.travelers) || 2;
  const maxBudget = travelers * 10000 + 5000;

  const requestedBudget = Number(budgetPatch?.budgetTotal);

  const nextBudget = Number.isFinite(requestedBudget)
    ? Math.max(500, Math.min(requestedBudget, maxBudget))
    : maxBudget;

  const nextBudgetMaxSelected =
    budgetPatch?.budgetMaxSelected === true || nextBudget >= maxBudget;

const nextAnswers = {
  ...userAnswers,
  budgetTotal: nextBudgetMaxSelected ? maxBudget : nextBudget,
  budgetMaxSelected: nextBudgetMaxSelected,
  budgetManuallyEdited: true,
  usedFinalBudgetRelaunch: true,
};

  setUserAnswers(nextAnswers);
  setResults(calculateResults(nextAnswers, destinations));
};

const handleRelaunchWithoutHeat = () => {
  const nextAnswers = {
    ...userAnswers,
    chal: 0,
    chalMin: null,
    chalMax: null,
  };

  setUserAnswers(nextAnswers);
  setResults(calculateResults(nextAnswers, destinations));
};

const getThemeLabel = (theme) => {
  return (
    theme.label ||
    theme.title ||
    theme.name ||
    theme.question ||
    theme.id
  );
};

const getThemeValue = (answers, key) => {
  const value = Number(answers?.[key]);
  return Number.isFinite(value) ? value : 0;
};

const uniqueThemesById = (themes = []) => {
  const seen = new Set();

  return themes.filter((theme) => {
    if (!theme?.id || seen.has(theme.id)) return false;
    seen.add(theme.id);
    return true;
  });
};

const buildActivatedThemesForEmail = () => {
  const themes1 = uniqueThemesById(THEMES_1[normalizedProfileType] || []);
  const themes2 = uniqueThemesById(
    THEMES_2[normalizedProfileType] || Object.values(THEMES_2).flat()
  );
  const themes3 = uniqueThemesById(THEMES3 || []);

  const mapThemes = (themes, maxScore) =>
    themes
      .map((theme) => {
        const score = getThemeValue(userAnswers, theme.id);

        if (score <= 0) return null;

        return {
          id: theme.id,
          label: getThemeLabel(theme),
          score,
          maxScore,
        };
      })
      .filter(Boolean);

  return {
    themes1: mapThemes(themes1, 5),
    themes2: mapThemes(themes2, 3),
    themes3: mapThemes(themes3, 3),
  };
};

const buildEmailContext = () => {
  return {
    userAnswers,
    selectedThemes: buildActivatedThemesForEmail(),
    profileType: normalizedProfileType,
    generatedAt: new Date().toISOString(),
  };
};

  return (
    <>
      {step === "start" && (
        <StartScreen onStart={() => goTo("adventure")} />
      )}

      {step === "adventure" && (
        <AdventureVsFarniente
          values={userAnswers}
          onSelect={handleAdventureSelect}
          onBack={goBack}
        />
      )}

      {step === "themes" && (
        <ThemesRating
          themes={THEMES_1[normalizedProfileType] || []}
          values={userAnswers}
          onChange={updateAnswers}
          onValidate={handleThemesValidate}
          onBack={goBackWithReset}
          onBackKeep={goBack}
          profileType={normalizedProfileType}
          minTemp={userAnswers.minTemp}
        />
      )}

      {step === "ville-activite" && (
        <VilleVsActivite
          values={userAnswers}
          onSelect={handleVilleActiviteSelect}
          onBack={goBack}
        />
      )}

      {step === "ville-themes" && (
        <ThemesRating2
          values={userAnswers}
          onChange={updateAnswers}
          onValidate={handleVilleThemesValidate}
          onBack={goBackWithReset}
          onBackKeep={goBack}
        />
      )}

      {step === "transport" && (
        <TransportScreen
          values={userAnswers}
          onChange={updateAnswers}
          onValidate={handleTransportValidate}
          onBack={goBackWithReset}
        />
      )}

      {step === "themes3" && (
        <ThemesRating3
          values={userAnswers}
          onChange={updateAnswers}
          onValidate={handleThemes3Validate}
          onBack={goBackWithReset}
          onBackKeep={goBack}
        />
      )}

      {step === "budget" && (
        <BudgetScreen
          values={userAnswers}
          onChange={updateAnswers}
          onValidate={handleBudgetValidate}
          onBack={goBackWithReset}
          onBackKeep={goBack}
        />
      )}

      {step === "date" && (
        <DateScreen
          selectedMonth={userAnswers.selectedMonth}
          exactDates={userAnswers.exactDates}
          values={userAnswers}
          onChange={handleDateChange}
          onBack={goBack}
          onValidate={handleDateValidate}
          onExactDatesValidate={handleExactDatesValidate}
        />
      )}

{step === "results" && results && (
  <ResultsScreen
    results={results}
    selectedMonth={userAnswers.selectedMonth}
    exactDates={userAnswers.exactDates}
    userAnswers={userAnswers}
    onBack={goBack}
    onRestart={handleRestart}
    onPlanTrip={handlePlanTrip}
    onRelaunchWithMaxBudget={handleRelaunchWithMaxBudget}
    onRelaunchWithoutHeat={handleRelaunchWithoutHeat}
  />
)}

{step === "plan-trip" && plannedTrip?.destination && (
  <PlanTripScreen
    destination={plannedTrip.destination}
    budgetBreakdown={plannedTrip.budgetBreakdown}
    onBack={goBack}
    onInterested={handleTripInterest}
  />
)}
{step === "contact" && contactRequest && (
  <ContactScreen
    contactRequest={contactRequest}
    onBack={handleContactBack}
    onSubmitContact={(payload) => {
      console.log("Payload prêt pour l'envoi email :", payload);

      // Prochaine étape :
      // ici on branchera l'envoi email.
    }}
  />
)}

    </>
  );
}

export default App;