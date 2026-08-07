import { ENDPOINTS } from './endpoints';
import api from './api';

/**
 * GET /api/managed-services/purchase-info
 * data: { package_name, price_per_session, currency, min_quantity, max_quantity, remaining_sessions }
 */
export const getManagedServicePurchaseInfo = async () => {
  const response = await api.get(ENDPOINTS.GET_MANAGED_SERVICE_PURCHASE_INFO);
  const body = response.data;
  const data = body?.data && !Array.isArray(body.data) ? body.data : body;

  return {
    packageName: data?.package_name || 'Managed Service Session',
    pricePerSession: Number(data?.price_per_session) || 0,
    currency: data?.currency || 'usd',
    minQuantity: Number(data?.min_quantity) || 1,
    maxQuantity: Number(data?.max_quantity) || 10,
    remainingSessions: Number(data?.remaining_sessions) || 0,
    status: body?.status,
    message: body?.message,
  };
};

/**
 * POST /api/managed-services/payment-intent
 * Body: { quantity }
 */
export const createManagedServicePaymentIntent = async ({ quantity }) => {
  const response = await api.post(ENDPOINTS.MANAGED_SERVICE_PAYMENT_INTENT, {
    quantity,
  });
  return response.data;
};

/**
 * POST /api/managed-services/payment/verify
 * Body: { payment_intent_id }
 */
export const verifyManagedServicePayment = async ({ payment_intent_id }) => {
  const response = await api.post(ENDPOINTS.MANAGED_SERVICE_PAYMENT_VERIFY, {
    payment_intent_id,
  });
  return response.data;
};
