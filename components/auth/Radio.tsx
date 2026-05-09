import { Pressable, View } from 'react-native';

interface RadioProps {
  checked: boolean;
  onChange: () => void;
  size?: number;
}

export function Radio({ checked, onChange, size = 20 }: RadioProps) {
  return (
    <Pressable
      onPress={onChange}
      className={`items-center justify-center ${checked ? 'border-brand' : 'border-surface-4'}`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
      }}
      hitSlop={8}
    >
      {checked && (
        <View
          className="bg-brand"
          style={{ width: size * 0.5, height: size * 0.5, borderRadius: size * 0.25 }}
        />
      )}
    </Pressable>
  );
}
