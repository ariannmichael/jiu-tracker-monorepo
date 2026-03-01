import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PieChart from './PieChart';

const mockData = [
  { label: 'Submission', value: 10, color: '#EC4899' },
  { label: 'Sweep', value: 5, color: '#3B82F6' },
  { label: 'Guard', value: 8, color: '#A855F7' },
];

describe('PieChart', () => {
  it('renders all segment labels and percentages', () => {
    render(<PieChart data={mockData} />);
    expect(screen.getByText('Submission')).toBeTruthy();
    expect(screen.getByText('Sweep')).toBeTruthy();
    expect(screen.getByText('Guard')).toBeTruthy();
    expect(screen.getByText('43.5%')).toBeTruthy();
    expect(screen.getByText('21.7%')).toBeTruthy();
    expect(screen.getByText('34.8%')).toBeTruthy();
  });

  it('renders with empty data without throwing', () => {
    expect(() => render(<PieChart data={[]} />)).not.toThrow();
  });

  it('renders single segment', () => {
    render(<PieChart data={[{ label: 'Only', value: 100, color: '#fff' }]} />);
    expect(screen.getByText('Only')).toBeTruthy();
    expect(screen.getByText('100.0%')).toBeTruthy();
  });
});
