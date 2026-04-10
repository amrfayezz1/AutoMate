import { Text, View } from 'react-native';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12 gap-4">
      <View className="w-16 h-16 rounded-full bg-surface-elevated items-center justify-center">
        <Text className="text-3xl">🚗</Text>
      </View>
      <View className="items-center gap-1">
        <Text className="text-white text-lg font-semibold text-center">{title}</Text>
        {description && (
          <Text className="text-slate-400 text-sm text-center">{description}</Text>
        )}
      </View>
      {actionLabel && onAction && (
        <Button label={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}
