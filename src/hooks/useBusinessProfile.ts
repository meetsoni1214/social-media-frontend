import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { BusinessProfileFormData } from '@/lib/validations';
import type { BusinessProfileResponse } from '@/types/businessProfile';

export function useSaveBusinessProfile() {
  const queryClient = useQueryClient();

  return useMutation<BusinessProfileResponse, Error, BusinessProfileFormData>({
    mutationFn: (businessProfile: BusinessProfileFormData) =>
      apiClient.saveBusinessProfile(businessProfile),
    onSuccess: data => {
      // Optionally invalidate any business profile queries here
      // queryClient.invalidateQueries({ queryKey: ['business-profile'] });
    },
  });
}
