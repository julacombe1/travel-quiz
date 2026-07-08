export default function admin(answers, destination) {
  const papiers = answers?.papiers;

  if (!papiers || papiers.indifferent) {
    return { score: 1, commentaire: "" };
  }

  const adminValue = String(destination?.admin ?? "").trim().toUpperCase();

  const selectedValues = [];

  if (papiers.carte) selectedValues.push("C");
  if (papiers.passeport) selectedValues.push("P");
  if (papiers.visa) selectedValues.push("V");
  if (papiers.evisa) selectedValues.push("E");
  if (papiers.complex) selectedValues.push("A");

  if (selectedValues.length === 0) {
    return { score: 1, commentaire: "" };
  }

  return {
    score: selectedValues.includes(adminValue) ? 1 : 0,
    commentaire: destination?.adminc ?? "",
  };
}