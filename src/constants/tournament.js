export const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const formatMonthTitle = (year, month, apiTitle) => {
  if (apiTitle) return apiTitle;
  const label = MONTH_LABELS[month - 1];
  return label ? `${label} ${year}` : `${month}/${year}`;
};

/** Shift calendar month; returns { year, month } (month 1–12). */
export const shiftMonth = (year, month, delta) => {
  const d = new Date(year, month - 1 + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
};

export const mapStanding = item => {
  if (!item) return null;
  const icon = String(item.icon || '').toLowerCase();
  return {
    award: item.award || '',
    icon:
      icon === 'medal' || icon === 'ribbon'
        ? 'ribbon-outline'
        : icon === 'star'
          ? 'star'
          : 'trophy',
    competitorName: item.competitor_name || '',
    nscaClass: item.nsca_class || '',
    totalAdjScore: Number(item.total_adj_score) || 0,
  };
};

export const mapLeaderboardEntry = item => {
  if (!item) return null;
  return {
    rank: Number(item.rank) || 0,
    nscaClass: item.nsca_class || '',
    competitorName: item.competitor_name || '',
    eventScore: Number(item.event_score) || 0,
    adjFactor: Number(item.adj_factor) || 0,
    totalAdjScore: Number(item.total_adj_score) || 0,
    tournamentName: item.tournament_name || '',
    tournamentDate: item.tournament_date || '',
  };
};

/** Normalize GET /classes into dropdown options. */
export const mapClassOptions = raw => {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.data)
      ? raw.data
      : [];
  return list
    .map(item => {
      if (typeof item === 'string') {
        return { label: item, value: item };
      }
      const value =
        item?.value ?? item?.name ?? item?.code ?? item?.nsca_class ?? null;
      if (value == null) return null;
      const label = item?.label ?? String(value);
      return { label, value: String(value) };
    })
    .filter(Boolean);
};

export const toIsoDate = date => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const parseIsoDate = value => {
  if (!value || typeof value !== 'string') return new Date();
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return new Date();
  const parsed = new Date(y, m - 1, d);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

export const formatDisplayDate = iso => {
  const date = parseIsoDate(iso);
  try {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso || '';
  }
};

export const rankBadgeColor = (rank, COLORS) => {
  if (rank === 1) return COLORS.primary;
  if (rank === 2) return COLORS.textSecondary;
  return COLORS.textPrimary;
};
