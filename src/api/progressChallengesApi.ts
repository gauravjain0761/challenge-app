import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as progressChallengeTypes from '@/validation/schemas/progress-challenges.schema';

export const progressChallengesApi = createApi({
  reducerPath: 'progressChallengesApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'ProgressInfo',
    'ProgressLevels',
    'ProgressActions',
    'ProgressActionDays',
    'ProgressActionDetails',
    'ChallengeProgress',
    'TodayChallenge',
    'ProgressMetrics',
    'ProgressMaxOut',
    'LeaderBoard',
    'FriendLeaderBoard',
    'GetReminders',
    'UpdateReminders',
    'ProgressLeaderBoard',
    'WHY',
    'rating',
    'dailyPopup',
    'ProgressActionsMatrix',
    'ProgressChallengesMatrix',
  ],
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: builder => ({
    getProgressInfo: builder.query<
      progressChallengeTypes.InProgressChallengeInfoResponse,
      progressChallengeTypes.GetInProgressChallengeInfoParams
    >({
      query: ({id}) => {
        return {
          url: API_ENDPOINTS.PROGRESS_CHALLENGES.INFO(id),
          method: HTTP_METHOD.GET,
        };
      },
      providesTags: (result, error, {id}) => [{type: 'ProgressInfo', id: id}],
    }),

    getProgressLevels: builder.query<
      progressChallengeTypes.InProgressChallengeLevelsResponse,
      progressChallengeTypes.GetInProgressChallengeLevelsParams
    >({
      query: ({id}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.LEVELS(id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {id}) => [{type: 'ProgressLevels', id: id}],
    }),

    getProgressActions: builder.query<
      progressChallengeTypes.InProgressDayActionsResponse,
      progressChallengeTypes.GetInProgressDayActionsParams
    >({
      query: ({id, day}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.ACTIONS(id, day),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {id, day}) => [
        {type: 'ProgressActions', id: id, day: day},
      ],
    }),

    getProgressActionDays: builder.query<
      progressChallengeTypes.InProgressActionDaysResponse,
      progressChallengeTypes.GetInProgressActionDaysParams
    >({
      query: ({id}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.ACTION_DAYS(id),
        method: HTTP_METHOD.GET,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: (result, error, {id}) => [
        {type: 'ProgressActionDays', id: id},
      ],
    }),

    updateProgressAction: builder.mutation<
      progressChallengeTypes.UpdateInProgressActionResponse,
      progressChallengeTypes.UpdateActionArg
    >({
      query: ({id, day, data}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.UPDATE_ACTION(id, day),
        method: HTTP_METHOD.PUT,
        data,
      }),
      invalidatesTags: (result, error, {id, day}) => [
        {type: 'ProgressActions', id: `${id}-${day}`},
        {type: 'ProgressInfo', id: id},
        {type: 'ChallengeProgress', id: id},
        {type: 'TodayChallenge'},
        {type: 'ProgressMaxOut'},
        {type: 'ProgressMetrics'},
      ],
    }),

    getProgressActionDetails: builder.query<
      progressChallengeTypes.GetInProgressActionDetailResponse,
      progressChallengeTypes.GetInProgressActionDetailParams
    >({
      query: ({id}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.ACTION_DETAIL(id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {id}) => [
        {type: 'ProgressActionDetails', id: id},
      ],
    }),

    getProgress: builder.query<
      progressChallengeTypes.GetChallengeProgressResponse,
      progressChallengeTypes.GetChallengeProgressParams
    >({
      query: ({id}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.PROGRESS(id),
        method: HTTP_METHOD.GET,
      }),
      providesTags: (result, error, {id}) => [
        {type: 'ChallengeProgress', id: id},
      ],
    }),

    getTodayChallenge: builder.query<
      progressChallengeTypes.GetTodayChallengesResponse,
      progressChallengeTypes.GetTodayChallengesParams
    >({
      query: query => ({
        url: API_ENDPOINTS.TODAY.TODAY_CHALLENGES,
        method: HTTP_METHOD.GET,
        params: query,
      }),
      providesTags: ['TodayChallenge'],
    }),

    getProgressMetrics: builder.query<
      progressChallengeTypes.GetProgressMetricsResponse,
      void
    >({
      query: () => ({
        url: API_ENDPOINTS.PROGRESS.METRICS,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['ProgressMetrics'],
    }),

    getProgressMaxOut: builder.query<
      progressChallengeTypes.GetProgressMexOutResponse,
      progressChallengeTypes.GetProgressMexOutParams
    >({
      query: query => ({
        url: API_ENDPOINTS.PROGRESS.MAX_OUT,
        method: HTTP_METHOD.GET,
        params: query,
      }),
      providesTags: ['ProgressMaxOut'],
    }),

    getProgressLeaderBoard: builder.query<
      progressChallengeTypes.UserLeaderboardResponse,
      any
    >({
      query: () => ({
        url: API_ENDPOINTS.PROGRESS.USERS_LEADER_BOARD,
        method: HTTP_METHOD.GET,
      }),
      providesTags: ['ProgressLeaderBoard'],
    }),

    getLeaderBoard: builder.query<
      progressChallengeTypes.LeaderboardResponse,
      progressChallengeTypes.LeaderboardParams
    >({
      query: ({id, query}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.LEADER_BOARD(id),
        method: HTTP_METHOD.GET,
        params: query,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: ['LeaderBoard'],
    }),

    getFriendLeaderBoard: builder.query<
      progressChallengeTypes.LeaderboardResponse,
      progressChallengeTypes.LeaderboardParams
    >({
      query: ({id, query}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.FRIEND_LEADER_BOARD(id),
        method: HTTP_METHOD.GET,
        params: query,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: ['FriendLeaderBoard'],
    }),

    skipAllAction: builder.mutation<
      progressChallengeTypes.SkipAllActionsResponse,
      progressChallengeTypes.SkipAllActionsParams
    >({
      query: ({id, day}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.SKIP_ALL_ACTION(id, day),
        method: HTTP_METHOD.POST,
      }),
      invalidatesTags: (result, error, {id, day}) => [
        {type: 'ProgressActions', id: `${id}-${day}`},
      ],
    }),

    getReminders: builder.query<
      progressChallengeTypes.GetReminderResponse,
      progressChallengeTypes.GetReminderParams
    >({
      query: ({id}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.REMINDERS(id),
        method: HTTP_METHOD.GET,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),
      providesTags: ['GetReminders'],
    }),

    updateReminders: builder.mutation<
      progressChallengeTypes.UpdateReminderResponse,
      progressChallengeTypes.UpdateReminderParams
    >({
      query: ({id, data}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.REMINDERS(id),
        method: HTTP_METHOD.PUT,
        data: data,
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'UpdateReminders', id: id},
        {type: 'GetReminders', id: id},
      ],
    }),

    removeReminder: builder.mutation<
      progressChallengeTypes.RemoveReminderResponse,
      progressChallengeTypes.RemoveReminderParams
    >({
      query: ({id, reminderTime}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.DELETE_REMINDERS(
          id,
          reminderTime,
        ),
        method: HTTP_METHOD.DELETE,
      }),
    }),

    addWhy: builder.mutation<
      progressChallengeTypes.AddWhyResponse,
      progressChallengeTypes.AddWhyRequest
    >({
      query: ({id, data}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.WHY(id),
        method: HTTP_METHOD.PUT,
        data: data,
      }),
      invalidatesTags: (result, error, {id}) => [
        {type: 'WHY', id: id},
        {type: 'ProgressActionDays', id: id},
        {type: 'ProgressActionDetails', id: id},
      ],
    }),

    dailyPopup: builder.mutation<
      progressChallengeTypes.DailyPopupResponse,
      progressChallengeTypes.DailyPopupRequest
    >({
      query: ({id, day}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.DAILY_POPUP(id, day),
        method: HTTP_METHOD.POST,
      }),
      invalidatesTags: ['dailyPopup'],
    }),

    rating: builder.mutation<
      progressChallengeTypes.RatingResponse,
      progressChallengeTypes.RatingRequest
    >({
      query: ({id, data}) => ({
        url: API_ENDPOINTS.PROGRESS_CHALLENGES.RATING(id),
        method: HTTP_METHOD.PUT,
        data: data,
      }),
      invalidatesTags: ['rating'],
    }),

    getProgressMatrixActions: builder.query<
      progressChallengeTypes.ProgressMatrixActionResponse,
      progressChallengeTypes.ProgressMatrixActionRequest
    >({
      query: query => ({
        url: API_ENDPOINTS.PROGRESS.ACTIONS,
        method: HTTP_METHOD.GET,
        params: query,
      }),
      providesTags: ['ProgressActionsMatrix'],
    }),

    getProgressMatrixChallenges: builder.query<
      progressChallengeTypes.ProgressMatrixChallengesResponse,
      progressChallengeTypes.ProgressMatrixChallengesRequest
    >({
      query: query => ({
        url: API_ENDPOINTS.PROGRESS.CHALLENGES,
        method: HTTP_METHOD.GET,
        params: query,
      }),
      providesTags: ['ProgressChallengesMatrix'],
    }),
  }),
});

export const {
  useGetProgressActionDaysQuery,
  useGetProgressActionsQuery,
  useGetProgressInfoQuery,
  useGetProgressLevelsQuery,
  useGetProgressActionDetailsQuery,
  useUpdateProgressActionMutation,
  useGetProgressQuery,
  useLazyGetProgressQuery,
  useGetTodayChallengeQuery,
  useGetProgressMetricsQuery,
  useGetProgressMaxOutQuery,
  useGetLeaderBoardQuery,
  useGetFriendLeaderBoardQuery,
  useLazyGetLeaderBoardQuery,
  useLazyGetFriendLeaderBoardQuery,
  useSkipAllActionMutation,
  useGetRemindersQuery,
  useUpdateRemindersMutation,
  useRemoveReminderMutation,
  useGetProgressLeaderBoardQuery,
  useDailyPopupMutation,
  useAddWhyMutation,
  useRatingMutation,
  useGetProgressMatrixActionsQuery,
  useGetProgressMatrixChallengesQuery,
  useLazyGetProgressMatrixActionsQuery,
  useLazyGetProgressMatrixChallengesQuery,
} = progressChallengesApi;
