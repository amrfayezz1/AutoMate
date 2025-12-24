import { Stack } from 'expo-router';
import { useTheme } from '@/lib/ThemeProvider';

export default function ExpensesRoutesLayout() {
  const { theme } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="add" />
    </Stack>
  );
}
