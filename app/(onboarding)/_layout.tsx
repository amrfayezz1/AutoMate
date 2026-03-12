import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "../../stores/authStore";

export default function OnboardingLayout() {
  const { session, isLoading } = useAuthStore();

  // Must be authenticated to view onboarding
  if (!isLoading && !session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0F172A" },
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="setup/step1" />
      <Stack.Screen name="setup/step2" />
    </Stack>
  );
}
