import api from './api';
import { ENDPOINTS } from './endpoints';

export const getSubscriptionEnabled = async () => {
  const response = await api.get(ENDPOINTS.SUBSCRIPTION_ENABLED);
  return response.data;
};
