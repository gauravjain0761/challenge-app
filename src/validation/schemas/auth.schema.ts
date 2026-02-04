import {z} from 'zod';
import {authErrorMessages} from '../errors';

// Password must contain at least one lowercase letter, one number
// Allows letters, numbers, and common special characters (including international ones) atleast 8 characters
const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;

const emailSchema = z
  .string()
  .min(1, {message: authErrorMessages.email.required})
  .email({message: authErrorMessages.email.invalid});

const passwordSchema = z
  .string()
  .min(1, {message: authErrorMessages.password.required})
  .min(8, {message: authErrorMessages.password.min})
  .regex(passwordRegex, {message: authErrorMessages.password.pattern});

const nameSchema = z
  .string()
  .min(1, {message: authErrorMessages.name.required})
  .min(2, {message: authErrorMessages.name.min})
  .max(50, {message: authErrorMessages.name.max});

const otpSchema = z
  .string()
  .min(1, {message: authErrorMessages.otp.required})
  .length(6, {message: authErrorMessages.otp.length})
  .regex(/^\d+$/, {message: authErrorMessages.otp.format});

export const userSchema = z.object({
  id: z.string(),
  email: emailSchema,
  name: nameSchema,
  role: z.string(),
  isEmailVerified: z.boolean(),

  createdAt: z.string().datetime(),
  isDeleted: z.boolean(),
  isFirstTimeUser: z.boolean(),
  provider: z.string(),
  updatedAt: z.string().datetime(),
});

export const tokenInfoSchema = z.object({
  token: z.string(),
  expires: z.string(),
});

export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, {message: authErrorMessages.password.required}),
  revenueCatCustomerId: z.string().optional(),
});

export const appleRequestSchema = z.object({
  identityToken: z.string(),
  user: z.string().optional(), // Apple user ID
  email: z.string().email().optional(),
  revenueCatCustomerId: z.string().optional(),
  fullName: z
    .object({
      givenName: z.string().optional(),
      familyName: z.string().optional(),
    })
    .optional(),
});

export const googleRequestSchema = z.object({
  idToken: z.string(),
  revenueCatCustomerId: z.string().optional(),
});

export const loginResponseSchema = z.object({
  user: userSchema,
  tokens: z.object({
    access: tokenInfoSchema,
    refresh: tokenInfoSchema,
  }),
  message: z.string(),
});

export const registerRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  revenueCatCustomerId: z.string().optional(),
});

export const refreshTokenResponseSchema = z.object({
  access: tokenInfoSchema,
  refresh: tokenInfoSchema,
});

export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

export const forgotPasswordResponseSchema = z.object({
  message: z.string(),
  email: z.string().email(),
  expiresAt: z.string(),
});

export const verifyOtpRequestSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const verifyOtpResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
});

export const resendOtpRequestSchema = z.object({
  email: emailSchema,
});

export const resetPasswordQuerySchema = z.object({
  token: z.string(),
});

export const resetPasswordBodySchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z
      .string()
      .min(1, {message: authErrorMessages.confirmPassword.required}),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: authErrorMessages.confirmPassword.match,
    path: ['confirmPassword'],
  });

export const resetPasswordRequestSchema = z.object({
  query: resetPasswordQuerySchema,
  body: resetPasswordBodySchema,
});

export const genericResponseSchema = z.object({
  message: z.string(),
});

//  Register Device

export const RegisterDeviceRequestSchema = z.object({
  playerId: z.string(),
  platform: z.string(),
  timeZone: z.string().optional(),
});

export const RegisterDeviceResponseSchema = z.object({
  message: z.string(),
  playerId: z.string(),
});

export type RegisterDeviceResponse = z.infer<
  typeof RegisterDeviceResponseSchema
>;

//  Complete Onboarding

export const CompleteOnboardingRequestSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  timezone: z.string().optional(),
});

export const CompleteOnboardingResponseSchema = z.object({
  user: userSchema,
  message: z.string(),
});

//  Guest Session
export const guestSessionResponseSchema = z.object({
  access: tokenInfoSchema,
  refresh: tokenInfoSchema,
  sessionId: z.string(),
  userType: z.literal('guest'),
});

//  Sync RevenueCat Customer ID
export const syncRcCustomerIdRequestSchema = z.object({
  revenueCatCustomerId: z.string(),
  previousCustomerId: z.string().optional(),
});

export const syncRcCustomerIdResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

//  Close Account

export const closeAccountRequestSchema = z.object({
  reason: z.string().optional(),
});

export const closeAccountResponse = z.object({
  message: z.string(),
});

//  Featurebase Embed Token
export const featurebaseEmbedTokenResponseSchema = z.object({
  token: z.string(),
});

// export types

export type RegisterDeviceRequest = z.infer<typeof RegisterDeviceRequestSchema>;

export type CompleteOnboardingRequest = z.infer<
  typeof CompleteOnboardingRequestSchema
>;
export type CompleteOnboardingResponse = z.infer<
  typeof CompleteOnboardingResponseSchema
>;

export type GuestSessionResponse = z.infer<typeof guestSessionResponseSchema>;

export type SyncRcCustomerIdRequest = z.infer<
  typeof syncRcCustomerIdRequestSchema
>;
export type SyncRcCustomerIdResponse = z.infer<
  typeof syncRcCustomerIdResponseSchema
>;
export type CloseAccountRequest = z.infer<typeof closeAccountRequestSchema>;
export type CloseAccountResponse = z.infer<typeof closeAccountResponse>;
export type User = z.infer<typeof userSchema>;
export type TokenInfo = z.infer<typeof tokenInfoSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type AppleRequest = z.infer<typeof appleRequestSchema>;
export type GoogleRequest = z.infer<typeof googleRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type RefreshTokenResponse = z.infer<typeof refreshTokenResponseSchema>;
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
export type ForgotPasswordResponse = z.infer<
  typeof forgotPasswordResponseSchema
>;
export type VerifyOtpRequest = z.infer<typeof verifyOtpRequestSchema>;
export type VerifyOtpResponse = z.infer<typeof verifyOtpResponseSchema>;
export type ResendOtpRequest = z.infer<typeof resendOtpRequestSchema>;
export type ResetPasswordQuery = z.infer<typeof resetPasswordQuerySchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;
export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
export type GenericResponse = z.infer<typeof genericResponseSchema>;
export type FeaturebaseEmbedTokenResponse = z.infer<
  typeof featurebaseEmbedTokenResponseSchema
>;
