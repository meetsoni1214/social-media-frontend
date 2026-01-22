import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import type { BusinessProfileFormData } from '@/lib/utils/validation';
import type { BusinessProfileResponse } from '@/features/business-profile/types/businessProfile';

export function useBusinessProfile() {
  return useQuery<BusinessProfileResponse[]>({
    queryKey: ['businessProfile'],
    queryFn: () => apiClient.getBusinessProfile(),
  });
}

export function useSaveBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<BusinessProfileResponse, Error, BusinessProfileFormData>({
    mutationFn: (businessProfile: BusinessProfileFormData) =>
      apiClient.saveBusinessProfile(businessProfile),
    onSuccess: data => {
      queryClient.setQueryData(['businessProfile'], [data]);
    },
  });
}
