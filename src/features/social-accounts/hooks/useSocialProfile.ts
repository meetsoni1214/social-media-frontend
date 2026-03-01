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
import type { UUID } from '@/types/uuid';

export function useCreateSocialProfile(businessProfileId: UUID | null) {
  const queryClient = useQueryClient();

  return useMutation<SocialProfileCreateResponse, Error>({
    mutationFn: () => socialProfileService.create(businessProfileId as UUID),
    onSuccess: data => {
      queryClient.setQueryData(['socialProfile', businessProfileId], data);
      queryClient.invalidateQueries({
        queryKey: ['socialProfileExists', businessProfileId],
      });
    },
  });
}

export function useSocialProfileExists(businessProfileId: UUID | null) {
  return useQuery<SocialProfileExistsResponse, Error>({
    queryKey: ['socialProfileExists', businessProfileId],
    queryFn: () => socialProfileService.checkExists(businessProfileId as UUID),
    enabled: !!businessProfileId,
  });
}

export function useConnectSocialProfile(request: SocialProfileConnectRequest) {
  return useQuery<SocialProfileConnectResponse, Error>({
    queryKey: [
      'socialProfileConnect',
      request.businessProfileId,
      request.platform,
    ],
    queryFn: () => socialProfileService.connect(request),
    enabled: !!request.platform && !!request.businessProfileId,
    staleTime: 0,
    gcTime: 0,
  });
}

export function useSocialAccountsStatus(businessProfileId: UUID | null) {
  return useQuery<SocialAccountsStatusResponse, Error>({
    queryKey: ['socialAccountsStatus', businessProfileId],
    queryFn: () => socialProfileService.getAccounts(businessProfileId as UUID),
    enabled: !!businessProfileId,
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['socialAccountsStatus', variables.businessProfileId],
      });
    },
  });
}
