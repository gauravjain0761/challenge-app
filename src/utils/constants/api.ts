export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    // Public authentication routes
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    RESET_PASSWORD: '/auth/reset-password',
    APPLE: '/auth/oauth/apple',
    GOOGLE: '/auth/oauth/google',
    GUEST_SESSION: '/auth/guest-session',
    // Private authentication routes
    LOGOUT: '/auth/logout',
    COMPLETE_ONBOARDING: '/auth/complete-onboarding',
    SYNC_RC_CUSTOMER_ID: '/auth/sync-rc-customer-id',
    CLOSE_ACCOUNT: '/auth/close-account',
    FEATUREBASE_EMBED_TOKEN: '/auth/featurebase-embed-token',
  },
  EXPLORE: {
    BASE: '/explore',
    CHALLENGES: '/explore/challenges',
    CHALLENGE_TYPES: '/explore/challenge-types',
    ALL_CHALLENGES: '/explore/see-all-challenges',
    INFO: (id: string) => `/explore/${id}/info`,
    LEVELS: (id: string) => `/explore/${id}/levels`,
    ACTIONS_WWH: (id: string) => `/explore/${id}/actions/wwh`, // Action ID
    ACTION_DAYS: (id: string) => `/explore/${id}/action-days`,
    ACTIONS: (id: string, day: string) => `/explore/${id}/actions/${day}`,
  },
  CHALLENGE_PARTICIPATION: {
    UPDATE: (id: string) => `/challenge/update/${id}`,
    JOIN: (id: string) => `/challenge/join/${id}`,
    LEAVE: (id: string) => `/challenge/leave/${id}`,
  },
  MY_CHALLENGES: {
    USER_CHALLENGES: 'user-challenges',
  },
  SCHEDULED_CHALLENGES: {
    INFO: (id: string) => `/scheduled-challenges/${id}/info`,
    LEVELS: (id: string) => `/scheduled-challenges/${id}/levels`,
    ACTION_DAYS: (id: string) => `/scheduled-challenges/${id}/action-days`,
    ACTIONS: (id: string, day: string) =>
      `/scheduled-challenges/${id}/actions/${day}`,
  },
  PAST_CHALLENGES: {
    INFO: (id: string) => `/past-challenges/${id}/info`,
    LEVELS: (id: string) => `/past-challenges/${id}/levels`,
    ACTION_DAYS: (id: string) => `/past-challenges/${id}/action-days`,
    ACTIONS: (id: string, day: string) =>
      `/past-challenges/${id}/actions/${day}`,
    ACTION_DETAIL: (id: string) => `/past-challenges/action/${id}`,
    PROGRESS: (id: string) => `/past-challenges/${id}/progress`,
  },
  PROGRESS_CHALLENGES: {
    UPDATE_ACTION: (id: string, day: string) =>
      `/in-progress-challenges/${id}/action/${day}`,
    INFO: (id: string) => `/in-progress-challenges/${id}/info`,
    LEVELS: (id: string) => `/in-progress-challenges/${id}/levels`,
    ACTION_DAYS: (id: string) => `/in-progress-challenges/${id}/action-days`,
    ACTIONS: (id: string, day: string) =>
      `/in-progress-challenges/${id}/actions/${day}`,
    ACTION_DETAIL: (id: string) => `/in-progress-challenges/action/${id}`,
    PROGRESS: (id: string) => `/in-progress-challenges/${id}/progress`,
    LEADER_BOARD: (id: string) => `/leaderboard/${id}/all/`,
    FRIEND_LEADER_BOARD: (id: string) => `/leaderboard/${id}/friends/`,
    SKIP_ALL_ACTION: (id: string, day: string) =>
      `/in-progress-challenges/${id}/skip-all-actions/${day}`,
    REMINDERS: (id: string) => `/in-progress-challenges/${id}/reminders/`,
    DELETE_REMINDERS: (id: string, reminderTime: string) =>
      `/in-progress-challenges/${id}/reminders/${reminderTime}`,
    WHY: (id: string) => `/in-progress-challenges/${id}/why`, //add why in the body // put
    DAILY_POPUP: (id: string, day: string) =>
      `/in-progress-challenges/${id}/day-popup/${day}`, // post
    RATING: (id: string) => `/in-progress-challenges/${id}/rating`, // ratingType = pre or post // put
  },
  TODAY: {
    TODAY_CHALLENGES: '/user-challenges/daily/',
  },
  PROGRESS: {
    METRICS: '/progress/metrics',
    MAX_OUT: '/progress/maxout',
    USERS_LEADER_BOARD: '/users-leaderboard',
    ACTIONS: '/progress/actions',
    CHALLENGES: '/progress/challenges',
  },
  INVITE_FRIEND: {
    INVITE: (id: string) => `/challenge-invite-friends/${id}/invite`,
    JOIN_INVITE: (id: string) => `/challenge-invite-friends/invite/${id}/join`,
    PARTICIPANTS: (id: string) =>
      `/challenge-invite-friends/${id}/participants`,
  },
  NOTIFICATION: {
    REGISTER_DEVICE: '/notifications/register-device/',
    NOTIFICATION_PERMISSION: '/notifications/notification-permission/',
    SETTINGS: '/notifications/settings/',
  },
  FRIEND: {
    SEND_REQUEST: `/friend-request/send`,
    ACCEPT_REQUESTS: (id: string) => `/friend-request/${id}/accept`,
    DECLINE_REQUESTS: (id: string) => `/friend-request/${id}/decline`,
    PENDING_REQUESTS: `/friend-request/pending`,
    SEND_NUDGE: `nudges/send`,
  },

  PROFILE: {
    PROFILE: 'user/me',
  },
  UPLOAD: {
    GENERATE_UPLOAD_URL: 'upload/generate-upload-url',
  },

  PAYMENT: {
    PAYMENT_INTENT: '/purchase-intent',
  },
} as const;

export const API_ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

// API request timeout settings
export const API_TIMEOUT = {
  DEFAULT: 30000, // 30 seconds
  UPLOAD: 120000, // 2 minutes for uploads
  LONG_OPERATION: 60000, // 1 minute for long operations
} as const;

export const API_CACHE = {
  NO_CACHE: 'no-cache',
  SHORT: 60, // 1 minute in seconds
  MEDIUM: 300, // 5 minutes in seconds
  LONG: 3600, // 1 hour in seconds
  VERY_LONG: 86400, // 1 day in seconds
} as const;

// Rate limiting settings
export const API_RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 60,
  RETRY_AFTER: 1000, // 1 second in milliseconds
  MAX_RETRIES: 3,
} as const;

export const ITEMS_PER_PAGE = 10;

export const EXPO_GOOGLE_CLIENT_ID =
  '12257720636-edlqspa9q5h0l7ulp5i99ls1pd1iu31d.apps.googleusercontent.com';
export const EXPO_IOS_CLIENT_ID =
  '12257720636-43k9g7i7uevt0blo9d24pb17rs1p6cao.apps.googleusercontent.com';
export const EXPO_ANDROID_CLIENT_ID =
  '12257720636-ffk7j9tf62vbcuji7m8ab99f8i26h5oq.apps.googleusercontent.com';

export const ONESIGNAL_APP_ID = 'f6267f98-91fb-4006-bdaf-1e81ea5f8dd8';

export const TERMS_URL = 'https://www.mentoolschallenges.co/terms-of-service';
export const PRIVACY_URL = 'https://www.mentoolschallenges.co/privacy-policy';

export type HttpMethod = keyof typeof HTTP_METHOD;
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
export type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE];
