import { ENDPOINTS } from './endpoints';
import api from './api';

export const getCourses = async () => {
  const response = await api.get(ENDPOINTS.GET_COURSES);
  return response.data;
};

export const getClasses = async () => {
  // nsca classes
  const response = await api.get(ENDPOINTS.GET_CLASSES);
  return response.data;
};

export const postRound = async body => {
  const response = await api.post(ENDPOINTS.CREATE_ROUND, body);
  console.log('🚀 ~ postRound ~ response:', response);
  return response.data;
};

export const getRounds = async () => {
  const response = await api.get(ENDPOINTS.GET_ROUNDS);
  return response.data;
};

export const getRound = async round_id => {
  const response = await api.get(ENDPOINTS.GET_ROUND(round_id));
  return response.data;
};

export const sendToCLayMaster = async round_id => {
  const response = await api.post(ENDPOINTS.SEND_TO_CLAYMASTER(round_id));
  console.log('🚀 ~ sendTolCayyMaster ~ response:', response);
  return response.data;
};
