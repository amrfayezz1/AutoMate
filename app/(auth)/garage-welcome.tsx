import { useRouter } from 'expo-router';
import { ArrowRight, Bell, Car, Check, Gauge } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';
import { supabase } from '@/lib/supabase';

const ROWS = [
  { Icon: Car, title: 'Vehicle Details', sub: 'Make, model, plate' },
  { Icon: Gauge, title: 'Tracking Mode', sub: 'Time, mileage, or both' },
  { Icon: Bell, title: 'Baseline Service', sub: 'When was your last oil change?' },
];

export default function GarageWelcomeScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const resetOnboarding = useOnboardingStore((s) => s.reset);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    resetOnboarding();
    const fullName = session?.user.user_metadata?.full_name as string | undefined;
    if (fullName) {
      setName(fullName.split(' ')[0]);
      return;
    }
    if (!session) return;
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.full_name) setName(data.full_name.split(' ')[0]);
      });
  }, [session, resetOnboarding]);

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View
        style={{ flex: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 28 }}
      >
        <View
          className="items-center justify-center"
          style={{ height: 280 }}
        >
          <View className="items-center justify-center" style={{ width: 200, height: 200 }}>
            {[200, 160, 120].map((s, i) => (
              <View
                key={i}
                className="bg-success-30 absolute"
                style={{
                  width: s,
                  height: s,
                  borderRadius: s / 2,
                  opacity: 0.18 + i * 0.06,
                }}
              />
            ))}
            <View
              className="bg-success items-center justify-center"
              style={{ width: 108, height: 108, borderRadius: 32 }}
            >
              <Check size={56} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Text
            className="text-fg-1 font-medium text-center"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            {name ? `You're In, ${name}.` : `You're In.`}
          </Text>
          <Text className="text-base text-fg-2 font-sans text-center">
            Add your first car. It takes about 90 seconds, and we will seed your service history
            so you start with reminders ready.
          </Text>
        </View>

        <View style={{ marginTop: 28, gap: 10 }}>
          {ROWS.map((row, i) => (
            <View
              key={i}
              className="bg-surface-2 flex-row items-center"
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 14,
                gap: 14,
              }}
            >
              <View
                className="bg-brand-30 items-center justify-center"
                style={{ width: 36, height: 36, borderRadius: 18 }}
              >
                <row.Icon size={18} color="#3A86FF" strokeWidth={1.6} />
              </View>
              <View style={{ flex: 1 }}>
                <Text className="text-sm text-fg-1 font-medium">{row.title}</Text>
                <Text className="text-xs text-fg-2 font-sans" style={{ marginTop: 2 }}>
                  {row.sub}
                </Text>
              </View>
              <View
                className="bg-surface-3 items-center justify-center"
                style={{ width: 28, height: 28, borderRadius: 14 }}
              >
                <Text className="text-xs text-fg-2 font-medium">{i + 1}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ gap: 12 }}>
          <PrimaryAuthButton
            label="Add My First Car"
            TrailingIcon={ArrowRight}
            onPress={() => router.push('/(auth)/add-car/vehicle')}
          />
          <Pressable
            onPress={() => router.replace('/(tabs)/')}
            className="items-center active:opacity-95"
            style={{ paddingVertical: 8 }}
            hitSlop={8}
          >
            <Text className="text-sm text-fg-2 font-medium">I'll Do This Later</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
