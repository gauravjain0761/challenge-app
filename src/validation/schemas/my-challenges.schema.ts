import {z} from 'zod';

// Request query parameters schema
export const UserChallengesListQueryParams = z.object({
  category: z.string().default('all'),
  inProgressOffset: z.number().int().min(0).default(0),
  inProgressLimit: z.number().int().min(1).default(10),
  scheduledOffset: z.number().int().min(0).default(0),
  scheduledLimit: z.number().int().min(1).default(10),
  pastOffset: z.number().int().min(0).default(0),
  pastLimit: z.number().int().min(1).default(10),
});

// Individual challenge schema
export const ChallengeSchema = z.object({
  _id: z.string(),
  challengeId: z.string(),
  userId: z.string(),
  challengeName: z.string(),
  challengeType: z.string(),
  challengeMode: z.string(),
  challengeCategory: z.string(),
  challengeImage: z.string(),
  totalDaysCompleted: z.number(),
  totalDays: z.number(),
  status: z.string(),
  startDate: z.string(),
  targetEndDate: z.string(),
  display_type: z.string(),
});

// Pagination schema
export const PaginationSchema = z.object({
  offset: z.number(),
  limit: z.number(),
  total: z.number(),
  hasMore: z.boolean(),
});

// Response schema
export const UserChallengesListResponse = z.object({
  message: z.string(),
  data: z.object({
    inProgress: z.array(ChallengeSchema),
    scheduled: z.array(ChallengeSchema),
    past: z.array(ChallengeSchema),
    counts: z.object({
      inProgressCount: z.number(),
      scheduledCount: z.number(),
      pastCount: z.number(),
      totalCount: z.number(),
    }),
  }),
  pagination: z.object({
    inProgress: PaginationSchema,
    scheduled: PaginationSchema,
    past: PaginationSchema,
  }),
});

// Export inferred types
export type UserChallengesListParams = z.infer<
  typeof UserChallengesListQueryParams
>;
export type UserChallengesListResponseType = z.infer<
  typeof UserChallengesListResponse
>;
export type ChallengeData = z.infer<typeof ChallengeSchema>;
// export type ApiError = z.infer<typeof ApiErrorSchema>;
