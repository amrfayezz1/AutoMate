import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const typeStyles: Record<ToastType, string> = {
  success: 'bg-green-800 border-green-600',
  error: 'bg-red-900 border-red-700',
  info: 'bg-slate-700 border-slate-600',
};

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, { toValue: -100, duration: 300, useNativeDriver: true }).start(onHide);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Animated.View
      style={[{ transform: [{ translateY }], top: insets.top + 12 }]}
      className={`absolute left-4 right-4 z-50 border rounded-xl px-4 py-3 ${typeStyles[type]}`}
    >
      <Text className="text-white text-sm font-medium">{message}</Text>
    </Animated.View>
  );
}
