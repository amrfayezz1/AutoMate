import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function AuthLayout() {
  const { session, isLoading } = useAuthStore();

  // If already authenticated, redirect to tabs
  if (!isLoading && session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F172A" },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}
