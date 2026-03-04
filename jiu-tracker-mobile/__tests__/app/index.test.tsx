import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Index from '@/app/index';

jest.mock('@/components/screens/StartScreen', () => {
  const { Text } = require('react-native');
  return function MockStartScreen() {
    return <Text>StartScreen</Text>;
  };
});

describe('Index (app entry)', () => {
  it('renders StartScreen', () => {
    render(<Index />);
    expect(screen.getByText('StartScreen')).toBeTruthy();
  });
});
