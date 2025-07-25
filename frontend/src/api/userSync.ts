// src/api/userSync.ts
// src/api/userSync.ts
import type { AccountInfo } from '@azure/msal-browser';
import client from './client'; // Your Axios client

export const syncUserWithBackend = async (
  account: AccountInfo
): Promise<boolean> => {
  try {
    await client.post('/login');
    console.log('User synced successfully with backend.');
    return true;
  } catch (error) {
    console.error('Failed to sync user with backend:', error);
    return false;
  }
};
