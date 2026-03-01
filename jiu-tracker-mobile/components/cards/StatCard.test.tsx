import React from 'react';
import { render, screen } from '@testing-library/react-native';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Sessions" value="12" />);
    expect(screen.getByText('Sessions')).toBeTruthy();
    expect(screen.getByText('12')).toBeTruthy();
  });

  it('renders with accent color purple', () => {
    render(<StatCard title="Total" value="5" accentColor="purple" />);
    expect(screen.getByText('Total')).toBeTruthy();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('renders with accent color orange', () => {
    render(<StatCard title="Hours" value="10h" accentColor="orange" />);
    expect(screen.getByText('Hours')).toBeTruthy();
    expect(screen.getByText('10h')).toBeTruthy();
  });

  it('renders with accent color teal', () => {
    render(<StatCard title="Days" value="7" accentColor="teal" />);
    expect(screen.getByText('Days')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
  });

  it('renders without accent bar when accentColor is none', () => {
    render(<StatCard title="Milestones" value="0" accentColor="none" />);
    expect(screen.getByText('Milestones')).toBeTruthy();
    expect(screen.getByText('0')).toBeTruthy();
  });

  it('accepts isLarge prop', () => {
    render(<StatCard title="Large" value="99" isLarge />);
    expect(screen.getByText('Large')).toBeTruthy();
    expect(screen.getByText('99')).toBeTruthy();
  });
});
