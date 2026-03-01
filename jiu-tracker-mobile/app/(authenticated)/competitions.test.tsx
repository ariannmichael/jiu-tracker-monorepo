import React from 'react';
import { render, screen } from '@testing-library/react-native';
import CompetitionsScreen from './competitions';

describe('CompetitionsScreen page', () => {
  it('renders title and subtitle', () => {
    render(<CompetitionsScreen />);
    expect(screen.getByText('Competitions')).toBeTruthy();
    expect(screen.getByText('Your competition history will appear here')).toBeTruthy();
  });
});
