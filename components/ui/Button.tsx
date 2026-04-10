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
  primary: { container: 'bg-primary-500 active:bg-primary-600', text: 'text-white font-semibold' },
  secondary: { container: 'bg-surface-elevated active:bg-slate-600', text: 'text-white font-semibold' },
  danger: { container: 'bg-danger active:bg-red-600', text: 'text-white font-semibold' },
  ghost: { container: 'bg-transparent active:bg-slate-800', text: 'text-primary-500 font-semibold' },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
  sm: { container: 'px-3 py-1.5 rounded-lg', text: 'text-sm' },
  md: { container: 'px-4 py-3 rounded-xl', text: 'text-base' },
  lg: { container: 'px-6 py-4 rounded-2xl', text: 'text-lg' },
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
      {loading && <ActivityIndicator size="small" color="white" />}
      <Text className={`${vText} ${sText}`}>{label}</Text>
    </Pressable>
  );
}
