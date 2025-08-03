import { z } from "zod";

// Image upload and processing schemas
export const uploadImageSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
});

export const maskSchema = z.object({
  id: z.string(),
  imageId: z.string(),
  maskData: z.string(), // base64 encoded mask data
  boundingBox: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  confidence: z.number(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(), // hex color
});

export const processedImageSchema = z.object({
  id: z.string(),
  originalFilename: z.string(),
  filePath: z.string(),
  width: z.number(),
  height: z.number(),
  masks: z.array(maskSchema),
  processedAt: z.date(),
});

export const colorApplicationSchema = z.object({
  imageId: z.string(),
  maskIds: z.array(z.string()),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/), // hex color
});

export const generateMasksRequestSchema = z.object({
  imageId: z.string(),
});

export const generateMasksResponseSchema = z.object({
  imageId: z.string(),
  masks: z.array(maskSchema),
  processingTime: z.number(),
});

export type UploadImage = z.infer<typeof uploadImageSchema>;
export type Mask = z.infer<typeof maskSchema>;
export type ProcessedImage = z.infer<typeof processedImageSchema>;
export type ColorApplication = z.infer<typeof colorApplicationSchema>;
export type GenerateMasksRequest = z.infer<typeof generateMasksRequestSchema>;
export type GenerateMasksResponse = z.infer<typeof generateMasksResponseSchema>;
