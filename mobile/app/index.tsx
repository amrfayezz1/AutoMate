import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing } from '@/lib/theme';

const { width } = Dimensions.get('window');

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const isFirstLaunch = useAppStore((state) => state.isFirstLaunch);
  const { theme } = useTheme();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Show branding while checking auth state or initializing
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.primary }]}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: 'center',
          }}
        >
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <ActivityIndicator 
            size="large" 
            color="#FFFFFF" 
            style={styles.loader}
          />
        </Animated.View>
      </View>
    );
  }

  // First time user → Onboarding
  if (isFirstLaunch) {
    return <Redirect href="/(onboarding)" />;
  }

  // Not authenticated → Auth screens (login options)
  if (!isAuthenticated) {
    return <Redirect href={'/(auth)/index' as any} />;
  }

  // Authenticated → Main app
  return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.08, // Matching the rounded corners of the generated icon
    marginBottom: Spacing.xl,
  },
  loader: {
    marginTop: Spacing.lg,
  },
});
