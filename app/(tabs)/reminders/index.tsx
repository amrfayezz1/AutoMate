import React from "react";
import { View, Text } from "react-native";
import { EmptyState } from "../../../components/ui/EmptyState";

export default function RemindersScreen() {
  return (
    <View className="flex-1 bg-slate-950">
      <View className="px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold text-slate-100">Reminders</Text>
      </View>
      <EmptyState
        icon={<Text className="text-5xl">🔔</Text>}
        title="No reminders set"
        description="Add a reminder to get notified before your next service is due."
      />
    </View>
  );
}
