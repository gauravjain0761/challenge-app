import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as scheduledChallengeTypes from '@/validation/schemas/scheduled-challenge.schema';

export const scheduleChallengeApi = createApi({
  reducerPath: 'scheduleChallengeApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'ScheduledInfo',
    'ScheduledLevels',
    'ScheduledActions',
    'ScheduledActionDays',
  ],
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: builder => ({
    getScheduleInfo: builder.query<
      scheduledChallengeTypes.ScheduledChallengeInfoResponse,
      scheduledChallengeTypes.GetScheduledChallengeInfoRequest
    >({
      query: ({params: {id}}) => {
        return {
          url: API_ENDPOINTS.SCHEDULED_CHALLENGES.INFO(id),
          method: HTTP_METHOD.GET,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        };
      },
      providesTags: (result, error, {params: {id}}) => [
        {type: 'ScheduledInfo', id: id},
      ],
    }),

    getScheduleLevels: builder.query<
      scheduledChallengeTypes.ScheduledChallengeLevelsResponse,
      scheduledChallengeTypes.GetScheduledChallengeLevelsRequest
    >({
      query: ({params: {id}}) => ({
        url: API_ENDPOINTS.SCHEDULED_CHALLENGES.LEVELS(id),
        method: HTTP_METHOD.GET,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: (result, error, {params: {id}}) => [
        {type: 'ScheduledLevels', id: id},
      ],
    }),

    getScheduleActions: builder.query<
      scheduledChallengeTypes.ScheduledChallengeActionsResponse,
      scheduledChallengeTypes.GetScheduledChallengeActionsRequest
    >({
      query: ({params: {id, day}}) => ({
        url: API_ENDPOINTS.SCHEDULED_CHALLENGES.ACTIONS(id, day),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {params: {id, day}}) => [
        {type: 'ScheduledActions', id: id, day: day},
      ],
    }),

    getScheduleActionDays: builder.query<
      scheduledChallengeTypes.ScheduledChallengeActionDaysResponse,
      scheduledChallengeTypes.GetScheduledChallengeActionDaysRequest
    >({
      query: ({params: {id}}) => ({
        url: API_ENDPOINTS.SCHEDULED_CHALLENGES.ACTION_DAYS(id),
        method: HTTP_METHOD.GET,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: (result, error, {params: {id}}) => [
        {type: 'ScheduledActionDays', id: id},
      ],
    }),
  }),
});

export const {
  useGetScheduleInfoQuery,
  useGetScheduleLevelsQuery,
  useGetScheduleActionsQuery,
  useGetScheduleActionDaysQuery,
} = scheduleChallengeApi;
