import { ENDPOINTS } from './endpoints';
import api from './api';

export const getTraps = async () => {
  const response = await api.get(ENDPOINTS.GET_TRAPS);
  return response.data;
};

export const postStations = async ({ roundId, payload }) => {
  const response = await api.post(ENDPOINTS.POST_STATION(roundId), payload);
  return response.data;
};

export const sendToClayMaster = async roundId => {
  const response = await api.post(ENDPOINTS.SEND_TO_CLAYMASTER(roundId));
  return response.data;
};
