import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from '@/store';
import * as authTypes from '@/validation/schemas/auth.schema';
import * as profile from '@/validation/schemas/profile.schema';
import {set} from 'lodash';

// Auth state interface
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresMs: number | null;
  refreshTokenExpiresMs: number | null;
  user: authTypes.User | null;
  isLoading: boolean;
  error: string | null;
  lastTokenRefresh: number | null;

  isShowUndo: boolean;
  isShowCancel: boolean;
  isShowComplete: boolean;

  isExploreInfoParams: any;
  profileData: profile.GetProfileResponse;
  isCompletionInfoData: null;
  isGuestUser: boolean;
  sessionId: string | null;
  userType: 'guest' | 'authenticated' | null;
  offerings: any;

  autoJoinState: boolean;

  personalizedCategories?: any;

  freePlan: boolean;
}

// Initial state
const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresMs: null,
  refreshTokenExpiresMs: null,
  user: {} as authTypes.User,
  isLoading: false,
  error: null,
  lastTokenRefresh: null,

  isShowUndo: false,
  isShowCancel: false,
  isShowComplete: false,

  isExploreInfoParams: null,
  profileData: {} as profile.GetProfileResponse,
  isCompletionInfoData: null,
  isGuestUser: false,
  sessionId: null,
  userType: null,
  offerings: null,

  autoJoinState: false,
  personalizedCategories: null,
  freePlan: false,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set tokens
    setToken: (
      state,
      action: PayloadAction<{
        access: authTypes.TokenInfo;
        refresh: authTypes.TokenInfo;
      }>,
    ) => {
      state.accessToken = action.payload.access.token;
      state.refreshToken = action.payload.refresh.token;
      state.accessTokenExpiresMs = new Date(
        action.payload.access.expires,
      ).getTime();
      state.refreshTokenExpiresMs = new Date(
        action.payload.refresh.expires,
      ).getTime();
      state.lastTokenRefresh = Date.now();
      state.error = null;
    },

    // Set tokens from TokenInfo objects
    setTokenFromInfo: (
      state,
      action: PayloadAction<{
        access: authTypes.TokenInfo;
        refresh: authTypes.TokenInfo;
      }>,
    ) => {
      state.accessToken = action.payload.access.token;
      state.refreshToken = action.payload.refresh.token;
      state.accessTokenExpiresMs = new Date(
        action.payload.access.expires,
      ).getTime();
      state.refreshTokenExpiresMs = new Date(
        action.payload.refresh.expires,
      ).getTime();
      state.lastTokenRefresh = Date.now();
      state.error = null;
    },

    setUser: (state, action: PayloadAction<authTypes.User>) => {
      state.user = action.payload;
    },

    updateUser: (state, action: PayloadAction<Partial<authTypes.User>>) => {
      if (state.user) {
        state.user = {...state.user, ...action.payload};
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setIsShowUndo: (state, action: PayloadAction<boolean>) => {
      state.isShowUndo = action.payload;
    },
    setIsShowCancel: (state, action: PayloadAction<boolean>) => {
      state.isShowCancel = action.payload;
    },
    setIsShowComplete: (state, action: PayloadAction<boolean>) => {
      state.isShowComplete = action.payload;
    },
    setIsExploreInfoParams: (state, action: PayloadAction<any>) => {
      state.isExploreInfoParams = action.payload;
    },
    setIsCompletionInfoData: (state, action: PayloadAction<any>) => {
      state.isCompletionInfoData = action.payload;
    },

    setProfileData: (
      state,
      action: PayloadAction<profile.GetProfileResponse>,
    ) => {
      state.profileData = action.payload;
    },

    setIsGuestUser: (state, action: PayloadAction<boolean>) => {
      state.isGuestUser = action.payload;
    },

    setGuestSession: (
      state,
      action: PayloadAction<{
        sessionId: string;
        userType: 'guest' | 'authenticated';
      }>,
    ) => {
      state.sessionId = action.payload.sessionId;
      state.userType = action.payload.userType;
    },

    setSubOfferings: (state, action: PayloadAction<any>) => {
      state.offerings = action.payload;
    },
    setFreePlan: (state, action: PayloadAction<any>) => {
      state.freePlan = action.payload;
    },
    clearError: state => {
      state.error = null;
    },

    clearToken: () => ({...initialState}),

    setAutoJoinState: (state, action: PayloadAction<boolean>) => {
      state.autoJoinState = action.payload;
    },
    setPersonalizedCategories: (state, action: PayloadAction<boolean>) => {
      state.personalizedCategories = action.payload;
    },

    // clearToken: state => {
    //   console.log('clearing token', new Error().stack);
    //   state.accessToken = null;
    //   state.refreshToken = null;
    //   state.accessTokenExpiresMs = null;
    //   state.refreshTokenExpiresMs = null;
    //   state.user = null;
    //   state.error = null;
    //   state.lastTokenRefresh = null;
    //   state.isShowCancel = false;
    //   state.isShowUndo = false;
    //   state.isShowComplete = false;
    // },
  },
});

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  // Only persist these fields
  whitelist: [
    'accessToken',
    'refreshToken',
    'accessTokenExpiresMs',
    'refreshTokenExpiresMs',
    'user',
    'lastTokenRefresh',
    'isShowCancel',
    'isShowUndo',
    'isShowComplete',
    'isExploreInfoParams',
    'isGuestUser',
    'sessionId',
    'userType',
    'offerings',
    'autoJoinState',
    'freePlan',
  ],
};

// Create the persisted reducer
export const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authSlice.reducer,
);

export const {
  setToken,
  setTokenFromInfo,
  setUser,
  updateUser,
  setLoading,
  setError,
  clearError,
  clearToken,
  setIsShowUndo,
  setIsShowCancel,
  setIsShowComplete,
  setIsExploreInfoParams,
  setProfileData,
  setIsCompletionInfoData,
  setIsGuestUser,
  setGuestSession,
  setSubOfferings,
  setAutoJoinState,
  setPersonalizedCategories,
  setFreePlan,
} = authSlice.actions;

// Selectors
export const selectToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectTokenExpires = (state: RootState) =>
  state.auth.accessTokenExpiresMs;
export const selectRefreshTokenExpires = (state: RootState) =>
  state.auth.refreshTokenExpiresMs;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectLastTokenRefresh = (state: RootState) =>
  state.auth.lastTokenRefresh;
export const selectProfileData = (state: RootState) => state.auth.profileData;
export const selectIsGuestUser = (state: RootState) => state.auth.isGuestUser;
export const selectSessionId = (state: RootState) => state.auth.sessionId;
export const selectUserType = (state: RootState) => state.auth.userType;
export const selectAutoJoinState = (state: RootState) =>
  state.auth.autoJoinState;

// Helper selector to check if token is expired

export const selectIsTokenExpired = (state: RootState) => {
  const expires = state.auth.accessTokenExpiresMs;

  if (!expires) return false;

  // Calculate time remaining in seconds for logging purposes
  //const timeRemainingSeconds = Math.floor((expires - Date.now()) / 1000);

  // console.log('Token expiration check:', {
  //   expiresTimestamp: new Date(expires).toISOString(),
  //   currentTime: new Date().toISOString(),
  //   timeRemainingSeconds,
  //   isExpired: Date.now() >= expires - 10_000,
  // });

  // Add buffer of 10 seconds (10,000 ms)
  return Date.now() >= expires - 10_000;
};

export const selectIsRefreshTokenExpired = (state: RootState) => {
  const expires = state.auth.refreshTokenExpiresMs;
  if (!expires) return true;
  return Date.now() >= expires;
};

export default persistedAuthReducer;
