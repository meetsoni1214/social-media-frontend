import { apiClient } from '@/lib/api';
import {
  SocialProfileConnectRequest,
  SocialProfileConnectResponse,
  SocialProfileCreateResponse,
} from '@/types/socialProfile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateSocialProfile() {
  const queryClient = useQueryClient();

  return useMutation<SocialProfileCreateResponse, Error>({
    mutationFn: () => apiClient.createSocialProfile(),
    onSuccess: data => {
      queryClient.setQueryData(['socialProfile'], data);
    },
  });
}

export function useConnectSocialProfile(request: SocialProfileConnectRequest) {
  return useQuery<SocialProfileConnectResponse, Error>({
    queryKey: ['socialProfileConnect', request],
    queryFn: () => apiClient.connectSocialProfile(request),
  });
}
