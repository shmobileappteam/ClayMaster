import { ENDPOINTS } from './endpoints';
import api from './api';

export const getTraps = async () => {
  const response = await api.get(ENDPOINTS.GET_TRAPS);
  return response.data;
};
