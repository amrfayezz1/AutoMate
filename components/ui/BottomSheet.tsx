import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  snapHeight?: number;
}

export function BottomSheet({
  visible,
  title,
  onClose,
  children,
  snapHeight,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/60" onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="absolute bottom-0 left-0 right-0"
      >
        <Animated.View
          style={[
            { transform: [{ translateY }] },
            snapHeight
              ? { height: snapHeight }
              : { maxHeight: SCREEN_HEIGHT * 0.85 },
          ]}
          className="rounded-t-2xl bg-slate-800 pb-8"
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-2">
            <View className="h-1 w-10 rounded-full bg-slate-600" />
          </View>
          {title ? (
            <View className="border-b border-slate-600 px-6 pb-4">
              <Text className="text-xl font-bold text-slate-100">{title}</Text>
            </View>
          ) : null}
          <ScrollView
            className="px-6 pt-4"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
