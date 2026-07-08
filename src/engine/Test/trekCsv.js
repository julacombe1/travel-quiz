// src/engine/Test/plusaventureCsv.js
import fs from "fs";
import path from "path";

import destinations from "../../data/destinations.js";
import { calculateResults } from "../calculateResults.js"; // ✅ on réutilise la vraie logique
import inso from "../inso.js";

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
  for (const trekV of VALUES) {
    for (const fauneV of VALUES) {
      for (const tourV of VALUES) {
        for (const insoV of VALUES) {
          for (const secuV of VALUES) {

            const answers = {
              trek: trekV, 
              rando: 0,       // ✅ FIXÉ (vu que tu ne boucles pas dessus)
              faune: fauneV,
              tour: tourV,
              inso: insoV,
              bain: 0,       // ✅ FIXÉ (vu que tu ne boucles pas dessus)
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
const totalScenarios = VALUES.length ** 5; // trek, rando, faune, tour, bain, secu
console.log(`✅ Scénarios: ${totalScenarios} (attendu ${totalScenarios})`);

const { sorted } = getOverallWinners(destinations);

console.log(`🏆 Destinations gagnantes (top1 au moins 1 fois): ${sorted.length}`);
console.log(
  "Top 10:",
  sorted.slice(0, 10).map(([k, n]) => `${k} (${n})`)
);

// CSV : Destination;WinsTop1
const descriptionLine =
  `DESCRIPTION;Classement des destinations par nb de victoires (top1) ` +
  `en utilisant calculateResults (trek+rando+faune+bain)*secu.;` +
  `Scénarios=${totalScenarios};Destinations=${sorted.length}`;

const header = ["Destination", "WinsTop1"].join(";");

const body = sorted
  .map(([k, n]) => [esc(k), String(n)].join(";"))
  .join("\n");

const outDir = path.resolve("output");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "trek.csv");
const csvContent = `${descriptionLine}\n${header}\n${body}\n`;

fs.writeFileSync(outPath, csvContent, "utf8");
console.log(`\n📄 CSV généré: ${outPath}`);