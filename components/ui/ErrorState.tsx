import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this content. Check your connection and try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="mb-2 text-center text-lg font-bold text-slate-100">
        {title}
      </Text>
      <Text className="mb-6 text-center text-sm text-slate-400">
        {description}
      </Text>
      {onRetry ? (
        <Button
          variant="secondary"
          onPress={onRetry}
          className="w-full max-w-xs"
        >
          Try Again
        </Button>
      ) : null}
    </View>
  );
}
