import { Text, View } from 'react-native';

interface WordmarkProps {
  size?: number;
}

export function Wordmark({ size = 28 }: WordmarkProps) {
  return (
    <View className="flex-row items-baseline">
      <Text
        className="text-fg-1 font-medium"
        style={{ fontSize: size, letterSpacing: -0.6 }}
      >
        Auto
      </Text>
      <Text
        className="text-brand font-medium"
        style={{ fontSize: size, letterSpacing: -0.6 }}
      >
        Mate
      </Text>
    </View>
  );
}
