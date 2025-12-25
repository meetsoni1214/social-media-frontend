export interface SocialProfileConnectResponse {
  authorizationUrl: string;
}

export interface SocialProfileCreateResponse {
  profileId: string;
}

export interface SocialProfileConnectRequest {
  platform: string;
}
