import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TechniquesSelect from './TechniquesSelect';

const mockOptions = [
  { id: '1', name: 'Armbar' },
  { id: '2', name: 'Triangle' },
  { id: '3', name: 'RNC' },
];

describe('TechniquesSelect', () => {
  it('renders placeholder when nothing selected', () => {
    render(
      <TechniquesSelect
        options={mockOptions}
        selected={[]}
        onSelectionChange={jest.fn()}
      />
    );
    expect(screen.getByText('Select techniques')).toBeTruthy();
  });

  it('renders selected technique names as chips', () => {
    render(
      <TechniquesSelect
        options={mockOptions}
        selected={['1', '3']}
        onSelectionChange={jest.fn()}
      />
    );
    expect(screen.getByText('Armbar')).toBeTruthy();
    expect(screen.getByText('RNC')).toBeTruthy();
    expect(screen.queryByText('Triangle')).toBeNull();
  });

  it('opens dropdown and shows options when pressed', () => {
    render(
      <TechniquesSelect
        options={mockOptions}
        selected={[]}
        onSelectionChange={jest.fn()}
      />
    );
    const trigger = screen.getByText('Select techniques');
    fireEvent.press(trigger);
    expect(screen.getByPlaceholderText('Search techniques...')).toBeTruthy();
    expect(screen.getByText('Armbar')).toBeTruthy();
    expect(screen.getByText('Triangle')).toBeTruthy();
    expect(screen.getByText('RNC')).toBeTruthy();
  });

  it('calls onSelectionChange when option is toggled', () => {
    const onSelectionChange = jest.fn();
    render(
      <TechniquesSelect
        options={mockOptions}
        selected={[]}
        onSelectionChange={onSelectionChange}
      />
    );
    fireEvent.press(screen.getByText('Select techniques'));
    fireEvent.press(screen.getByText('Armbar'));
    expect(onSelectionChange).toHaveBeenCalledWith(['1']);
  });

  it('shows custom placeholder', () => {
    render(
      <TechniquesSelect
        options={mockOptions}
        selected={[]}
        onSelectionChange={jest.fn()}
        placeholder="Pick techniques"
      />
    );
    expect(screen.getByText('Pick techniques')).toBeTruthy();
  });
});
