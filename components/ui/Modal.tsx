import React from "react";
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Button } from "./Button";

interface ModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  confirmLoading?: boolean;
  destructive?: boolean;
  children: React.ReactNode;
}

export function Modal({
  visible,
  title,
  onClose,
  onConfirm,
  confirmLabel = "Confirm",
  confirmLoading = false,
  destructive = false,
  children,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/60 px-4"
        onPress={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="w-full"
        >
          <Pressable onPress={() => {}} className="w-full">
            <View className="rounded-2xl bg-slate-800 p-6">
              <Text className="mb-4 text-xl font-bold text-slate-100">
                {title}
              </Text>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {children}
              </ScrollView>
              <View className="mt-4 flex-row gap-3">
                <Button
                  variant="secondary"
                  onPress={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                {onConfirm ? (
                  <Button
                    variant={destructive ? "destructive" : "primary"}
                    onPress={onConfirm}
                    loading={confirmLoading}
                    className="flex-1"
                  >
                    {confirmLabel}
                  </Button>
                ) : null}
              </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </RNModal>
  );
}
