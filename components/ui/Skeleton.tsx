import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  className?: string;
}

export function Skeleton({ width, height = 16, className }: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <Animated.View
      style={[{ opacity, height, width: width as number | string | undefined }]}
      className={`rounded-lg bg-slate-700 ${className ?? ""}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="rounded-xl border border-slate-600 bg-slate-800 p-4">
      <Skeleton height={18} className="mb-3 w-full" />
      <Skeleton height={14} width="70%" className="mb-2" />
      <Skeleton height={14} width="50%" />
    </View>
  );
}
