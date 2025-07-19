export function shouldTrackView(slug, cooldownMinutes = 60) {
  const viewedKey = `viewed-${slug}`;
  const lastViewed = localStorage.getItem(viewedKey);
  const now = Date.now();

  if (!lastViewed || now - parseInt(lastViewed) > cooldownMinutes * 60 * 1000) {
    localStorage.setItem(viewedKey, now.toString());
    return true;
  }

  return false;
}
