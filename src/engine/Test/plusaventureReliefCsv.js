// src/engine/Test/exportWinnersWithReliefCsv.js
import fs from "fs";
import path from "path";

import destinations from "../../data/destinations.js";

// ✅ engines
import rando from "../rando.js";
import faune from "../faune.js";
import bain from "../bain.js";

const VALUES = [0, 1, 2, 3, 4, 5];

// ⚙️ Reliefs gérés (adapte si tu en ajoutes)
const RELIEF_KEYS = [
  "vegetalise",
  "alpin",
  "cotier",
  "volcanique",
  "tropical",
  "desertique",
  "foret",
];

// ---------- helpers ----------
const esc = (v) => {
  const s = String(v ?? "");
  if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const destKey = (d) => `${d.lieu} (${d.pays})`;

function calculateAllScores(answers, destinationsList) {
  return destinationsList.map((dest) => {
    const b = rando(answers, dest)?.score ?? 0;
    const c = faune(answers, dest)?.score ?? 0;
    const a = bain(answers, dest)?.score ?? 0;

    const score = (Number(a) || 0) + (Number(b) || 0) + (Number(c) || 0);

    return { ...dest, score, _key: destKey(dest) };
  });
}

/**
 * Génère toutes les combinaisons de relief sous forme d’objet:
 * - combinaison vide => { indifferent: true, ...false }
 * - sinon indifferent: false et certains reliefs true
 *
 * NB: on applique aussi ton exclusif vegetalise <-> desertique :
 * on ne génère pas les combos où les 2 sont true en même temps.
 */
function generateReliefCombos(keys) {
  const combos = [];
  const n = keys.length;

  const vegetaliseIdx = keys.indexOf("vegetalise");
  const desertiqueIdx = keys.indexOf("desertique");

  for (let mask = 0; mask < (1 << n); mask++) {
    // exclu vegetalise + desertique simultané
    if (vegetaliseIdx !== -1 && desertiqueIdx !== -1) {
      const vegOn = (mask & (1 << vegetaliseIdx)) !== 0;
      const desOn = (mask & (1 << desertiqueIdx)) !== 0;
      if (vegOn && desOn) continue;
    }

    const relief = { indifferent: mask === 0 };
    for (let i = 0; i < n; i++) {
      relief[keys[i]] = (mask & (1 << i)) !== 0;
    }
    combos.push(relief);
  }

  return combos;
}

function getOverallWinnersWithRelief(destinationsList) {
  const wins = new Map();

  const reliefCombos = generateReliefCombos(RELIEF_KEYS);
  const totalScenarios =
    VALUES.length ** 4 * reliefCombos.length; // rando, faune, tour, bain * reliefCombos

  const EMPTY_KEY = "(vide)";

  let processed = 0;

  for (const randoV of VALUES) {
    for (const fauneV of VALUES) {
      for (const tourV of VALUES) {
        for (const bainV of VALUES) {
          for (const relief of reliefCombos) {
            const answers = {
              rando: randoV,
              faune: fauneV,
              tour: tourV,
              bain: bainV,
              relief, // ✅ on injecte le bloc relief complet
            };

            const all = calculateAllScores(answers, destinationsList);
            all.sort((x, y) => y.score - x.score);

            const top1 = all[0];

            // ✅ si aucune destination ou score <= 0 => "(vide)"
            if (!top1 || !(Number(top1.score) > 0)) {
              wins.set(EMPTY_KEY, (wins.get(EMPTY_KEY) || 0) + 1);
            } else {
              wins.set(top1._key, (wins.get(top1._key) || 0) + 1);
            }

            processed++;
            if (processed % 5000 === 0) {
              console.log(`… ${processed}/${totalScenarios}`);
            }
          }
        }
      }
    }
  }

  const sorted = [...wins.entries()].sort((a, b) => b[1] - a[1]);
  return { sorted, totalScenarios, reliefCombosCount: reliefCombos.length, EMPTY_KEY };
}

// ---------- main ----------
const { sorted, totalScenarios, reliefCombosCount } =
  getOverallWinnersWithRelief(destinations);

console.log(`✅ Relief combos: ${reliefCombosCount}`);
console.log(`✅ Scénarios total: ${totalScenarios}`);

console.log(
  "Top 10:",
  sorted.slice(0, 10).map(([k, n]) => `${k} (${n})`)
);

const descriptionLine =
  `DESCRIPTION;Classement des destinations par nb de victoires (top1) ` +
  `sur tous les scénarios rando/faune/tour/bain + combinaisons de relief.;` +
  `Scénarios=${totalScenarios};ReliefCombos=${reliefCombosCount};Destinations=${sorted.length}`;

const header = ["Destination", "WinsTop1"].join(";");

const body = sorted.map(([k, n]) => [esc(k), String(n)].join(";")).join("\n");

const outDir = path.resolve("output");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "winners_top1_with_relief.csv");
const csvContent = `${descriptionLine}\n${header}\n${body}\n`;

fs.writeFileSync(outPath, csvContent, "utf8");
console.log(`\n📄 CSV généré: ${outPath}`);