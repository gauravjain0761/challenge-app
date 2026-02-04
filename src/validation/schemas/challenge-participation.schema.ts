import {z} from 'zod';
import {challengeParticipationErrors} from '../errors';
import {ChallengeMode} from '@/types/enums';

export const joinChallengeData = z.object({
  selectedLevelIndex: z
    .number()
    .min(0, {message: challengeParticipationErrors.selectedLevelIndex})
    .nullable(),

  // for personal mode kindly add proper condition of these
  startDate: z.string().optional(),
  targetEndDate: z.string().optional(),
  daysToFail: z.number().optional(),

  // Optional for group challenges
  friends: z.array(z.string()).optional(),
});

export const joinChallengeRequestSchema = z.object({
  challengeId: z.string(),
  data: joinChallengeData,
});

// Update Challenge
export const updateChallengeRequestSchema = z.object({
  challengeId: z.string(),

  data: joinChallengeData,
});

// Leave Challenge
export const leaveChallengeRequestSchema = z.object({
  challengeId: z.string(),
});

// ----------------
// Response Schemas
// —;;----

// Join Challenge Response
export const joinChallengeResponseSchema = z.object({
  message: z.string(),
  _id: z.string(),
  challengeName: z.string(),
  challengeId: z.string(),
  status: z.string(),
  selectedLevelIndex: z.number(),
  startDate: z.string(),
  targetEndDate: z.string(),
  mode: z.string(),
  type: z.string(),
});

// Update Challenge Response
export const updateChallengeResponseSchema = z.object({
  message: z.string(),
  _id: z.string(),
  challengeId: z.string(),
  status: z.string(),
  selectedLevelIndex: z.number(),
  startDate: z.string(),
  targetEndDate: z.string(),
  mode: z.string(),
  type: z.string(),
});

// Leave Challenge Response
export const leaveChallengeResponseSchema = z.object({
  message: z.string(),
  challengeId: z.string(),
  status: z.string(),
});

// validations

export const validateJoinChallengeData = (
  data: JoinChallengeData & {mode: ChallengeMode},
) => {
  const {selectedLevelIndex, daysToFail, mode} = data;

  if (selectedLevelIndex === null) {
    throw new Error(challengeParticipationErrors.selectedLevelIndex);
  }

  if (mode === ChallengeMode.PERSONAL) {
    if (daysToFail === undefined) {
      throw new Error(challengeParticipationErrors.daysToFail);
    }
  }
};

// Helper to handle API errors related to challenges
export const handleChallengeApiError = (error: any): string => {
  console.log('API error:', error);

  if (
    error?.data?.code === 500 &&
    error?.data?.message?.includes('duplicate key error') &&
    error?.data?.message?.includes('userId_1_challengeId_1_startDate_1')
  ) {
    return challengeParticipationErrors.duplicate;
  }

  return (
    error?.data?.message || error?.message || challengeParticipationErrors.error
  );
};

// ----------------
// Request Types
// ----------------

export type JoinChallengeData = z.infer<typeof joinChallengeData>;
export type JoinChallengeRequest = z.infer<typeof joinChallengeRequestSchema>;
export type UpdateChallengeRequest = z.infer<
  typeof updateChallengeRequestSchema
>;
export type LeaveChallengeRequest = z.infer<typeof leaveChallengeRequestSchema>;
// ----------------
// Response Types
// ----------------

export type JoinChallengeResponse = z.infer<typeof joinChallengeResponseSchema>;
export type UpdateChallengeResponse = z.infer<
  typeof updateChallengeResponseSchema
>;
export type LeaveChallengeResponse = z.infer<
  typeof leaveChallengeResponseSchema
>;
