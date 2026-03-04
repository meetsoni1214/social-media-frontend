import type { UUID } from '@/types/uuid';

export const businessProfileKeys = {
  all: ['businessProfiles'] as const,
  detail: (businessProfileId: UUID | null) =>
    [...businessProfileKeys.all, 'detail', businessProfileId] as const,
};
