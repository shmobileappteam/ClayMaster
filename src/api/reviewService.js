import { ENDPOINTS } from './endpoints';
import api from './api';

/**
 * GET /api/reviews
 * @param {{ page?: number, per_page?: number }} params
 * @returns {{ items: Array, status?: boolean, message?: string }}
 */
export const getReviews = async (params = {}) => {
  const response = await api.get(ENDPOINTS.GET_REVIEWS, {
    params: {
      page: params.page ?? 1,
      per_page: Math.min(params.per_page ?? 20, 50),
    },
  });
  const body = response.data;
  const items = Array.isArray(body?.data)
    ? body.data
    : Array.isArray(body)
      ? body
      : [];
  return {
    items,
    status: body?.status,
    message: body?.message,
  };
};

/**
 * POST /api/reviews
 * Body: { title, review, name, email, issue, difference_after, performance_change, rating }
 * Requires active subscription (403 otherwise).
 */
export const submitReview = async payload => {
  const response = await api.post(ENDPOINTS.POST_REVIEW, {
    title: payload.title,
    review: payload.review,
    name: payload.name,
    email: payload.email,
    issue: payload.issue,
    difference_after: payload.difference_after,
    performance_change: payload.performance_change,
    rating: Number(payload.rating),
  });
  return response.data;
};
