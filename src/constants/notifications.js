/**
 * Notification icon map + API → UI helpers.
 * No hardcoded list data — list comes from GET /api/notifications.
 */

export const NOTIFICATION_ICON_MAP = {
  trophy: { name: 'trophy-outline', iconFamily: 'Ionicons' },
  message: { name: 'chatbubble-ellipses-outline', iconFamily: 'Ionicons' },
  calendar: { name: 'calendar-outline', iconFamily: 'Ionicons' },
  shopping: { name: 'bag-outline', iconFamily: 'Ionicons' },
  document: { name: 'document-text-outline', iconFamily: 'Ionicons' },
  bell: { name: 'notifications-outline', iconFamily: 'Ionicons' },
};

export const getNotificationIcon = iconType =>
  NOTIFICATION_ICON_MAP[iconType] ?? NOTIFICATION_ICON_MAP.bell;

const typeLabel = type => {
  const short = String(type || '')
    .replace(/Notification$/i, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  return short || 'Notification';
};

const resolveIconType = (type, action, data = {}) => {
  const t = String(type || '').toLowerCase();
  const a = String(action || data?.action || '').toLowerCase();

  if (t.includes('adminbroadcast') || t.includes('broadcast')) return 'bell';
  if (t.includes('round') || a.includes('round') || a.includes('uploaded')) {
    return a.includes('upload') ? 'document' : 'trophy';
  }
  if (t.includes('forum') || t.includes('reply') || t.includes('community')) {
    return 'message';
  }
  if (t.includes('coach') || t.includes('session') || a.includes('session')) {
    return 'calendar';
  }
  if (t.includes('order') || t.includes('shop') || t.includes('cart')) {
    return 'shopping';
  }
  return 'bell';
};

export const formatNotificationTime = createdAt => {
  if (!createdAt) return '';
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

/**
 * Map Laravel notification payload to UI row shape.
 */
export const mapApiNotification = item => {
  const data = item?.data || {};
  const normalized = item?.data_normalized || {};
  const action = normalized.action || data.action || data.type || null;
  const roundId = normalized.round_id ?? data.round_id ?? null;
  const downloadUrl = normalized.download_url || data.download_url || null;

  const title =
    data.title ||
    normalized.course_name ||
    (action ? String(action).replace(/_/g, ' ') : null) ||
    typeLabel(item?.type);

  const desc =
    data.message ||
    data.body ||
    (normalized.course_name && action
      ? `${normalized.course_name} — ${String(action).replace(/_/g, ' ')}`
      : '') ||
    (data.target_label ? `For ${data.target_label}` : '') ||
    '';

  return {
    id: item.id,
    type: item.type,
    title: typeof title === 'string' ? title : 'Notification',
    desc: typeof desc === 'string' ? desc : '',
    time: formatNotificationTime(item.created_at),
    unread: !item.read_at,
    iconType: resolveIconType(item.type, action, data),
    roundId,
    downloadUrl,
    action,
    createdAt: item.created_at,
    raw: item,
  };
};
