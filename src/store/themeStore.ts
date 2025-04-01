import create from 'zustand';

type ThemeType = 'forest' | 'sea' | 'warm';

interface ThemeState {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'forest',
  setTheme: (theme) => set({ theme }),
}));