import { z } from 'zod';

export const businessProfileSchema = z.object({
  businessName: z
    .string()
    .min(2, 'Business name must be at least 2 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  targetAudience: z.string().optional(),
  websiteUrl: z.string().optional(),
  logo: z.string().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

export const contentPreferencesSchema = z.object({
  goals: z.array(z.string()).min(1, 'Please select at least one goal'),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
export type ContentPreferencesFormData = z.infer<
  typeof contentPreferencesSchema
>;
