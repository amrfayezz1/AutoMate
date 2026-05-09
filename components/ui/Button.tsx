import { ActivityIndicator, Pressable, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: 'bg-brand active:opacity-95',
    text:      'text-fg-on-brand font-medium',
  },
  secondary: {
    container: 'bg-surface-3 active:opacity-95',
    text:      'text-fg-1 font-medium',
  },
  danger: {
    container: 'bg-danger active:opacity-95',
    text:      'text-fg-on-brand font-medium',
  },
  ghost: {
    container: 'bg-transparent active:opacity-95',
    text:      'text-brand font-medium',
  },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-3 py-2 rounded-card',   text: 'text-sm' },
  md: { container: 'px-4 py-3 rounded-card',   text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-card',   text: 'text-lg' },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const { container: vContainer, text: vText } = variantStyles[variant];
  const { container: sContainer, text: sText } = sizeStyles[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`items-center justify-center flex-row gap-2 ${vContainer} ${sContainer} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50' : ''}`}
    >
      {loading && <ActivityIndicator size="small" color="#FFFFFF" />}
      <Text className={`font-sans ${vText} ${sText}`}>{label}</Text>
    </Pressable>
  );
}
