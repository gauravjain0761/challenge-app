import {useEffect, useState, useCallback, useRef} from 'react';
import {useAppSelector, useAppDispatch} from './reduxHooks';
import {
  selectToken,
  selectUser,
  selectRefreshToken,
  selectTokenExpires,
  selectRefreshTokenExpires,
  selectIsGuestUser,
  selectSessionId,
  selectUserType,
} from '@/features/authSlice';
import {clearToken} from '@/features/authSlice';
import {tokenRefreshManager} from '@/services/api/TokenRefreshManager';
import NetInfo from '@react-native-community/netinfo';
import {HTTP_STATUS} from '@/utils/constants/api';

const useConnectivity = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!state.isConnected;
      const wasDisconnected = !isConnected;

      setIsConnected(connected);

      if (!connected) {
        setNetworkError(true);
      } else if (connected && wasDisconnected) {
        console.log('📶 Connection restored - clearing network error');
        setNetworkError(false);
      }
    });

    return unsubscribe;
  }, [isConnected]);

  const clearNetworkError = useCallback(() => {
    setNetworkError(false);
  }, []);

  return {isConnected, networkError, clearNetworkError};
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const refreshValue = useAppSelector(selectRefreshToken);
  const expiresAt = useAppSelector(selectTokenExpires);
  const refreshTokenExpires = useAppSelector(selectRefreshTokenExpires);
  const isGuestUser = useAppSelector(selectIsGuestUser);
  const sessionId = useAppSelector(selectSessionId);
  const userType = useAppSelector(selectUserType);

  const {isConnected, networkError, clearNetworkError} = useConnectivity();

  const refreshPromiseRef = useRef<Promise<any> | null>(null);
  const accessTokenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const refreshTokenTimerRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  const isNetworkError = useCallback(
    (error: any): boolean => {
      return (
        !error.response ||
        error.code === 'NETWORK_ERROR' ||
        error.code === 'ECONNABORTED' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error') ||
        !isConnected
      );
    },
    [isConnected],
  );

  const attemptTokenRefresh = useCallback(
    async (source = 'manual') => {
      if (!refreshValue) {
        console.log('🔄 No refresh token available');
        return;
      }

      if (refreshPromiseRef.current) {
        console.log(
          '🔄 Refresh already in progress, returning existing promise',
        );
        return refreshPromiseRef.current;
      }

      console.log(`🔄 Starting token refresh from: ${source}`);

      refreshPromiseRef.current = (async () => {
        let currentRetryCount = retryCountRef.current;

        const attemptRefresh = async (
          attemptNumber: number,
        ): Promise<boolean> => {
          if (attemptNumber > 0) {
            const backoffDelay = Math.min(
              1000 * Math.pow(2, attemptNumber - 1),
              30000,
            );
            console.log(
              `🔄 Applying backoff delay: ${backoffDelay}ms (attempt ${attemptNumber})`,
            );
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
          }

          try {
            await tokenRefreshManager.refreshToken(refreshValue);

            retryCountRef.current = 0;
            clearNetworkError();
            console.log('✅ Token refresh successful');
            return true;
          } catch (err: any) {
            console.error(
              `❌ Token refresh failed (attempt ${attemptNumber}):`,
              err,
            );

            // Only clear tokens for real auth errors, not guest access restrictions
            const errorData = err?.response?.data;
            const isGuestAccessDenied = err?.response?.status === HTTP_STATUS.FORBIDDEN &&
              ((errorData as any)?.message === 'GUEST_ACCESS_DENIED' || (errorData as any)?.error === 'GUEST_ACCESS_DENIED');

            if (
              (err?.response?.status === HTTP_STATUS.UNAUTHORIZED ||
               err?.response?.status === HTTP_STATUS.FORBIDDEN) &&
              !isGuestAccessDenied
            ) {
              console.log('🚨 Auth error - clearing tokens');
              retryCountRef.current = 0;
              dispatch(clearToken());
              throw err;
            } else if (isGuestAccessDenied) {
              console.log('🔓 Guest access denied during refresh - keeping tokens');
              throw err; // Still throw the error but don't clear tokens
            }

            if (isNetworkError(err)) {
              console.log(
                `🌐 Network error (attempt ${attemptNumber}/${maxRetries + 1})`,
              );
              if (attemptNumber <= maxRetries) {
                retryCountRef.current = attemptNumber;
                return attemptRefresh(attemptNumber + 1);
              } else {
                console.log('🚨 Max retries exceeded');
                retryCountRef.current = 0;
                throw err;
              }
            }

            console.log(
              '❓ Unknown error during refresh - resetting retry count',
            );
            retryCountRef.current = 0;
            throw err;
          }
        };

        return attemptRefresh(currentRetryCount + 1);
      })();

      try {
        return await refreshPromiseRef.current;
      } finally {
        refreshPromiseRef.current = null;
      }
    },
    [refreshValue, dispatch, isNetworkError, clearNetworkError],
  );

  useEffect(() => {
    if (
      isConnected &&
      refreshValue &&
      expiresAt &&
      Date.now() >= expiresAt - 120000
    ) {
      console.log('🔄 Auto-retry refresh after reconnection');
      attemptTokenRefresh('reconnection');
    }
  }, [isConnected, refreshValue, expiresAt, attemptTokenRefresh]);

  useEffect(() => {
    tokenRefreshManager.setDispatch(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (accessTokenTimerRef.current) {
      clearTimeout(accessTokenTimerRef.current);
      accessTokenTimerRef.current = null;
    }
    if (refreshTokenTimerRef.current) {
      clearTimeout(refreshTokenTimerRef.current);
      refreshTokenTimerRef.current = null;
    }

    if (!token || !expiresAt || !refreshValue || !refreshTokenExpires) {
      console.log('No auth data - user not logged in');
      return;
    }

    const now = Date.now();
    const accessBuffer = 120_000;

    console.log('⏰ Token timing setup:', {
      now: new Date(now).toLocaleString(),
      accessExpires: new Date(expiresAt).toLocaleString(),
      refreshExpires: new Date(refreshTokenExpires).toLocaleString(),
    });

    if (now < refreshTokenExpires) {
      const timeUntilRefreshExpiry = refreshTokenExpires - now;
      refreshTokenTimerRef.current = setTimeout(() => {
        console.log('🚨 Refresh token expired - logging out');
        dispatch(clearToken());
      }, timeUntilRefreshExpiry);

      console.log(
        `⏲️ Refresh token expiry timer set for ${Math.round(
          timeUntilRefreshExpiry / 1000,
        )}s`,
      );
    } else {
      console.log('🚨 Refresh token already expired - logging out');
      dispatch(clearToken());
      return;
    }

    if (now >= expiresAt - accessBuffer) {
      console.log('⏰ Access token expiring - attempting refresh');
      if (isConnected) {
        attemptTokenRefresh('expiry-check');
      }
    } else {
      const timeUntilRefresh = expiresAt - now - accessBuffer;
      accessTokenTimerRef.current = setTimeout(() => {
        console.log('⏰ Access token refresh timer triggered');
        if (isConnected) {
          attemptTokenRefresh('timer');
        }
      }, timeUntilRefresh);

      console.log(
        `⏲️ Access token refresh timer set for ${Math.round(
          timeUntilRefresh / 1000,
        )}s`,
      );
    }

    return () => {
      if (accessTokenTimerRef.current) {
        clearTimeout(accessTokenTimerRef.current);
        accessTokenTimerRef.current = null;
      }
      if (refreshTokenTimerRef.current) {
        clearTimeout(refreshTokenTimerRef.current);
        refreshTokenTimerRef.current = null;
      }
    };
  }, [
    token,
    expiresAt,
    refreshValue,
    refreshTokenExpires,
    dispatch,
    isConnected,
    attemptTokenRefresh,
  ]);

  const isLoggedIn = Boolean(
    token &&
      user &&
      refreshValue &&
      refreshTokenExpires &&
      Date.now() < refreshTokenExpires &&
      !isGuestUser // Only authenticated users, not guests
  );

  // hasValidSession includes both authenticated and guest users
  const hasValidSession = Boolean(
    token &&
      refreshValue &&
      refreshTokenExpires &&
      Date.now() < refreshTokenExpires
  );

  const retryConnection = useCallback(() => {
    console.log('🔄 Manual retry triggered');
    if (isConnected && refreshValue) {
      retryCountRef.current = 0;
      attemptTokenRefresh('manual-retry');
    } else {
      console.log('🔄 Retry conditions not met:', {
        isConnected,
        hasRefreshValue: !!refreshValue,
      });
    }
  }, [isConnected, refreshValue, attemptTokenRefresh]);

  useEffect(() => {
    return () => {
      if (accessTokenTimerRef.current) {
        clearTimeout(accessTokenTimerRef.current);
        accessTokenTimerRef.current = null;
      }
      if (refreshTokenTimerRef.current) {
        clearTimeout(refreshTokenTimerRef.current);
        refreshTokenTimerRef.current = null;
      }
      refreshPromiseRef.current = null;
    };
  }, []);

  return {
    isInitialized: true,
    isLoggedIn, // Only authenticated users
    isGuest: isGuestUser, // Only guest users
    hasValidSession, // Both authenticated and guest users
    isLoading: !!refreshPromiseRef.current,
    user,
    token,
    networkError,
    isConnected,
    retryConnection,
    sessionId,
    userType,
  };
};
