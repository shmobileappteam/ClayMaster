// ---( Live URL )--- //
export const API_DOMAIN = __DEV__
  ? 'https://php82.demo-customlinks.com/claymaster-dev/api'
  : 'https://php82.demo-customlinks.com/claymaster-dev/api';

export const ENDPOINTS = {
  //Auth End Points:
  LOGIN: '/login',
  REGISTER: '/register',
  RESEND_OTP: '/resend/otp',
  VERIFY_OTP: '/verify/otp',
  RESEND_PASSWORD_OTP: '/resend/forgot/password/otp',
  FORGOT_PASSWORD: '/forgot/password',
  RESET_PASSWORD: '/verify/otp/password',
  LOGOUT: '/logout',

  EDIT_PROFILE: '/user-edit-profile',

  //Round End Points:
  GET_COURSES: '/courses',
  GET_CLASSES: '/classes',
};
