import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      {icon ? <View className="mb-4">{icon}</View> : null}
      <Text className="mb-2 text-center text-lg font-bold text-slate-100">
        {title}
      </Text>
      {description ? (
        <Text className="mb-6 text-center text-sm text-slate-400">
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          variant="primary"
          onPress={onAction}
          className="w-full max-w-xs"
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}
