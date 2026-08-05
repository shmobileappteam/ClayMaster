import { ENDPOINTS } from './endpoints';
import api from './api';

const asList = body => {
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
};

/**
 * GET /api/coaches
 * data[]: { key, name, booking_url }
 */
export const getCoaches = async () => {
  const response = await api.get(ENDPOINTS.GET_COACHES);
  const body = response.data;
  return {
    items: asList(body),
    status: body?.status,
  };
};

/**
 * GET /api/sessions
 * data: { package_id, months_active, has_reached_limit, can_book_session,
 *         appointments[], summary }
 */
export const getSessions = async () => {
  const response = await api.get(ENDPOINTS.GET_SESSIONS);
  const body = response.data;
  const data = body?.data && !Array.isArray(body.data) ? body.data : body;
  const appointments = Array.isArray(data?.appointments)
    ? data.appointments
    : [];
  const summary = data?.summary && typeof data.summary === 'object'
    ? data.summary
    : {};

  return {
    packageId: data?.package_id ?? null,
    monthsActive: Number(data?.months_active) || 0,
    hasReachedLimit: Boolean(data?.has_reached_limit),
    canBookSession: data?.can_book_session !== false,
    appointments,
    summary: {
      totalSessions: Number(summary.total_sessions) || 0,
      usedSessions: Number(summary.used_sessions) || 0,
      remainingSessions: Number(summary.remaining_sessions) || 0,
      outstandingSessions: Number(summary.outstanding_sessions) || 0,
      percentageUsed: Number(summary.percentage_used) || 0,
    },
    status: body?.status,
    message: body?.message,
  };
};

/**
 * GET /api/sessions/purchase-info
 * data: { package_name, single_price, bundle_price, bundle_qty, bundle_savings }
 */
export const getSessionPurchaseInfo = async () => {
  const response = await api.get(ENDPOINTS.GET_SESSION_PURCHASE_INFO);
  const body = response.data;
  const data = body?.data && !Array.isArray(body.data) ? body.data : body;
  return {
    packageName: data?.package_name || 'Coaching Session',
    singlePrice: Number(data?.single_price) || 0,
    bundlePrice: Number(data?.bundle_price) || 0,
    bundleQty: Number(data?.bundle_qty) || 10,
    bundleSavings: Number(data?.bundle_savings) || 0,
    status: body?.status,
  };
};

/**
 * POST /api/sessions/setup-intent
 * Response data: { setup_intent_id, client_secret, customer_id }
 */
export const createSessionSetupIntent = async () => {
  const response = await api.post(ENDPOINTS.SESSIONS_SETUP_INTENT);
  const body = response.data;
  const data = body?.data && !Array.isArray(body.data) ? body.data : body;
  return {
    status: body?.status,
    message: body?.message,
    client_secret: data?.client_secret ?? null,
    setup_intent_id: data?.setup_intent_id ?? null,
    customer_id: data?.customer_id ?? null,
  };
};

/**
 * POST /api/sessions/purchase
 * Body: { payment_method: 'pm_...', bundle_type: 'single' | 'bundle' }
 * Success: data.payment_status === 'succeeded'
 * 3DS: { status: false, requires_action: true, data.payment_intent_client_secret }
 */
export const purchaseSessions = async ({ bundle_type, payment_method }) => {
  const response = await api.post(ENDPOINTS.PURCHASE_SESSIONS, {
    bundle_type,
    payment_method,
  });
  return response.data;
};
