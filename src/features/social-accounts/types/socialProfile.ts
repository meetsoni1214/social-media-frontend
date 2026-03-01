import type { UUID } from '@/types/uuid';

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  GOOGLEBUSINESS = 'googlebusiness',
}

export interface SocialProfileConnectResponse {
  authorizationUrl: string;
}

export interface SocialProfileCreateResponse {
  profileId: string;
}

export interface SocialProfileExistsResponse {
  exists: boolean;
  profileId?: string;
}

export interface SocialProfileConnectRequest {
  businessProfileId: UUID;
  platform: SocialPlatform;
}

export interface SocialProfileDisconnectRequest {
  businessProfileId: UUID;
  platform: SocialPlatform;
}

export interface SocialAccount {
  fieldId: string;
  platform: SocialPlatform;
  connected: boolean;
  profileId: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialAccountStatus {
  isConnected: boolean;
  accountId?: string;
  username?: string;
  displayName?: string;
  profileImageUrl?: string;
}

export interface SocialAccountsStatusResponse {
  facebook: SocialAccountStatus;
  instagram: SocialAccountStatus;
  googlebusiness: SocialAccountStatus;
}
