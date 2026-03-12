import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function EditCarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-slate-950 px-4 pt-14">
      <Text className="text-2xl font-bold text-slate-100">Edit Car</Text>
      <Text className="mt-2 text-slate-400 text-sm">Car ID: {id}</Text>
    </View>
  );
}
