import type {BaseQueryFn} from '@reduxjs/toolkit/query/react';
import type {AxiosError, AxiosRequestConfig} from 'axios';
import {ApiError, axiosInstance} from './client';
import {
  incrementPendingRequests,
  decrementPendingRequests,
} from '@/features/loaderSlice';
import {clearToken} from '@/features/authSlice';
import {API_ENDPOINTS, HTTP_STATUS} from '@/utils/constants/api';
import {tokenRefreshManager} from './TokenRefreshManager';

export interface BaseQueryArgs {
  url: string;
  method: string;
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  skipLoader?: boolean;
}

export const axiosBaseQuery: BaseQueryFn<
  BaseQueryArgs,
  unknown,
  ApiError
> = async (args, api) => {
  const {dispatch, getState} = api;
  const {url, method, data, params, headers, skipLoader} = args;

  if (!skipLoader) dispatch(incrementPendingRequests());

  const token = (getState() as any).auth.refreshToken
    ? (getState() as any).auth.accessToken
    : null;
  const authHeaders = token ? {Authorization: `Bearer ${token}`} : {};

  try {
    const result = await axiosInstance.request({
      url,
      method,
      data,
      params,
      headers: {
        ...headers,
        ...authHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    } as AxiosRequestConfig);

    return {data: result.data};
  } catch (rawError) {
    const error = rawError as AxiosError;

    if (
      error.response?.status === HTTP_STATUS.UNAUTHORIZED &&
      !url.includes(API_ENDPOINTS.AUTH.LOGIN) &&
      !url.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      try {
        const refreshToken = (getState() as any).auth.refreshToken;

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Use the singleton manager to refresh the token
        await tokenRefreshManager.refreshToken(refreshToken);

        // After token is refreshed, retry the original request
        const newToken = (getState() as any).auth.accessToken;
        if (!newToken) {
          throw new Error('No access token after refresh');
        }

        console.log('Retrying original request with new token');
        const retryResult = await axiosInstance.request({
          url,
          method,
          data,
          params,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        } as AxiosRequestConfig);

        return {data: retryResult.data};
      } catch (refreshError: any) {
        console.log('refreshError', refreshError);
        
        // Only clear tokens if it's a genuine auth error, not a network error
        const isGuestUser = (getState() as any).auth.isGuestUser;
        const errorData = refreshError?.response?.data;
        const isGuestAccessDenied = isGuestUser && 
          refreshError?.response?.status === HTTP_STATUS.FORBIDDEN &&
          ((errorData as any)?.message === 'GUEST_ACCESS_DENIED' || (errorData as any)?.error === 'GUEST_ACCESS_DENIED');

        if (
          (refreshError?.response?.status === HTTP_STATUS.UNAUTHORIZED ||
           refreshError?.response?.status === HTTP_STATUS.FORBIDDEN) &&
          !isGuestAccessDenied
        ) {
          console.log('🚨 Auth error in baseQuery - clearing tokens');
          dispatch(clearToken());
        } else if (isGuestAccessDenied) {
          console.log('🔓 Guest access denied - keeping guest tokens');
        } else {
          console.log('🌐 Network error in baseQuery - keeping tokens');
          console.error('Token refresh or retry failed:', refreshError);
        }
        
        // For guest access denied, return empty data instead of error
        if (isGuestAccessDenied) {
          console.log('🔓 Returning empty data for guest access denied');
          return {data: null};
        }
        
        // For auth errors, return unauthorized status
        if (
          refreshError?.response?.status === HTTP_STATUS.UNAUTHORIZED ||
          refreshError?.response?.status === HTTP_STATUS.FORBIDDEN
        ) {
          return {
            error: {
              status: refreshError?.response?.status,
              data: refreshError?.response?.data || null,
              message: 'Authentication failed. Please log in again.',
            } as ApiError,
          };
        }
        
        // For network errors, return a different status to avoid auth confusion
        return {
          error: {
            status: refreshError?.response?.status || 503, // Service Unavailable for network errors
            data: refreshError?.response?.data || null,
            message: refreshError?.message || 'Network error occurred. Please try again.',
          } as ApiError,
        };
      }
    }

    // Handle 403 GUEST_ACCESS_DENIED for guest users
    if (error.response?.status === HTTP_STATUS.FORBIDDEN) {
      const isGuestUser = (getState() as any).auth.isGuestUser;
      const errorData = error.response?.data;
      
      if (isGuestUser && 
          ((errorData as any)?.message === 'GUEST_ACCESS_DENIED' || (errorData as any)?.error === 'GUEST_ACCESS_DENIED')) {
        console.log('🔓 Guest access denied - returning empty data');
        return {data: null};
      }
    }

    return {
      error: {
        status: error.response?.status || 500,
        data: error.response?.data,
        message: error.message,
      } as ApiError,
    };
  } finally {
    if (!skipLoader) dispatch(decrementPendingRequests());
  }
};
