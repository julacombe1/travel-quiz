export function aggregateComponents(components) {
  let sumScore = 0;
  let coefProduct = 1;

  const scores = {};
  const comments = {};

  for (const component of components) {
    const { key, type, score, commentaire } = component;

    const safeScore = Number.isFinite(Number(score)) ? Number(score) : 0;

    scores[key] = safeScore;

    if (type === "sum") {
      sumScore += safeScore;
    } else if (type === "coef") {
      coefProduct *= safeScore;
    }

    if (commentaire) {
      comments[key] = commentaire;
    }
  }

  return {
    rawSum: sumScore,
    coefProduct,
    totalBeforeTime: sumScore * coefProduct,
    scores,
    comments,
    components,
  };
}