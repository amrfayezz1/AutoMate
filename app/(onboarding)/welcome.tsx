import React from "react";
import { View, Text, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { Button } from "../../components/ui/Button";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-slate-950 px-4">
      {/* Illustration area */}
      <View className="flex-1 items-center justify-center">
        <View className="mb-8 h-40 w-40 items-center justify-center rounded-full bg-amber-400/10">
          <Text className="text-7xl">🚗</Text>
        </View>
        <Text className="mb-4 text-center text-3xl font-bold text-slate-100">
          Stay on top of{"\n"}your car's health
        </Text>
        <Text className="text-center text-base text-slate-400 leading-6 px-4">
          Never miss a service. AutoMate tracks every maintenance, reminds you
          before it's due, and keeps all your car docs in one place.
        </Text>
      </View>

      {/* CTA */}
      <View className="pb-12 gap-3">
        <Button onPress={() => router.push("/(onboarding)/setup/step1")}>
          Add Your First Car
        </Button>
        <Link href="/(tabs)" asChild>
          <Pressable className="items-center py-3">
            <Text className="text-sm text-slate-400">Skip for now</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
