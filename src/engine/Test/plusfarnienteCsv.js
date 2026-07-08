// src/engine/Test/plusInsoCsv.js
import fs from "fs";
import path from "path";

import destinations from "../../data/destinations.js";
import { calculateResults } from "../calculateResults.js";
import fete from "../fete.js";
import infra from "../infra.js";
import mer from "../mer.js";

const VALUES = [0, 1, 2, 3, 4, 5];

// ---------- helpers ----------
const esc = (v) => {
  const s = String(v ?? "");
  if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const destKey = (d) => `${d.lieu} (${d.pays})`;

function getOverallWinners(destinationsList) {
  const wins = new Map();

  for (const balaV of VALUES) {
    for (const natureV of VALUES) {
      for (const merV of VALUES) {
        for (const tourV of VALUES) {
          for (const secuV of VALUES) {
            const answers = {
              bala: balaV,
              nature: natureV,
              mer: merV,      // ✅ NOUVEAU
              tour: tourV,
              secu: secuV,
            };

            const results = calculateResults(answers, destinationsList);
            const top1 = results?.[0];

            if (!top1 || !(Number(top1.score) > 0)) {
              wins.set("(vide)", (wins.get("(vide)") || 0) + 1);
            } else {
              const key = destKey(top1);
              wins.set(key, (wins.get(key) || 0) + 1);
            }
          }
        }
      }
    }
  }

  const sorted = [...wins.entries()].sort((a, b) => b[1] - a[1]);
  return { wins, sorted };
}

// ---------- main ----------
const totalScenarios = VALUES.length ** 5; // rando, faune, inso, tour, secu
console.log(`✅ Scénarios: ${totalScenarios} (attendu ${totalScenarios})`);

const { sorted } = getOverallWinners(destinations);

console.log(`🏆 Destinations gagnantes (top1 au moins 1 fois): ${sorted.length}`);
console.log(
  "Top 10:",
  sorted.slice(0, 10).map(([k, n]) => `${k} (${n})`)
);

const descriptionLine =
  `DESCRIPTION;Classement des destinations par nb de victoires (top1) ` +
  `en utilisant calculateResults, en bouclant rando/faune/inso/tour/secu (trek=0, bain=0 fixés).;` +
  `Scénarios=${totalScenarios};Destinations=${sorted.length}`;

const header = ["Destination", "WinsTop1"].join(";");

const body = sorted
  .map(([k, n]) => [esc(k), String(n)].join(";"))
  .join("\n");

const outDir = path.resolve("output");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "Plusfarniente.csv");
const csvContent = `${descriptionLine}\n${header}\n${body}\n`;

fs.writeFileSync(outPath, csvContent, "utf8");
console.log(`\n📄 CSV généré: ${outPath}`);