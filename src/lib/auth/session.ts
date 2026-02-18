import Session from 'supertokens-web-js/recipe/session';

export async function signOut(): Promise<void> {
  await Session.signOut();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
