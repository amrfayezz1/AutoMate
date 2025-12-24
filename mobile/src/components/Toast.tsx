import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const toastConfig: Record<ToastType, { icon: keyof typeof Ionicons.glyphMap; colorKey: string }> = {
  success: { icon: 'checkmark-circle', colorKey: 'success' },
  error: { icon: 'close-circle', colorKey: 'critical' },
  warning: { icon: 'warning', colorKey: 'warning' },
  info: { icon: 'information-circle', colorKey: 'info' },
};

function ToastItem({ 
  toast, 
  onDismiss 
}: { 
  toast: Toast; 
  onDismiss: (id: string) => void;
}) {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const config = toastConfig[toast.type];
  const color = (theme as any)[config.colorKey] || theme.primary;

  React.useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      dismissToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss(toast.id);
    });
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderLeftColor: color,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Ionicons name={config.icon} size={24} color={color} />
      <Text style={[styles.toastMessage, { color: theme.textPrimary }]} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity onPress={dismissToast} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="close" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <View style={[styles.toastsWrapper, { top: insets.top + Spacing.md }]}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={hideToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// Convenience hooks
export function useSuccessToast() {
  const { showToast } = useToast();
  return (message: string) => showToast('success', message);
}

export function useErrorToast() {
  const { showToast } = useToast();
  return (message: string) => showToast('error', message);
}

const styles = StyleSheet.create({
  toastsWrapper: {
    position: 'absolute',
    left: Spacing.md,
    right: Spacing.md,
    zIndex: 9999,
    gap: Spacing.sm,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    gap: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  toastMessage: {
    flex: 1,
    fontSize: FontSizes.sm,
    lineHeight: 20,
  },
});
