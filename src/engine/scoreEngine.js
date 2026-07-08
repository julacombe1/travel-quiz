export function computeScore(userAnswers, destination) {
  let score = 0;

  for (const key in userAnswers) {
    score += (userAnswers[key] || 0) * (destination[key] || 0);
  }

  return score;
}