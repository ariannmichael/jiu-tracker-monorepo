import React from 'react';
import { render, screen } from '@testing-library/react-native';
import DashboardScreen from './DashboardScreen';
import { useAnalytics } from '@/contexts/AnalyticsContext';

jest.mock('@/contexts/AnalyticsContext', () => ({
  useAnalytics: jest.fn(),
}));

const mockUseAnalytics = useAnalytics as jest.MockedFunction<typeof useAnalytics>;

describe('DashboardScreen', () => {
  beforeEach(() => {
    mockUseAnalytics.mockReturnValue({
      analytics: {
        current_streak: 5,
        total_sessions: 10,
        total_minutes: 600,
        days_trained: 8,
        max_minutes_in_one_day: 120,
        open_mat_sessions: 2,
        unique_techniques_count: 12,
        category_breakdown: { Submission: 5, Guard: 3, Sweep: 2 },
      },
      refreshAnalytics: jest.fn(),
      loading: false,
      error: null,
    });
  });

  it('renders streak card with current streak', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('5')).toBeTruthy();
    expect(screen.getByText('day streak')).toBeTruthy();
  });

  it('renders stat cards for sessions and total hours', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Sessions')).toBeTruthy();
    expect(screen.getByText('10')).toBeTruthy();
    expect(screen.getByText('Total Hours')).toBeTruthy();
    expect(screen.getByText('10h')).toBeTruthy();
  });

  it('renders technique breakdown section', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Technique breakdown by category')).toBeTruthy();
  });

  it('shows loading state when loading and no analytics', () => {
    mockUseAnalytics.mockReturnValue({
      analytics: null,
      refreshAnalytics: jest.fn(),
      loading: true,
      error: null,
    });
    render(<DashboardScreen />);
    expect(screen.queryByText('Sessions')).toBeNull();
  });

  it('shows error message when error is set', () => {
    mockUseAnalytics.mockReturnValue({
      analytics: null,
      refreshAnalytics: jest.fn(),
      loading: false,
      error: 'Failed to load',
    });
    render(<DashboardScreen />);
    expect(screen.getByText('Failed to load')).toBeTruthy();
  });
});
