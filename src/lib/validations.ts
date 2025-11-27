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
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
    .optional(),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^[0-9]{6}$/, 'OTP must contain only numbers'),
});

export const signupSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
  email: z.email('Invalid email format').optional(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format'),
  role: z.string().optional(),
});

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;
export type PhoneFormData = z.infer<typeof phoneSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
