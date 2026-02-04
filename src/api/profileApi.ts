import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as profile from '@/validation/schemas/profile.schema';
import {setProfileData, setUser} from '@/features/authSlice';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Profile'],
  endpoints: builder => ({
    getProfile: builder.query<profile.GetProfileResponse, any>({
      query: () => {
        return {
          url: API_ENDPOINTS.PROFILE.PROFILE,
          method: HTTP_METHOD.GET,
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(setProfileData(data));
        } catch (error) {}
      },
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<
      profile.UpdateProfileResponse,
      profile.UpdateProfileRequest
    >({
      query: data => {
        return {
          url: API_ENDPOINTS.PROFILE.PROFILE,
          method: HTTP_METHOD.PATCH,
          data: data,
        };
      },
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        try {
          const {data} = await queryFulfilled;

          dispatch(setProfileData(data.user));
          
          // Invalidate progress metrics and leaderboard cache
          dispatch({type: 'progressChallengesApi/invalidateTags', payload: ['ProgressMetrics', 'ProgressLeaderBoard']});
        } catch (error) {}
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {useGetProfileQuery, useUpdateProfileMutation} = profileApi;
