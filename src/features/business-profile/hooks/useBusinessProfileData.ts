import { useQuery } from '@tanstack/react-query';
import { businessProfileService } from '@/lib/api';
import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import type { UUID } from '@/types/uuid';

const businessProfilesQueryOptions = {
  queryKey: ['businessProfiles'] as const,
  queryFn: () => businessProfileService.getProfiles(),
};

function toFormData(
  profile: BusinessProfileResponse | null
): BusinessProfileFormData | null {
  if (!profile) return null;

  return {
    businessName: profile.businessName,
    category: profile.category,
    description: profile.description,
    targetAudience: profile.targetAudience,
    websiteUrl: profile.websiteUrl,
    logo: profile.logo,
    primaryColor: profile.primaryColor,
    secondaryColor: profile.secondaryColor,
    accentColor: profile.accentColor,
  };
}

export function useBusinessProfiles() {
  return useQuery({
    ...businessProfilesQueryOptions,
  });
}

export function useBusinessProfileDataById(businessProfileId: UUID | null) {
  return useQuery({
    queryKey: ['businessProfile', businessProfileId] as const,
    queryFn: () =>
      businessProfileService.getProfileById(businessProfileId as UUID),
    enabled: !!businessProfileId,
    select: (data: BusinessProfileResponse) => ({
      businessProfile: toFormData(data),
      isBusinessProfileComplete: !!data.id,
    }),
  });
}
