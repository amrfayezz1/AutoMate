import { AlertCircle } from 'lucide-react-native';
import { Modal, Pressable, Text, View } from 'react-native';
import { Button } from './Button';

interface DeleteConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteConfirmationModal({
  visible,
  title,
  message,
  itemName,
  onCancel,
  onConfirm,
  loading,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable
        onPress={onCancel}
        disabled={loading}
        className="flex-1 bg-black/50 items-center justify-center px-4"
      >
        <Pressable
          onPress={() => {}}
          className="bg-surface-3 rounded-sheet p-6 w-full max-w-[320px] gap-4 items-center"
        >
          {/* Icon */}
          <View className="bg-danger-30 rounded-pill w-16 h-16 items-center justify-center">
            <AlertCircle size={32} strokeWidth={2.25} color="#E63946" />
          </View>

          {/* Text */}
          <View className="gap-2 items-center">
            <Text className="text-xl font-medium text-fg-1">{title}</Text>
            <Text className="text-base font-sans text-fg-2 text-center">
              {message.replace('{itemName}', `"${itemName}"`)}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row gap-2 w-full pt-2">
            <View className="flex-1">
              <Button
                label="Cancel"
                onPress={onCancel}
                variant="secondary"
                size="lg"
                fullWidth
                disabled={loading}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Delete"
                onPress={onConfirm}
                loading={loading}
                size="lg"
                fullWidth
                variant="danger"
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
