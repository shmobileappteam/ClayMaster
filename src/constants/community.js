/** Forum / Community UI helpers — API mappers (no dummy posts). */

import { BASE_URL } from '../api/endpoints';

export const getInitials = name =>
  (name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

/**
 * API often returns relative paths like `storage/images/profile/….JPG`.
 * Prefix with BASE_URL (same as Profile / Header).
 */
export const resolveMediaUrl = path => {
  if (!path || typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  if (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith('file:') ||
    trimmed.startsWith('content:') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${base}${trimmed.replace(/^\//, '')}`;
};

/** Detect HTML markup in forum description/content. */
export const looksLikeHtml = value =>
  typeof value === 'string' && /<\/?[a-z][\s\S]*>/i.test(value);

/** Plain-text preview for cards/lists — do not use on detail body. */
export const stripHtml = html =>
  String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/** Ensure RenderHTML always receives a fragment (plain text → escaped &lt;p&gt;). */
export const toRenderableHtml = value => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (looksLikeHtml(raw)) return raw;
  return `<p>${raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')}</p>`;
};

export const formatUserName = user => {
  if (!user) return 'Member';
  if (typeof user === 'string') return user;
  const full = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return full || user.name || user.username || 'Member';
};

export const formatRelativeTime = value => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  try {
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return date.toISOString().slice(0, 10);
  }
};

export const normalizeTags = tags => {
  if (!Array.isArray(tags)) return [];
  return tags
    .map(t => String(t || '').replace(/^#/, '').trim())
    .filter(Boolean);
};

export const mapForumCategory = item => {
  if (!item) return null;
  return {
    id: item.id,
    name: item.name || '',
    isActive: item.is_active !== false,
  };
};

export const mapForumTopic = item => {
  if (!item) return null;
  const userName = formatUserName(item.user);
  const avatarRaw = item.user?.avatar || item.user?.profile_image || null;
  return {
    id: item.id,
    title: item.title || '',
    description: item.description || item.content || '',
    content: item.content || item.description || '',
    slug: item.slug || '',
    userId: item.user_id ?? item.user?.id ?? null,
    categoryId: item.category_id ?? item.category?.id ?? null,
    categoryName: item.category?.name || '',
    status: item.status || '',
    viewsCount: Number(item.views_count) || 0,
    repliesCount: Number(item.replies_count) || 0,
    tags: normalizeTags(item.tags),
    attachment: item.attachment || null,
    user: item.user || null,
    userName,
    avatarUrl: resolveMediaUrl(avatarRaw),
    time: formatRelativeTime(item.created_at || item.updated_at),
    createdAt: item.created_at || null,
  };
};

export const mapForumReply = item => {
  if (!item) return null;
  const userName = formatUserName(item.user);
  const avatarRaw = item.user?.avatar || item.user?.profile_image || null;
  return {
    id: item.id,
    forumId: item.forum_id,
    userId: item.user_id ?? item.user?.id ?? null,
    parentId: item.parent_id ?? null,
    content: item.content || '',
    attachment: item.attachment || null,
    user: item.user || null,
    userName,
    author: {
      id: item.user_id ?? item.user?.id ?? null,
      name: userName,
      avatar: resolveMediaUrl(avatarRaw),
    },
    time: formatRelativeTime(item.created_at || item.updated_at),
    createdAt: item.created_at || null,
    isEdited: Boolean(item.is_edited),
    helpfulCount: Number(item.helpful_count) || 0,
    isHelpful: Boolean(item.is_helpful),
    isHelpfulByMe: Boolean(item.is_helpful),
    isBest: Boolean(item.is_best_answer || item.is_best),
    isBestAnswer: Boolean(item.is_best_answer || item.is_best),
  };
};

export const mapPoll = poll => {
  if (!poll) return null;
  const options = Array.isArray(poll.options) ? poll.options : [];
  const userVotedOptionId = poll.user_voted_option_id ?? null;
  return {
    id: poll.id,
    question: poll.question || '',
    totalVotes: Number(poll.total_votes) || 0,
    userVotedOptionId,
    hasVoted: userVotedOptionId != null,
    options: options.map(o => ({
      id: o.id,
      text: o.option_text || o.text || '',
      votes: Number(o.votes_count) || 0,
      votesCount: Number(o.votes_count) || 0,
      percentage: Number(o.percentage) || 0,
      isSelected: Boolean(o.is_selected),
      sortOrder: o.sort_order ?? 0,
    })),
  };
};

/**
 * Map GET /api/forums/{slug} service result
 * ({ forum, replies, bestAnswer, poll, totalRepliesCount }).
 */
export const mapForumDetail = payload => {
  if (!payload?.forum && !payload?.id) return null;
  const forum = payload.forum || payload;
  const topic = mapForumTopic(forum);
  if (!topic) return null;
  const authorName = topic.userName;
  const avatarRaw = forum.user?.avatar || forum.user?.profile_image || null;
  return {
    ...topic,
    author: {
      id: topic.userId,
      name: authorName,
      avatar: resolveMediaUrl(avatarRaw) || topic.avatarUrl,
    },
    category: {
      id: topic.categoryId,
      name: topic.categoryName || forum.category?.name || 'Discussion',
    },
    isEdited: Boolean(forum.is_edited),
    poll: mapPoll(payload.poll || forum.poll),
    bestAnswer: payload.bestAnswer || payload.best_answer || null,
    totalRepliesCount:
      Number(payload.totalRepliesCount ?? payload.total_replies_count) ||
      topic.repliesCount,
  };
};

/** Alias used by some screens */
export const formatCommunityRelativeTime = formatRelativeTime;

export const FORUM_SORT_OPTIONS = [
  { label: 'Recent', value: 'recent' },
  { label: 'Most replied', value: 'most_replied' },
  { label: 'Most viewed', value: 'most_viewed' },
  { label: 'Oldest', value: 'oldest' },
];

export const SUGGESTED_TAGS = [
  'SportingClays',
  'Skeet',
  'Trap',
  'Training',
  'Competition',
  'NewShooter',
];
