import {ChallengeMode, ChallengeType} from '@/types/enums';
import {z} from 'zod';

//  INVITE FRIEND

export const InviteRequestSchema = z.object({
  id: z.string(),
});

export const InviteResponseSchema = z.object({
  inviteData: z.object({
    challengeData: z.object({
      challengeCategory: z.string(), // e.g., "mind"
      challengeId: z.string(),
      challengeImage: z.string().url(),
      challengeMode: z.nativeEnum(ChallengeMode),
      challengeName: z.string(),
      challengeType: z.nativeEnum(ChallengeType),
      daysToFail: z.number(),
      instanceEndDate: z.string().datetime(),
      instanceStartDate: z.string().datetime(),
      selectedLevelIndex: z.number(),
      skipAllowance: z.number(),
      startDate: z.string().datetime(),
      targetEndDate: z.string().datetime(),
      userChallengeId: z.string(),
    }),
    expiresAt: z.string().datetime(),
    links: z.object({
      deepLink: z.string().url(),
      universal: z.string().url(),
    }),
    maxUses: z.number(),
    token: z.string(),
    usesCount: z.number(),
  }),
  inviteLink: z.string().url(),
  message: z.string(),
});

export type InviteResponse = z.infer<typeof InviteResponseSchema>;

export type InviteRequest = z.infer<typeof InviteRequestSchema>;

//  JOIN VIA INVITE

export const JoinInviteRequestSchema = z.object({
  token: z.string(),
  data: z.object({
    timezone: z.string().optional(),
  }),
});

export const JoinInviteResponseSchema = z.object({
  message: z.string(),
  userChallenge: z.object({
    _id: z.string(),
    challengeId: z.string(),
    role: z.string(), // e.g., "member"
    status: z.string(), // e.g., "scheduled"
    startDate: z.string().datetime(),
    targetEndDate: z.string().datetime(),
    selectedLevelIndex: z.number(),
    invitedBy: z.string(),
    challengeName: z.string(),
    challengeImage: z.string(),
  }),
  friendship: z.object({
    status: z.string(), // e.g., "created"
    source: z.string(), // e.g., "challenge_invite"
  }),
});

export type JoinInviteResponseType = z.infer<typeof JoinInviteResponseSchema>;

export type JoinInviteRequest = z.infer<typeof JoinInviteRequestSchema>;

// Participant schema

export const ParticipantSchema = z.object({
  name: z.string(),
  isRealFriend: z.boolean(),
  selectedLevelIndex: z.number(),
});

export const LimitSchema = z.object({
  total: z.number(),
  showing: z.number(),
  hasMore: z.boolean(),
});

export const ChallengeParticipantsResponseSchema = z.object({
  message: z.string(),
  participants: z.array(ParticipantSchema),
  limit: LimitSchema,
});

export type ParticipantList = z.infer<typeof ParticipantSchema>;
export type ParticipantsResponse = z.infer<
  typeof ChallengeParticipantsResponseSchema
>;

// Send Friend Request

export const FriendRequestSchema = z.object({
  receiverId: z.string(),
  message: z.string(),
  source: z.string(),
});

export type FriendRequest = z.infer<typeof FriendRequestSchema>;

export const FriendRequestResponseSchema = z.object({
  message: z.string(),
});

export type FriendRequestResponse = z.infer<typeof FriendRequestResponseSchema>;

// Accept or Decline Friend Request

export const AcceptFriendRequestSchema = z.object({
  id: z.string(),
  data: z.object({
    sendDeclineNotification: z.boolean(),
  }),
});

export type AcceptFriendRequest = z.infer<typeof AcceptFriendRequestSchema>;

export const AcceptFriendRequestResponseSchema = z.object({
  message: z.string(),
});

export type AcceptFriendRequestResponse = z.infer<
  typeof AcceptFriendRequestResponseSchema
>;

// Pending Friend Requests

export const PendingFriendRequestSchema = z.object({
  page: z.number(),
  limit: z.number(),
});

export type PendingFriendRequest = z.infer<typeof PendingFriendRequestSchema>;

const PendingFriendRequest = z.object({
  metadata: z.object({
    source: z.literal('leaderboard'),
    mutualFriends: z.number(),
  }),
  senderId: z.object({
    name: z.string(),
    email: z.string().email(),
    id: z.string(),
  }),
  receiverId: z.string(),
  status: z.literal('pending'),
  message: z.string(),
  sentAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  id: z.string(),
});

export const PendingFriendRequestResponseSchema = z.object({
  requests: z.array(PendingFriendRequest),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    pages: z.number(),
  }),
});

export type PendingFriendList = z.infer<typeof PendingFriendRequest>;

export type PendingFriendRequestResponse = z.infer<
  typeof PendingFriendRequestResponseSchema
>;

//   Friend Nudges

export const SendFriendNudgeSchema = z.object({
  friendId: z.string(),
  userChallengeId: z.string(),
});

export type FriendNudgeRequest = z.infer<typeof SendFriendNudgeSchema>;

export const FriendNudgeResponseSchema = z.object({
  message: z.string(),
  nudgedUser: z.string(),
  challenge: z.string(),
});

export type FriendNudgeResponse = z.infer<typeof FriendNudgeResponseSchema>;
