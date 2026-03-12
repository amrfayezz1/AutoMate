import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

type ToastType = "success" | "error" | "info";

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onHide: () => void;
}

const typeStyles: Record<ToastType, { bg: string; text: string }> = {
  success: { bg: "bg-emerald-500", text: "text-white" },
  error: { bg: "bg-red-500", text: "text-white" },
  info: { bg: "bg-blue-500", text: "text-white" },
};

export function Toast({
  visible,
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  const styles = typeStyles[type];

  return (
    <Animated.View
      style={{ opacity }}
      className={`absolute bottom-24 left-4 right-4 z-50 rounded-lg px-4 py-3 ${styles.bg}`}
    >
      <Text className={`text-sm font-medium ${styles.text}`}>{message}</Text>
    </Animated.View>
  );
}
