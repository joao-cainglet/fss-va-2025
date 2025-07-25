import {
  PublicClientApplication,
  EventType,
  type AuthenticationResult,
} from '@azure/msal-browser';
import { syncUserWithBackend } from './userSync';

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MSAL_CLIENT_ID,
    authority:
      'https://login.microsoftonline.com/' +
      import.meta.env.VITE_MSAL_TENANT_ID,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = new PublicClientApplication(msalConfig);

const accounts = msalInstance.getAllAccounts();
if (accounts.length > 0) {
  msalInstance.setActiveAccount(accounts[0]);
}

msalInstance.addEventCallback(async (event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;

    if (account) {
      msalInstance.setActiveAccount(account);
      const isSyncSuccessful = await syncUserWithBackend(account);
      if (!isSyncSuccessful) {
        msalInstance.logoutRedirect({
          postLogoutRedirectUri: '/',
        });
      }
    }
  }
});
