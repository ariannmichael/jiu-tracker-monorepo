import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Dashboard from '@/app/(authenticated)/dashboard';

jest.mock('@/components/screens/DashboardScreen', () => {
  const { Text } = require('react-native');
  return function MockDashboardScreen() {
    return <Text>DashboardScreen</Text>;
  };
});

describe('Dashboard page', () => {
  it('renders DashboardScreen', () => {
    render(<Dashboard />);
    expect(screen.getByText('DashboardScreen')).toBeTruthy();
  });
});
