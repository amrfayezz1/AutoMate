import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 56 }: LogoProps) {
  return (
    <View
      className="bg-brand items-center justify-center"
      style={{ width: size, height: size, borderRadius: size * 0.32 }}
    >
      <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none">
        <Path
          d="M5 19 L12 4 L19 19"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M8.3 13 L15.7 13" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
        <Circle cx="12" cy="20.6" r="1.2" fill="white" />
      </Svg>
    </View>
  );
}
