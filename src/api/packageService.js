import { ENDPOINTS } from './endpoints';
import api from './api';

/** GET /api/packages — raw array */
export const getPackages = async () => {
  const response = await api.get(ENDPOINTS.GET_PACKAGES);
  const data = response.data;
  return Array.isArray(data) ? data : data?.data ?? [];
};

/** GET /api/discounts — { status, data } */
export const getDiscountForPackages = async () => {
  const response = await api.get(ENDPOINTS.GET_DISCOUNT_FOR_PACKAGES);
  return response.data;
};

/** POST /api/stripe/setup-intent — { client_secret } */
export const fetchPaymentIntent = async () => {
  const response = await api.post(ENDPOINTS.SETUP_INTENT);
  console.log('response', response.data);
  return response.data;
};

/**
 * POST /api/stripe/subscribe
 * Body: { payment_method, package_id }
 * Returns: { success, subscription_status, package_id, package_expires_at, ... }
 */
export const handlePaymentSuccess = async body => {
  const response = await api.post(ENDPOINTS.PAYMENT, {
    payment_method: body.payment_method,
    package_id: body.package_id,
  });
  return response.data;
};
