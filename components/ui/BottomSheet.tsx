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
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: snapHeight,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, snapHeight, translateY]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        <Pressable className="flex-1 bg-black/60" onPress={onClose} />
        <Animated.View
          style={[{ transform: [{ translateY }], height: snapHeight }]}
          className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl"
        >
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-full bg-slate-600" />
          </View>
          {title && (
            <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-800">
              <Text className="text-white text-lg font-semibold">{title}</Text>
              <Pressable onPress={onClose} className="p-1">
                <Text className="text-slate-400 text-base">✕</Text>
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
