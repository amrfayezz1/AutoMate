import React from "react";
import { Text, View } from "react-native";

type BadgeStatus = "success" | "warning" | "error" | "info";

interface BadgeProps {
  status: BadgeStatus;
  label: string;
}

const statusStyles: Record<BadgeStatus, { bg: string; text: string }> = {
  success: { bg: "bg-emerald-500/20", text: "text-emerald-500" },
  warning: { bg: "bg-amber-500/20", text: "text-amber-500" },
  error: { bg: "bg-red-500/20", text: "text-red-500" },
  info: { bg: "bg-blue-500/20", text: "text-blue-500" },
};

export function Badge({ status, label }: BadgeProps) {
  const styles = statusStyles[status];
  return (
    <View className={`rounded px-2 py-1 ${styles.bg}`}>
      <Text className={`text-xs font-medium ${styles.text}`}>{label}</Text>
    </View>
  );
}
