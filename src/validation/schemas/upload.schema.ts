import {z} from 'zod';

export const generateUploadUrlRequestSchema = z.object({
  folderName: z.string().min(1, 'Folder name is required'),
  fileName: z.string().min(1, 'File name is required'),
  contentType: z.string().min(1, 'Content type is required'),
});

export const generateUploadUrlResponseSchema = z.object({
  uploadUrl: z.string().url('Invalid upload URL'),
  fileUrl: z.string().url('Invalid file URL'),
  fileName: z.string(),
  expiresAt: z.string().optional(),
});

export type GenerateUploadUrlRequest = z.infer<typeof generateUploadUrlRequestSchema>;
export type GenerateUploadUrlResponse = z.infer<typeof generateUploadUrlResponseSchema>;