import {
  ActionStatus,
  CategoryFilter,
  ChallengeType,
  DayStatus,
  ChallengeMode,
  UnitsOptions,
  ChallengeStatus,
  ChallengeLevel,
  RATING_TYPE,
} from '@/types/enums';
import {z} from 'zod';
import {
  WhySectionSchema,
  FileSchema,
  WhatSectionSchema,
  HowSectionSchema,
} from './explore.schema';

// ------------------------------------------------------------------
// 1. getInProgressChallengeInfo schemas
// ------------------------------------------------------------------

export const getInProgressChallengeInfoParams = z.object({
  id: z.string().uuid(),
});

export const inProgressChallengeInfoResponse = z.object({
  _id: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  name: z.string(),
  category: z.nativeEnum(CategoryFilter),
  type: z.nativeEnum(ChallengeType),
  display_type: z.string(),
  mode: z.nativeEnum(ChallengeMode),
  description: z.string(),
  image: z.string().optional(),
  selectedLevelIndex: z.number(),
  daysToFail: z.number(),
  skipAllowance: z.number(),
  skipsUsed: z.number(),
  what: WhySectionSchema,
  why: WhatSectionSchema,
  how: HowSectionSchema,
  totalDays: z.number(),
  totalDaysCompleted: z.number(),
  totalDaysFailed: z.number(),
  totalDaysSkipped: z.number(),
  failRemaining: z.number(),
});

export type GetInProgressChallengeInfoParams = z.infer<
  typeof getInProgressChallengeInfoParams
>;
export type InProgressChallengeInfoResponse = z.infer<
  typeof inProgressChallengeInfoResponse
>;

// ------------------------------------------------------------------
// 2. getInProgressChallengeLevels schemas
// ------------------------------------------------------------------

export const getInProgressChallengeLevelsParams = z.object({
  id: z.string().uuid(),
});

const levelSchema = z.object({
  name: z.string(),
  goal: z.object({
    value: z.number(),
    unit: z.string().optional(),
  }),
  description: z.string().optional(),
});

export const inProgressChallengeLevelsResponse = z.object({
  levels: z.array(levelSchema),
  selectedLevelIndex: z.number(),
  highestLevelAchieved: z.number().optional(),
});

export type GetInProgressChallengeLevelsParams = z.infer<
  typeof getInProgressChallengeLevelsParams
>;
export type InProgressChallengeLevelsResponse = z.infer<
  typeof inProgressChallengeLevelsResponse
>;

// ------------------------------------------------------------------
// 3. getInProgressActionDays schemas
// ------------------------------------------------------------------

export const getInProgressActionDaysParams = z.object({
  id: z.string().uuid(),
});

const availableDaySchema = z.record(
  z.string(), // key is day1, day2, etc.
  z.object({
    available: z.boolean(),
    order: z.number(),
    date: z.string(), // ISO date string
    originalDayRef: z.string(),
    status: z.nativeEnum(DayStatus),
    completed: z.boolean(),
    failed: z.boolean(),
    skipped: z.boolean(),
    pending: z.boolean(),
  }),
);

export const inProgressActionDaysResponse = z.object({
  startDate: z.string(), // ISO date string
  targetEndDate: z.string(), // ISO date string
  availableDays: availableDaySchema,
  type: z.string().nullable(),
  totalDays: z.number(),
});

export type GetInProgressActionDaysParams = z.infer<
  typeof getInProgressActionDaysParams
>;
export type InProgressActionDaysResponse = z.infer<
  typeof inProgressActionDaysResponse
>;

// ------------------------------------------------------------------
// 4. getInProgressDayActions schemas
// ------------------------------------------------------------------

export const getInProgressDayActionsParams = z.object({
  id: z.string().uuid(),
  day: z.string().regex(/^day\d+$/), // Format: day1, day2, etc.
});

const actionDetailSchema = z.object({
  _id: z.string(),
  name: z.string(),
  image: z.string().optional(),
  type: z.string(),
  basicRules: z.object({
    goal: z.object({
      value: z.number(),
      unit: z.nativeEnum(UnitsOptions),
      frequency: z.string(),
    }),
    timeOfDay: z.string(),
  }),
});

const actionOverridesSchema = z
  .object({
    name: z.string().optional(),
    instructions: z.string().optional(),
    image: z.string().optional(),
  })
  .optional();

const actionProgressSchema = z.object({
  actionId: z.string(),
  status: z.nativeEnum(ActionStatus),
  action: actionDetailSchema,
  compulsory: z.boolean(),
  overrides: actionOverridesSchema,
  selectedLevelIndex: z.number(),
  bestCount: z.number().optional(),
  bestUnit: z.string().optional(),
  completionData: z
    .object({
      levelIndex: z.number().optional(),
      completionCount: z.number().optional(),
      completionUnit: z.string().optional(),
    })
    .optional(),
});

export const inProgressDayActionsResponse = z.object({
  _id: z.string(),
  userId: z.string(),
  challengeId: z.string(),
  challengeName: z.string(),
  type: z.nativeEnum(ChallengeType),
  dayStatus: z.nativeEnum(DayStatus),
  selectedActionCount: z.number().optional(),
  completedActionCount: z.number().optional(),
  actionDay: z.object({
    type: z.string().nullable(),
    day: z.string(),
    originalDayRef: z.string(),
    date: z.string(), // ISO date string
    actions: z.array(actionProgressSchema),
    levels: z.array(levelSchema),
    selectedLevelIndex: z.number(),
    popupShown: z.boolean(),
    finishDay: z.boolean().optional(),
  }),
  userWhy: z.string().optional(),
  preRating: z.number().optional(),
  currentStreak: z.number(),
  maxStreak: z.number(),
  highestLevelAchieved: z.number().optional(),
  canEdit: z.boolean(),
  isAtRisk: z.boolean().optional(),
});

export type GetInProgressDayActionsParams = z.infer<
  typeof getInProgressDayActionsParams
>;
export type InProgressDayActionsResponse = z.infer<
  typeof inProgressDayActionsResponse
>;

// ------------------------------------------------------------------
// 5. updateInProgressAction schemas
// ------------------------------------------------------------------

export const updateInProgressActionBody = z.object({
  actionId: z.string().uuid(),
  status: z.nativeEnum(ActionStatus),
  completionData: z
    .object({
      levelIndex: z.number().optional(),
      completionCount: z.number().optional(),
      completionUnit: z.string().optional(),
    })
    .optional(),
});

export type UpdateActionArg = UpdateInProgressActionParams & {
  data: UpdateInProgressActionBody;
};

export const updateInProgressActionParams = z.object({
  id: z.string().uuid(),
  day: z.string().regex(/^day\d+$/), // Format: day1, day2, etc.
});

// The response is likely the same as inProgressDayActionsResponse
export const updateInProgressActionResponse = inProgressDayActionsResponse;

export type UpdateInProgressActionParams = z.infer<
  typeof updateInProgressActionParams
>;
export type UpdateInProgressActionBody = z.infer<
  typeof updateInProgressActionBody
>;
export type UpdateInProgressActionResponse = z.infer<
  typeof updateInProgressActionResponse
>;

// ------------------------------------------------------------------
// 6. getInProgressAction Details schemas
// ------------------------------------------------------------------

export const getInProgressActionDetailParams = z.object({
  id: z.string().uuid(),
});

const questionSchema = z.object({
  question: z.string(),
  type: z.string(),
  options: z.array(z.string()),
});

export const actionAssetData = z.object({
  name: z.string(),
  category: z.string(),
  info: z.string(),
  assetType: z.string(),
  files: FileSchema,
  id: z.string(),
  journal: z
    .object({
      questions: z.array(questionSchema),
    })
    .optional(),
  breathwork: z
    .object({
      exhale: z.number().optional(),
      hold: z.number().optional(),
      inhale: z.number().optional(),
      exhaleHold: z.number().optional(),
      timer: z.number().optional(),
    })
    .optional(),
  timer: z
    .object({
      allowCustom: z.boolean().optional(),
      duration: z.number().optional(),
    })
    .optional(),
});

export const getInProgressActionDetailResponse = z.object({
  name: z.string(),
  category: z.nativeEnum(CategoryFilter),
  type: z.nativeEnum(ChallengeType),
  description: z.string(),
  image: z.string().optional(),
  what: WhatSectionSchema,
  why: WhySectionSchema,
  how: HowSectionSchema,
  basicRules: z.object({
    goal: z.object({
      value: z.number(),
      unit: z.nativeEnum(UnitsOptions),
      frequency: z.string(),
    }),
    timeOfDay: z.string(),
  }),
  assets: z.array(actionAssetData),
  createdBy: z.string(),
  updatedBy: z.string(),
  id: z.string(),
});

export type questionsData = z.infer<typeof questionSchema>;
export type GetInProgressActionAssetsData = z.infer<typeof actionAssetData>;

export type GetInProgressActionDetailParams = z.infer<
  typeof getInProgressActionDetailParams
>;

export type GetInProgressActionDetailResponse = z.infer<
  typeof getInProgressActionDetailResponse
>;

// -------------------------
// REQUEST SCHEMA
// -------------------------

export const getChallengeProgressParamsSchema = z.object({
  id: z.string().min(1),
});

export type GetChallengeProgressParams = z.infer<
  typeof getChallengeProgressParamsSchema
>;

// -------------------------
// RESPONSE SCHEMAS
// -------------------------

// Common schemas

const progressLevelSchema = z.object({
  id: z.number().optional(),
  index: z.number().optional(),
  level: z.string().optional(),
  progressValue: z.number().optional(),
  name: z.string().optional(),
  goal: z
    .object({
      value: z.number(),
      unit: z.nativeEnum(UnitsOptions),
      frequency: z.string(),
    })
    .optional(),
});

// Simplify for better type instantiation
export const getChallengeProgressResponseSchema = z.object({
  challengeId: z.string(),
  socialShareImage: z.string(),
  challengeShortName: z.string(),
  challengeName: z.string(),
  challengeType: z.string(), // Using string instead of enum for flexibility
  selectedLevel: z.number(),
  daysToFail: z.number(),
  totalDaysFailed: z.number(),
  totalDays: z.number(),
  completedDays: z.number(),
  status: z.string(),
  levels: z.array(progressLevelSchema),
  dailyLevels: z.array(
    z.object({
      day: z.string(),
      level: z.number().nullable(),
      status: z.string(),
    }),
  ),
  avgLevel: z.number(),
  highestLevelAchieved: z.number(),

  // Optional fields based on challenge type
  dailyCompletion: z
    .array(
      z.object({
        day: z.string(),
        completionCount: z.number(),
        completionUnit: z.string().nullable(),
      }),
    )
    .optional(),
  avgCompletion: z.number().optional(),

  dayCompletions: z
    .array(
      z.object({
        day: z.string(),
        completed: z.number(),
        total: z.number(),
      }),
    )
    .optional(),

  challengeAvg: z
    .object({
      completed: z.number(),
      total: z.number(),
    })
    .optional(),

  actionCompletions: z
    .array(
      z
        .object({
          actionName: z.string(),
        })
        .and(
          z.union([
            z.object({
              completed: z.number(),
              total: z.number(),
            }),
            z.object({
              completionCount: z.number(),
              completionUnit: z.string(),
            }),
          ]),
        ),
    )
    .optional(),

  categoryMetrics: z.array(
    z.object({
      category: z.nativeEnum(CategoryFilter),
      completedCount: z.number(),
      totalCount: z.number(),
      percentage: z.number(),
    }),
  ),
});

// Type definition
export type GetChallengeProgressResponse = z.infer<
  typeof getChallengeProgressResponseSchema
>;

// -------------------------
// REQUEST SCHEMA
// -------------------------

export const GetTodayChallengesParams = z.object({
  category: z.string().default('all'),
  date: z.string().or(z.date()),
});

export const TodayChallengeSchema = z.object({
  _id: z.string(),
  name: z.string(),
  category: z.string(),
  type: z.string(),
  mode: z.nativeEnum(ChallengeMode),
  description: z.string(),
  image: z.string().optional(),
  display_type: z.nativeEnum(ChallengeType),
});

export const GetTodayChallengesSchema = z
  .object({
    group: z.array(TodayChallengeSchema),
    personal: z.array(TodayChallengeSchema),
    worldwide: z.array(TodayChallengeSchema),
  })
  .partial();

export type TodayChallengeListItems = z.infer<typeof TodayChallengeSchema>;

export type GetTodayChallengesParams = z.infer<typeof GetTodayChallengesParams>;

export type GetTodayChallengesResponse = z.infer<
  typeof GetTodayChallengesSchema
>;

// -------------------------
// PROGRESS METRICS RESPONSE SCHEMAS
// -------------------------

const completionStats = z.object({
  totalChallenges: z.number(),
  completed: z.number(),
  failed: z.number(),
  left: z.number(),
  active: z.number(),
  completionPercentage: z.number(),
});

const recentChallenges = z.object({
  _id: z.string(),
  status: z.nativeEnum(ChallengeStatus),
  category: z.nativeEnum(CategoryFilter),
  avgLevelAchievedName: z.string(),
});

const categoryProgress = z.array(
  z.object({
    category: z.nativeEnum(CategoryFilter),
    percentage: z.number(),
    count: z.number(),
    totalCount: z.number().optional(),
  }),
);
const ProgressMetricsResponse = z.object({
  categoryProgress: categoryProgress,
  completionStats: completionStats,
  recentChallenges: z.array(recentChallenges),
  overallLevel: z.object({
    levelName: z.nativeEnum(ChallengeLevel),
    levelIndex: z.number(),
  }),
});

export const getProgressMetricsResponseSchema = z.object({
  data: ProgressMetricsResponse,
});

export type CategoryProgress = z.infer<typeof categoryProgress>;
export type RecentChallenges = z.infer<typeof recentChallenges>;
export type ProgressMetricsResponse = z.infer<typeof ProgressMetricsResponse>;
export type CompletionStats = z.infer<typeof completionStats>;
export type GetProgressMetricsResponse = z.infer<
  typeof getProgressMetricsResponseSchema
>;

// -------------------------
// PROGRESS MAX_OUT REQUEST SCHEMA
// -------------------------

export const getProgressMexOutParamsSchema = z.object({
  limit: z.number(),
});

export type GetProgressMexOutParams = z.infer<
  typeof getProgressMexOutParamsSchema
>;

// -------------------------
// PROGRESS MAX_OUT RESPONSE SCHEMAS
// -------------------------

const maxOutChallengeSchema = z.object({
  actionId: z.string(),
  category: z.nativeEnum(ChallengeType),
  unit: z.string(),
  bestCount: z.number(),
  achievedAt: z.string().datetime(), // ISO 8601 date-time string
  actionName: z.string(),
  actionImage: z.string().url(),
});

export const getProgressMexOutResponseSchema = z.object({
  data: z.array(maxOutChallengeSchema),
});

export type MaxOutChallengeSchema = z.infer<typeof maxOutChallengeSchema>;

export type GetProgressMexOutResponse = z.infer<
  typeof getProgressMexOutResponseSchema
>;

//  Leader board response schema

export const LeaderboardParamsSchema = z.object({
  id: z.string(),

  query: z.object({
    limit: z.number(),
    offset: z.number(),
  }),
});

export type LeaderboardParams = z.infer<typeof LeaderboardParamsSchema>;

export const LeaderboardUserSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  profilePicture: z.string().nullable(),
});

export const LeaderboardStatsSchema = z.object({
  totalActionsCompleted: z.number(),
  totalDaysFailed: z.number(),
  totalActionsSkipped: z.number().optional(),
  totalCompletionCount: z.number().optional(),
  bestCount: z.number().optional(),
  unit: z.string().optional(),
});

export const LeaderboardEntrySchema = z.object({
  rank: z.number(),
  userChallengeId: z.string(),
  user: LeaderboardUserSchema,
  stats: LeaderboardStatsSchema,
  level: z.nativeEnum(ChallengeLevel), // Could also use z.enum([...]) if level is predefined
  isFriend: z.boolean(),
  isCurrentUser: z.boolean(),
});

export const Pagination = z.object({
  limit: z.number(),
  offset: z.number(),
  hasMore: z.boolean(),
});

export const ChallengeInfo = z.object({
  challengeType: z.nativeEnum(ChallengeType),
  challengeMode: z.nativeEnum(ChallengeMode),
});

export const LeaderboardResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    leaderboard: z.array(LeaderboardEntrySchema),
    currentUserRank: z.number(),
    totalParticipants: z.number(),
    pagination: Pagination,
    challengeInfo: ChallengeInfo,
  }),
});

export type LeaderboardEntry = z.infer<typeof LeaderboardEntrySchema>;
export type LeaderboardResponse = z.infer<typeof LeaderboardResponseSchema>;

//  Skip all actions response schema

export type SkipAllActionsParams = z.infer<typeof updateInProgressActionParams>;

const SkipAllActionData = z.object({
  dayString: z.string(),
  dayNumber: z.number(),
  dayStatus: z.nativeEnum(DayStatus),
  completedActions: z.number(),
  skippedActions: z.number(),
  level: z.number(),
  levelName: z.nativeEnum(ChallengeLevel),
  metrics: z.object({
    completionCountChange: z.number().optional(),
    completedActionsChange: z.number().optional(),
    skippedActionsChange: z.number().optional(),
    levelChange: z.number().optional(),
  }),
  totalActionsSkipped: z.number(),
  totalDaysFailed: z.number(),
  categoryMetrics: z.array(
    z.object({
      category: z.nativeEnum(CategoryFilter),
      completedCount: z.number(),
      totalCount: z.number(),
      percentage: z.number(),
    }),
  ),

  completionCount: z.number(),
  completionUnit: z.string(),
});

export type SkipAllAction = z.infer<typeof SkipAllActionData>;

export const SkipAllActionsResponseSchema = z.object({
  message: z.string(),
  data: SkipAllActionData,
});

export type SkipAllActionsResponse = z.infer<
  typeof SkipAllActionsResponseSchema
>;

// Reminder response schema

export const GetReminderParamsSchema = z.object({
  id: z.string().uuid(),
});

export type GetReminderParams = z.infer<typeof GetReminderParamsSchema>;

export const GetReminderResponseSchema = z.object({
  message: z.string(),
  reminderSettings: z.object({
    lastUpdated: z.string().datetime(),
    reminderTimes: z.array(z.string()),
    timezone: z.string(),
  }),
});

export type GetReminderResponse = z.infer<typeof GetReminderResponseSchema>;

export const UpdateReminderParamsSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    timezone: z.string().optional(),
    reminderTimes: z.array(z.string()).optional(),
  }),
});

export type UpdateReminderParams = z.infer<typeof UpdateReminderParamsSchema>;

export const UpdateReminderResponseSchema = z.object({
  message: z.string(),
});

export type UpdateReminderResponse = z.infer<
  typeof UpdateReminderResponseSchema
>;

export const RemoveReminderParamsSchema = z.object({
  id: z.string(),
  reminderTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
});
export type RemoveReminderParams = z.infer<typeof RemoveReminderParamsSchema>;
export const RemoveReminderResponseSchema = z.object({
  message: z.string(),
});

export type RemoveReminderResponse = z.infer<
  typeof RemoveReminderResponseSchema
>;

// USER LEADERBOARD RESPONSE SCHEMA

const userData = z.object({
  userId: z.string().uuid(),
  name: z.string(),
  profilePicture: z.string().nullable(),
  position: z.number(),
  isCurrentUser: z.boolean(),
  stats: z.object({
    totalStarted: z.number(),
    totalCompleted: z.number(),
    totalFailed: z.number(),
    avgLevel: z.number(),
  }),
});

export type UserLeaderboardData = z.infer<typeof userData>;

export const UserLeaderboardResponseSchema = z.object({
  message: z.string(),
  title: z.string(),
  top10: z.array(userData),
  currentUser: userData,
  totalUsers: z.number(),
});

export type UserLeaderboardResponse = z.infer<
  typeof UserLeaderboardResponseSchema
>;

// ADD WHY

export const AddWhyResponseSchema = z.object({
  message: z.string(),
});

export type AddWhyResponse = z.infer<typeof AddWhyResponseSchema>;

export const AddWhyRequestSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    why: z.string().max(100),
  }),
});

export type AddWhyRequest = z.infer<typeof AddWhyRequestSchema>;

// Daily Popup

export const DailyPopupResponseSchema = z.object({
  message: z.string(),
});

export type DailyPopupResponse = z.infer<typeof DailyPopupResponseSchema>;

export const DailyPopupRequestSchema = z.object({
  id: z.string().uuid(),
  day: z.string(),
});

export type DailyPopupRequest = z.infer<typeof DailyPopupRequestSchema>;

// Rating schema

export const RatingResponseSchema = z.object({
  message: z.string(),
});

export type RatingResponse = z.infer<typeof RatingResponseSchema>;

export const RatingSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    ratingType: z.nativeEnum(RATING_TYPE),
    rating: z.number().int().min(1).max(10),
  }),
});

export type RatingRequest = z.infer<typeof RatingSchema>;

// Progress Matrix Action

export const ProgressMatrixActionResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    actionStats: z.object({
      totalStarted: z.number().int().min(0),
      totalCompleted: z.number().int().min(0),
      totalFailed: z.number().int().min(0),
    }),
    actionCategoryProgress: z.array(
      z.object({
        category: z.string(),
        count: z.number().int().min(0),
        percentage: z.number().int().min(0).max(100),
      }),
    ),
    overallLevel: z.object({
      levelName: z.string(),
      levelIndex: z.number().int().min(0),
    }),
  }),
});

export type ProgressMatrixActionResponse = z.infer<
  typeof ProgressMatrixActionResponseSchema
>;

export const ProgressMatrixActionRequestSchema = z.object({});

export type ProgressMatrixActionRequest = z.infer<
  typeof ProgressMatrixActionRequestSchema
>;

// Progress Matrix Challenges

export const ProgressMatrixChallengesResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    challengeStats: z.object({
      totalStarted: z.number().int().min(0),
      totalCompleted: z.number().int().min(0),
      totalFailed: z.number().int().min(0),
      totalLeft: z.number().int().min(0),
    }),
    challengeCategoryProgress: z.array(
      z.object({
        category: z.string(),
        count: z.number().int().min(0),
        percentage: z.number().int().min(0).max(100),
        totalCount: z.number().optional(),
      }),
    ),
    overallLevel: z.object({
      levelName: z.string(),
      levelIndex: z.number().int().min(0),
    }),
    recentChallenges: z.array(
      z.object({
        id: z.string().uuid(),
        name: z.string(),
        category: z.nativeEnum(CategoryFilter),
        avgLevelAchievedName: z.string(),
        image: z.string().url(),
        status: z.string(),
      }),
    ),
  }),
});

export type ProgressMatrixChallengesResponse = z.infer<
  typeof ProgressMatrixChallengesResponseSchema
>;

export const ProgressMatrixChallengesRequestSchema = z.object({});

export type ProgressMatrixChallengesRequest = z.infer<
  typeof ProgressMatrixChallengesRequestSchema
>;
