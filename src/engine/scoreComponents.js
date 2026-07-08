import trek from "./trek.js";
import inso from "./inso.js";
import mer from "./mer.js";
import genericTheme from "./genericTheme.js";
import eventTheme from "./eventTheme.js";
import specialBonusEngine from "./specialBonusEngine.js";
import francophone from "./francophone.js";
import admin from "./admin.js";
import avion from "./avion.js";
import hmax from "./hmax.js";
import transportModes from "./transportModes.js";
import { budget } from "./budget.js";
import { chaleur } from "./chaleur.js";
import { meteo } from "./meteo.js";
import tour from "./tour.js";
import secu from "./secu.js";
import relief from "./relief.js";
import proximite from "./proximite.js";
import cityActivityCoefficient from "./cityActivityCoefficient.js";
import adjustmentCoefficient from "./adjustmentCoefficient.js";


export const SCORE_COMPONENTS = [
  { key: "trek", engine: trek, type: "sum" },
  { key: "rando", engine: genericTheme("rando"), type: "sum" },
  { key: "faune", engine: genericTheme("faune"), type: "sum" },
  { key: "inso", engine: inso, type: "sum" },
  { key: "bala", engine: genericTheme("bala"), type: "sum" },
  { key: "mer", engine: mer, type: "sum" },
  { key: "fete", engine: genericTheme("fete"), type: "sum" },
  { key: "nature", engine: genericTheme("nature"), type: "sum" },
  { key: "infra", engine: genericTheme("infra"), type: "sum" },
 
// =====================
// THEMES VILLE
// =====================

{ key: "histo", engine: genericTheme("histo"), type: "sum" },
{ key: "reli", engine: genericTheme("reli"), type: "sum" },
{ key: "musees", engine: genericTheme("musees"), type: "sum" },
{ key: "arch", engine: genericTheme("arch"), type: "sum" },
{ key: "monu", engine: genericTheme("monu"), type: "sum" },

{ key: "shop", engine: genericTheme("shop"), type: "sum" },
{ key: "moder", engine: genericTheme("moder"), type: "sum" },

{ key: "spec", engine: genericTheme("spec"), type: "sum" },
{ key: "noctu", engine: genericTheme("noctu"), type: "sum" },

{ key: "quar", engine: genericTheme("quar"), type: "sum" },
{ key: "streetart", engine: genericTheme("streetart"), type: "sum" },

{ key: "soin", engine: genericTheme("soin"), type: "sum" },
{ key: "massage", engine: genericTheme("massage"), type: "sum" },

// =====================
// THEMES EVENEMENTS / LOISIRS
// =====================

{ key: "carna", engine: eventTheme("carna"), type: "sum" },
{ key: "festi", engine: eventTheme("festi"), type: "sum" },

{ key: "attrac", engine: genericTheme("attrac"), type: "sum" },
{ key: "attracsens", engine: genericTheme("attracsens"), type: "sum" },

{ key: "zoo", engine: genericTheme("zoo"), type: "sum" },
{ key: "aqua", engine: genericTheme("aqua"), type: "sum" },

// =====================
// THEMES ACTIVITE
// =====================

{ key: "snork", engine: genericTheme("snork"), type: "sum" },
{ key: "plongee", engine: genericTheme("plongee"), type: "sum" },

{ key: "visite", engine: genericTheme("visite"), type: "sum" },
{ key: "planta", engine: genericTheme("planta"), type: "sum" },

{ key: "velo", engine: genericTheme("velo"), type: "sum" },
{ key: "cyclisme", engine: genericTheme("cyclisme"), type: "sum" },

{ key: "canoe", engine: genericTheme("canoe"), type: "sum" },
{ key: "rafting", engine: genericTheme("rafting"), type: "sum" },
{ key: "canyon", engine: genericTheme("canyon"), type: "sum" },

{ key: "accro", engine: genericTheme("accro"), type: "sum" },
{ key: "viaferrata", engine: genericTheme("viaferrata"), type: "sum" },

{ key: "motor", engine: genericTheme("motor"), type: "sum" },
{ key: "bateau", engine: genericTheme("bateau"), type: "sum" },

{ key: "surf", engine: genericTheme("surf"), type: "sum" },
{ key: "jetski", engine: genericTheme("jetski"), type: "sum" },

{ key: "grot", engine: genericTheme("grot"), type: "sum" },
{ key: "speleo", engine: genericTheme("speleo"), type: "sum" },

{ key: "aerien", engine: genericTheme("aerien"), type: "sum" },
{ key: "extreme", engine: genericTheme("extreme"), type: "sum" },

{ key: "esca", engine: genericTheme("esca"), type: "sum" },



// =====================
// THEMES 3 - NOURRITURE & LOGEMENT
// =====================

// Nourriture & boissons
{ key: "streetfood", engine: genericTheme("streetfood"), type: "sum" },
{ key: "stvege", engine: genericTheme("stvege"), type: "sum" },

{ key: "cuisineloc", engine: genericTheme("cuisineloc"), type: "sum" },
{ key: "cuivege", engine: genericTheme("cuivege"), type: "sum" },

{ key: "gastro", engine: genericTheme("gastro"), type: "sum" },
{ key: "gasvege", engine: genericTheme("gasvege"), type: "sum" },

{ key: "alcool", engine: genericTheme("alcool"), type: "sum" },
{ key: "vin", engine: genericTheme("vin"), type: "sum" },

{ key: "doux", engine: genericTheme("doux"), type: "sum" },
{ key: "epice", engine: genericTheme("epice"), type: "sum" },

{ key: "atelcul", engine: genericTheme("atelcul"), type: "sum" },

// Logement & ambiance
{ key: "luxe", engine: genericTheme("luxe"), type: "sum" },
{ key: "confort", engine: genericTheme("confort"), type: "sum" },
{ key: "popu", engine: genericTheme("popu"), type: "sum" },

{ key: "camp", engine: genericTheme("camp"), type: "sum" },
{ key: "sauvage", engine: genericTheme("sauvage"), type: "sum" },

{ key: "jacuz", engine: genericTheme("jacuz"), type: "sum" },
{ key: "pisci", engine: genericTheme("pisci"), type: "sum" },

{ key: "roman", engine: genericTheme("roman"), type: "sum" },
{ key: "coquin", engine: genericTheme("coquin"), type: "sum" },

{ key: "atyp", engine: genericTheme("atyp"), type: "sum" },
{ key: "eco", engine: genericTheme("eco"), type: "sum" },

// Modes de transport
{ key: "transportModes", engine: transportModes, type: "sum", alwaysRun: true },

// COEFFICIENTS
{ key: "franco", engine: francophone, type: "coef" },
{ key: "admin", engine: admin, type: "coef" },
{ key: "avion", engine: avion, type: "coef" },
{ key: "hmax", engine: hmax, type: "coef" },
{
  key: "budget",
  engine: (answers, dest) => budget(dest, answers),
  type: "coef",
  alwaysRun: true,
},
{
  key: "meteo",
  engine: meteo,
  type: "coef",
  alwaysRun: true,
},
{
  key: "chaleur",
  engine: chaleur,
  type: "coef",
  alwaysRun: true,
},
{ key: "tour", engine: tour, type: "coef", alwaysRun: true },
{ key: "secu", engine: secu, type: "coef", alwaysRun: true },
{
  key: "relief",
  engine: relief,
  type: "coef",
  alwaysRun: true,
},
//{
//  key: "proximite",
//  engine: proximite,
//  type: "coef",
//  alwaysRun: true,
// },

{
  key: "cityActivityCoefficient",
  engine: cityActivityCoefficient,
  type: "coef",
},

{
  key: "adjustmentCoefficient",
  engine: adjustmentCoefficient,
  type: "coef",
  alwaysRun: true,
}
];