import { ENDPOINTS } from './endpoints';
import api, { storage } from './api';
import { objectToFormData } from '../utils';
import { KEYS } from '../constants';

export const login = async body => {
  // const deviceToken = await AsyncStorage.getItem(KEYS.FCM_TOKEN);
  const deviceToken = storage.getString(KEYS.FCM_TOKEN);

  if (deviceToken) {
    body.device_token = deviceToken;
  }
  const response = await api.post(ENDPOINTS.LOGIN, body);
  return response.data;
};

export const register = async body => {
  const response = await api.post(ENDPOINTS.REGISTER, body);
  console.log('🚀 ~ register ~ response:', response);
  return response.data;
};

export const verifyOtp = async body => {
  console.log('🚀 ~ verifyOtp ~ body:', body);
  const response = await api.post(ENDPOINTS.VERIFY_OTP, body);
  return response.data;
};

export const resendOtp = async email => {
  const response = await api.post(ENDPOINTS.RESEND_OTP, { email });
  return response.data;
};

export const forgotPassword = async body => {
  const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, body);
  return response.data;
};

export const resendPasswordOtp = async body => {
  const response = await api.post(ENDPOINTS.RESEND_PASSWORD_OTP, body);
  return response.data;
};

export const resetPassword = async body => {
  const response = await api.post(ENDPOINTS.RESET_PASSWORD, body);
  return response.data;
};

export const logout = async () => {
  const response = await api.get(ENDPOINTS.LOGOUT);
  return response.data;
};

//New
export const editProfile = async body => {
  const formData = objectToFormData(body);
  const response = await api.post(ENDPOINTS.EDIT_PROFILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteAccount = async () => {
  const response = await api.get(ENDPOINTS.DELETE_USER);
  return response.data;
};

export const changePassword = async body => {
  const response = await api.post(ENDPOINTS.UPDATE_PASSWORD, body);
  return response.data;
};
