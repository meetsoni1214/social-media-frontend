import type { UUID } from '@/types/uuid';

export interface BusinessProfileResponse {
  id: UUID;
  userId: UUID;
  businessName: string;
  category: string;
  description: string;
  targetAudience?: string;
  websiteUrl?: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  createdAt: string;
  updatedAt: string | null;
}
