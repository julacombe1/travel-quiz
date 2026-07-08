export default function filterDestinationGroups(
  results,
  destinationGroups = []
) {
  const removedIds = new Set();

  for (const group of destinationGroups) {
    const groupIds = group.map((id) => String(id));

    const groupResults = results.filter((res) =>
      groupIds.includes(String(res.id))
    );

    if (groupResults.length <= 1) continue;

    const best = groupResults.reduce((a, b) =>
      Number(b.score) > Number(a.score) ? b : a
    );

    for (const res of groupResults) {
      if (String(res.id) !== String(best.id)) {
        removedIds.add(String(res.id));
      }
    }
  }

  return results.filter((res) => !removedIds.has(String(res.id)));
}