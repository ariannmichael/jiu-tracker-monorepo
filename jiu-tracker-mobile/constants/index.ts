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

// Design system — dark theme with gradients (glassmorphism, rounded cards)
export const COLORS = {
  // Backgrounds
  BACKGROUND: '#1C1A24',
  CARD: '#28262E',
  CARD_ELEVATED: '#2E2C36',
  WHITE: '#FFFFFF',
  // Grays
  GRAY_DARKER: '#221F28',
  GRAY_DARK: '#28252E',
  GRAY_MEDIUM: '#333333',
  GRAY_LIGHT: '#3D3D3D',
  GRAY_TEXT: '#8E8E93',
  GRAY_TEXT_SECONDARY: '#636366',
  // Surfaces & borders
  BORDER: 'rgba(255, 255, 255, 0.08)',
  GLASS: 'rgba(40, 40, 40, 0.85)',
  // Primary actions & accents
  BUTTON: '#6366F1',
  BUTTON_SECONDARY: '#3D3D3D',
  // Gradient accent colors (for progress, charts, highlights)
  ACCENT_PURPLE: '#A855F7',
  ACCENT_BLUE: '#3B82F6',
  ACCENT_TEAL: '#14B8A6',
  ACCENT_PINK: '#EC4899',
  ACCENT_ORANGE: '#F97316',
  ACCENT_YELLOW: '#EAB308',
  ACCENT_GREEN: '#22C55E',
  // Legacy / semantic
  YELLOW: '#F99214',
  PURPLE: '#9B59B6',
} as const;

// Gradient color arrays for LinearGradient (start → end)
export const GRADIENTS = {
  PRIMARY: ['#6366F1', '#A855F7'] as const,           // indigo → purple
  STREAK: ['#3B82F6', '#A855F7', '#F97316'] as const, // blue → purple → orange
  WARM: ['#F97316', '#EAB308'] as const,              // orange → yellow
  COOL: ['#14B8A6', '#3B82F6'] as const,              // teal → blue
  PINK_PURPLE: ['#EC4899', '#A855F7'] as const,
  GREEN_TEAL: ['#22C55E', '#14B8A6'] as const,
} as const;

// Layout
export const RADIUS = {
  SM: 8,
  MD: 12,
  LG: 16,
  XL: 20,
  ROUND: 9999,
} as const;
