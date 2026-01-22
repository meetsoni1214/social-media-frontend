import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { businessProfileService } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';

export function useBusinessProfile() {
  return useQuery<BusinessProfileResponse[]>({
    queryKey: ['businessProfile'],
    queryFn: () => businessProfileService.getProfiles(),
  });
}

export function useSaveBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<BusinessProfileResponse, Error, BusinessProfileFormData>({
    mutationFn: (businessProfile: BusinessProfileFormData) =>
      businessProfileService.createProfile(businessProfile),
    onSuccess: data => {
      queryClient.setQueryData(['businessProfile'], [data]);
    },
  });
}
