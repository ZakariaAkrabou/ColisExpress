import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

let inMemoryToken: string | null = null;

export const storage = {
  async setToken(token: string): Promise<void> {
    inMemoryToken = token;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('auth_token', token);
        }
      } else {
        await SecureStore.setItemAsync('auth_token', token);
      }
    } catch (e) {
      console.warn('Storage setToken warning:', e);
    }
  },

  async getToken(): Promise<string | null> {
    if (inMemoryToken) {
      return inMemoryToken;
    }
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const t = window.localStorage.getItem('auth_token');
          if (t) {
            inMemoryToken = t;
            return t;
          }
        }
      } else {
        const t = await SecureStore.getItemAsync('auth_token');
        if (t) {
          inMemoryToken = t;
          return t;
        }
      }
    } catch (e) {
      console.warn('Storage getToken warning:', e);
    }
    return inMemoryToken;
  },

  async removeToken(): Promise<void> {
    inMemoryToken = null;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem('auth_token');
          window.localStorage.removeItem('remember_me');
        }
      } else {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('remember_me');
      }
    } catch (e) {
      console.warn('Storage removeToken warning:', e);
    }
  },
};

