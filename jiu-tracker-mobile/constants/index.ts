// Belt ranks and related data
export type BeltRank = 'White Belt' | 'Blue Belt' | 'Purple Belt' | 'Brown Belt' | 'Black Belt';

export const BELT_RANKS: BeltRank[] = ['White Belt', 'Blue Belt', 'Purple Belt', 'Brown Belt', 'Black Belt'];

export const BELT_RANK_VALUES: Record<BeltRank, number> = {
  'White Belt': 1, 
  'Blue Belt': 2, 
  'Purple Belt': 3, 
  'Brown Belt': 4, 
  'Black Belt': 5,
};

export const BELT_COLORS: Record<BeltRank, string> = {
  'White Belt': '#FFFFFF',
  'Blue Belt': '#0066CC',
  'Purple Belt': '#800080',
  'Brown Belt': '#8B4513',
  'Black Belt': '#000000',
};

// Countries
export const COUNTRIES = [
  'Brazil', 
  'United States', 
  'Canada', 
  'United Kingdom', 
  'Australia', 
  'Japan', 
  'Germany', 
  'France', 
  'Italy', 
  'Spain', 
  'Mexico', 
  'Argentina'
];

// Date-related constants
export const MONTHS = {
  'Jan': 1, 
  'Feb': 2, 
  'Mar': 3, 
  'Apr': 4, 
  'May': 5, 
  'Jun': 6, 
  'Jul': 7, 
  'Aug': 8, 
  'Sep': 9, 
  'Oct': 10, 
  'Nov': 11, 
  'Dec': 12,
};

export const MONTH_NAMES = Object.keys(MONTHS);

export const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

export const YEARS = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());

// Font families
export const FONTS = {
  ZEN_DOTS: 'ZenDots_400Regular',
  SUNFLOWER_LIGHT: 'Sunflower_300Light',
  SUNFLOWER_MEDIUM: 'Sunflower_500Medium',
  SUNFLOWER_BOLD: 'Sunflower_700Bold',
} as const;

// Colors
export const COLORS = {
  BACKGROUND: '#0D0D0E',
  WHITE: '#FFFFFF',
  GRAY_DARKER: '#1B1B1E',
  GRAY_DARK: '#1A1A1A',
  GRAY_MEDIUM: '#2A2A2A',
  GRAY_LIGHT: '#333333',
  GRAY_TEXT: '#666666',
  BUTTON: '#79787E',
  YELLOW: '#F99214',
  PURPLE: '#9B59B6',
} as const;
