import { ENDPOINTS } from './endpoints';
import api from './api';

/**
 * GET /api/notifications
 * @param {{ unread_only?: 0|1, page?: number, per_page?: number }} params
 */
export const getNotifications = async (params = {}) => {
  const response = await api.get(ENDPOINTS.GET_NOTIFICATIONS, {
    params: {
      unread_only: params.unread_only ?? 0,
      page: params.page ?? 1,
      per_page: Math.min(params.per_page ?? 20, 50),
    },
  });
  const data = response.data;
  return {
    items: Array.isArray(data?.items) ? data.items : [],
  };
};

/** GET /api/notifications/counts → { unread, total } */
export const getNotificationCounts = async () => {
  const response = await api.get(ENDPOINTS.GET_NOTIFICATION_COUNTS);
  const data = response.data || {};
  return {
    unread: Number(data.unread) || 0,
    total: Number(data.total) || 0,
  };
};

/** POST /api/notifications/{id}/read → { status: true } */
export const markNotificationRead = async id => {
  const response = await api.post(ENDPOINTS.MARK_NOTIFICATION_READ(id));
  return response.data;
};

/** POST /api/notifications/read-all → { status: true } */
export const markAllNotificationsRead = async () => {
  const response = await api.post(ENDPOINTS.MARK_ALL_NOTIFICATIONS_READ);
  return response.data;
};

/**
 * DELETE /api/notifications/{id}
 * HTTP 200 with status true/false — check body.status
 */
export const deleteNotification = async id => {
  const response = await api.delete(ENDPOINTS.DELETE_NOTIFICATION(id));
  return response.data;
};
