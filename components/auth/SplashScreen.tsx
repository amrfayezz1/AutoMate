import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from './Logo';
import { Wordmark } from './Wordmark';

export function SplashScreen() {
  const translate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translate, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [translate]);

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View className="flex-1 items-center justify-center" style={{ gap: 28 }}>
        <View className="items-center justify-center" style={{ width: 200, height: 200 }}>
          {[200, 160, 120].map((s, i) => (
            <View
              key={i}
              className="border-brand absolute"
              style={{
                width: s,
                height: s,
                borderRadius: s / 2,
                borderWidth: 1,
                opacity: 0.12 + i * 0.07,
              }}
            />
          ))}
          <Logo size={84} />
        </View>
        <View className="items-center" style={{ gap: 10 }}>
          <Wordmark size={36} />
          <Text
            className="text-xs font-medium text-fg-2"
            style={{ letterSpacing: 2, textTransform: 'uppercase' }}
          >
            Maintenance · Simplified
          </Text>
        </View>
      </View>

      <View className="items-center" style={{ paddingBottom: 90 }}>
        <View
          className="bg-surface-3 overflow-hidden"
          style={{ width: 120, height: 3, borderRadius: 99 }}
        >
          <Animated.View
            className="bg-brand"
            style={{
              width: '40%',
              height: '100%',
              borderRadius: 99,
              transform: [
                {
                  translateX: translate.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-48, 144],
                  }),
                },
              ],
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
