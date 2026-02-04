import {z} from 'zod';
import {
  ChallengeAccessType,
  ChallengeMode,
  ChallengeType,
  ExploreChallengeUserType,
} from '@/types/enums';

export const FileSchema = z.object({
  fileUrl: z.string(),
  fileName: z.string(),
  fileSize: z.string(),
  fileType: z.string(),
});

export const ChallengeListItemSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  type: z.string(),
  mode: z.nativeEnum(ChallengeMode),
  display_type: z.nativeEnum(ChallengeType),
  basicRules: z
    .object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      daysToFail: z.number().optional(),
      skipAllowance: z.number().optional(),
    })
    .optional(),
  totalDaysCompleted: z.number().optional(),
  totalDays: z.number().optional(),
  hasAccess: z.boolean().optional(),
  accessType: z.nativeEnum(ChallengeAccessType).optional(),
  accessTypeByUser: z.nativeEnum(ChallengeAccessType).optional(),
  shortName: z.string().optional(),
});

// Request schemas
export const GetExploreChallengesSchema = z.object({
  category: z.string().optional().default('all'),
  limit: z.number().optional().default(3),
});

export const GetChallengeTypesSchema = z.object({
  mode: z.nativeEnum(ChallengeMode),
  category: z.string().optional().default('all'),
});

export const GetSeeAllChallengesSchema = z.object({
  mode: z.nativeEnum(ChallengeMode),
  category: z.string().optional().default('all'),
  type: z
    .nativeEnum(ExploreChallengeUserType)
    .optional()
    .default(ExploreChallengeUserType.ALL),
  page: z.number().optional().default(1),
  limit: z.number().optional().default(20),
});

export const GetChallengeInfoSchema = z.object({
  challengeId: z.string(),
});

export const GetChallengeLevelsSchema = z.object({
  challengeId: z.string(),
});

export const GetChallengeActionDaysSchema = z.object({
  challengeId: z.string(),
});

export const GetChallengeActionsSchema = z.object({
  challengeId: z.string(),
  day: z.string(),
});

// Response schemas
export const ChallengeTypeOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const WhySectionSchema = z.object({
  details: z.string(),
  files: z.array(FileSchema),
});

export const WhatSectionSchema = z.object({
  items: z.array(
    z.object({
      details: z.string(),
      title: z.string().optional(),
      files: z.array(FileSchema),
    }),
  ),
});
export const HowSectionSchema = z.object({
  steps: z.array(
    z.object({
      title: z.string().optional(),
      files: z.array(FileSchema),
    }),
  ),
  disclaimer: z.string(),
});

export const ChallengeInfoSchema = ChallengeListItemSchema.extend({
  ChallengeListItemSchema,
  what: WhySectionSchema,
  why: WhatSectionSchema,
  how: HowSectionSchema,
});

export const ChallengeActionDaySchema = z.object({
  available: z.boolean(),
  order: z.number(),
  date: z.string(),
  actionCount: z.number(),
});

export const ChallengeLevelSchema = z.object({
  name: z.string(),
  goal: z.object({
    value: z.union([z.number(), z.string()]),
    unit: z.string(),
    frequency: z.string(),
  }),
});

export const ChallengeActionSchema = z.object({
  compulsory: z.boolean(),
  overrides: z.any(),
  action: z.object({
    _id: z.string(),
    name: z.string(),
    image: z.string(),
    type: z.string(),
    basicRules: z.object({
      goal: z.object({
        value: z.union([z.number(), z.string()]),
        unit: z.string(),
        frequency: z.string(),
      }),
      timeOfDay: z.string(),
    }),
  }),
});

// Response type schemas
export const GetExploreChallengesResponseSchema = z
  .object({
    challenges: z.record(
      z.nativeEnum(ChallengeMode),
      z.array(ChallengeListItemSchema),
    ),
  })
  .partial();

export const GetChallengeTypesResponseSchema = z.array(
  ChallengeTypeOptionSchema,
);

export const GetSeeAllChallengesResponseSchema = z.object({
  challenges: z.array(ChallengeListItemSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
});

export const GetChallengeInfoResponseSchema = ChallengeInfoSchema;

export const GetChallengeLevelsResponseSchema = z.array(ChallengeLevelSchema);

export const GetChallengeActionDaysResponseSchema = z.object({
  availableDays: z.record(z.string(), ChallengeActionDaySchema),
  type: z.string().nullable(),
  totalDays: z.number(),
});

export const GetChallengeActionsResponseSchema = z.object({
  _id: z.string(),
  type: z.string(),
  actionDay: z.object({
    type: z.string().nullable(),
    day: z.string(),
    date: z.string(),
    actions: z.array(ChallengeActionSchema),
    levels: z.array(ChallengeLevelSchema),
  }),
});

export const GetChallengeWWHAction = z.object({
  actionId: z.string(),
});

// Export types using z.infer

export type GetChallengeWWHActionRequest = z.infer<
  typeof GetChallengeWWHAction
>;

export type ChallengeListItem = z.infer<typeof ChallengeListItemSchema>;

export type GetExploreChallengesRequest = z.infer<
  typeof GetExploreChallengesSchema
>;
export type GetExploreChallengesResponse = z.infer<
  typeof GetExploreChallengesResponseSchema
>;

export type GetChallengeTypesRequest = z.infer<typeof GetChallengeTypesSchema>;
export type GetChallengeTypesResponse = z.infer<
  typeof GetChallengeTypesResponseSchema
>;

export type GetSeeAllChallengesRequest = z.infer<
  typeof GetSeeAllChallengesSchema
>;
export type GetSeeAllChallengesResponse = z.infer<
  typeof GetSeeAllChallengesResponseSchema
>;

export type GetChallengeInfoRequest = z.infer<typeof GetChallengeInfoSchema>;
export type GetChallengeInfoResponse = z.infer<
  typeof GetChallengeInfoResponseSchema
>;

export type GetChallengeLevelsRequest = z.infer<
  typeof GetChallengeLevelsSchema
>;
export type GetChallengeLevelsResponse = z.infer<
  typeof GetChallengeLevelsResponseSchema
>;

export type GetChallengeActionDaysRequest = z.infer<
  typeof GetChallengeActionDaysSchema
>;
export type GetChallengeActionDaysResponse = z.infer<
  typeof GetChallengeActionDaysResponseSchema
>;

export type GetChallengeActionsRequest = z.infer<
  typeof GetChallengeActionsSchema
>;
export type GetChallengeActionsResponse = z.infer<
  typeof GetChallengeActionsResponseSchema
>;
