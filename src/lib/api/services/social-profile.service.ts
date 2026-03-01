import type {
  SocialProfileConnectRequest,
  SocialProfileConnectResponse,
  SocialProfileCreateResponse,
  SocialAccount,
  SocialAccountsStatusResponse,
  SocialProfileExistsResponse,
  SocialProfileDisconnectRequest,
} from '@/features/social-accounts/types/socialProfile';
import { httpClient } from '../core/http-client';
import type { UUID } from '@/types/uuid';

async function create(
  businessProfileId: UUID
): Promise<SocialProfileCreateResponse> {
  return httpClient.post<SocialProfileCreateResponse>('/social-profiles', {
    businessProfileId,
  });
}

async function checkExists(
  businessProfileId: UUID
): Promise<SocialProfileExistsResponse> {
  return httpClient.get<SocialProfileExistsResponse>(
    `/social-profiles/exists?business_profile_id=${businessProfileId}`
  );
}

async function connect(
  request: SocialProfileConnectRequest
): Promise<SocialProfileConnectResponse> {
  return httpClient.get<SocialProfileConnectResponse>(
    `/social-profiles/connect/${request.platform}?business_profile_id=${request.businessProfileId}`
  );
}

async function getAccounts(
  businessProfileId: UUID
): Promise<SocialAccountsStatusResponse> {
  const accounts = await httpClient.get<SocialAccount[]>(
    `/social-profiles/accounts?business_profile_id=${businessProfileId}`
  );

  const statusResponse: SocialAccountsStatusResponse = {
    facebook: { isConnected: false },
    instagram: { isConnected: false },
    googlebusiness: { isConnected: false },
  };

  accounts.forEach(account => {
    if (account.platform in statusResponse) {
      statusResponse[account.platform] = {
        isConnected: account.connected,
        accountId: account.fieldId,
        username: account.username,
        displayName: account.displayName,
        profileImageUrl: account.profileImageUrl,
      };
    }
  });

  return statusResponse;
}

async function disconnect(
  request: SocialProfileDisconnectRequest
): Promise<void> {
  return httpClient.delete<void>(
    `/social-profiles/disconnect/${request.platform}?business_profile_id=${request.businessProfileId}`
  );
}

export const socialProfileService = {
  create,
  checkExists,
  connect,
  getAccounts,
  disconnect,
};
