import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, Theme, getTheme } from './theme';
import { useAppStore } from '@/stores/appStore';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const { themeMode, setThemeMode } = useAppStore();

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const theme = useMemo(() => {
    return isDark ? DarkTheme : LightTheme;
  }, [isDark]);

  const toggleTheme = () => {
    setThemeMode(isDark ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Convenience hook for just the theme object
export function useColors(): Theme {
  const { theme } = useTheme();
  return theme;
}
