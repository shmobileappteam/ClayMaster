import { ENDPOINTS } from './endpoints';
import api, { storage } from './api';
import { KEYS } from '../constants';

const asList = body => {
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
};

export const getForumDeviceId = () => {
  let id = storage.getString(KEYS.DEVICE_ID);
  if (!id) {
    id = `cm-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    storage.set(KEYS.DEVICE_ID, id);
  }
  return id;
};

/** GET /api/forum-categories */
export const getForumCategories = async () => {
  const response = await api.get(ENDPOINTS.GET_FORUM_CATEGORIES);
  const body = response.data;
  return {
    items: asList(body).filter(c => c?.is_active !== false),
    status: body?.status,
  };
};

/**
 * GET /api/forums
 * @param {{ sort?: string, alpha?: string, category?: number|string, page?: number, per_page?: number }} params
 */
export const getForums = async (params = {}) => {
  const response = await api.get(ENDPOINTS.GET_FORUMS, {
    params: {
      sort: params.sort || 'recent',
      page: params.page ?? 1,
      per_page: Math.min(params.per_page ?? 20, 50),
      ...(params.category != null && params.category !== ''
        ? { category: params.category }
        : {}),
      ...(params.alpha ? { alpha: params.alpha } : {}),
    },
  });
  const body = response.data;
  return {
    items: asList(body),
    pagination: body?.pagination || null,
    status: body?.status,
    message: body?.message,
  };
};

/**
 * GET /api/forums/{slug}
 * @param {string} slug
 * @param {{ sort?: string, page?: number, per_page?: number }} params
 */
export const getForum = async (slug, params = {}) => {
  const response = await api.get(ENDPOINTS.GET_FORUM(slug), {
    params: {
      sort: params.sort || 'newest',
      page: params.page ?? 1,
      per_page: Math.min(params.per_page ?? 30, 50),
    },
    headers: { 'X-Device-Id': getForumDeviceId() },
  });
  const body = response.data;
  const data = body?.data && typeof body.data === 'object' ? body.data : body;
  return {
    forum: data?.forum || data || null,
    replies: Array.isArray(data?.replies) ? data.replies : [],
    bestAnswer: data?.best_answer || null,
    poll: data?.poll || null,
    totalRepliesCount: Number(data?.total_replies_count) || 0,
    status: body?.status,
    message: body?.message,
  };
};

const buildForumBody = payload => {
  const body = {
    title: payload.title,
    category_id: Number(payload.category_id),
    description: payload.description,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
  };
  if (payload.enable_poll) {
    body.enable_poll = 1;
    body.poll_question = payload.poll_question;
    body.poll_options = payload.poll_options;
  }
  return body;
};

/** POST /api/forums */
export const createForum = async payload => {
  const response = await api.post(ENDPOINTS.CREATE_FORUM, buildForumBody(payload));
  return response.data;
};

/** POST /api/forums/{id}/update */
export const updateForum = async (id, payload) => {
  const response = await api.post(
    ENDPOINTS.UPDATE_FORUM(id),
    buildForumBody(payload),
  );
  return response.data;
};

/** DELETE /api/forums/{id} */
export const deleteForum = async id => {
  const response = await api.delete(ENDPOINTS.DELETE_FORUM(id));
  return response.data;
};

/**
 * POST /api/forums/{slug}/replies — multipart
 * @param {string} slug
 * @param {{ content: string, parent_id?: number, attachment?: { uri, type?, fileName? } }} payload
 */
export const postForumReply = async (slug, payload) => {
  const form = new FormData();
  form.append('content', payload.content);
  if (payload.parent_id != null) {
    form.append('parent_id', String(payload.parent_id));
  }
  if (payload.attachment?.uri) {
    const name =
      payload.attachment.fileName ||
      payload.attachment.uri.split('/').pop() ||
      'attachment.jpg';
    form.append('attachment', {
      uri: payload.attachment.uri,
      type: payload.attachment.type || 'image/jpeg',
      name,
    });
  }
  const response = await api.post(ENDPOINTS.POST_FORUM_REPLY(slug), form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/** POST /api/forum-replies/{id}/helpful */
export const toggleReplyHelpful = async id => {
  const response = await api.post(ENDPOINTS.TOGGLE_REPLY_HELPFUL(id));
  return response.data;
};

/** DELETE /api/forum-replies/{id} */
export const deleteForumReply = async id => {
  const response = await api.delete(ENDPOINTS.DELETE_FORUM_REPLY(id));
  return response.data;
};

/** POST /api/forum-replies/{id}/best-answer */
export const markBestAnswer = async id => {
  const response = await api.post(ENDPOINTS.MARK_BEST_ANSWER(id));
  return response.data;
};

/** POST /api/forums/{id}/report */
export const reportForum = async (id, reason) => {
  const response = await api.post(ENDPOINTS.REPORT_FORUM(id), { reason });
  return response.data;
};

/** POST /api/forum-replies/{id}/report */
export const reportForumReply = async (id, reason) => {
  const response = await api.post(ENDPOINTS.REPORT_FORUM_REPLY(id), { reason });
  return response.data;
};

/** POST /api/forums/{id}/poll/vote */
export const voteForumPoll = async (forumId, optionId) => {
  const response = await api.post(ENDPOINTS.VOTE_FORUM_POLL(forumId), {
    option_id: Number(optionId),
  });
  return response.data;
};

/** GET /api/forums/{id}/poll */
export const getForumPoll = async forumId => {
  const response = await api.get(ENDPOINTS.GET_FORUM_POLL(forumId));
  return response.data;
};
