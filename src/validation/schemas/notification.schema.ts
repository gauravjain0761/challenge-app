import z from 'zod';

export const notificationSchema = z.object({
  pushEnabled: z.boolean(),
});

export type NotificationPermissionRequest = z.infer<typeof notificationSchema>;

export const notificationPermissionRequestSchema = z.object({
  message: z.string(),
});

export type NotificationPermissionResponse = z.infer<
  typeof notificationPermissionRequestSchema
>;

// update notification

const notificationTypesSchema = z.object({
  friend_invite: z.boolean().optional(),
  friend_accept: z.boolean().optional(),
  friend_decline: z.boolean().optional(),
  friend_challenge_complete: z.boolean().optional(),
  challenge_started: z.boolean().optional(),
  challenge_reminder: z.boolean().optional(),
  challenge_deadline: z.boolean().optional(),
  challenge_completed: z.boolean().optional(),
  challenge_day_failed: z.boolean().optional(),
  daily_reminder: z.boolean().optional(),
  weekly_summary: z.boolean().optional(),
  streak_reminder: z.boolean().optional(),
});

export const updateNotificationSchema = z.object({
  notificationTypes: notificationTypesSchema,
});

export type UpdateNotificationRequest = z.infer<
  typeof updateNotificationSchema
>;

export const updateNotificationResponseSchema = z.object({
  message: z.string(),
  settings: z.object({
    quietHours: z.object({
      enabled: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    }),
    deviceInfo: z.object({
      platform: z.string(),
      userAgent: z.string(),
      lastActive: z.string().datetime(),
    }),
    userId: z.string(),
    pushEnabled: z.boolean(),
    timezone: z.string(),
    dailyReminderTime: z.string(),
    notificationTypes: notificationTypesSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    oneSignalPlayerId: z.string(),
    id: z.string(),
  }),
});

export type UpdateNotificationResponse = z.infer<
  typeof updateNotificationResponseSchema
>;

//  Get Notification Setting

export const getNotificationSettingSchema = z.object({
  id: z.string(),
});

export type GetNotificationSettingRequest = z.infer<
  typeof getNotificationSettingSchema
>;

export const getNotificationSettingResponseSchema = z.object({
  createdAt: z.string().datetime(),
  dailyReminderTime: z.string(),
  deviceInfo: z.object({
    lastActive: z.string().datetime(),
    platform: z.string(),
    userAgent: z.string(),
  }),
  id: z.string(),
  notificationTypes: notificationTypesSchema,
  oneSignalPlayerId: z.string(),
  pushEnabled: z.boolean(),
  quietHours: z.object({
    enabled: z.boolean(),
    endTime: z.string(),
    startTime: z.string(),
  }),
  timezone: z.string(),
  updatedAt: z.string().datetime(),
  userId: z.string(),
});

export type GetNotificationSettingResponse = z.infer<
  typeof getNotificationSettingResponseSchema
>;
