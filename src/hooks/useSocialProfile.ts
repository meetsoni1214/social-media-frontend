import { apiClient } from '@/lib/api';
import {
  SocialProfileConnectRequest,
  SocialProfileConnectResponse,
  SocialProfileCreateResponse,
  SocialAccountsStatusResponse,
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

export function useSocialAccountsStatus() {
  return useQuery<SocialAccountsStatusResponse, Error>({
    queryKey: ['socialAccountsStatus'],
    queryFn: () => apiClient.getSocialAccounts(),
    staleTime: 30000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}
