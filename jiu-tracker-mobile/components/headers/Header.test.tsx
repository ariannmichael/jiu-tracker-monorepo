import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Header from './Header';
import { useUser } from '@/contexts/UserContext';

jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
  UserContextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    logout: jest.fn(),
    deleteAccount: jest.fn(),
    user: { id: '1', username: 'test', name: 'Test', email: 'test@test.com', avatar: '' },
  })),
}));

jest.mock('@/contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    language: "en",
    setLanguage: jest.fn(),
    t: (key: string) => key,
  })),
}));

const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('Header', () => {
  beforeEach(() => {
    mockUseUser.mockReturnValue({
      userData: {
        name: 'Test User',
        trainingTime: '2 years',
        profileImageUri: undefined,
        belt_color: 'Blue Belt',
        belt_stripe: 3,
      },
      updateUserData: jest.fn(),
      updateUserFull: jest.fn(),
      updateAvatar: jest.fn(),
      updateBelt: jest.fn(),
    });
  });

  it('renders user name', () => {
    render(<Header />);
    expect(screen.getByText('TEST USER')).toBeTruthy();
  });

  it('renders profile image when profileImageUri is set', () => {
    mockUseUser.mockReturnValue({
      userData: {
        name: 'Image User',
        trainingTime: '1 year',
        profileImageUri: 'https://example.com/avatar.png',
        belt_color: 'Blue Belt',
        belt_stripe: 0,
      },
      updateUserData: jest.fn(),
      updateUserFull: jest.fn(),
      updateAvatar: jest.fn(),
      updateBelt: jest.fn(),
    });
    render(<Header />);
    expect(screen.getByText('IMAGE USER')).toBeTruthy();
  });
});
