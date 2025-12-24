import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { ThemeProvider, useTheme } from '@/lib/ThemeProvider';
import { ToastProvider } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import '@/locales/i18n';

function RootNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
        <Stack.Screen name="cars" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);
  const hydrate = useAppStore((state) => state.hydrate);

  useEffect(() => {
    // Initialize app state from storage
    hydrate();
    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <RootNavigator />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
