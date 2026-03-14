import Api from '@/services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createLogger, serializeError } from '@/services/logger';
import { useAuth } from './AuthContext';

export interface UserData {
  name: string;
  trainingTime: string;
  profileImageUri?: string;
  belt_color?: string;
  belt_stripe?: number;
}

export interface UpdateUserFullDto {
  name: string;
  username: string;
  email: string;
  password?: string;
  belt_color: string;
  belt_stripe: number;
}

export interface UpdateBeltDto {
  belt_color: string;
  belt_stripe: number;
}

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  updateUserFull: (dto: UpdateUserFullDto) => Promise<void>;
  updateAvatar: (avatarUri: string) => Promise<void>;
  updateBelt: (dto: UpdateBeltDto) => Promise<void>;
}

const defaultUserData: UserData = {
  name: "Mica Micão",
  trainingTime: "4 years",
  profileImageUri: "https://via.placeholder.com/150",
  belt_color: "Brown Belt",
  belt_stripe: 4,
};

const UserContext = createContext<UserContextType | undefined>(undefined);
const userLogger = createLogger('user-context');

export function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const { token, user, refreshUser } = useAuth();

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
      belt_stripe: user.belt_stripe ?? defaultUserData.belt_stripe,
      belt_color: user.belt_color ?? defaultUserData.belt_color,
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

      const response = await Api.request(`/user/${user.id}`, {
        headers: Api.authHeaders(token),
        method: 'PUT',
        body: JSON.stringify(updateData),
      }, {
        operation: 'user.updatePartial',
      });
      const data = await response.json();
      const u = data.user;
      if (u) {
        setUserData((prev) => ({
          ...prev,
          name: u.username ?? u.name ?? prev.name,
          profileImageUri: u.avatar ?? prev.profileImageUri,
          belt_stripe: u.belt_stripe ?? prev.belt_stripe,
          belt_color: u.belt_color ?? prev.belt_color,
        }));
        userLogger.info(
          { userId: user.id },
          'User profile data updated',
        );
      }
    } catch (error) {
      userLogger.error(
        { err: serializeError(error), userId: user?.id },
        'Failed to update user profile data',
      );
    }
  };

  const updateUserFull = async (dto: UpdateUserFullDto) => {
    try {
      if (!token) throw new Error('No token found');
      if (!user) throw new Error('No user found');
      const response = await Api.request(`/user/${user.id}`, {
        headers: Api.authHeaders(token),
        method: 'PUT',
        body: JSON.stringify(dto),
      }, {
        operation: 'user.updateFull',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `Update failed: ${response.status}`);
      }
      const updatedUser = await refreshUser();
      if (updatedUser) {
        setUserData((prev) => ({
          ...prev,
          name: updatedUser.username ?? updatedUser.name ?? prev.name,
          profileImageUri: updatedUser.avatar ?? prev.profileImageUri,
          belt_color: updatedUser.belt_color ?? prev.belt_color,
          belt_stripe: Number(updatedUser.belt_stripe ?? prev.belt_stripe),
        }));
      } else {
        setUserData((prev) => ({
          ...prev,
          name: dto.name,
          belt_color: dto.belt_color,
          belt_stripe: dto.belt_stripe,
        }));
      }
      userLogger.info(
        { userId: user.id },
        'User profile updated successfully',
      );
    } catch (error) {
      userLogger.error(
        { err: serializeError(error), userId: user?.id },
        'Failed to update user profile',
      );
      throw error;
    }
  };

  const updateAvatar = async (avatarUri: string) => {
    try {
      if (!token) throw new Error('No token found');
      if (!user) throw new Error('No user found');

      const response = await Api.request(`/user/${user.id}/avatar`, {
        headers: Api.authHeaders(token),
        method: 'PATCH',
        body: JSON.stringify({ avatar: avatarUri }),
      }, {
        operation: 'user.updateAvatar',
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
      userLogger.info(
        { userId: user.id },
        'User avatar updated successfully',
      );
    } catch (error) {
      userLogger.error(
        { err: serializeError(error), userId: user?.id },
        'Failed to update user avatar',
      );
      throw error;
    }
  };

  const updateBelt = async (dto: UpdateBeltDto) => {
    try {
      if (!token) throw new Error('No token found');
      if (!user) throw new Error('No user found');
      const response = await Api.request(`/user/${user.id}/belt`, {
        headers: Api.authHeaders(token),
        method: 'PUT',
        body: JSON.stringify({
          userId: user.id,
          color: dto.belt_color,
          stripes: dto.belt_stripe,
        }),
      }, {
        operation: 'user.updateBelt',
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error ?? `Update failed: ${response.status}`);
      }
      const updatedUser = await refreshUser();
      if (updatedUser) {
        setUserData((prev) => ({ ...prev, belt_color: updatedUser.belt_color, belt_stripe: updatedUser.belt_stripe }));
      }
      userLogger.info(
        { userId: user.id, beltColor: dto.belt_color, beltStripe: dto.belt_stripe },
        'User belt updated successfully',
      );
    } catch (error) {
      userLogger.error(
        { err: serializeError(error), userId: user?.id },
        'Failed to update user belt',
      );
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, updateUserFull, updateAvatar, updateBelt }}>
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
