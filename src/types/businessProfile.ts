export interface BusinessProfileResponse {
  id: number;
  userId: number;
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
