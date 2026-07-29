import { ENDPOINTS } from './endpoints';
import api, { storage } from './api';
import { objectToFormData } from '../utils';
import { KEYS } from '../constants';

const withDeviceToken = body => {
  const payload = { ...body };
  const deviceToken = storage.getString(KEYS.FCM_TOKEN);
  if (deviceToken) {
    payload.device_token = deviceToken;
  }
  return payload;
};

export const login = async (body, setIsLoading) => {
  setIsLoading?.(true);
  const payload = withDeviceToken({
    email: body?.email,
    password: body?.password,
    ...(body?.device_token ? { device_token: body.device_token } : {}),
  });
  const response = await api.post(ENDPOINTS.LOGIN, payload);
  return response.data;
};

export const register = async body => {
  const payload = {
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
    password_confirmation: body.password_confirmation,
  };
  if (body.discount_type) {
    payload.discount_type = body.discount_type;
  }
  const response = await api.post(ENDPOINTS.REGISTER, payload);
  return response.data;
};

export const verifyOtp = async body => {
  const response = await api.post(ENDPOINTS.VERIFY_OTP, {
    email: body.email,
    otp: body.otp,
  });
  return response.data;
};

export const resendOtp = async email => {
  const response = await api.post(ENDPOINTS.RESEND_OTP, { email });
  return response.data;
};

export const forgotPassword = async body => {
  const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, {
    email: body.email,
  });
  return response.data;
};

export const resendPasswordOtp = async body => {
  const response = await api.post(ENDPOINTS.RESEND_PASSWORD_OTP, {
    email: body.email,
  });
  return response.data;
};

export const resetPassword = async body => {
  const response = await api.post(ENDPOINTS.RESET_PASSWORD, {
    email: body.email,
    otp: body.otp,
    password: body.password,
    password_confirmation: body.password_confirmation,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.get(ENDPOINTS.LOGOUT);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get(ENDPOINTS.GET_PROFILE);
  return response.data;
};

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
