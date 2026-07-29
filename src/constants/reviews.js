/** Review list helpers — data comes from GET /api/reviews. */

export const getReviewInitials = name => {
  const parts = String(name || '')
    .replace(/\./g, '')
    .trim()
    .split(/\s+/);
  return `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}`.toUpperCase() || '?';
};

export const formatReviewDate = createdAt => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/** Map API review → UI card shape */
export const mapApiReview = item => ({
  id: item.id,
  name: item.name || 'Anonymous',
  title: item.title || '',
  text: item.review || '',
  issue: item.issue || '',
  differenceAfter: item.difference_after || '',
  performanceChange: item.performance_change || '',
  rating: Number(item.rating) || 0,
  date: formatReviewDate(item.created_at),
  isApproved: item.is_approved == null ? true : Boolean(Number(item.is_approved)),
});

/** Build summary stats from a list of mapped reviews */
export const buildReviewStats = reviews => {
  const total = reviews.length;
  const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach(r => {
    const stars = Math.min(5, Math.max(1, Math.round(r.rating || 0)));
    buckets[stars] += 1;
    sum += r.rating || 0;
  });

  return {
    avg: total ? Math.round((sum / total) * 10) / 10 : 0,
    total,
    five: buckets[5],
    four: buckets[4],
    three: buckets[3],
    two: buckets[2],
    one: buckets[1],
  };
};
