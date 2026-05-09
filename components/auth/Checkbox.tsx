import { Check } from 'lucide-react-native';
import { Pressable } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  size?: number;
}

export function Checkbox({ checked, onChange, size = 20 }: CheckboxProps) {
  return (
    <Pressable
      onPress={onChange}
      className={`items-center justify-center ${checked ? 'bg-brand border-brand' : 'border-surface-4'}`}
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        borderWidth: 1.5,
      }}
      hitSlop={8}
    >
      {checked && <Check size={size * 0.7} color="#FFFFFF" strokeWidth={2.4} />}
    </Pressable>
  );
}
