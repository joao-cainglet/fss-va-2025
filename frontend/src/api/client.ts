import axios from 'axios';
import { msalInstance } from './msalConfig';
import type { SilentRequest } from '@azure/msal-browser';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  async (config) => {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      throw new Error('No active account! Please log in.');
    }
    const idToken = account.idToken;
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      msalInstance.logoutRedirect({
        postLogoutRedirectUri: '/',
      });
      sessionStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default client;
