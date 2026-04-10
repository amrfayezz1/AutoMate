import { useEffect, useRef } from 'react';
import { Animated, View, ViewProps } from 'react-native';

interface SkeletonProps extends ViewProps {
  width?: number | `${number}%`;
  height?: number;
  rounded?: boolean;
}

export function Skeleton({ width, height = 16, rounded = false, className = '', style, ...props }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={[{ opacity, width, height }, style]}
      className={`bg-slate-700 ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <View className="bg-surface rounded-2xl p-4 gap-3">
      <Skeleton width="60%" height={16} />
      <Skeleton width="100%" height={12} />
      <Skeleton width="80%" height={12} />
    </View>
  );
}
