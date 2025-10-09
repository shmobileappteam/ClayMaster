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
