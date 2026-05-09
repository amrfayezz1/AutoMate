import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapHeight?: number;
}

export function BottomSheet({ visible, onClose, title, children, snapHeight = SCREEN_HEIGHT * 0.5 }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(snapHeight)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      // iOS sheet slide-up: 220ms, design system easing
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: snapHeight,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, snapHeight, translateY]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        {/* Modal scrim: rgba(0,0,0,0.5) per design system */}
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />
        <Animated.View
          style={[{ transform: [{ translateY }], height: snapHeight }]}
          className="absolute bottom-0 left-0 right-0 bg-surface-3 rounded-t-sheet"
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-pill bg-surface-4" />
          </View>

          {title && (
            <View className="flex-row items-center justify-between px-5 py-3 border-b border-surface-4">
              <Text className="text-fg-1 text-lg font-medium font-sans">{title}</Text>
              <Pressable onPress={onClose} className="p-1 active:opacity-95">
                <Text className="text-fg-2 text-base">✕</Text>
              </Pressable>
            </View>
          )}

          <View style={{ paddingBottom: insets.bottom }} className="flex-1">
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
