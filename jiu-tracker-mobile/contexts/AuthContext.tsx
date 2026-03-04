import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Api from '@/services/api';
import { User } from '@jiu-tracker/shared';

const TOKEN_KEY = 'auth_token';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
      try {
        const storedToken = await getToken();
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          try {
            const res = await fetch(`${Api.BASE_URL}/user/me`, {
              headers: Api.authHeaders(storedToken),
            });
            if (res.ok) {
              const data = await res.json();
              setUser(data.user);
            }
          } catch (err) {
            console.error('Error fetching current user:', err);
          }
        }
      } catch (error) {
        console.error('Error restoring auth token:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${Api.BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    await saveToken(data.access_token);
    setToken(data.access_token);
    setIsAuthenticated(true);
    // Fetch full user (with belt_color, belt_stripe) from /user/me so UserContext has correct data
    try {
      const meRes = await fetch(`${Api.BASE_URL}/user/me`, {
        headers: Api.authHeaders(data.access_token),
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        setUser(meData.user);
      } else {
        setUser(data.user);
      }
    } catch {
      setUser(data.user);
    }
    queueMicrotask(() => router.replace('/(authenticated)/dashboard'));
  };

  const logout = async () => {
    await removeToken();
    setToken(null);
    setIsAuthenticated(false);
    router.replace('/');
  };

  const refreshUser = async (): Promise<User | null> => {
    const t = token ?? (await getToken());
    if (!t) return null;
    try {
      const res = await fetch(`${Api.BASE_URL}/user/me`, {
        headers: Api.authHeaders(t),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, isLoading, login, logout, refreshUser }}>
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
