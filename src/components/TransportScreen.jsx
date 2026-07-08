import React from "react";
import StarRating from "./StarRating";
import "./TransportScreen.css";

const TRI_OPTIONS = [
  { value: "oui", label: "Oui" },
  { value: "non", label: "Non" },
  { value: "indifferent", label: "Indifférent" },
];

const PAPER_OPTIONS = [
  { key: "carte", label: "Carte d’identité" },
  { key: "passeport", label: "Passeport" },
  { key: "visa", label: "Visa" },
  { key: "complex", label: "Complexité administrative" },
];

const DEFAULT_TRANSPORT_MODES = {
  indifferent: true,
  voiture: false,
  commun: false,
  taxi: false,
  vtc: false,
};

const DEFAULT_PAPIERS = {
  indifferent: true,
  carte: false,
  passeport: false,
  visa: false,
  evisa: false,
  complex: false,
};

const DEFAULT_PAPIERS_DISABLED = {
  indifferent: true,
  carte: false,
  passeport: false,
  visa: false,
  evisa: false,
  complex: false,
};

const HMAX_MIN_WITH_PLANE = 2;
const HMAX_MIN_WITHOUT_PLANE = 8;
const HMAX_DEFAULT = 15;
const HMAX_MAX = 30;

export default function TransportScreen({
  values = {},
  onChange,
  onValidate,
  onBack,
}) {
  const avion = values.avion ?? "indifferent";
  const hmaxEnabled = values.hmaxEnabled ?? false;

  const hmaxMin =
    avion === "non" ? HMAX_MIN_WITHOUT_PLANE : HMAX_MIN_WITH_PLANE;

  const hmax = Math.max(values.hmax ?? HMAX_DEFAULT, hmaxMin);

  const transportModes = values.transportModes ?? DEFAULT_TRANSPORT_MODES;
  const transportEnabled = values.transportEnabled ?? true;
  const fran = values.fran ?? "indifferent";
  const papiers = values.papiers ?? DEFAULT_PAPIERS;
  const papiersEnabled = values.papiersEnabled ?? false;

  React.useEffect(() => {
    if (!hmaxEnabled) return;

    if ((values.hmax ?? HMAX_DEFAULT) < hmaxMin) {
      onChange?.({ hmax: hmaxMin });
    }
  }, [avion, hmaxEnabled, hmaxMin, values.hmax, onChange]);

  const setTriValue = (key, value) => {
    const patch = { [key]: value };

    if (key === "avion" && hmaxEnabled) {
      const nextMin =
        value === "non" ? HMAX_MIN_WITHOUT_PLANE : HMAX_MIN_WITH_PLANE;

      patch.hmax = Math.max(values.hmax ?? HMAX_DEFAULT, nextMin);
    }

    onChange?.(patch);
  };

  const handleHmaxToggle = (enabled) => {
    onChange?.({
      hmaxEnabled: enabled,
      hmax: enabled ? Math.max(hmax || hmaxMin, hmaxMin) : null,
    });
  };

  const handleTransportClick = (key) => {
    if (key === "indifferent") {
      onChange?.({ transportModes: DEFAULT_TRANSPORT_MODES });
      return;
    }

    const next = { ...transportModes, indifferent: false };

    if (key === "taxi") {
      next.taxi = !transportModes.taxi;
      if (!next.taxi) next.vtc = false;
    } else if (key === "vtc") {
      if (!transportModes.taxi) return;
      next.vtc = !transportModes.vtc;
    } else {
      next[key] = !transportModes[key];
    }

    const hasAny = next.voiture || next.commun || next.taxi || next.vtc;

    onChange?.({
      transportModes: hasAny ? next : DEFAULT_TRANSPORT_MODES,
    });
  };

const handlePaperClick = (key) => {
  const order = ["carte", "passeport", "visa", "complex"];
  const index = order.indexOf(key);

  if (index === -1) return;

  const wasActive = Boolean(papiers[key]);

  if (wasActive) {
    const next = {
      ...papiers,
      indifferent: false,
      [key]: false,
    };

    const hasAny = order.some((paperKey) => next[paperKey]);

    onChange?.({
      papiers: hasAny ? next : DEFAULT_PAPIERS,
    });

    return;
  }

  const next = {
    ...papiers,
    indifferent: false,
  };

  order.slice(0, index + 1).forEach((paperKey) => {
    next[paperKey] = true;
  });

  onChange?.({
    papiers: next,
  });
};

  const handleValidate = () => {
    onValidate?.({
      ...values,
      avion,
      hmaxEnabled,
      hmax: hmaxEnabled ? hmax : null,
      transportEnabled,
      transportModes,
      fran,
      papiersEnabled,
      papiers: papiersEnabled ? papiers : DEFAULT_PAPIERS,
    });
  };

  return (
    <div className="transport-bg">
      <div className="transport-screen">
        <h1 className="transport-title">Transport</h1>

<section className="transport-section">
  <div className="section-header-row">
    <h2>
  <span className="section-icon">✈️</span>
  <span className="section-text">
    Avion
  </span>
  </h2>
    <div className="choice-row inline-choice">
      {TRI_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`choice-btn ${avion === option.value ? "active" : ""}`}
          onClick={() => setTriValue("avion", option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
</section>

<section className="transport-section">
  <div className="section-header-row">
    <h2>
  <span className="section-icon">⏱️</span>
  <span className="section-text">
    Limiter la durée du trajet
  </span>
  </h2>
    <div className="choice-row inline-choice">
      <button
        className={`choice-btn ${hmaxEnabled ? "active" : ""}`}
        onClick={() => handleHmaxToggle(true)}
      >
        Oui
      </button>

      <button
        className={`choice-btn ${!hmaxEnabled ? "active" : ""}`}
        onClick={() => handleHmaxToggle(false)}
      >
        Non
      </button>
    </div>
  </div>

  {hmaxEnabled && (
    <div className="hours-picker">
      <input
        type="range"
        min={hmaxMin}
        max={HMAX_MAX}
        value={hmax}
        onChange={(e) =>
          onChange?.({ hmax: Number(e.target.value) })
        }
      />

      <div className="hours-value">
        {hmax} h maximum
      </div>
    </div>
  )}
</section>

<section className="transport-section">
  <div className="section-header-row">
    <h2>
  <span className="section-icon">🚗</span>
  <span className="section-text">
    Transport sur place
  </span>
</h2>

    <div className="choice-row inline-choice">
      <button
        className={`choice-btn ${transportEnabled ? "active" : ""}`}
        onClick={() => onChange?.({ transportEnabled: true })}
      >
        Oui
      </button>

      <button
        className={`choice-btn ${!transportEnabled ? "active" : ""}`}
        onClick={() =>
          onChange?.({
            transportEnabled: false,
            transportModes: DEFAULT_TRANSPORT_MODES,
          })
        }
      >
        Non
      </button>
    </div>
  </div>

  {transportEnabled && (
          <div className="transport-icons-grid">
            <button
              className={`transport-icon ${
                transportModes.voiture ? "active" : ""
              }`}
              onClick={() => handleTransportClick("voiture")}
            >
              <span className="transport-emoji">🚗</span>
              <span className="transport-label">
                {avion === "non"
                  ? "Voiture personnelle"
                  : "Voiture de location"}
              </span>
            </button>

            <button
              className={`transport-icon ${
                transportModes.commun ? "active" : ""
              }`}
              onClick={() => handleTransportClick("commun")}
            >
              <span className="transport-emoji">🚆</span>
              <span className="transport-label">Transports en commun</span>
            </button>

<button
  className={`transport-icon ${
    transportModes.taxi ? "active" : ""
  }`}
  onClick={() => handleTransportClick("taxi")}
>
  <span className="transport-emoji">🚕</span>

  <span className="transport-label">
    Taxi OU VTC
  </span>

  {transportModes.taxi && (
    <div
      className="sub-option"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
<div
  className={`vtc-pill ${
    transportModes.vtc ? "active" : ""
  }`}
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    handleTransportClick("vtc");
  }}
>
  <span className="vtc-star">
    {transportModes.vtc ? "★" : "☆"}
  </span>

  <span className="vtc-text">
    VTC
  </span>
</div>
    </div>
  )}
</button>

            <button
              className={`transport-icon ${
                transportModes.indifferent ? "active" : ""
              }`}
              onClick={() => handleTransportClick("indifferent")}
            >
              <span className="transport-emoji">✨</span>
              <span className="transport-label">Indifférent</span>
            </button>
              </div>
  )}
</section>

<section className="transport-section">
  <div className="section-header-row">
<h2>
  <span className="section-icon">🗣️</span>
  <span className="section-text">
    Destination francophone
  </span>
</h2>

    <div className="choice-row inline-choice">
      {TRI_OPTIONS.map((option) => (
        <button
          key={option.value}
          className={`choice-btn ${
            fran === option.value ? "active" : ""
          }`}
          onClick={() => setTriValue("fran", option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
</section>

<section className="transport-section">
  <div className="section-header-row">
    <h2>
      <span className="section-icon">🛂</span>
      <span className="section-text">Exigence administrative</span>
    </h2>

    <div className="choice-row inline-choice">
      <button
        className={`choice-btn ${papiersEnabled ? "active" : ""}`}
        onClick={() =>
          onChange?.({
            papiersEnabled: true,
            papiers: DEFAULT_PAPIERS_DISABLED,
          })
        }
      >
        Oui
      </button>

      <button
        className={`choice-btn ${!papiersEnabled ? "active" : ""}`}
        onClick={() =>
          onChange?.({
            papiersEnabled: false,
            papiers: DEFAULT_PAPIERS,
          })
        }
      >
        Non
      </button>
    </div>
  </div>

  {papiersEnabled && (
    <div className="paper-grid">
      {PAPER_OPTIONS.map((option) => (
        <button
          key={option.key}
          className={`choice-btn ${
            papiers[option.key] ? "active" : ""
          }`}
          onClick={() => handlePaperClick(option.key)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )}
</section>

<div className="app-actions two-buttons">
  <button type="button" className="app-btn back" onClick={onBack}>
    BACK
  </button>

  <button type="button" className="app-btn ok" onClick={handleValidate}>
    OK
  </button>
</div>
      </div>
    </div>
  );
}