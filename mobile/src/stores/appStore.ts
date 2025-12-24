import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

// MMKV storage instance
const storage = new MMKV();

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'en' | 'ar';

interface AppState {
  // Theme
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  
  // App state
  isFirstLaunch: boolean;
  setFirstLaunch: (value: boolean) => void;
  
  // Initialize from storage
  hydrate: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Theme
  themeMode: 'dark',
  setThemeMode: (mode) => {
    storage.set('themeMode', mode);
    set({ themeMode: mode });
  },
  
  // Language
  language: 'en',
  isRTL: false,
  setLanguage: (lang) => {
    storage.set('language', lang);
    set({ language: lang, isRTL: lang === 'ar' });
  },
  
  // First launch
  isFirstLaunch: true,
  setFirstLaunch: (value) => {
    storage.set('isFirstLaunch', value);
    set({ isFirstLaunch: value });
  },
  
  // Hydrate from storage
  hydrate: () => {
    const themeMode = storage.getString('themeMode') as ThemeMode | undefined;
    const language = storage.getString('language') as Language | undefined;
    const isFirstLaunch = storage.getBoolean('isFirstLaunch');
    
    set({
      themeMode: themeMode || 'dark',
      language: language || 'en',
      isRTL: language === 'ar',
      isFirstLaunch: isFirstLaunch ?? true,
    });
  },
}));
