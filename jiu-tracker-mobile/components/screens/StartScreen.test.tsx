import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import StartScreen from './StartScreen';
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  router: { replace: jest.fn() },
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('StartScreen', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      deleteAccount: jest.fn(),
      refreshUser: jest.fn(),
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  });

  it('renders title and login/signup buttons', () => {
    render(<StartScreen />);
    expect(screen.getByText('Jiu Tracker')).toBeTruthy();
    expect(screen.getByText('LOGIN')).toBeTruthy();
    expect(screen.getByText('SIGN UP')).toBeTruthy();
  });

  it('shows input fields after pressing LOGIN', () => {
    render(<StartScreen />);
    fireEvent.press(screen.getByText('LOGIN'));
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows name and confirm password when SIGN UP is pressed', () => {
    render(<StartScreen />);
    fireEvent.press(screen.getByText('SIGN UP'));
    expect(screen.getByPlaceholderText('Name')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeTruthy();
  });

  it('renders footer', () => {
    render(<StartScreen />);
    expect(screen.getByText('402 Software')).toBeTruthy();
  });
});
