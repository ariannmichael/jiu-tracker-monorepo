import Api from '@/services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface UserData {
  name: string;
  trainingTime: string;
  profileImageUri?: string;
  badges: number;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  refreshUserData: () => Promise<void>;
}

const defaultUserData: UserData = {
  name: "ARIANN MICHAEL FARIAS",
  trainingTime: "4 years",
  profileImageUri: "https://via.placeholder.com/150",
  badges: 2,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const { token } = useAuth();
  // Load user data on mount (e.g., from AsyncStorage or API)
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      if (!token) return;

      const response = await fetch(`${Api.BASE_URL}/user`, {
        headers: Api.authHeaders(token),
      });
      const data = await response.json();
      const user = data.user;
      if (user) {
        setUserData((prev) => ({
          ...prev,
          name: user.name ?? prev.name,
          profileImageUri: user.avatar ?? prev.profileImageUri,
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUserData = async (updateData: Partial<UserData>) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }


      const response = await fetch(`${Api.BASE_URL}/user`, {
        headers: Api.authHeaders(token),
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const refreshUserData = async () => {
    try {
      if (!token) return;
      await loadUserData();
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, refreshUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
}
