import z from 'zod';

export const getProfileResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  isEmailVerified: z.boolean(),
  profilePicture: z.string().url().nullable(),
  dateOfBirth: z.date().min(new Date()).nullable(),
  location: z.string().min(1).nullable(),
  stats: z.object({
    totalStarted: z.number(),
    totalCompleted: z.number(),
    totalFailed: z.number(),
    totalLeft: z.number(),
    avgLevel: z.number(),
  }),
  isSubscribed: z.boolean().optional(),
  isSubscriptionExpired: z.boolean().optional(),
  ownedChallenges: z.array(z.string()).optional(),
  ownedChallengesCount: z.number().optional(),
  revenueCatCustomerId: z.string().optional(),
  subscription: z.object({
    _id: z.string().optional(),
    currency: z.string().optional(),
    environment: z.string().optional(),
    expirationAt: z.string().optional(),
    lastUpdated: z.string().optional(),
    periodType: z.string().optional(),
    price: z.number().optional(),
    productId: z.string().optional(),
    purchasedAt: z.string().optional(),
    store: z.string().optional(),
    transactionId: z.string().optional(),
  }).optional(),
});
export type GetProfileResponse = z.infer<typeof getProfileResponseSchema>;

export const updateProfileRequestSchema = z.object({
  name: z.string().min(1).optional(),
  profilePicture: z.string().url().optional(),
  dateOfBirth: z.date().min(new Date()).optional(),
  location: z.string().min(1).optional(),
});

export type UpdateProfileRequest = z.infer<typeof updateProfileRequestSchema>;

export const updateProfileResponseSchema = z.object({
  message: z.string(),
  user: getProfileResponseSchema,
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
