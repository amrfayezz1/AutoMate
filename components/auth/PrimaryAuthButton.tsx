import { LucideIcon } from 'lucide-react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

interface PrimaryAuthButtonProps {
  label: string;
  onPress: () => void;
  TrailingIcon?: LucideIcon;
  loading?: boolean;
  disabled?: boolean;
}

export function PrimaryAuthButton({
  label,
  onPress,
  TrailingIcon,
  loading = false,
  disabled = false,
}: PrimaryAuthButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`bg-brand rounded-card items-center justify-center flex-row active:opacity-95 ${isDisabled ? 'opacity-50' : ''}`}
      style={{ height: 56, gap: 10 }}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text className="text-base font-medium text-fg-on-brand">{label}</Text>
          {TrailingIcon && (
            <View>
              <TrailingIcon size={18} color="#FFFFFF" strokeWidth={2} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
