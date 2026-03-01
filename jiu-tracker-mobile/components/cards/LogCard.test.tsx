import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LogCard, { LogCardTechnique } from './LogCard';

const mockSubmitted: LogCardTechnique[] = [
  { id: '1', name: 'Armbar' },
  { id: '2', name: 'Armbar' },
  { id: '3', name: 'RNC' },
];
const mockTapped: LogCardTechnique[] = [
  { id: '4', name: 'Triangle' },
];

describe('LogCard', () => {
  it('renders date and duration', () => {
    render(
      <LogCard
        date="2025-03-01T00:00:00.000Z"
        durationMinutes={90}
        submitted={[]}
        tapped={[]}
      />
    );
    expect(screen.getByText(/2025\/\d{2}\/\d{2}/)).toBeTruthy();
    expect(screen.getByText('1h 30m')).toBeTruthy();
    expect(screen.getByText('Total Time')).toBeTruthy();
  });

  it('renders duration in minutes only when under 60', () => {
    render(
      <LogCard
        date="2025-03-01"
        durationMinutes={45}
        submitted={[]}
        tapped={[]}
      />
    );
    expect(screen.getByText('45m')).toBeTruthy();
  });

  it('renders Submitted and Tapped columns with techniques', () => {
    render(
      <LogCard
        date="2025-03-01"
        durationMinutes={60}
        submitted={mockSubmitted}
        tapped={mockTapped}
      />
    );
    expect(screen.getByText('Submitted')).toBeTruthy();
    expect(screen.getByText('Tapped')).toBeTruthy();
    expect(screen.getAllByText('Armbar').length).toBeGreaterThan(0);
    expect(screen.getByText('RNC')).toBeTruthy();
    expect(screen.getByText('Triangle')).toBeTruthy();
  });

  it('shows submission rate and metrics', () => {
    render(
      <LogCard
        date="2025-03-01"
        durationMinutes={60}
        submitted={mockSubmitted}
        tapped={mockTapped}
      />
    );
    expect(screen.getByText('Submission Rate')).toBeTruthy();
    expect(screen.getByText('Most Efficient')).toBeTruthy();
    expect(screen.getByText('Risk Area')).toBeTruthy();
  });

  it('shows empty state for no techniques', () => {
    render(
      <LogCard
        date="2025-03-01"
        durationMinutes={30}
        submitted={[]}
        tapped={[]}
      />
    );
    const emptyTags = screen.getAllByText('—');
    expect(emptyTags.length).toBeGreaterThanOrEqual(2);
  });
});
