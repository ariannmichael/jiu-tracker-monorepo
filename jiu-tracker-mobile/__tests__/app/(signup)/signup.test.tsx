import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Signup from '@/app/(signup)/signup';

jest.mock('expo-router', () => ({
  ...jest.requireActual('expo-router'),
  useLocalSearchParams: () => ({ name: 'Test', email: 'test@test.com', password: 'secret' }),
  router: { replace: jest.fn() },
}));

jest.mock('@/services/signup.service', () => ({
  __esModule: true,
  default: {
    signup: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('Signup page', () => {
  it('renders title and step 1 content', () => {
    render(<Signup />);
    expect(screen.getByText('Jiu Tracker')).toBeTruthy();
    expect(screen.getByText('Where were you born?')).toBeTruthy();
  });

  it('renders country selector and submit button on step 1', () => {
    render(<Signup />);
    expect(screen.getByText('Brazil')).toBeTruthy();
    expect(screen.getByText(/I'M FROM/)).toBeTruthy();
  });
});
