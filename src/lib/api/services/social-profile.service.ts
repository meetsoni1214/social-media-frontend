import type {
  SocialProfileConnectRequest,
  SocialProfileConnectResponse,
  SocialProfileCreateResponse,
  SocialAccount,
  SocialAccountsStatusResponse,
  SocialProfileExistsResponse,
} from '@/features/social-accounts/types/socialProfile';
import { httpClient } from '../core/http-client';

async function create(): Promise<SocialProfileCreateResponse> {
  return httpClient.post<SocialProfileCreateResponse>('/social-profiles');
}

async function checkExists(): Promise<SocialProfileExistsResponse> {
  return httpClient.get<SocialProfileExistsResponse>('/social-profiles/exists');
}

async function connect(
  request: SocialProfileConnectRequest
): Promise<SocialProfileConnectResponse> {
  return httpClient.get<SocialProfileConnectResponse>(
    `/social-profiles/connect/${request.platform}`
  );
}

async function getAccounts(): Promise<SocialAccountsStatusResponse> {
  const accounts = await httpClient.get<SocialAccount[]>(
    '/social-profiles/accounts'
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

export const socialProfileService = {
  create,
  checkExists,
  connect,
  getAccounts,
};
