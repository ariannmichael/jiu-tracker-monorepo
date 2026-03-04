import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LogsScreen from '@/app/(authenticated)/logs';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'user-1' },
    token: 'mock-token',
  }),
}));

jest.mock('@/services/techniques.service', () => ({
  __esModule: true,
  default: {
    getTechniquesList: jest.fn().mockResolvedValue({ techniques: [] }),
  },
}));

jest.mock('@/services/training.service', () => ({
  __esModule: true,
  default: {
    getTrainings: jest.fn().mockResolvedValue({ trainings: [], total: 0 }),
    createTraining: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('@react-native-community/datetimepicker', () => ({
  __esModule: true,
  default: () => null,
}));

describe('LogsScreen page', () => {
  it('renders title and add log button', async () => {
    render(<LogsScreen />);
    await waitFor(() => {
      expect(screen.getByText('Training Logs')).toBeTruthy();
    });
    expect(screen.getByText('+ ADD LOG')).toBeTruthy();
  });

  it('opens add log modal when add button is pressed', async () => {
    render(<LogsScreen />);
    await waitFor(() => {
      expect(screen.getByText('+ ADD LOG')).toBeTruthy();
    });
    fireEvent.press(screen.getByText('+ ADD LOG'));
    expect(screen.getByText('NEW LOG')).toBeTruthy();
  });
});
