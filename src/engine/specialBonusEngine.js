const specialBonusEngine = ({
  answerKey,
  bonusAnswerKey,
  destinationKey,
  bonusDestinationKey,
  commentKey,
  bonusCommentKey,
}) => {
  return (answers, destination) => {
    if (!answers?.[answerKey] || answers[answerKey] <= 0) {
      return { score: 0, commentaire: "" };
    }

    const hasBonus = Number(answers?.[bonusAnswerKey]) === 1;

    const value = hasBonus
      ? destination?.[bonusDestinationKey]
      : destination?.[destinationKey];

    const commentaire = hasBonus
      ? destination?.[bonusCommentKey]
      : destination?.[commentKey];

    const score = Number(value ?? 0) * answers[answerKey];

    return {
      score,
      commentaire: commentaire ?? "",
    };
  };
};

export default specialBonusEngine;