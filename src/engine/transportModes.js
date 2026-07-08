export default function transportModes(answers, destination) {
  const modes = answers?.transportModes;

  if (!modes || modes.indifferent) {
    return { score: 0, commentaire: {} };
  }

  let score = 0;
  const commentaire = {};

  const avionChoice = answers?.avion ?? "indifferent";

if (modes.voiture) {
  score += Number(destination?.voitu ?? 0);

  if (destination?.voituc) {
    commentaire.voiture = destination.voituc;
  }
}

  if (modes.commun) {
    score += Number(destination?.bus ?? 0);

    if (destination?.busc) {
      commentaire.commun = destination.busc;
    }
  }

  if (modes.taxi) {
    if (modes.vtc) {
      score += Number(destination?.vtc ?? 0);

      if (destination?.vtcc) {
        commentaire.vtc = destination.vtcc;
      }
    } else {
      score += Number(destination?.taxi ?? 0);

      if (destination?.taxic) {
        commentaire.taxi = destination.taxic;
      }
    }
  }

  return { score, commentaire };
}