import { ENDPOINTS } from './endpoints';
import api from './api';

const asList = body => {
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
};

const asItem = body => {
  if (body?.data && !Array.isArray(body.data)) return body.data;
  if (body && !Array.isArray(body) && body.id != null) return body;
  return null;
};

/** GET /api/tutorial-videos/ */
export const getTutorialVideos = async () => {
  const response = await api.get(ENDPOINTS.GET_TUTORIAL_VIDEOS);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/tutorial-videos/{id} */
export const getTutorialVideo = async id => {
  const response = await api.get(ENDPOINTS.GET_TUTORIAL_VIDEO(id));
  return asItem(response.data);
};

/** GET /api/workbooks */
export const getWorkbooks = async () => {
  const response = await api.get(ENDPOINTS.GET_WORKBOOKS);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/workbooks/{id} */
export const getWorkbook = async id => {
  const response = await api.get(ENDPOINTS.GET_WORKBOOK(id));
  return asItem(response.data);
};

/** GET /api/instructional-videos */
export const getInstructionalVideos = async () => {
  const response = await api.get(ENDPOINTS.GET_INSTRUCTIONAL_VIDEOS);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/instructional-videos/{id} */
export const getInstructionalVideo = async id => {
  const response = await api.get(ENDPOINTS.GET_INSTRUCTIONAL_VIDEO(id));
  return asItem(response.data);
};

/** GET /api/additional-videos */
export const getAdditionalVideos = async () => {
  const response = await api.get(ENDPOINTS.GET_ADDITIONAL_VIDEOS);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/additional-videos/{id} */
export const getAdditionalVideo = async id => {
  const response = await api.get(ENDPOINTS.GET_ADDITIONAL_VIDEO(id));
  return asItem(response.data);
};

/** GET /api/additional-videos/categories */
export const getAdditionalVideoCategories = async () => {
  const response = await api.get(ENDPOINTS.GET_ADDITIONAL_VIDEO_CATEGORIES);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/practice-drills */
export const getPracticeDrills = async () => {
  const response = await api.get(ENDPOINTS.GET_PRACTICE_DRILLS);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/practice-drills/{id} */
export const getPracticeDrill = async id => {
  const response = await api.get(ENDPOINTS.GET_PRACTICE_DRILL(id));
  return asItem(response.data);
};

/** GET /api/monthly-webcasts */
export const getMonthlyWebcasts = async () => {
  const response = await api.get(ENDPOINTS.GET_MONTHLY_WEBCASTS);
  return { items: asList(response.data), ...response.data };
};

/** GET /api/monthly-webcasts/{id} */
export const getMonthlyWebcast = async id => {
  const response = await api.get(ENDPOINTS.GET_MONTHLY_WEBCAST(id));
  return asItem(response.data);
};

/** GET /api/manual-deliveries — data.documents[] */
export const getManualDeliveries = async () => {
  const response = await api.get(ENDPOINTS.GET_MANUAL_DELIVERIES);
  const body = response.data;
  const documents = Array.isArray(body?.data?.documents)
    ? body.data.documents
    : Array.isArray(body?.documents)
      ? body.documents
      : asList(body);
  return { items: documents, ...body };
};

/** GET /api/manual-deliveries/{id} */
export const getManualDelivery = async id => {
  const response = await api.get(ENDPOINTS.GET_MANUAL_DELIVERY(id));
  return asItem(response.data);
};
