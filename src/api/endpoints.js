// ✅ Base URLs
export const BASE_URL = __DEV__
  ? 'https://claymaster.net/beta/'
  : 'https://claymaster.net/beta/';

export const API_DOMAIN = `${BASE_URL}api/`;

/** Country State City API root */
export const CSC_DOMAIN = 'https://api.countrystatecity.in/v1/';

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
  GET_PROFILE: 'profile',
  EDIT_PROFILE: 'edit-profile',
  DELETE_USER: 'delete/user',
  UPDATE_PASSWORD: 'user/update-password',

  // --- Packages and Payment (subscription) ---
  GET_PACKAGES: 'packages',
  GET_DISCOUNT_FOR_PACKAGES: 'discounts',
  SETUP_INTENT: 'stripe/setup-intent',
  PAYMENT: 'stripe/subscribe',

  // --- Rounds ---
  GET_COURSES: 'courses',
  GET_CLASSES: 'classes',
  CREATE_ROUND: 'rounds',
  GET_ROUNDS: 'rounds',
  GET_ROUND: round_id => `rounds/${round_id}`,
  SEND_TO_CLAYMASTER: round_id => `rounds/${round_id}/send-to-claymaster`,

  // --- Stations ---
  GET_TRAPS: 'trap-presentations',
  GET_STATIONS: round_id => `rounds/${round_id}/stations`,
  POST_STATION: round_id => `rounds/${round_id}/stations`,

  // --- Notifications ---
  GET_NOTIFICATIONS: 'notifications',
  GET_NOTIFICATION_COUNTS: 'notifications/counts',
  MARK_NOTIFICATION_READ: id => `notifications/${id}/read`,
  MARK_ALL_NOTIFICATIONS_READ: 'notifications/read-all',
  DELETE_NOTIFICATION: id => `notifications/${id}`,

  // --- Reviews ---
  GET_REVIEWS: 'reviews',
  POST_REVIEW: 'reviews',

  // --- Tournament ---
  SUBMIT_TOURNAMENT: 'tournament/submit',
  GET_TOURNAMENT_LEADERBOARD: 'tournament/leaderboard',

  // --- Forum / Community ---
  GET_FORUM_CATEGORIES: 'forum-categories',
  GET_FORUMS: 'forums',
  GET_FORUM: slug => `forums/${slug}`,
  CREATE_FORUM: 'forums',
  UPDATE_FORUM: id => `forums/${id}/update`,
  DELETE_FORUM: id => `forums/${id}`,
  POST_FORUM_REPLY: slug => `forums/${slug}/replies`,
  TOGGLE_REPLY_HELPFUL: id => `forum-replies/${id}/helpful`,
  DELETE_FORUM_REPLY: id => `forum-replies/${id}`,
  MARK_BEST_ANSWER: id => `forum-replies/${id}/best-answer`,
  REPORT_FORUM: id => `forums/${id}/report`,
  REPORT_FORUM_REPLY: id => `forum-replies/${id}/report`,
  VOTE_FORUM_POLL: id => `forums/${id}/poll/vote`,
  GET_FORUM_POLL: id => `forums/${id}/poll`,

  // --- Academy / Library ---
  GET_TUTORIAL_VIDEOS: 'tutorial-videos/',
  GET_TUTORIAL_VIDEO: id => `tutorial-videos/${id}`,
  GET_WORKBOOKS: 'workbooks',
  GET_WORKBOOK: id => `workbooks/${id}`,
  GET_INSTRUCTIONAL_VIDEOS: 'instructional-videos',
  GET_INSTRUCTIONAL_VIDEO: id => `instructional-videos/${id}`,
  GET_ADDITIONAL_VIDEOS: 'additional-videos',
  GET_ADDITIONAL_VIDEO: id => `additional-videos/${id}`,
  GET_ADDITIONAL_VIDEO_CATEGORIES: 'additional-videos/categories',
  GET_PRACTICE_DRILLS: 'practice-drills',
  GET_PRACTICE_DRILL: id => `practice-drills/${id}`,
  GET_MONTHLY_WEBCASTS: 'monthly-webcasts',
  GET_MONTHLY_WEBCAST: id => `monthly-webcasts/${id}`,
  GET_MANUAL_DELIVERIES: 'manual-deliveries',
  GET_MANUAL_DELIVERY: id => `manual-deliveries/${id}`,

  // --- Online Coaching / Sessions ---
  GET_COACHES: 'coaches',
  GET_SESSIONS: 'sessions',
  GET_SESSION_PURCHASE_INFO: 'sessions/purchase-info',
  SESSIONS_SETUP_INTENT: 'sessions/setup-intent',
  PURCHASE_SESSIONS: 'sessions/purchase',

  // --- Shop / Cart / Orders ---
  GET_SHOP_PRODUCTS: 'shop/products',
  GET_SHOP_PRODUCT: id => `shop/products/${id}`,
  ADD_TO_CART: 'cart/add',
  GET_CART: 'cart',
  UPDATE_CART: 'cart/update',
  REMOVE_CART_ITEM: variantId => `cart/${variantId}`,
  CHECKOUT_SETUP_INTENT: 'checkout/setup-intent',
  PLACE_ORDER: 'checkout/place-order',
  GET_ORDERS: 'orders',
  GET_ORDER: id => `orders/${id}`,

  // --- Config ---
  SUBSCRIPTION_ENABLED: 'subscription-enabled',

  // --- Country State City ---
  CSC_COUNTRIES: 'countries',
  CSC_STATES: countryIso => `countries/${countryIso}/states`,
  CSC_CITIES: (countryIso, stateIso) =>
    `countries/${countryIso}/states/${stateIso}/cities`,
};
