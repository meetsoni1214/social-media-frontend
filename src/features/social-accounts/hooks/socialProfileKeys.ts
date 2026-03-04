import type { SocialPlatform } from '@/features/social-accounts/types/socialProfile';
import type { UUID } from '@/types/uuid';

export const socialProfileKeys = {
  all: ['socialProfiles'] as const,
  detail: (businessProfileId: UUID | null) =>
    [...socialProfileKeys.all, 'detail', businessProfileId] as const,
  exists: (businessProfileId: UUID | null) =>
    [...socialProfileKeys.all, 'exists', businessProfileId] as const,
  connect: (businessProfileId: UUID | null, platform: SocialPlatform | null) =>
    [...socialProfileKeys.all, 'connect', businessProfileId, platform] as const,
  accountsStatus: (businessProfileId: UUID | null) =>
    [...socialProfileKeys.all, 'accounts-status', businessProfileId] as const,
};
