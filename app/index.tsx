import { Redirect } from 'expo-router';

// Root index redirects to auth — auth gate in Phase 1 will handle session check
export default function Index() {
  return <Redirect href="/(auth)/login" />;
}
