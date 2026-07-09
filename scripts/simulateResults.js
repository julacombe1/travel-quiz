import ExcelJS from "exceljs";

import destinations from "../src/data/destinations.js";
import { calculateResults } from "../src/engine/calculateResults.js";
import { simulateAnswers } from "../src/simulator/simulateAnswers.js";

const SIMULATION_COUNT = 50000;
const TOP_N = 10;
const OUTPUT_FILE = "simulation-results.xlsx";

const stats = {};
const budgetPressureStats = {};
let noResultCount = 0;

for (let i = 0; i < SIMULATION_COUNT; i++) {
  const answers = simulateAnswers(i === 0);
  const results = calculateResults(answers, destinations);

  if (!results || results.length === 0) {
    noResultCount++;
    continue;
  }

  for (let rank = 0; rank < TOP_N; rank++) {
    const destination = results[rank];
    if (!destination) continue;

    const nom = destination.nom ?? destination.id ?? "Sans nom";

    stats[nom] ??= Array(TOP_N).fill(0);
    budgetPressureStats[nom] ??= Array(TOP_N).fill(0);

    stats[nom][rank]++;
    budgetPressureStats[nom][rank] += destination.budgetPressureCount ?? 0;
  }
}

const rows = Object.entries(stats)
  .map(([destination, ranks]) => {
    const row = {
      Destination: destination,
    };

    for (let i = 0; i < TOP_N; i++) {
      row[`Rang ${i + 1}`] = ranks[i];
    }

    row["Total Top 10"] = ranks.reduce((sum, value) => sum + value, 0);

    for (let i = 0; i < TOP_N; i++) {
      const occurrences = ranks[i] || 0;
      const totalPressure = budgetPressureStats[destination]?.[i] || 0;

      row[`Budget moyen Rang ${i + 1}`] =
        occurrences > 0
          ? Math.round((totalPressure / occurrences) * 100) / 100
          : 0;
    }

    return row;
  })
  .sort((a, b) => {
    for (let i = 1; i <= TOP_N; i++) {
      const diff = b[`Rang ${i}`] - a[`Rang ${i}`];
      if (diff !== 0) return diff;
    }

    return a.Destination.localeCompare(b.Destination);
  });

console.log(`Simulations lancées : ${SIMULATION_COUNT}`);
console.log(`Simulations sans résultat : ${noResultCount}`);
console.log(`Destinations apparues dans le top ${TOP_N} : ${rows.length}`);

console.table(rows.slice(0, 20));

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("Simulation");

worksheet.columns = [
  { header: "Destination", key: "Destination", width: 45 },

  ...Array.from({ length: TOP_N }, (_, index) => ({
    header: `Rang ${index + 1}`,
    key: `Rang ${index + 1}`,
    width: 12,
  })),

  { header: "Total Top 10", key: "Total Top 10", width: 15 },

  ...Array.from({ length: TOP_N }, (_, index) => ({
    header: `Budget moyen Rang ${index + 1}`,
    key: `Budget moyen Rang ${index + 1}`,
    width: 22,
  })),
];

worksheet.addRows(rows);

worksheet.getRow(1).font = { bold: true };
worksheet.views = [{ state: "frozen", ySplit: 1 }];

const lastColumnLetter = worksheet.getColumn(worksheet.columns.length).letter;

worksheet.autoFilter = {
  from: "A1",
  to: `${lastColumnLetter}1`,
};
await workbook.xlsx.writeFile(OUTPUT_FILE);

console.log(`Fichier Excel généré : ${OUTPUT_FILE}`);