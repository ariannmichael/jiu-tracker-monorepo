import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TechniquesScreen from './techniques';

describe('TechniquesScreen page', () => {
  it('renders title and subtitle', () => {
    render(<TechniquesScreen />);
    expect(screen.getByText('Techniques')).toBeTruthy();
    expect(screen.getByText('All techniques will appear here')).toBeTruthy();
  });
});
