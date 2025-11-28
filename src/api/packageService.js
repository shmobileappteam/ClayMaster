import { ENDPOINTS } from './endpoints';
import api from './api';

export const getPackages = async () => {
  const response = await api.get(ENDPOINTS.GET_PACKAGES);
  return response.data;
};
export const getDiscountForPackages = async () => {
  const response = await api.get(ENDPOINTS.GET_DISCOUNT_FOR_PACKAGES);
  return response.data;
};

export const fetchPaymentIntent = async () => {
  const response = await api.post(ENDPOINTS.SETUP_INTENT);
  return response;
};

export const handlePaymentSuccess = async body => {
  const res = await api.post(ENDPOINTS.PAYMENT, body);
  return res;
};
