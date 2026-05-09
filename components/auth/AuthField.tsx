import { LucideIcon } from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';

interface AuthFieldProps extends Omit<TextInputProps, 'onChange'> {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  Icon?: LucideIcon;
  trailing?: ReactNode;
  hint?: string;
  error?: string;
}

export function AuthField({
  label,
  value,
  onChangeText,
  Icon,
  trailing,
  hint,
  error,
  ...rest
}: AuthFieldProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? 'border-danger'
    : focused
      ? 'border-brand'
      : 'border-surface-3';

  return (
    <View className="gap-2">
      <Text
        className="text-xs font-medium text-fg-2"
        style={{ letterSpacing: 0.6, textTransform: 'uppercase' }}
      >
        {label}
      </Text>
      <View
        className={`bg-surface-1 rounded-card border ${borderColor} flex-row items-center px-4`}
        style={{ height: 56 }}
      >
        {Icon && (
          <View className="mr-3">
            <Icon size={18} color={focused ? '#3A86FF' : '#A1A7B3'} strokeWidth={1.6} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor="#6B7280"
          className="flex-1 text-base font-medium text-fg-1 font-sans"
          style={{ paddingVertical: 0 }}
          {...rest}
        />
        {trailing}
      </View>
      {(hint || error) && (
        <Text className={`text-xs font-medium ${error ? 'text-danger' : 'text-fg-2'}`}>
          {error || hint}
        </Text>
      )}
    </View>
  );
}
