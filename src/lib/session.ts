import Session from 'supertokens-web-js/recipe/session';

export async function isUserAuthenticated(): Promise<boolean> {
  return await Session.doesSessionExist();
}

export async function signOut(): Promise<void> {
  await Session.signOut();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export async function getUserId(): Promise<string | undefined> {
  if (await Session.doesSessionExist()) {
    const userId = await Session.getUserId();
    return userId;
  }
  return undefined;
}

export async function getAccessToken(): Promise<string | undefined> {
  if (await Session.doesSessionExist()) {
    const accessToken = await Session.getAccessTokenPayloadSecurely();
    return JSON.stringify(accessToken);
  }
  return undefined;
}

export async function getAccessTokenPayload(): Promise<
  Record<string, unknown> | undefined
> {
  if (await Session.doesSessionExist()) {
    return await Session.getAccessTokenPayloadSecurely();
  }
  return undefined;
}

export async function refreshSession(): Promise<boolean> {
  try {
    if (await Session.doesSessionExist()) {
      await Session.attemptRefreshingSession();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
