import {AppDispatch} from '@/store';
import {clearToken, setToken} from '@/features/authSlice';
import {API_ENDPOINTS, HTTP_METHOD, HTTP_STATUS} from '@/utils/constants/api';
import {axiosInstance} from '@/services/api/client';

class TokenRefreshManager {
  private isRefreshing = false;
  private refreshPromise: Promise<any> | null = null;
  private dispatch: AppDispatch | null = null;

  setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  async refreshToken(refreshToken: string) {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = new Promise(async (resolve, reject) => {
      try {
        console.log('Starting global token refresh');

        const response = await axiosInstance.post(
          API_ENDPOINTS.AUTH.REFRESH_TOKEN,
          {refreshToken},
          {skipLoader: true},
        );

        const responseData = response?.data;

        if (!responseData.access?.token || !responseData.refresh?.token) {
          console.error(
            'Unexpected response format:',
            JSON.stringify(responseData),
          );
          throw new Error('Invalid token response format');
        }

        const tokenData = {
          access: responseData.access,
          refresh: responseData.refresh,
        };

        if (this.dispatch) {
          this.dispatch(setToken(tokenData));
        }

        resolve(tokenData);
      } catch (error: any) {
        console.error('Global token refresh failed:', error);

        // Only clear tokens if it's actually a refresh token error
        // 403 GUEST_ACCESS_DENIED should not clear tokens - it's content restriction, not auth failure
        const errorData = error?.response?.data;
        const isGuestAccessDenied = error?.response?.status === HTTP_STATUS.FORBIDDEN &&
          ((errorData as any)?.message === 'GUEST_ACCESS_DENIED' || (errorData as any)?.error === 'GUEST_ACCESS_DENIED');

        if (
          (error?.response?.status === HTTP_STATUS.UNAUTHORIZED ||
           error?.response?.status === HTTP_STATUS.FORBIDDEN) &&
          !isGuestAccessDenied
        ) {
          console.log('🚨 Refresh token is invalid - clearing tokens');
          if (this.dispatch) {
            this.dispatch(clearToken());
          }
        } else if (isGuestAccessDenied) {
          console.log('🔓 Guest access denied during refresh - keeping tokens');
        } else {
          console.log('🌐 Non-auth error during refresh - not clearing tokens');
        }

        reject(error);
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    });

    return this.refreshPromise;
  }
}

export const tokenRefreshManager = new TokenRefreshManager();
export default tokenRefreshManager;
