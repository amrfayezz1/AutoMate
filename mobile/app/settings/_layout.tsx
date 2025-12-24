import { Stack } from 'expo-router';
import { useTheme } from '@/lib/ThemeProvider';

export default function SettingsRoutesLayout() {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="profile" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="support" />
      <Stack.Screen name="delete-account" />
    </Stack>
  );
}

