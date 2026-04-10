import { Text, View } from 'react-native';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn\'t load the data. Check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-12 gap-4">
      <View className="w-16 h-16 rounded-full bg-red-900/30 items-center justify-center">
        <Text className="text-3xl">⚠️</Text>
      </View>
      <View className="items-center gap-1">
        <Text className="text-white text-lg font-semibold text-center">{title}</Text>
        <Text className="text-slate-400 text-sm text-center">{description}</Text>
      </View>
      {onRetry && <Button label="Retry" onPress={onRetry} variant="secondary" />}
    </View>
  );
}
