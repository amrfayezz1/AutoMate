import { Text, View } from 'react-native';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, { container: string; text: string }> = {
  success: { container: 'bg-green-900/50', text: 'text-green-400' },
  warning: { container: 'bg-amber-900/50', text: 'text-amber-400' },
  danger: { container: 'bg-red-900/50', text: 'text-red-400' },
  info: { container: 'bg-blue-900/50', text: 'text-blue-400' },
  neutral: { container: 'bg-slate-700', text: 'text-slate-300' },
};

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const { container, text } = variantStyles[variant];
  return (
    <View className={`px-2.5 py-0.5 rounded-full self-start ${container}`}>
      <Text className={`text-xs font-medium ${text}`}>{label}</Text>
    </View>
  );
}
