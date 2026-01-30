import { socialProfileService } from '@/lib/api';
import {
  SocialProfileConnectRequest,
  SocialProfileConnectResponse,
  SocialProfileCreateResponse,
  SocialAccountsStatusResponse,
  SocialProfileExistsResponse,
  SocialProfileDisconnectRequest,
} from '@/features/social-accounts/types/socialProfile';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCreateSocialProfile() {
  const queryClient = useQueryClient();

  return useMutation<SocialProfileCreateResponse, Error>({
    mutationFn: () => socialProfileService.create(),
    onSuccess: data => {
      queryClient.setQueryData(['socialProfile'], data);
      queryClient.invalidateQueries({ queryKey: ['socialProfileExists'] });
    },
  });
}

export function useSocialProfileExists() {
  return useQuery<SocialProfileExistsResponse, Error>({
    queryKey: ['socialProfileExists'],
    queryFn: () => socialProfileService.checkExists(),
  });
}

export function useConnectSocialProfile(request: SocialProfileConnectRequest) {
  return useQuery<SocialProfileConnectResponse, Error>({
    queryKey: ['socialProfileConnect', request.platform],
    queryFn: () => socialProfileService.connect(request),
    enabled: !!request.platform,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSocialAccountsStatus() {
  return useQuery<SocialAccountsStatusResponse, Error>({
    queryKey: ['socialAccountsStatus'],
    queryFn: () => socialProfileService.getAccounts(),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
}

export function useDisconnectSocialProfile() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SocialProfileDisconnectRequest>({
    mutationFn: request => socialProfileService.disconnect(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['socialAccountsStatus'] });
    },
  });
}
