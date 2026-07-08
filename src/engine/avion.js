export default function avion(answers, destination) {
  const choice = answers?.avion ?? "indifferent";

  const hasAvion =
    String(destination?.avion ?? "").toUpperCase() === "Y";

  const hasCommun =
    String(destination?.commun ?? "").toUpperCase() === "Y";

  // 🔹 Aucun moyen de transport disponible
  if (!hasAvion && !hasCommun) {
    return {
      score: 0,
      commentaire: "",
    };
  }

  // 🔹 Cas 1 : indifférent
  if (choice === "indifferent") {
    return { score: 1, commentaire: "" };
  }

  // 🔹 Cas 2 : utilisateur veut avion
  if (choice === "oui") {
    return {
      score: hasAvion ? 1 : 0,
      commentaire: "",
    };
  }

  // 🔹 Cas 3 : utilisateur refuse avion
  if (choice === "non") {
    return {
      score: hasCommun ? 1 : 0,
      commentaire: "",
    };
  }

  return { score: 1, commentaire: "" };
}