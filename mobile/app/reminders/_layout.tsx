import { Stack } from 'expo-router';
import { useTheme } from '@/lib/ThemeProvider';

export default function RemindersRoutesLayout() {
  const { theme } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="add" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
