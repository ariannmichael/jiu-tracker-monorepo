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
  updateAvatar: (avatarUri: string) => Promise<void>;
}

const defaultUserData: UserData = {
  name: "Mica Micão",
  trainingTime: "4 years",
  profileImageUri: "https://via.placeholder.com/150",
  badges: 2,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) return;
    if (!user) {
      setUserData(defaultUserData);
      return;
    }
    setUserData({
      name: user.username ?? user.name ?? defaultUserData.name,
      profileImageUri: user.avatar ?? defaultUserData.profileImageUri,
      trainingTime: defaultUserData.trainingTime,
      badges: defaultUserData.badges,
    });
  }, [token, user]);

  const updateUserData = async (updateData: Partial<UserData>) => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      if (!user) {
        throw new Error('No user found');
      }

      const response = await fetch(`${Api.BASE_URL}/user/${user.id}`, {
        headers: Api.authHeaders(token),
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      const u = data.user;
      if (u) {
        setUserData((prev) => ({
          ...prev,
          name: u.username ?? u.name ?? prev.name,
          profileImageUri: u.avatar ?? prev.profileImageUri,
        }));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const updateAvatar = async (avatarUri: string) => {
    try {
      if (!token) throw new Error('No token found');
      if (!user) throw new Error('No user found');

      const response = await fetch(`${Api.BASE_URL}/user/${user.id}/avatar`, {
        headers: Api.authHeaders(token),
        method: 'PATCH',
        body: JSON.stringify({ avatar: avatarUri }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `Upload failed: ${response.status}`);
      }
      const data = await response.json();
      const u = data.user;
      if (u?.avatar != null) {
        setUserData((prev) => ({ ...prev, profileImageUri: u.avatar }));
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, updateAvatar }}>
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
