import {ChallengeMode, ROLE} from '@/types/enums';
import {z} from 'zod';
import {
  HowSectionSchema,
  WhatSectionSchema,
  WhySectionSchema,
} from './explore.schema';

// Common schemas
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/);
const dateSchema = z.string().or(z.date());

// ========= Request Schemas ====================

export const GetScheduledChallengeInfoRequestSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const GetScheduledChallengeActionDaysRequestSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const GetScheduledChallengeActionsRequestSchema = z.object({
  params: z.object({
    id: objectIdSchema,
    day: z.string().regex(/^day\d+$/),
  }),
});

export const GetScheduledChallengeLevelsRequestSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

// =============== Response Schemas ====================

const ScheduleItemSchema = z.object({
  _id: objectIdSchema,
  userId: objectIdSchema,
  challengeId: objectIdSchema,
  name: z.string(),
  category: z.string(),
  type: z.string(),
  display_type: z.string(),
  mode: z.nativeEnum(ChallengeMode),
  description: z.string().optional(),
  image: z.string().optional(),
  selectedLevelIndex: z.number(),
  startDate: dateSchema,
  targetEndDate: dateSchema,
  totalDays: z.number(),
  daysToFail: z.number(),
  skipAllowance: z.number(),
  role: z.nativeEnum(ROLE),
});
// For getScheduledChallengeInfo
export const ScheduledChallengeInfoResponseSchema = ScheduleItemSchema.extend({
  what: WhatSectionSchema,
  why: WhySectionSchema,
  how: HowSectionSchema,
});

// For getScheduledChallengeActionDays
const AvailableDaySchema = z.object({
  available: z.boolean(),
  order: z.number(),
  date: dateSchema,
  originalDayRef: z.string(),
  status: z.string(),
});

export const ScheduledChallengeActionDaysResponseSchema = z.object({
  availableDays: z.record(z.string(), AvailableDaySchema),
  type: z.string().nullable(),
  totalDays: z.number(),
  startDate: dateSchema,
  targetEndDate: dateSchema,
});

// For getScheduledChallengeActions
const ActionSchema = z.object({
  _id: objectIdSchema,
  name: z.string(),
  image: z.string().optional(),
  type: z.string(),
  status: z.string(),
  basicRules: z.any().optional(),
});

const DayActionSchema = z.object({
  status: z.string().optional(),
  compulsory: z.boolean(),
  overrides: z.record(z.string(), z.any()).optional(),
  action: ActionSchema,
  selectedCompletionCount: z.number().optional(),
  selectedCompletionUnit: z.string().optional(),
  selectedLevelIndex: z.number().optional(),
  completedLevelIndex: z.number().optional(),
  completionCount: z.number().optional(),
});

const ActionDaySchema = z.object({
  type: z.string().nullable(),
  day: z.string(),
  originalDayRef: z.string(),
  date: dateSchema,
  actions: z.array(DayActionSchema),
  levels: z.array(z.any()),
  selectedLevelIndex: z.number(),
});

export const ScheduledChallengeActionsResponseSchema = z.object({
  _id: objectIdSchema,
  userId: objectIdSchema,
  challengeId: objectIdSchema,
  type: z.string(),
  actionDay: ActionDaySchema,
});

// For getScheduledChallengeLevels
export const ScheduledChallengeLevelsResponseSchema = z.object({
  levels: z.array(z.any()),
  selectedLevelIndex: z.number(),
});

// Export TypeScript type inferences for easy use in frontend
export type GetScheduledChallengeInfoRequest = z.infer<
  typeof GetScheduledChallengeInfoRequestSchema
>;
export type GetScheduledChallengeActionDaysRequest = z.infer<
  typeof GetScheduledChallengeActionDaysRequestSchema
>;
export type GetScheduledChallengeActionsRequest = z.infer<
  typeof GetScheduledChallengeActionsRequestSchema
>;
export type GetScheduledChallengeLevelsRequest = z.infer<
  typeof GetScheduledChallengeLevelsRequestSchema
>;

export type ScheduledChallengeInfoResponse = z.infer<
  typeof ScheduledChallengeInfoResponseSchema
>;
export type ScheduledChallengeActionDaysResponse = z.infer<
  typeof ScheduledChallengeActionDaysResponseSchema
>;
export type ScheduledChallengeActionsResponse = z.infer<
  typeof ScheduledChallengeActionsResponseSchema
>;
export type ScheduledChallengeLevelsResponse = z.infer<
  typeof ScheduledChallengeLevelsResponseSchema
>;
