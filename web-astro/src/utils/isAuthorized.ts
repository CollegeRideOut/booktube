import { trpc, createAuthTrpc } from './trpc';

export async function isAuthorized() {
  const val = window.localStorage.getItem('token');
  if (val === null) {
    return false;
  }
  try {
    const verfied = await createAuthTrpc()!.auth.authorizedClient.query();
    return verfied;
  } catch (error) {
    return false;
  }
}
