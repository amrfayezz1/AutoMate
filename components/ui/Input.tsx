import { Text, TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, ...props }: InputProps) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-slate-300">{label}</Text>
      )}
      <TextInput
        className={`bg-surface-elevated text-white rounded-xl px-4 py-3 text-base border ${
          error ? 'border-danger' : 'border-slate-700'
        } focus:border-primary-500`}
        placeholderTextColor="#64748B"
        {...props}
      />
      {error && <Text className="text-danger text-xs">{error}</Text>}
      {hint && !error && <Text className="text-slate-500 text-xs">{hint}</Text>}
    </View>
  );
}
