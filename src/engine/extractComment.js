export default function extractComment(commentaire, key) {
  if (!commentaire || !commentaire.includes(`${key}=`)) {
    return null;
  }

  const afterKey = commentaire.split(`${key}=`)[1];
  return afterKey.split("/")[0].trim();
}
