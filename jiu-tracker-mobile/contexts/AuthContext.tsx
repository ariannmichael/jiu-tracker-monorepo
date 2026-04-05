import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Api from '@/services/api';
import AccountService from '@/services/account.service';
import { createLogger, serializeError } from '@/services/logger';
import { User } from '@jiu-tracker/shared';

const TOKEN_KEY = 'auth_token';
const authLogger = createLogger('auth-context');

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Token storage helpers that work on both web and native
async function saveToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  }
}

async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore token and user on app start
  useEffect(() => {
    (async () => {
      authLogger.debug('Restoring authentication state');
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          authLogger.info('Auth token restored from storage');
          try {
            const res = await Api.request('/user/me', {
              headers: Api.authHeaders(storedToken),
            }, {
              operation: 'auth.restoreCurrentUser',
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
              authLogger.info(
                { userId: data.user?.id },
                'Restored authenticated user',
              );
            }
          } catch (err) {
            authLogger.warn(
              { err: serializeError(err) },
              'Unable to restore current user profile',
            );
          }
        } else {
          authLogger.debug('No stored auth token found');
        }
      } catch (error) {
        authLogger.error(
          { err: serializeError(error) },
          'Failed to restore auth token',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    authLogger.info('Submitting login request');

    const response = await Api.request('/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }, {
      operation: 'auth.login',
    });

    if (!response.ok) {
      const error = await response.json();
      authLogger.warn(
        { status: response.status },
        'Login request was rejected',
      );
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    await saveToken(data.access_token);
    setToken(data.access_token);
    setIsAuthenticated(true);
    // Fetch full user (with belt_color, belt_stripe) from /user/me so UserContext has correct data
    try {
      const meRes = await Api.request('/user/me', {
        headers: Api.authHeaders(data.access_token),
      }, {
        operation: 'auth.fetchCurrentUserAfterLogin',
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
        authLogger.info(
          { userId: meData.user?.id },
          'User login succeeded',
        );
      } else {
        setUser(data.user);
        authLogger.info(
          { userId: data.user?.id, status: meRes.status },
          'User login succeeded with fallback profile payload',
        );
      }
    } catch (error) {
      setUser(data.user);
      authLogger.warn(
        { err: serializeError(error), userId: data.user?.id },
        'User login succeeded but profile refresh failed',
      );
    }
    queueMicrotask(() => router.replace('/(authenticated)/dashboard'));
  };

  const logout = async () => {
    await removeToken();
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    authLogger.info('User logged out');
    router.replace('/');
  };

  const deleteAccount = async () => {
    const t = token ?? (await getToken());
    if (!t) {
      throw new Error('Not signed in');
    }
    await AccountService.deleteAccount(t);
    await removeToken();
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
    authLogger.info('User account deleted');
    router.replace('/');
  };

  const refreshUser = async (): Promise<User | null> => {
    const t = token ?? (await getToken());
    if (!t) return null;
    try {
      const res = await Api.request('/user/me', {
        headers: Api.authHeaders(t),
      }, {
        operation: 'auth.refreshUser',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        authLogger.debug(
          { userId: data.user?.id },
          'User profile refreshed',
        );
        return data.user;
      }
    } catch (err) {
      authLogger.error(
        { err: serializeError(err) },
        'Failed to refresh authenticated user',
      );
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        isLoading,
        login,
        logout,
        deleteAccount,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
