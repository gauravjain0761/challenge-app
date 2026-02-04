import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as friend from '@/validation/schemas/friend.schema';
import * as progressChallengeTypes from '@/validation/schemas/progress-challenges.schema';

export const friendApi = createApi({
  reducerPath: 'friendApi',
  baseQuery: axiosBaseQuery,
  tagTypes: [
    'Invite',
    'JoinInvite',
    'FriendParticipants',
    'FriendRequest',
    'AcceptFriendRequest',
    'DeclineFriendRequest',
    'PendingFriendRequest',
    'SendFriendNudge',
  ],
  endpoints: builder => ({
    inviteFriend: builder.mutation<friend.InviteResponse, friend.InviteRequest>(
      {
        query: ({id}) => ({
          url: API_ENDPOINTS.INVITE_FRIEND.INVITE(id),
          method: HTTP_METHOD.POST,
        }),
        invalidatesTags: (result, error, {id}) => [{type: 'Invite', id: id}],
      },
    ),

    joinInviteFriend: builder.mutation<
      friend.JoinInviteResponseType,
      friend.JoinInviteRequest
    >({
      query: ({token, data}) => ({
        url: API_ENDPOINTS.INVITE_FRIEND.JOIN_INVITE(token),
        method: HTTP_METHOD.POST,
        data,
      }),
      invalidatesTags: (result, error, {token}) => [
        {type: 'JoinInvite', token: token},
      ],
    }),

    // getFriendParticipants: builder.query<
    //   friend.ParticipantsResponse,
    //   progressChallengeTypes.LeaderboardParams
    // >({
    //   query: ({id, query}) => ({
    //     url: API_ENDPOINTS.INVITE_FRIEND.PARTICIPANTS(id),
    //     method: HTTP_METHOD.GET,
    //     params: query,
    //     headers: {
    //       'Cache-Control': 'no-cache, no-store, must-revalidate',
    //     },
    //   }),
    //   providesTags: ['FriendParticipants'],
    // }),

    getFriendParticipants: builder.query<
      friend.ParticipantsResponse,
      progressChallengeTypes.LeaderboardParams
    >({
      query: ({id, query}) => ({
        url: API_ENDPOINTS.INVITE_FRIEND.PARTICIPANTS(id),
        method: HTTP_METHOD.GET,
        params: query,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }),

      // Cache entries by challenge ID
      serializeQueryArgs: ({queryArgs}) => queryArgs.id,

      merge: (currentCache, newItems, {arg}) => {
        if (!currentCache || (arg?.query?.offset ?? 0) === 0) {
          // Directly mutate currentCache if it exists
          currentCache.participants = newItems.participants;
          currentCache.limit = newItems.limit;
          return;
        }

        const existingNames = new Set(
          currentCache.participants.map(p => p.name),
        );

        const uniqueNew = newItems.participants.filter(
          p => !existingNames.has(p.name),
        );

        currentCache.participants.push(...uniqueNew);
        currentCache.limit = newItems.limit;
      },

      forceRefetch({currentArg, previousArg}) {
        return (
          currentArg?.query?.offset === 0 // refetch if reset
        );
      },

      providesTags: result =>
        result?.participants
          ? [
              ...result.participants.map(p => ({
                type: 'FriendParticipants' as const,
                id: p.name,
              })),
              {type: 'FriendParticipants', id: 'LIST'},
            ]
          : [{type: 'FriendParticipants', id: 'LIST'}],
    }),

    friendRequest: builder.mutation<
      friend.FriendRequestResponse,
      friend.FriendRequest
    >({
      query: data => {
        return {
          url: API_ENDPOINTS.FRIEND.SEND_REQUEST,
          method: HTTP_METHOD.POST,
          data: data,
        };
      },

      invalidatesTags: ['FriendRequest'],
    }),

    pendingFriendRequest: builder.query<
      friend.PendingFriendRequestResponse,
      friend.PendingFriendRequest
    >({
      query: query => {
        return {
          url: API_ENDPOINTS.FRIEND.PENDING_REQUESTS,
          method: HTTP_METHOD.GET,
          params: query,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        };
      },
      providesTags: ['PendingFriendRequest'],
    }),

    acceptFriendRequest: builder.mutation<
      friend.AcceptFriendRequestResponse,
      friend.AcceptFriendRequest
    >({
      query: ({id, data}) => {
        return {
          url: API_ENDPOINTS.FRIEND.ACCEPT_REQUESTS(id),
          method: HTTP_METHOD.POST,
          data: data,
        };
      },

      invalidatesTags: (result, error, {id}) => [
        {type: 'AcceptFriendRequest', id: id},
        {type: 'PendingFriendRequest', id: id},
      ],
    }),

    declineFriendRequest: builder.mutation<
      friend.AcceptFriendRequestResponse,
      friend.AcceptFriendRequest
    >({
      query: ({id, data}) => {
        return {
          url: API_ENDPOINTS.FRIEND.DECLINE_REQUESTS(id),
          method: HTTP_METHOD.POST,
          data: data,
        };
      },

      invalidatesTags: (result, error, {id}) => [
        {type: 'DeclineFriendRequest', id: id},
        {type: 'PendingFriendRequest', id: id},
      ],
    }),

    sedFriendNudges: builder.mutation<
      friend.FriendNudgeResponse,
      friend.FriendNudgeRequest
    >({
      query: data => {
        return {
          url: API_ENDPOINTS.FRIEND.SEND_NUDGE,
          method: HTTP_METHOD.POST,
          data: data,
        };
      },

      invalidatesTags: ['SendFriendNudge'],
    }),
  }),
});

export const {
  useInviteFriendMutation,
  useJoinInviteFriendMutation,
  useGetFriendParticipantsQuery,
  useFriendRequestMutation,

  useAcceptFriendRequestMutation,
  useDeclineFriendRequestMutation,
  usePendingFriendRequestQuery,

  useSedFriendNudgesMutation,
} = friendApi;
