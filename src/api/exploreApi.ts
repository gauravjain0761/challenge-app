import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as exploreTypes from '@/validation/schemas/explore.schema';

export const exploreApi = createApi({
  reducerPath: 'exploreApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'ExploreChallenges',
    'SeeAllChallenges',
    'ExploreChallengeTypes',
    'ExploreChallengeInfo',
    'ExploreChallengeLevels',
    'ExploreChallengeActionDays',
    'ExploreChallengeActions',
    'JoinChallenge',
    'ExploreChallengeWWHActions',
  ],
  keepUnusedDataFor: 300, // 5 minutes
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: builder => ({
    // Get Explore challenges
    getChallenges: builder.query<
      exploreTypes.GetExploreChallengesResponse,
      exploreTypes.GetExploreChallengesRequest
    >({
      query: query => ({
        url: API_ENDPOINTS.EXPLORE.CHALLENGES,
        method: HTTP_METHOD.GET,
        params: query,
        skipLoader: true,
      }),
      providesTags: ['ExploreChallenges'],
    }),

    // Get Challenges Type
    getChallengeTypes: builder.query<
      exploreTypes.GetChallengeTypesResponse,
      exploreTypes.GetChallengeTypesRequest
    >({
      query: query => ({
        url: API_ENDPOINTS.EXPLORE.CHALLENGE_TYPES,
        method: HTTP_METHOD.GET,
        params: query,
        skipLoader: true,
      }),
      providesTags: ['ExploreChallengeTypes'],
    }),

    // Get All Challenges
    getAllChallenges: builder.query<
      exploreTypes.GetSeeAllChallengesResponse,
      exploreTypes.GetSeeAllChallengesRequest
    >({
      query: query => ({
        url: API_ENDPOINTS.EXPLORE.ALL_CHALLENGES,
        method: HTTP_METHOD.GET,
        params: query,
        skipLoader: true,
      }),
      providesTags: ['SeeAllChallenges'],
    }),

    // Get Challenge Info
    getChallengeInfo: builder.query<
      exploreTypes.GetChallengeInfoResponse,
      exploreTypes.GetChallengeInfoRequest
    >({
      query: ({challengeId}) => ({
        url: API_ENDPOINTS.EXPLORE.INFO(challengeId),
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: (result, error, {challengeId}) => [
        {type: 'ExploreChallengeInfo', id: challengeId},
      ],
    }),

    // Get Challenge Level
    getChallengeLevel: builder.query<
      exploreTypes.GetChallengeLevelsResponse,
      exploreTypes.GetChallengeLevelsRequest
    >({
      query: ({challengeId}) => ({
        url: API_ENDPOINTS.EXPLORE.LEVELS(challengeId),
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: (result, error, {challengeId}) => [
        {type: 'ExploreChallengeLevels', id: challengeId},
      ],
    }),

    // Get Challenge Action Days
    getChallengeActionDays: builder.query<
      exploreTypes.GetChallengeActionDaysResponse,
      exploreTypes.GetChallengeActionDaysRequest
    >({
      query: ({challengeId}) => ({
        url: API_ENDPOINTS.EXPLORE.ACTION_DAYS(challengeId),
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: (result, error, {challengeId}) => [
        {type: 'ExploreChallengeActionDays', id: challengeId},
      ],
    }),

    // Get Challenge Actions
    getChallengeActions: builder.query<
      exploreTypes.GetChallengeActionsResponse,
      exploreTypes.GetChallengeActionsRequest
    >({
      query: ({challengeId, day}) => ({
        url: API_ENDPOINTS.EXPLORE.ACTIONS(challengeId, day),
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: (result, error, {challengeId}) => [
        {type: 'ExploreChallengeActions', id: challengeId},
      ],
    }),

    getWWHAction: builder.query<
      exploreTypes.GetChallengeActionDaysResponse,
      exploreTypes.GetChallengeWWHActionRequest
    >({
      query: ({actionId}) => ({
        url: API_ENDPOINTS.EXPLORE.ACTIONS_WWH(actionId),
        method: HTTP_METHOD.GET,
        skipLoader: true,
      }),
      providesTags: (result, error, {actionId}) => [
        {type: 'ExploreChallengeWWHActions', id: actionId},
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetChallengesQuery,
  useGetChallengeTypesQuery,
  useGetAllChallengesQuery,
  useGetChallengeInfoQuery,
  useGetChallengeLevelQuery,
  useGetChallengeActionDaysQuery,
  useGetChallengeActionsQuery,
  useGetWWHActionQuery,
  useLazyGetWWHActionQuery,
} = exploreApi;
