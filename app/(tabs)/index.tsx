import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "../../stores/authStore";
import { useCarStore } from "../../stores/carStore";
import { EmptyState } from "../../components/ui/EmptyState";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const { activeCarId } = useCarStore();

  if (!activeCarId) {
    return (
      <View className="flex-1 bg-slate-950">
        <View className="px-4 pt-14 pb-4">
          <Text className="text-2xl font-bold text-slate-100">Home</Text>
        </View>
        <EmptyState
          icon={<Text className="text-5xl">🚗</Text>}
          title="No car added yet"
          description="Add your car to start tracking maintenance and get reminders."
          actionLabel="Add Your Car"
          onAction={() => router.push("/(onboarding)/welcome")}
        />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-950"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View className="px-4 pt-14 pb-4 flex-row items-center justify-between">
        <Text className="text-2xl font-bold text-slate-100">Home</Text>
        <Pressable onPress={() => {}}>
          <Text className="text-sm text-amber-400">Switch Car</Text>
        </Pressable>
      </View>

      {/* Placeholder: Full home dashboard is in the next phase */}
      <View className="px-4 py-8 items-center">
        <Text className="text-slate-400 text-sm text-center">
          Home dashboard coming soon.{"\n"}Maintenance tracking, reminders, and
          more.
        </Text>
      </View>
    </ScrollView>
  );
}
