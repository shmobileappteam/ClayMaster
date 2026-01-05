// ✅ Base URLs
export const BASE_URL = __DEV__
  ? 'https://php82.demo-customlinks.com/claymaster-dev/'
  : 'https://claymaster.net/portal/';
  
export const API_DOMAIN = `${BASE_URL}api/`;

export const ENDPOINTS = {
  // --- Auth ---
  LOGIN: 'login',
  REGISTER: 'register',
  RESEND_OTP: 'resend/otp',
  VERIFY_OTP: 'verify/otp',
  RESEND_PASSWORD_OTP: 'resend/forgot/password/otp',
  FORGOT_PASSWORD: 'forgot/password',
  RESET_PASSWORD: 'verify/otp/password',
  LOGOUT: 'logout',

  EDIT_PROFILE: 'edit-profile',
  DELETE_USER: 'delete/user',
  UPDATE_PASSWORD: 'user/update-password',

  // --- Rounds ---
  GET_COURSES: 'courses',
  GET_CLASSES: 'classes',
  CREATE_ROUND: 'rounds',
  GET_ROUNDS: 'rounds',
  GET_ROUND: round_id => `rounds/${round_id}`,
  SEND_TO_CLAYMASTER: round_id => `rounds/${round_id}/send-to-claymaster`,

  // --- Stations ---
  GET_TRAPS: 'trap-presentations',
  POST_STATION: round_id => `rounds/${round_id}/stations`,

  // --- Packages and Payment ---
  GET_PACKAGES: 'packages',
  GET_DISCOUNT_FOR_PACKAGES: 'discounts',
  SETUP_INTENT: 'stripe/setup-intent',
  PAYMENT: 'stripe/subscribe',
};
