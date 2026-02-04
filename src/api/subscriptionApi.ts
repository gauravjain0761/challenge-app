import {createApi} from '@reduxjs/toolkit/query/react';
import {axiosBaseQuery} from '@/services/api/baseQuery';
import {API_ENDPOINTS, HTTP_METHOD} from '@/utils/constants/api';
import * as subscription from '@/validation/schemas/subscription.schema';

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['PaymentIntent'],
  endpoints: builder => ({
    paymentIntent: builder.mutation<any, subscription.PaymentIntentRequest>({
      query: data => ({
        url: API_ENDPOINTS.PAYMENT.PAYMENT_INTENT,
        method: HTTP_METHOD.POST,
        data: data,
      }),
      invalidatesTags: ['PaymentIntent'],
    }),
  }),
});

export const {usePaymentIntentMutation} = subscriptionApi;
