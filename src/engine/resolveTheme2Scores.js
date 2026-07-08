export function resolveTheme2Scores(values, themes) {
  const resolved = { ...values };

  themes.forEach((theme) => {
    if (!theme.duoId) return;

    const mainKey = theme.scoreKey ?? theme.id;
    const duoKey = theme.duoScoreKey ?? theme.duoId;

    const stars = Number(values?.[theme.id]) || 0;
    const duoChecked = Number(values?.[theme.duoId]) === 1;

    if (stars <= 0) {
      resolved[mainKey] = 0;
      resolved[duoKey] = 0;
      return;
    }

    if (duoChecked) {
      resolved[mainKey] = 0;
      resolved[duoKey] = stars;
    } else {
      resolved[mainKey] = stars;
      resolved[duoKey] = 0;
    }
  });

  return resolved;
}