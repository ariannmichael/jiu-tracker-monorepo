import React from 'react';
import { render, screen } from '@testing-library/react-native';
import StreakCard from './StreakCard';

describe('StreakCard', () => {
  it('renders value and label', () => {
    render(<StreakCard value="7" label="day streak" />);
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('day streak')).toBeTruthy();
  });

  it('renders without milestone when not provided', () => {
    render(<StreakCard value="3" label="week streak" />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.queryByText(/Next milestone/)).toBeNull();
  });

  it('renders next milestone and progress when provided', () => {
    render(
      <StreakCard
        value="15"
        label="day streak"
        nextMilestone={30}
        progressPercent={50}
      />
    );
    expect(screen.getByText('15')).toBeTruthy();
    expect(screen.getByText('day streak')).toBeTruthy();
    expect(screen.getByText('Next milestone: 30')).toBeTruthy();
  });
});
