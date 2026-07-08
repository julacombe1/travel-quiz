export default function francophone(answers, destination) {
  const choice = answers?.fran ?? "indifferent";

  if (choice === "indifferent") {
    return { score: 1, commentaire: "" };
  }

  const franco = String(destination?.franco ?? "").trim().toUpperCase();

  if (choice === "oui") {
    return {
      score: franco === "Y" ? 1 : 0,
      commentaire: "",
    };
  }

  if (choice === "non") {
    return {
      score: franco === "N" ? 1 : 0,
      commentaire: "",
    };
  }

  return { score: 1, commentaire: "" };
}