import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-surface-1 border border-surface-3 rounded-card items-center justify-center active:opacity-95"
      style={{ width: 44, height: 44 }}
      hitSlop={8}
    >
      <ChevronLeft size={20} color="#E6E8EC" strokeWidth={2} />
    </Pressable>
  );
}
