import { useQuery } from '@tanstack/react-query';
import { businessProfileService } from '@/lib/api';
import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';
import type { BusinessProfileFormData } from '@/lib/utils/validation';

const businessProfileQueryOptions = {
  queryKey: ['businessProfile'] as const,
  queryFn: () => businessProfileService.getProfiles(),
};

function toFormData(
  profiles: BusinessProfileResponse[]
): BusinessProfileFormData | null {
  if (profiles.length === 0) return null;
  const p = profiles[0];
  return {
    businessName: p.businessName,
    category: p.category,
    description: p.description,
    targetAudience: p.targetAudience,
    websiteUrl: p.websiteUrl,
    logo: p.logo,
    primaryColor: p.primaryColor,
    secondaryColor: p.secondaryColor,
    accentColor: p.accentColor,
  };
}

export function useBusinessProfileData() {
  return useQuery({
    ...businessProfileQueryOptions,
    select: (data: BusinessProfileResponse[]) => ({
      businessProfile: toFormData(data),
      isBusinessProfileComplete: data.length > 0,
    }),
  });
}

export function useBusinessProfileId() {
  return useQuery({
    ...businessProfileQueryOptions,
    select: (data: BusinessProfileResponse[]): number | null =>
      data.length > 0 ? data[0].id : null,
  });
}

export function useIsBusinessProfileComplete() {
  return useQuery({
    ...businessProfileQueryOptions,
    select: (data: BusinessProfileResponse[]): boolean => data.length > 0,
  });
}
