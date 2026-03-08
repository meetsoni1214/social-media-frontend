import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { businessProfileService } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';
import type { UUID } from '@/types/uuid';
import { businessProfileKeys } from '@/features/business-profile/hooks/businessProfileKeys';

export function useBusinessProfile() {
  return useQuery<BusinessProfileResponse[]>({
    queryKey: businessProfileKeys.all,
    queryFn: () => businessProfileService.getProfiles(),
  });
}

export function useSaveBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    BusinessProfileResponse,
    Error,
    {
      businessProfile: BusinessProfileFormData;
      businessProfileId?: UUID | null;
    }
  >({
    mutationFn: ({ businessProfile, businessProfileId }) =>
      businessProfileId
        ? businessProfileService.updateProfile(
            businessProfileId,
            businessProfile
          )
        : businessProfileService.createProfile(businessProfile),
    onSuccess: data => {
      queryClient.setQueryData(
        businessProfileKeys.all,
        (current: BusinessProfileResponse[] | undefined) => {
          if (!current) return [data];

          const existingIndex = current.findIndex(item => item.id === data.id);
          if (existingIndex === -1) {
            return [data, ...current];
          }

          const next = [...current];
          next[existingIndex] = data;
          return next;
        }
      );
      queryClient.setQueryData(businessProfileKeys.detail(data.id), data);
    },
  });
}
