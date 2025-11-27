import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/validations';
import type { BusinessProfileResponse } from '@/types/businessProfile';

export function useBusinessProfile() {
  return useQuery<BusinessProfileResponse | null>({
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
      queryClient.setQueryData(['businessProfile'], data);
    },
  });
}
