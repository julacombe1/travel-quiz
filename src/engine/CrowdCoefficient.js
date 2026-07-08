export const clamp = (x, min, max) => Math.min(max, Math.max(min, x));

export const toNumber = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export const FREQ_LEVELS = [100, 75, 50, 25, 0];

export const COEFS = [
  [0.2, 0.55, 0.8, 0.95, 1.0],
  [0.55, 0.8, 0.95, 1.0, 0.95],
  [0.8, 0.95, 1.0, 0.95, 0.8],
  [0.95, 1.0, 0.95, 0.8, 0.55],
  [1.0, 0.95, 0.8, 0.55, 0.2],
];

function coefFromMatrix(starsInt, freqScore) {
  if (starsInt === 0) return 1;

  const row = COEFS[starsInt - 1] ?? COEFS[0];

  const f = toNumber(freqScore, 0);
  const fClamped = clamp(f, 0, 100);

  const exactIdx = FREQ_LEVELS.indexOf(fClamped);
  if (exactIdx !== -1) return row[exactIdx];

  for (let i = 0; i < FREQ_LEVELS.length - 1; i++) {
    const hi = FREQ_LEVELS[i];
    const lo = FREQ_LEVELS[i + 1];

    if (fClamped < hi && fClamped > lo) {
      const t = (hi - fClamped) / (hi - lo);
      const a = row[i];
      const b = row[i + 1];
      return a + (b - a) * t;
    }
  }

  return row[row.length - 1];
}

export function crowdCoefficient(
  stars,
  freqScore,
  {
    minCoef = 0,
    maxCoef = 1.2,
    freqMax = 100,
  } = {}
) {
  const s = Math.round(toNumber(stars, 0));
  const starsInt = clamp(s, 0, 5);

  if (starsInt === 0) return 1;

  const f = (toNumber(freqScore, 0) / freqMax) * 100;
  const coef = coefFromMatrix(starsInt, f);

  return clamp(coef, minCoef, maxCoef);
}

export default crowdCoefficient;