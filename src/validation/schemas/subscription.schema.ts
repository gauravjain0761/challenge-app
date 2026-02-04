// Accept or Decline Friend Request

import z from 'zod';

export const PaymentIntentRequestSchema = z.object({
  challengeId: z.string(),
  revenueCatCustomerId: z.string(),
  previousCustomerId: z.string().optional(),
});

export type PaymentIntentRequest = z.infer<typeof PaymentIntentRequestSchema>;
