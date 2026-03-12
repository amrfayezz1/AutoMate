import React from "react";
import { View, Text } from "react-native";

export default function NotificationsScreen() {
  return (
    <View className="flex-1 bg-slate-950 px-4 pt-14">
      <Text className="text-2xl font-bold text-slate-100">Notifications</Text>
      <Text className="mt-4 text-slate-400 text-sm">
        Notification preferences coming in next phase.
      </Text>
    </View>
  );
}
