import { ENDPOINTS } from './endpoints';
import api, { storage } from './api';
import { objectToFormData } from '../utils';
import { AUTH_APIS_DISABLED, DEV_STUB_TOKEN, KEYS } from '../constants';

const stubUser = (email = 'dev@claymaster.local') => ({
  email,
  name: 'Dev User',
  email_verified_at: new Date().toISOString(),
  subscription_status: 'active',
});

export const login = async (body, setIsLoading) => {
  setIsLoading(true);
  if (AUTH_APIS_DISABLED) {
    return {
      status: true,
      token: DEV_STUB_TOKEN,
      message: 'Auth API disabled (dev)',
      user: stubUser(body?.email),
    };
  }
  const deviceToken = storage.getString(KEYS.FCM_TOKEN);
  if (deviceToken) {
    body.device_token = deviceToken;
  }
  // const response = await api.post(ENDPOINTS.LOGIN, body);
  // return response.data;
};

export const register = async body => {
  if (AUTH_APIS_DISABLED) {
    return {
      status: true,
      token: DEV_STUB_TOKEN,
      message: 'Auth API disabled (dev)',
      user: stubUser(body?.email),
    };
  }
  // const response = await api.post(ENDPOINTS.REGISTER, body);
  // console.log('🚀 ~ register ~ response:', response);
  // return response.data;
};

export const verifyOtp = async body => {
  if (AUTH_APIS_DISABLED) {
    return { status: true, message: 'Auth API disabled (dev)' };
  }
  console.log('🚀 ~ verifyOtp ~ body:', body);
  // const response = await api.post(ENDPOINTS.VERIFY_OTP, body);
  // return response.data;
};

export const resendOtp = async email => {
  if (AUTH_APIS_DISABLED) {
    return { status: true, message: 'Auth API disabled (dev)' };
  }
  // const response = await api.post(ENDPOINTS.RESEND_OTP, { email });
  // return response.data;
};

export const forgotPassword = async body => {
  if (AUTH_APIS_DISABLED) {
    return { status: true, message: 'Auth API disabled (dev)' };
  }
  // const response = await api.post(ENDPOINTS.FORGOT_PASSWORD, body);
  // return response.data;
};

export const resendPasswordOtp = async body => {
  if (AUTH_APIS_DISABLED) {
    return { status: true, message: 'Auth API disabled (dev)' };
  }
  // const response = await api.post(ENDPOINTS.RESEND_PASSWORD_OTP, body);
  // return response.data;
};

export const resetPassword = async body => {
  if (AUTH_APIS_DISABLED) {
    return { status: true, message: 'Auth API disabled (dev)' };
  }
  // const response = await api.post(ENDPOINTS.RESET_PASSWORD, body);
  // return response.data;
};

export const logout = async () => {
  if (AUTH_APIS_DISABLED) {
    return { status: true, message: 'Auth API disabled (dev)' };
  }
  // const response = await api.get(ENDPOINTS.LOGOUT);
  // return response.data;
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
