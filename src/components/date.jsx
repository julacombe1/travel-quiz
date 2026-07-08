import { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/style.css";
import "./date.css";

const months = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const durationOptions = [
  { value: 3, label: "3 jours" },
  { value: 7, label: "1 semaine" },
  { value: 15, label: "15 jours" },
  { value: 21, label: "3 semaines" },
  { value: 28, label: "4 semaines" },
  { value: "custom", label: "Autres" },
];

function getDefaultCalendarMonth(selectedMonth) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  if (!selectedMonth || selectedMonth === "best") {
    return new Date(currentYear, currentMonth, 1);
  }

  const monthIndex = months.findIndex((m) => m === selectedMonth);

  if (monthIndex === -1) {
    return new Date(currentYear, currentMonth, 1);
  }

  const year = monthIndex < currentMonth ? currentYear + 1 : currentYear;
  return new Date(year, monthIndex, 1);
}

function getCalendarMonthFromExactDates(exactDates, fallbackMonth) {
  if (exactDates?.from) {
    const fromDate = new Date(exactDates.from);

    if (!Number.isNaN(fromDate.getTime())) {
      return new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
    }
  }

  return getDefaultCalendarMonth(fallbackMonth);
}

function getInitialRange(exactDates) {
  if (exactDates?.from && exactDates?.to) {
    return {
      from: new Date(exactDates.from),
      to: new Date(exactDates.to),
    };
  }

  return undefined;
}

export default function DateScreen({
  selectedMonth: initialSelectedMonth = "best",
  exactDates,
  values = {},
  onChange,
  onBack,
  onValidate,
  onExactDatesValidate,
}) {
  const hasInitialExactDates = !!(exactDates?.from && exactDates?.to);

  const [selectedMonth, setSelectedMonth] = useState(initialSelectedMonth);
  const [showCalendar, setShowCalendar] = useState(hasInitialExactDates);
  const [range, setRange] = useState(() => getInitialRange(exactDates));
  const [calendarMonth, setCalendarMonth] = useState(() =>
    getCalendarMonthFromExactDates(exactDates, initialSelectedMonth)
  );
const [isLoading, setIsLoading] = useState(false);

const launchCalculation = (callback) => {
  setIsLoading(true);

  setTimeout(() => {
    callback();
  }, 450);
};
  const calendarRef = useRef(null);

  const tripDays = values.tripDays ?? 15;
  const customTripDays = values.customTripDays ?? false;
  const exactDatesSelected = !!(range?.from && range?.to);

  useEffect(() => {
    if (!showCalendar || !calendarRef.current) return;

    setTimeout(() => {
      calendarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);
  }, [showCalendar]);

const handleDurationClick = (option) => {
  setRange(undefined);
  setShowCalendar(false);

  if (!selectedMonth) {
    setSelectedMonth("best");
  }

  onChange?.({
    exactDates: null,
    selectedMonth: selectedMonth || "best",
    customTripDays: option.value === "custom",
    tripDays: option.value === "custom" ? tripDays || 15 : option.value,
  });
};

const handleCustomDaysChange = (value) => {
  setRange(undefined);
  setShowCalendar(false);

  onChange?.({
    exactDates: null,
    selectedMonth: selectedMonth || "best",
    tripDays: Number(value),
    customTripDays: true,
  });
};

  const handleMonthClick = (month) => {
    if (selectedMonth === month) {
      setSelectedMonth(null);
    } else {
      setSelectedMonth(month);
      setCalendarMonth(getDefaultCalendarMonth(month));
    }

    setRange(undefined);
    setShowCalendar(false);
  };

const handleBestMonth = () => {
  setSelectedMonth("best");
  setCalendarMonth(getDefaultCalendarMonth("best"));
  setRange(undefined);
  setShowCalendar(false);

  launchCalculation(() => onValidate?.("best"));
};

  const handleShowExactDates = () => {
    const monthToUse = selectedMonth;

    setSelectedMonth(null);
    setCalendarMonth(getDefaultCalendarMonth(monthToUse));
    setShowCalendar(true);
  };

const handleCancelDates = () => {
  setSelectedMonth("best");
  setRange(undefined);
  setShowCalendar(false);
  setCalendarMonth(getDefaultCalendarMonth("best"));

  onChange?.({
    selectedMonth: "best",
    exactDates: null,
    tripDays: 15,
    customTripDays: false,
  });
};

  const handleConfirmDates = () => {
    if (!range?.from || !range?.to) return;

    onExactDatesValidate?.({
      from: range.from,
      to: range.to,
    });

    setShowCalendar(false);
  };

const handleOk = () => {
  if (range?.from && range?.to) {
    launchCalculation(() =>
      onExactDatesValidate?.({
        from: range.from,
        to: range.to,
      })
    );
    return;
  }

  launchCalculation(() => onValidate?.(selectedMonth));
};

  return (
    <div
      className="date-screen"
      style={{ backgroundImage: "url('/choix_date.png')" }}
    >
      <div className="duration-section">
        <h3 className="date-title">Durée du voyage</h3>

        <div className="duration-grid">
          {durationOptions.map((option) => {
            const isActive =
  !exactDatesSelected &&
  (option.value === "custom"
    ? customTripDays
    : !customTripDays && tripDays === option.value);

            return (
<button
  key={option.value}
  className={`duration-btn ${isActive ? "active" : ""}`}
  onClick={() => handleDurationClick(option)}
>
  {option.label}
</button>
            );
          })}
        </div>
    
{isLoading && (
  <div className="date-loading-box">
    <div className="date-hourglass">⏳</div>

    <div className="date-loading-text">
      <strong>Calcul de ta destination...</strong>
    </div>
  </div>
)}

        {customTripDays && (
          <div className="custom-days-picker">
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={tripDays}
              onChange={(e) => handleCustomDaysChange(e.target.value)}
            />

            <div className="custom-days-value">
              {tripDays} jours de vacances
            </div>
          </div>
        )}
      </div>

      <h3 className="date-title">Quand partir ?</h3>

      <button className="best-month-btn" onClick={handleBestMonth}>
        ✨ Trouve-moi ma destination et MON MEILLEUR MOIS !
      </button>

      <div className="months-grid">
        {months.map((month) => (
          <button
            key={month}
            className={`month-btn ${selectedMonth === month ? "active" : ""}`}
            onClick={() => handleMonthClick(month)}
          >
            {month}
          </button>
        ))}
      </div>

<div className="app-actions date-actions">
  <button type="button" className="app-btn back date-side-btn" onClick={onBack}>
    BACK
  </button>

  <button
    type="button"
    className="dates-btn date-center-btn"
    onClick={handleShowExactDates}
  >
    <span className="calendar-icon">📅</span>
    <span className="dates-text">
      J&apos;ai les <br />
      dates exactes
    </span>
  </button>

  <button type="button" className="app-btn ok date-side-btn" onClick={handleOk}>
    OK
  </button>
</div>


      {showCalendar && (
        <div ref={calendarRef} className="calendar-section">
          <h3 className="calendar-title">Choisis ton intervalle de dates</h3>

          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            numberOfMonths={2}
            locale={fr}
          />

          <div className="calendar-actions">
            <button className="calendar-cancel" onClick={handleCancelDates}>
              Annuler
            </button>

            <button
              className="calendar-validate"
              disabled={!range?.from || !range?.to}
              onClick={handleConfirmDates}
            >
              Valider les dates
            </button>
          </div>
        </div>
      )}
    </div>
  );
}