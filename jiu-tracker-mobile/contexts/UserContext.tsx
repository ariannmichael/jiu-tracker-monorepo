import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load user data on mount (e.g., from AsyncStorage or API)
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // TODO: Replace with actual API call or AsyncStorage retrieval
      // For now, using default data
      // const data = await fetchUserData();
      // setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prevData) => ({
      ...prevData,
      ...data,
    }));
  };

  const refreshUserData = async () => {
    try {
      // TODO: Replace with actual API call
      // const data = await fetchUserData();
      // setUserData(data);
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
