// src/engine/exportTop3MatrixCsv.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import destinations from "../../data/destinations.js";

// ✅ engines (à adapter si tu en ajoutes)
import trek from "../trek.js";
import rando from "../rando.js";
import faune from "../faune.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VALUES = [0, 1, 2, 3, 4, 5];

// ---------- helpers ----------
const esc = (v) => {
  const s = String(v ?? "");
  // CSV Excel friendly ; and quotes
  if (/[;"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

const destKey = (d) => `${d.lieu} (${d.pays})`;

function calculateAllScores(answers, destinationsList) {
  // calcule un score pour CHAQUE destination (sans slice)
  return destinationsList.map((dest) => {
 //   const a = trek(answers, dest)?.score ?? 0;
    const b = rando(answers, dest)?.score ?? 0;
    const c = faune(answers, dest)?.score ?? 0;

 //   const score = (Number(a) || 0) + (Number(b) || 0) + (Number(c) || 0);
    const score =  (Number(b) || 0) + (Number(c) || 0);
    return {
      ...dest,
      score,
      _key: destKey(dest),
    };
  });
}

function getAllOverallWinners(destinationsList) {
  // Toutes les destinations qui finissent 1ères au moins une fois,
  // triées par nb de "wins" décroissant.
  const wins = new Map();

  //for (const trekV of VALUES) {
    for (const randoV of VALUES) {
      for (const fauneV of VALUES) {
        for (const tourV of VALUES) {
 //         const answers = { trek: trekV, rando: randoV, faune: fauneV, tour: tourV };
          const answers = { rando: randoV, faune: fauneV, tour: tourV };
          const all = calculateAllScores(answers, destinationsList);
          all.sort((x, y) => y.score - x.score);

          const top1 = all[0];
          if (!top1) continue;

          wins.set(top1._key, (wins.get(top1._key) || 0) + 1);
        }
      }
    }
 // }

  // -> [{ key, wins }]
  const sorted = [...wins.entries()].sort((a, b) => b[1] - a[1]);

  return {
    keys: sorted.map(([k]) => k),
    winsByKey: new Map(sorted),
  };
}


// ---------- main ----------
const scenarioLabels = [];
const scenarioAnswers = [];

for (const tourV of VALUES) {
  for (const randoV of VALUES) {
    for (const fauneV of VALUES) {
//      for (const trekV of VALUES) {
//        scenarioAnswers.push({ trek: trekV, rando: randoV, faune: fauneV, tour: tourV });
//        scenarioLabels.push(`T${trekV}_R${randoV}_F${fauneV}_TOUR${tourV}`);
         scenarioAnswers.push({  rando: randoV, faune: fauneV, tour: tourV });
        scenarioLabels.push(`R${randoV}_F${fauneV}_TOUR${tourV}`);
      }
    }
//  }
}


console.log(`✅ Scénarios: ${scenarioAnswers.length} (attendu 1296)`);

// 1) Choisir toutes les destinations "trouvées" (au moins une fois top1)
const { keys: winners, winsByKey } = getAllOverallWinners(destinations);
console.log(`🏆 Destinations gagnantes (top1 au moins 1 fois): ${winners.length}`);
console.log("Top 10:", winners.slice(0, 10).map(k => `${k} (${winsByKey.get(k)})`));

// 2) Construire la matrice [N lignes] x [1 + nbScénarios colonnes]
const rows = winners.map((k) => ({
  destination: k,
  wins: winsByKey.get(k) || 0,
  scores: [],
}));

for (let i = 0; i < scenarioAnswers.length; i++) {
  const answers = scenarioAnswers[i];

  const all = calculateAllScores(answers, destinations);

  // pour accès rapide
  const scoreByKey = new Map(all.map((d) => [d._key, d.score]));

  for (const row of rows) {
    const s = scoreByKey.get(row.destination);
    row.scores.push(Number.isFinite(s) ? s : 0);
  }

  if ((i + 1) % 200 === 0) console.log(`… ${i + 1}/${scenarioAnswers.length}`);
}

// 3) Écrire le CSV
// Ligne 1 = description (ta demande)
const descriptionLine =
  `DESCRIPTION;Matrice des scores pour toutes les destinations apparaissant top1 au moins 1 fois. ` +
  `Colonnes 3..${scenarioAnswers.length + 2} = scénarios (trek/rando/faune/tour).;` +
  `Scénarios=${scenarioAnswers.length};Destinations=${rows.length}`;

// Ligne 2 = en-têtes : Destination + Run1..RunN (ou labels)
const header = ["Destination", "WinsTop1", ...scenarioLabels].join(";");

// Lignes suivantes = 3 destinations + scores
const body = rows
  .map((r) =>
    [
      esc(r.destination),
      String(r.wins),
      ...r.scores.map((x) => String(Math.round(x * 1000) / 1000)),
    ].join(";")
  )
  .join("\n");

const outDir = path.join(__dirname, "output");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "winners_top1_matrix.csv");
fs.writeFileSync(outPath, `${descriptionLine}\n${header}\n${body}\n`, "utf8");

console.log(`\n📄 CSV généré: ${outPath}`);