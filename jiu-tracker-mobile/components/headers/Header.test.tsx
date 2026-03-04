import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Header from './Header';
import { useUser } from '@/contexts/UserContext';

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
  UserContextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({ logout: jest.fn() })),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('Header', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      userData: {
        name: 'Test User',
        trainingTime: '2 years',
        profileImageUri: undefined,
        badges: 3,
      },
      updateUserData: jest.fn(),
      updateAvatar: jest.fn(),
      refreshUserData: jest.fn(),
    });
  });

  it('renders user name and training time', () => {
    render(<Header />);
    expect(screen.getByText('TEST USER')).toBeTruthy();
    expect(screen.getByText('Training Time: 2 years')).toBeTruthy();
  });

  it('renders profile image when profileImageUri is set', () => {
    mockUseUser.mockReturnValue({
      userData: {
        name: 'Image User',
        trainingTime: '1 year',
        profileImageUri: 'https://example.com/avatar.png',
        badges: 0,
      },
      updateUserData: jest.fn(),
      updateAvatar: jest.fn(),
      refreshUserData: jest.fn(),
    });
    render(<Header />);
    expect(screen.getByText('IMAGE USER')).toBeTruthy();
  });
});
