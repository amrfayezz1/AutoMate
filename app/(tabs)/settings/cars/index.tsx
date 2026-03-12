import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { EmptyState } from "../../../../components/ui/EmptyState";

export default function CarsIndexScreen() {
  return (
    <View className="flex-1 bg-slate-950">
      <View className="px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold text-slate-100">My Cars</Text>
      </View>
      <EmptyState
        icon={<Text className="text-5xl">🚗</Text>}
        title="No cars yet"
        description="Add a car to start tracking maintenance."
        actionLabel="Add Car"
        onAction={() => router.push("/(onboarding)/setup/step1")}
      />
    </View>
  );
}
