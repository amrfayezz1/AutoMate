import { useRouter } from 'expo-router';
import { ArrowRight, Bell, Check, Gauge } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';

type Slide = {
  title: string;
  copy: string;
  Icon: typeof Gauge;
  color: 'brand' | 'success' | 'warn';
};

const slides: Slide[] = [
  {
    title: 'Stay Ahead Of Every Service',
    copy: 'AutoMate tracks oil, tires, brakes and more, so nothing slips past you.',
    Icon: Gauge,
    color: 'brand',
  },
  {
    title: 'One Tap To Log It',
    copy: 'Update mileage, log a repair, attach a receipt, in seconds.',
    Icon: Check,
    color: 'success',
  },
  {
    title: 'Reminders That Match Your Driving',
    copy: 'AutoMate does the math on intervals. You just drive.',
    Icon: Bell,
    color: 'warn',
  },
];

export default function WelcomeScreen() {
  const [page, setPage] = useState(0);
  const router = useRouter();
  const s = slides[page];
  const isLast = page === slides.length - 1;

  const colorMap = {
    brand: { bg: 'bg-brand-30', fg: '#3A86FF' },
    success: { bg: 'bg-success-30', fg: '#2EC4B6' },
    warn: { bg: 'bg-warn-30', fg: '#FF9F1C' },
  } as const;

  const tone = colorMap[s.color];

  const handleContinue = () => {
    if (!isLast) setPage(page + 1);
    else router.push('/(auth)/sign-up');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View className="flex-1">
        <View
          className="items-center justify-center"
          style={{ height: 380, position: 'relative' }}
        >
          <Pressable
            onPress={() => router.push('/(auth)/sign-in')}
            className="absolute active:opacity-95"
            style={{ top: 14, right: 20 }}
            hitSlop={8}
          >
            <Text className="text-sm font-medium text-fg-2">Skip</Text>
          </Pressable>

          <View
            className="items-center justify-center"
            style={{ width: 220, height: 220 }}
          >
            {[200, 150, 100].map((sz, i) => (
              <View
                key={i}
                className={tone.bg + ' absolute'}
                style={{
                  width: sz,
                  height: sz,
                  borderRadius: sz / 2,
                  opacity: 0.4 - i * 0.1,
                }}
              />
            ))}
            <View
              className={tone.bg + ' items-center justify-center'}
              style={{ width: 96, height: 96, borderRadius: 28 }}
            >
              <s.Icon size={44} color={tone.fg} strokeWidth={2.25} />
            </View>
          </View>
        </View>

        <View className="flex-1 px-6" style={{ paddingTop: 32, paddingBottom: 28, gap: 20 }}>
          <View className="flex-row" style={{ gap: 6 }}>
            {slides.map((_, i) => (
              <Pressable
                key={i}
                onPress={() => setPage(i)}
                className={i === page ? 'bg-brand' : 'bg-surface-3'}
                style={{
                  height: 4,
                  borderRadius: 2,
                  width: i === page ? 28 : 8,
                }}
              />
            ))}
          </View>

          <View style={{ gap: 12, flex: 1 }}>
            <Text
              className="text-fg-1 font-medium"
              style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
            >
              {s.title}
            </Text>
            <Text className="text-fg-2 text-base font-sans">{s.copy}</Text>
          </View>

          <View style={{ gap: 12 }}>
            <PrimaryAuthButton
              label={isLast ? 'Get Started' : 'Continue'}
              TrailingIcon={ArrowRight}
              onPress={handleContinue}
            />
            <View className="flex-row justify-center" style={{ gap: 4 }}>
              <Text className="text-sm text-fg-2 font-medium">Already have an account?</Text>
              <Pressable onPress={() => router.push('/(auth)/sign-in')} hitSlop={8}>
                <Text className="text-sm text-brand font-medium">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
