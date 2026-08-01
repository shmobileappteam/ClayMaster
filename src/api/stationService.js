import { ENDPOINTS } from './endpoints';
import api from './api';

export const getTraps = async () => {
  const response = await api.get(ENDPOINTS.GET_TRAPS);
  return response.data;
};

/** GET /api/rounds/{round_id}/stations — raw array */
export const getStations = async roundId => {
  const response = await api.get(ENDPOINTS.GET_STATIONS(roundId));
  const body = response.data;
  return Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
};

export const postStations = async ({ roundId, payload }) => {
  const response = await api.post(ENDPOINTS.POST_STATION(roundId), payload);
  return response.data;
};

export const sendToClayMaster = async roundId => {
  const response = await api.post(ENDPOINTS.SEND_TO_CLAYMASTER(roundId));
  return response.data;
};
