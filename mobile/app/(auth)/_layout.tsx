import { Stack } from 'expo-router';
import { useTheme } from '@/lib/ThemeProvider';

export default function AuthLayout() {
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
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="phone-login" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="add-first-car" />
    </Stack>
  );
}

