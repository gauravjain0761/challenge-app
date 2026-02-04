import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as friend from '@/validation/schemas/friend.schema';
import * as notificationType from '@/validation/schemas/notification.schema';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['NotificationPermission', 'UpdateSetting', 'GetSetting'],
  endpoints: builder => ({
    notificationPermission: builder.mutation<
      notificationType.NotificationPermissionResponse,
      notificationType.NotificationPermissionRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.NOTIFICATION.NOTIFICATION_PERMISSION,
        method: HTTP_METHOD.POST,
        data: body,
      }),
      invalidatesTags: ['NotificationPermission'],
    }),

    updateSetting: builder.mutation<
      notificationType.UpdateNotificationResponse,
      notificationType.UpdateNotificationRequest
    >({
      query: body => ({
        url: API_ENDPOINTS.NOTIFICATION.SETTINGS,
        method: HTTP_METHOD.PUT,
        data: body,
      }),
      invalidatesTags: ['UpdateSetting'],
    }),

    getSetting: builder.query<
      notificationType.GetNotificationSettingResponse,
      any
    >({
      query: () => {
        return {
          url: API_ENDPOINTS.NOTIFICATION.SETTINGS,
          method: HTTP_METHOD.GET,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        };
      },
      providesTags: ['GetSetting'],
    }),
  }),
});

export const {
  useLazyGetSettingQuery,
  useGetSettingQuery,
  useUpdateSettingMutation,
  useNotificationPermissionMutation,
} = notificationApi;
