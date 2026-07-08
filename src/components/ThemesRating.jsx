import React from "react";
import StarRating from "./StarRating";
import "./ThemesRating.css";
import { Root, Track, Range, Thumb } from "@radix-ui/react-slider";
import "rc-slider/assets/index.css";
import { CHAL_MIN, CHAL_MAX } from "../engine/constants.js";

const TEMP_MIN = 14;
const TEMP_MAX = 34;


const WATER_RANGES_BY_AVENTURE = {
  1: [25, 34],
  5: [21, 34],
  4: [22, 34],
  2: [24, 34],
  3: [23, 34],
};

const CHAL_RANGES = {
  1: [10, 18],
  2: [15, 22],
  3: [18, 26],
  4: [22, 30],
  5: [26, 34],
};

const TREK_LEVELS = {
  1: "1 grosse journée",
  2: "2/3 jours",
  3: "4/5 jours",
  4: "6/7 jours",
  5: "plus d'une semaine",
};

const DEFAULT_RELIEF = {
  indifferent: true,
  vegetalise: false,
  alpin: false,
  cotier: false,
  volcanique: false,
  tropical: false,
  desertique: false,
  foret: false,
};

export default function ThemesRating({
  themes = [],
  values = {},
  onChange,
  onValidate,
  onBack,
  onBackKeep, 
  profileType,
  minTemp,
}) {
  const ratings = Object.fromEntries(
    themes.map((theme) => [theme.id, values?.[theme.id] ?? 0])
  );

const defaultWaterRange =
  WATER_RANGES_BY_AVENTURE[values?.aventure] ??
  (minTemp != null ? [minTemp, TEMP_MAX] : [22, TEMP_MAX]);

const teauMin =
  values?.teauMin != null && values.teauMin >= TEMP_MIN
    ? values.teauMin
    : defaultWaterRange[0];

const teauMax =
  values?.teauMax != null && values.teauMax >= TEMP_MIN
    ? values.teauMax
    : defaultWaterRange[1];
const sliderValue = [teauMin, teauMax];

  const relief = values?.relief ?? DEFAULT_RELIEF;
  const showRelief = values?.showRelief ?? false;
  const trekSelected = (ratings.trek || 0) > 0;
  const trekDuration = values?.trekDuration ?? 1;

  
  const chalSelected = (ratings.chal || 0) > 0;
  const defaultChalRange = CHAL_RANGES[ratings.chal] ?? [22, 26];
  const chalMin = values?.chalMin ?? (chalSelected ? defaultChalRange[0] : null);
  const chalMax = values?.chalMax ?? (chalSelected ? defaultChalRange[1] : null);
  const chalSliderValue = chalSelected ? [chalMin, chalMax] : [22, 26];

  const displayMinTemp =
  sliderValue[0] <= TEMP_MIN
    ? `Moins de ${TEMP_MIN}° `
    : `${sliderValue[0]}°`;

const displayMaxTemp =
  sliderValue[1] >= TEMP_MAX
    ? `à plus de ${TEMP_MAX}°`
    : `${sliderValue[1]}°`;

  const displayChalMin =
    chalSliderValue[0] <= CHAL_MIN ? `Moins de ${CHAL_MIN}°` : `${chalSliderValue[0]}°`;

  const displayChalMax =
    chalSliderValue[1] >= CHAL_MAX ? `à plus de ${CHAL_MAX}°` : `${chalSliderValue[1]}°`;

  const merSelected = (ratings.mer || 0) > 0;
  const bainSelected = (ratings.bain || 0) > 0;
  const insoSelected = (ratings.inso || 0) > 0;

  const handleRatingChange = (themeId, value) => {
    if (themeId === "chal") {
      if (value <= 0) {
        onChange?.({
          chal: 0,
          chalMin: null,
          chalMax: null,
        });
        return;
      }

      const range = CHAL_RANGES[value] ?? [22, 26];

      onChange?.({
        chal: value,
        chalMin: range[0],
        chalMax: range[1],
      });
      return;
    }

    onChange?.({
      [themeId]: value,
    });
  };

  const handleSliderChange = (values) => {
    onChange?.({
      teauMin: values[0],
      teauMax: values[1],
    });
  };

  const handleChalSliderChange = (values) => {
    onChange?.({
      chalMin: values[0],
      chalMax: values[1],
    });
  };

const handleTrekDurationChange = (value) => {
  onChange?.({
    trekDuration: value[0],
  });
};
const handleReliefImportance = (enabled) => {
  onChange?.({
    showRelief: enabled,
    relief: enabled
      ? (values?.relief ?? DEFAULT_RELIEF)
      : DEFAULT_RELIEF,
  });
};
  const toggleRelief = (key) => {
    const current = relief;

    if (key === "indifferent") {
      const reset = Object.fromEntries(
        Object.keys(DEFAULT_RELIEF).map((k) => [k, false])
      );

      onChange?.({
        relief: {
          ...reset,
          indifferent: true,
        },
      });

      return;
    }

    const next = {
      ...current,
      [key]: !current[key],
      indifferent: false,
    };

    if (key === "vegetalise" && next.vegetalise) {
      next.desertique = false;
    }

    if (key === "desertique" && next.desertique) {
      next.vegetalise = false;
    }

    const anySelected = Object.entries(next).some(
      ([k, v]) => k !== "indifferent" && v === true
    );

    if (!anySelected) {
      next.indifferent = true;
    }

    onChange?.({
      relief: next,
    });
  };

  const shouldShowWaterSliderUnderTheme = (themeId) => {
    if (themeId === "inso" && insoSelected) return true;
    if (themeId === "bain" && bainSelected && !insoSelected) return true;
    if (themeId === "mer" && merSelected && !insoSelected && !bainSelected) {
      return true;
    }
    return false;
  };

  const sliderLabel =
    insoSelected ? "🌡 T° de l'eau souhaitée" : "🌡 T° de l'eau";

  const handleValidate = () => {
    const payload = {
      ...values,
      ...ratings,
      teauMin: sliderValue[0],
      teauMax: sliderValue[1],
      chalMin: chalSelected ? chalSliderValue[0] : null,
      chalMax: chalSelected ? chalSliderValue[1] : null,
      relief,
    };

    onValidate?.(payload);
  };

  return (
    <div className="themes-bg">
      <div className="title-block">
        <h1 className="page-title">Importance selon toi !</h1>
        <div className="title-hint alert-hint">
  ⚠️ Tu n’es pas obligé de tout noter : mets des ⭐ uniquement sur les thèmes qui te parlent.
</div>
      </div>

      <div className="vote-card">
        <div className="themes-list">
          {themes.map((theme) => (
            <React.Fragment key={theme.id}>
              <div className="theme-row">
                <div className="theme-name">{theme.label}</div>

                <div className="theme-stars">
<StarRating
  value={ratings[theme.id] || 0}
  variant={
    ["chal", "tour", "secu"].includes(theme.id)
      ? "temperature"
      : "default"
  }
  onChange={(value) => handleRatingChange(theme.id, value)}
/>
                </div>
              </div>

              {shouldShowWaterSliderUnderTheme(theme.id) && (
                <div className="mer-bonus-row">
                  <div className="mer-options-row">
                    <div className="temp-block">
                      <Root
                        className="SliderRoot"
                        min={TEMP_MIN}
                        max={TEMP_MAX}
                        step={1}
                        value={sliderValue}
                        onValueChange={handleSliderChange}
                      >
                        <Track className="SliderTrack">
                          <Range className="SliderRange" />
                        </Track>
                        <Thumb className="SliderThumb" />
                        <Thumb className="SliderThumb" />
                      </Root>

                      <div className="temp-info">
                        {sliderLabel} : {displayMinTemp} – {displayMaxTemp}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {theme.id === "chal" && chalSelected && (
                <div className="mer-bonus-row">
                  <div className="mer-options-row">
                    <div className="temp-block">
                      <Root
                        className="SliderRoot"
                        min={CHAL_MIN}
                        max={CHAL_MAX}
                        step={1}
                        value={chalSliderValue}
                        onValueChange={handleChalSliderChange}
                      >
                        <Track className="SliderTrack">
                          <Range className="SliderRange" />
                        </Track>
                        <Thumb className="SliderThumb" />
                        <Thumb className="SliderThumb" />
                      </Root>

                      <div className="temp-info">
                        ☀️ T° souhaitée : {displayChalMin} –{" "}
                        {displayChalMax}
                      </div>
                    </div>
                  </div>
                </div>
              )}
{theme.id === "trek" && trekSelected && (
  <div className="mer-bonus-row">
    <div className="mer-options-row">
      <div className="temp-block">
        <Root
          className="SliderRoot trek-slider"
          min={1}
          max={5}
          step={1}
          value={[trekDuration]}
          onValueChange={handleTrekDurationChange}
        >

<Track className="SliderTrack trek-slider-track">
  <Range className="SliderRange trek-slider-range" />
</Track>
          <Thumb className="SliderThumb trek-slider-thumb" />
        </Root>

        <div className="temp-info">
          🥾 Durée trek souhaitée :{" "}
          {TREK_LEVELS[trekDuration]}
        </div>
      </div>
    </div>
  </div>
)}
            </React.Fragment>
          ))}
        </div>

        <div className="relief-card">
  <div className="relief-header-inline">
  <h4>Importance du relief ?</h4>

  <div className="choice-row relief-choice-row">
    <button
      type="button"
      className={`choice-btn ${showRelief ? "active" : ""}`}
      onClick={() => handleReliefImportance(true)}
    >
      Oui
    </button>

    <button
      type="button"
      className={`choice-btn ${!showRelief ? "active" : ""}`}
      onClick={() => handleReliefImportance(false)}
    >
      Non
    </button>
  </div>
</div>

  {showRelief && (
    <div className="relief-grid">
      <button
        type="button"
        className={`relief-btn ${relief.alpin ? "is-on" : ""}`}
        onClick={() => toggleRelief("alpin")}
      >
        <span className="relief-icon">🏔️</span>
        <span className="relief-text">Alpin</span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.cotier ? "is-on" : ""}`}
        onClick={() => toggleRelief("cotier")}
      >
        <span className="relief-icon">🧗</span>
        <span className="relief-text">
          Côtes
          <br />
          escarpées
        </span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.foret ? "is-on" : ""}`}
        onClick={() => toggleRelief("foret")}
      >
        <span className="relief-icon">🌲</span>
        <span className="relief-text">Forêt</span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.vegetalise ? "is-on" : ""}`}
        onClick={() => toggleRelief("vegetalise")}
      >
        <span className="relief-icon">🌿</span>
        <span className="relief-text">Végétalisé</span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.volcanique ? "is-on" : ""}`}
        onClick={() => toggleRelief("volcanique")}
      >
        <span className="relief-icon">🌋</span>
        <span className="relief-text">Volcanique</span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.tropical ? "is-on" : ""}`}
        onClick={() => toggleRelief("tropical")}
      >
        <span className="relief-icon">🌴</span>
        <span className="relief-text">Tropical</span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.indifferent ? "is-on" : ""}`}
        onClick={() => toggleRelief("indifferent")}
      >
        <span className="relief-icon">🤷</span>
        <span className="relief-text">Indifférent</span>
      </button>

      <button
        type="button"
        className={`relief-btn ${relief.desertique ? "is-on" : ""}`}
        onClick={() => toggleRelief("desertique")}
      >
        <span className="relief-icon">🏜️</span>
        <span className="relief-text">Désertique</span>
      </button>
    </div>
  )}
</div>
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
      onClick={onBackKeep}
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
  );
}