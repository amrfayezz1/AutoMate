import React from "react";
import { View, Text } from "react-native";
import { router } from "expo-router";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function MaintenanceIndexScreen() {
  return (
    <View className="flex-1 bg-slate-950">
      <View className="px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold text-slate-100">Maintenance</Text>
      </View>
      <EmptyState
        icon={<Text className="text-5xl">🔧</Text>}
        title="No maintenance records yet"
        description="Start logging your car's service history."
        actionLabel="Log Maintenance"
        onAction={() => router.push("/(tabs)/maintenance/add")}
      />
    </View>
  );
}
