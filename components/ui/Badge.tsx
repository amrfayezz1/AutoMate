import { Text, View } from 'react-native';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  success: { container: 'bg-success-20', text: 'text-success' },
  warning: { container: 'bg-warn-20',    text: 'text-warn' },
  danger:  { container: 'bg-danger-20',  text: 'text-danger' },
  info:    { container: 'bg-brand-20',   text: 'text-brand' },
  neutral: { container: 'bg-surface-4',  text: 'text-fg-2' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const { container, text } = variantStyles[variant];
  return (
    <View className={`px-3 py-1 rounded-pill self-start ${container}`}>
      <Text className={`text-xs font-medium font-sans ${text}`}>{label}</Text>
    </View>
  );
}
