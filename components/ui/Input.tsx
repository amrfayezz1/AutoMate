import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  return (
    <View className="gap-2">
      {label && (
        <Text className="text-sm font-medium font-sans text-fg-2">{label}</Text>
      )}
      <TextInput
        className={`bg-surface-1 text-fg-1 rounded-card px-4 py-3 text-base border font-sans ${
          error ? 'border-danger' : 'border-surface-3'
        } focus:border-brand`}
        placeholderTextColor="#6B7280"
        {...props}
      />
      {error && (
        <Text className="text-danger text-xs font-sans">{error}</Text>
      )}
      {hint && !error && (
        <Text className="text-fg-muted text-xs font-sans">{hint}</Text>
      )}
    </View>
  );
}
