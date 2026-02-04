import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as progressChallengeTypes from '@/validation/schemas/progress-challenges.schema';

export const pastChallengeApi = createApi({
  reducerPath: 'pastChallengeApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'PastInfo',
    'PastActions',
    'PastActionDays',
    'PastActionDetails',
    'ChallengePast',
    'TodayChallenge',
  ],
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: builder => ({
    getPastInfo: builder.query<any, any>({
      query: ({id}) => {
        return {
          url: API_ENDPOINTS.PAST_CHALLENGES.INFO(id),
          method: HTTP_METHOD.GET,
        };
      },
      providesTags: (result, error, {id}) => [{type: 'PastInfo', id: id}],
    }),

    getPastActions: builder.query<any, any>({
      query: ({id, day}) => ({
        url: API_ENDPOINTS.PAST_CHALLENGES.ACTIONS(id, day),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {id, day}) => [
        {type: 'PastActions', id: id, day: day},
      ],
    }),

    getPastActionDays: builder.query<any, any>({
      query: ({id}) => ({
        url: API_ENDPOINTS.PAST_CHALLENGES.ACTION_DAYS(id),
        method: HTTP_METHOD.GET,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: (result, error, {id}) => [{type: 'PastActionDays', id: id}],
    }),

    getPastProgress: builder.query<any, any>({
      query: ({id}) => ({
        url: API_ENDPOINTS.PAST_CHALLENGES.PROGRESS(id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {id}) => [{type: 'ChallengePast', id: id}],
    }),
  }),
});

export const {
  useGetPastActionDaysQuery,
  useGetPastActionsQuery,
  useGetPastInfoQuery,
  useGetPastProgressQuery,
} = pastChallengeApi;
