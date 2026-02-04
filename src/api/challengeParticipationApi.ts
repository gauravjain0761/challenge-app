import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as challengeParticipationTypes from '@/validation/schemas/challenge-participation.schema';
import * as myChallengesTypes from '@/validation/schemas/my-challenges.schema';

export const challengeParticipationApi = createApi({
  reducerPath: 'challengeParticipationApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'MyChallenges',
    'JoinChallenge',
    'UpdateChallenge',
    'LeaveChallenge',
  ],
  endpoints: builder => ({
    // Get My Challenges
    getMyChallenges: builder.query<
      myChallengesTypes.UserChallengesListResponseType,
      myChallengesTypes.UserChallengesListParams
    >({
      query: params => ({
        url: API_ENDPOINTS.MY_CHALLENGES.USER_CHALLENGES,
        method: HTTP_METHOD.GET,
        params,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),

      serializeQueryArgs: ({queryArgs}) => queryArgs.category,

      merge: (currentCache, newItems, {arg}) => {
        const {inProgressOffset, scheduledOffset, pastOffset} = arg;
        const {data: incoming, pagination: incomingPagination} = newItems;

        // 1) On very first load, or if ALL offsets are back to zero => full replace
        if (
          !currentCache ||
          (inProgressOffset === 0 && scheduledOffset === 0 && pastOffset === 0)
        ) {
          return newItems;
        }

        // 2) Otherwise, build a fresh merged object
        const merged = {
          ...currentCache,
          data: {...currentCache.data},
          pagination: {...currentCache.pagination},
        };

        // 3) For each section, if offset>0 then append & dedupe:
        if (inProgressOffset > 0) {
          const seen = new Set(merged.data.inProgress.map(c => c._id));
          merged.data.inProgress = [
            ...merged.data.inProgress,
            ...incoming.inProgress.filter(item => !seen.has(item._id)),
          ];
          merged.pagination.inProgress = incomingPagination.inProgress;
        }

        if (scheduledOffset > 0) {
          const seen = new Set(merged.data.scheduled.map(c => c._id));
          merged.data.scheduled = [
            ...merged.data.scheduled,
            ...incoming.scheduled.filter(item => !seen.has(item._id)),
          ];
          merged.pagination.scheduled = incomingPagination.scheduled;
        }

        if (pastOffset > 0) {
          const seen = new Set(merged.data.past.map(c => c._id));
          merged.data.past = [
            ...merged.data.past,
            ...incoming.past.filter(item => !seen.has(item._id)),
          ];
          merged.pagination.past = incomingPagination.past;
        }

        return merged;
      },

      forceRefetch({currentArg, previousArg}) {
        if (previousArg?.category !== currentArg?.category) return true;

        const reset =
          ((previousArg?.inProgressOffset ?? 0) > 0 &&
            currentArg?.inProgressOffset === 0) ||
          ((previousArg?.scheduledOffset ?? 0) > 0 &&
            currentArg?.scheduledOffset === 0) ||
          ((previousArg?.pastOffset ?? 0) > 0 && currentArg?.pastOffset === 0);
        if (reset) return true;

        return false;
      },

      //providesTags: ['MyChallenges'],
      providesTags: result =>
        result
          ? [
              // one tag per challenge id, so individual item updates can work:
              ...result.data.inProgress.map(c => ({
                type: 'MyChallenges' as const,
                id: c._id,
              })),
              ...result.data.scheduled.map(c => ({
                type: 'MyChallenges' as const,
                id: c._id,
              })),
              ...result.data.past.map(c => ({
                type: 'MyChallenges' as const,
                id: c._id,
              })),
              // plus a “LIST” tag to fully refetch the whole array:
              {type: 'MyChallenges' as const, id: 'LIST'},
            ]
          : [{type: 'MyChallenges', id: 'LIST'}],
    }),

    // Join Participation
    joinParticipation: builder.mutation<
      challengeParticipationTypes.JoinChallengeResponse,
      challengeParticipationTypes.JoinChallengeRequest
    >({
      query: ({challengeId, data}) => ({
        url: API_ENDPOINTS.CHALLENGE_PARTICIPATION.JOIN(challengeId),
        method: HTTP_METHOD.POST,
        data: data,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;

          // Invalidate profile and progress data after joining a challenge
          dispatch({type: 'profileApi/invalidateTags', payload: ['Profile']});
          dispatch({type: 'progressChallengesApi/invalidateTags', payload: ['ProgressMetrics', 'ProgressLeaderBoard', 'ProgressChallengesMatrix', 'ProgressActionsMatrix']});
        } catch (error) {}
      },
      //invalidatesTags: ['MyChallenges'],
      invalidatesTags: [{type: 'MyChallenges', id: 'LIST'}],
    }),

    // Update Participation
    updateParticipation: builder.mutation<
      challengeParticipationTypes.UpdateChallengeResponse,
      challengeParticipationTypes.UpdateChallengeRequest
    >({
      query: ({challengeId, data}) => ({
        url: API_ENDPOINTS.CHALLENGE_PARTICIPATION.UPDATE(challengeId),
        method: HTTP_METHOD.PATCH,
        data: data,
      }),
      //invalidatesTags: ['MyChallenges'],
      invalidatesTags: [{type: 'MyChallenges', id: 'LIST'}],
    }),

    // Leave Participation
    leaveParticipation: builder.mutation<
      challengeParticipationTypes.LeaveChallengeResponse,
      challengeParticipationTypes.LeaveChallengeRequest
    >({
      query: ({challengeId}) => ({
        url: API_ENDPOINTS.CHALLENGE_PARTICIPATION.LEAVE(challengeId),
        method: HTTP_METHOD.POST,
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          await queryFulfilled;
          
          // Invalidate profile and progress data after joining a challenge
          dispatch({type: 'profileApi/invalidateTags', payload: ['Profile']});
          dispatch({type: 'progressChallengesApi/invalidateTags', payload: ['ProgressMetrics', 'ProgressLeaderBoard']});
        } catch (error) {}
      },
      //invalidatesTags: ['MyChallenges'],
      invalidatesTags: [{type: 'MyChallenges', id: 'LIST'}],
    }),
  }),
});

export const {
  useJoinParticipationMutation,
  useGetMyChallengesQuery,
  useLeaveParticipationMutation,
  useUpdateParticipationMutation,
} = challengeParticipationApi;
