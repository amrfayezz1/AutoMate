import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, AlertCircle, Info, Trash2, type LucideIcon } from 'lucide-react-native';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const iconMap: Record<ToastType, LucideIcon> = {
  success: Trash2,
  error: AlertCircle,
  info: Info,
};

const typeStyles: Record<ToastType, string> = {
  success: 'bg-black/91 rounded-pill px-4 py-3',
  error: 'bg-danger-20 border border-danger rounded-card px-4 py-3',
  info: 'bg-brand-20 border border-brand rounded-card px-4 py-3',
};

const textStyles: Record<ToastType, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-brand',
};

export function Toast({ message, type = 'info', visible, onHide, duration = 3000 }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const insets = useSafeAreaInsets();
  const Icon = iconMap[type];

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.timing(translateY, { toValue: -100, duration: 220, useNativeDriver: true }).start(onHide);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Animated.View
      style={[{ transform: [{ translateY }], top: insets.top + 12 }]}
      className={`absolute left-4 right-4 z-50 flex-row items-center gap-1 ${typeStyles[type]}`}
    >
      <Icon size={16} strokeWidth={2.25} color={type === 'success' ? '#2EC4B6' : undefined} />
      <Text className={`text-sm font-medium font-sans ${textStyles[type]}`}>{message}</Text>
    </Animated.View>
  );
}
