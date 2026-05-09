import { Redirect } from "expo-router";

import { SplashScreen } from "@/components/auth/SplashScreen";
import { useAuthStore } from "@/lib/stores/authStore";

export default function Index() {
  const status = useAuthStore((s) => s.status);

  if (status === "loading") return <SplashScreen />;
  if (status === "authenticated") return <Redirect href="/(tabs)/" />;
  return <Redirect href="/(auth)/welcome" />;
}
