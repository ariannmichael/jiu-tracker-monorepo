import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import BottomNavigation from './BottomNavigation';

describe('BottomNavigation', () => {
  it('renders all nav items', () => {
    render(<BottomNavigation />);
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Logs')).toBeTruthy();
    expect(screen.getByText('Techniques')).toBeTruthy();
  });

  it('navigates when item is pressed', () => {
    const pushMock = jest.fn();
    jest.spyOn(require('expo-router'), 'useRouter').mockReturnValue({
      push: pushMock,
      replace: jest.fn(),
      back: jest.fn(),
    });
    const { getByText } = render(<BottomNavigation />);
    fireEvent.press(getByText('Logs'));
    expect(pushMock).toHaveBeenCalledWith('/(authenticated)/logs');
  });
});
