import fs from "fs";
import path from "path";

/* ===================== */
/* DESTINATIONS */
/* ===================== */

const inputPath = path.resolve("src/data/destinations.csv");
const outputPath = path.resolve("src/data/destinations.js");


console.log("Dossier courant :", process.cwd());
console.log("CSV lu :", inputPath);
console.log("JS généré :", outputPath);
const raw = fs.readFileSync(inputPath, "utf-8");

const lines = raw
  .replace(/^\uFEFF/, "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

const headers = lines[0].split(";").map((h) =>
  h.trim().toLowerCase()
);

const data = lines.slice(1).map((line) => {
  const cells = line.split(";");
  const row = {};

  headers.forEach((key, i) => {
    let value = cells[i]?.trim();

    if (!value) {
      row[key] = "";
      return;
    }

    const normalized = value.replace(",", ".");
    const num = Number(normalized);

    row[key] = Number.isNaN(num) ? value : num;
  });

  return row;
});

const output = `const destinations = ${JSON.stringify(data, null, 2)};
export default destinations;
`;

fs.writeFileSync(outputPath, output);

console.log("✅ destinations.js généré");

/* ===================== */
/* DESTINATION GROUPS */
/* ===================== */

const groupInputPath = path.resolve("src/data/destinations_group.csv");
const groupOutputPath = path.resolve("src/data/destinations_group.js");

if (fs.existsSync(groupInputPath)) {
  const rawGroups = fs.readFileSync(groupInputPath, "utf-8");

  const groupLines = rawGroups
    .replace(/^\uFEFF/, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const destinationGroups = groupLines.slice(1).map((line) =>
    line
      .split(";")
      .map((cell) => cell.trim())
      .filter(Boolean)
      .map((id) => {
        const normalized = id.replace(",", ".");
        const num = Number(normalized);
        return Number.isNaN(num) ? id : num;
      })
  );

  const groupOutput = `const destinationGroups = ${JSON.stringify(
    destinationGroups,
    null,
    2
  )};
export default destinationGroups;
`;

  fs.writeFileSync(groupOutputPath, groupOutput);

  console.log("✅ destinations_group.js généré");
} else {
  console.log("ℹ️ Aucun destinations_group.csv trouvé");
}