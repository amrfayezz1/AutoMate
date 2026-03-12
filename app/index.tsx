import React, { useEffect } from "react";
import { View, Text, Animated } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../stores/authStore";

export default function SplashScreen() {
  const pulse = new Animated.Value(1);
  const { session, isLoading } = useAuthStore();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (session) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [session, isLoading]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-950">
      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Text className="text-7xl">🚗</Text>
      </Animated.View>
      <Text className="mt-6 text-2xl font-bold text-slate-100">AutoMate</Text>
      <Text className="mt-2 text-sm text-slate-400">
        Your car's health tracker
      </Text>

      {/* Version */}
      <Text className="absolute bottom-10 text-xs text-slate-600">v1.0.0</Text>
    </View>
  );
}
