import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import {
  setToken,
  setUser,
  clearToken,
  setIsGuestUser,
  setGuestSession,
  setAutoJoinState,
} from '@/features/authSlice';
import * as authTypes from '@/validation/schemas/auth.schema';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth', 'RegisterDevice', 'CompleteOnboarding'],
  endpoints: builder => ({
    // Login endpoint
    login: builder.mutation<authTypes.LoginResponse, authTypes.LoginRequest>({
      query: credentials => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: HTTP_METHOD.POST,
        data: credentials,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('Login Data', data);
          dispatch(setAutoJoinState(true));
          dispatch(
            setToken({
              access: data.tokens.access,
              refresh: data.tokens.refresh,
            }),
          );
          dispatch(setUser(data.user));
        } catch (error) {}
      },
      invalidatesTags: ['Auth'],
    }),

    // Register endpoint
    register: builder.mutation<
      authTypes.LoginResponse,
      authTypes.RegisterRequest
    >({
      query: userData => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: HTTP_METHOD.POST,
        data: userData,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('Register Data', data);
          dispatch(setAutoJoinState(true));

          dispatch(
            setToken({
              access: data.tokens.access,
              refresh: data.tokens.refresh,
            }),
          );
          dispatch(setUser(data.user));
        } catch (error) {}
      },
      invalidatesTags: ['Auth'],
    }),

    appleLogin: builder.mutation<
      authTypes.LoginResponse,
      authTypes.AppleRequest
    >({
      query: credentials => {
        console.log('credentials', credentials);
        return {
          url: API_ENDPOINTS.AUTH.APPLE,
          method: HTTP_METHOD.POST,
          data: credentials,
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('data', data);

          dispatch(
            setToken({
              access: data.tokens.access,
              refresh: data.tokens.refresh,
            }),
          );
          dispatch(setUser(data.user));
        } catch (error) {
          console.log('error', error);
        }
      },
    }),

    googleLogin: builder.mutation<
      authTypes.LoginResponse,
      authTypes.GoogleRequest
    >({
      query: credentials => ({
        url: API_ENDPOINTS.AUTH.GOOGLE,
        method: HTTP_METHOD.POST,
        data: credentials,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('data', data);

          dispatch(
            setToken({
              access: data.tokens.access,
              refresh: data.tokens.refresh,
            }),
          );
          dispatch(setUser(data.user));
        } catch (error) {
          console.log('error', error);
        }
      },
    }),

    // Logout endpoint
    logout: builder.mutation<authTypes.GenericResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
        method: HTTP_METHOD.POST,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearToken());
          dispatch({type: 'RESET_STORE'});
        }
      },
      invalidatesTags: ['Auth'],
    }),

    refreshToken: builder.mutation<
      authTypes.RefreshTokenResponse,
      {refreshToken: string}
    >({
      query: data => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: HTTP_METHOD.POST,
        data,
        skipLoader: true,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('Refresh Data', data);

          if (!data?.access?.token || !data?.refresh?.token) {
            console.error('Invalid token response format:', data);
            throw new Error('Invalid token response format');
          }

          dispatch(
            setToken({
              access: data?.access,
              refresh: data?.refresh,
            }),
          );
        } catch (error: any) {
          console.error('Refresh token mutation failed:', error);
        }
      },
    }),

    // Forgot password
    forgotPassword: builder.mutation<
      authTypes.ForgotPasswordResponse,
      authTypes.ForgotPasswordRequest
    >({
      query: data => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: HTTP_METHOD.POST,
        data,
      }),
    }),

    // Verify OTP
    verifyOtp: builder.mutation<
      authTypes.VerifyOtpResponse,
      authTypes.VerifyOtpRequest
    >({
      query: data => ({
        url: API_ENDPOINTS.AUTH.VERIFY_OTP,
        method: HTTP_METHOD.POST,
        data,
      }),
    }),

    // Resend OTP
    resendOtp: builder.mutation<
      authTypes.GenericResponse,
      authTypes.ResendOtpRequest
    >({
      query: data => ({
        url: API_ENDPOINTS.AUTH.RESEND_OTP,
        method: HTTP_METHOD.POST,
        data,
      }),
    }),

    // Reset password
    resetPassword: builder.mutation<
      authTypes.GenericResponse,
      authTypes.ResetPasswordRequest
    >({
      query: ({query, body}) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: HTTP_METHOD.POST,
        params: query,
        data: body,
      }),
      invalidatesTags: ['Auth'],
    }),

    // For Notification
    registerDevice: builder.mutation<
      authTypes.RegisterDeviceResponse,
      authTypes.RegisterDeviceRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.NOTIFICATION.REGISTER_DEVICE,
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: ['RegisterDevice'],
    }),

    //  For Onboarding
    completeOnboarding: builder.mutation<
      authTypes.CompleteOnboardingResponse,
      any
    >({
      query: () => ({
        url: API_ENDPOINTS.AUTH.COMPLETE_ONBOARDING,
        method: HTTP_METHOD.POST,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('Onboarding Data', data);
          dispatch(setUser(data.user));
        } catch (error) {}
      },
      invalidatesTags: ['CompleteOnboarding'],
    }),

    // Guest Session
    guestSession: builder.mutation<authTypes.GuestSessionResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.GUEST_SESSION,
        method: HTTP_METHOD.POST,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;
          console.log('Guest Session Data', data);

          dispatch(
            setToken({
              access: data.access,
              refresh: data.refresh,
            }),
          );
          dispatch(setIsGuestUser(true));
          dispatch(
            setGuestSession({
              sessionId: data.sessionId,
              userType: data.userType,
            }),
          );
        } catch (error) {
          console.log('Guest session error', error);
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Sync RevenueCat Customer ID
    syncRcCustomerId: builder.mutation<
      authTypes.SyncRcCustomerIdResponse,
      authTypes.SyncRcCustomerIdRequest
    >({
      query: data => ({
        url: API_ENDPOINTS.AUTH.SYNC_RC_CUSTOMER_ID,
        method: HTTP_METHOD.POST,
        data,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Close Account
    closeAccount: builder.mutation<
      authTypes.CloseAccountResponse,
      authTypes.CloseAccountRequest
    >({
      query: data => ({
        url: API_ENDPOINTS.AUTH.CLOSE_ACCOUNT,
        method: HTTP_METHOD.POST,
        data,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearToken());
          dispatch({type: 'RESET_STORE'});
        }
      },
      invalidatesTags: ['Auth'],
    }),

    // Featurebase Embed Token
    featurebaseEmbedToken: builder.mutation<
      authTypes.FeaturebaseEmbedTokenResponse,
      any
    >({
      query: () => ({
        url: API_ENDPOINTS.AUTH.FEATUREBASE_EMBED_TOKEN,
        method: HTTP_METHOD.GET,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useAppleLoginMutation,
  useGoogleLoginMutation,
  useRegisterDeviceMutation,
  useCompleteOnboardingMutation,
  useGuestSessionMutation,
  useSyncRcCustomerIdMutation,
  useCloseAccountMutation,
  useFeaturebaseEmbedTokenMutation,
} = authApi;
