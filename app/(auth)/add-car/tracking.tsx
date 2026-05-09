import { useRouter } from 'expo-router';
import { ArrowRight, Calendar, Gauge, LucideIcon, Sparkles } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/auth/AuthField';
import { BackButton } from '@/components/auth/BackButton';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { Radio } from '@/components/auth/Radio';
import { Stepper } from '@/components/auth/Stepper';
import { TrackingMode, useOnboardingStore } from '@/lib/stores/onboardingStore';

type Option = {
  id: TrackingMode;
  title: string;
  sub: string;
  Icon: LucideIcon;
  badge?: string;
};

const OPTIONS: Option[] = [
  {
    id: 'time',
    title: 'By Time',
    sub: 'Calendar-based reminders. Best for daily drivers.',
    Icon: Calendar,
  },
  {
    id: 'mileage',
    title: 'By Mileage',
    sub: 'Triggers on km. Best if your driving varies.',
    Icon: Gauge,
  },
  {
    id: 'both',
    title: 'Both',
    sub: 'Whichever comes first. Recommended.',
    Icon: Sparkles,
    badge: 'Recommended',
  },
];

export default function AddCarTrackingScreen() {
  const router = useRouter();
  const { trackingMode, odometer, set } = useOnboardingStore();

  const odoNumber = parseInt(odometer.replace(/[^\d]/g, ''), 10);
  const odoValid = !Number.isNaN(odoNumber) && odoNumber >= 0;
  const needsOdo = trackingMode !== 'time';
  const canContinue = !needsOdo || odoValid;

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <BackButton onPress={() => router.back()} />
          <Stepper step={1} total={3} />
          <View style={{ width: 44 }} />
        </View>

        <View style={{ marginTop: 24, gap: 6 }}>
          <Text
            className="text-xs text-brand font-medium"
            style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}
          >
            Step 2 Of 3
          </Text>
          <Text
            className="text-fg-1 font-medium"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            How Should We Track Service?
          </Text>
        </View>

        <View style={{ marginTop: 18, gap: 10 }}>
          {OPTIONS.map((o) => {
            const sel = trackingMode === o.id;
            return (
              <Pressable
                key={o.id}
                onPress={() => set({ trackingMode: o.id })}
                className={`flex-row items-center ${sel ? 'bg-brand-20 border-brand' : 'bg-surface-2 border-surface-3'} active:opacity-95`}
                style={{
                  padding: 14,
                  borderRadius: 16,
                  borderWidth: 1,
                  gap: 14,
                }}
              >
                <View
                  className={`items-center justify-center ${sel ? 'bg-brand-30' : 'bg-surface-3'}`}
                  style={{ width: 40, height: 40, borderRadius: 20 }}
                >
                  <o.Icon
                    size={20}
                    color={sel ? '#3A86FF' : '#A1A7B3'}
                    strokeWidth={1.6}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <View className="flex-row items-center" style={{ gap: 8 }}>
                    <Text className="text-base text-fg-1 font-medium">{o.title}</Text>
                    {o.badge && (
                      <View
                        className="bg-success-20"
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 99,
                        }}
                      >
                        <Text
                          className="text-success font-medium"
                          style={{
                            fontSize: 10,
                            letterSpacing: 0.5,
                            textTransform: 'uppercase',
                          }}
                        >
                          {o.badge}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-xs text-fg-2 font-sans" style={{ marginTop: 3 }}>
                    {o.sub}
                  </Text>
                </View>
                <Radio checked={sel} onChange={() => set({ trackingMode: o.id })} />
              </Pressable>
            );
          })}
        </View>

        {needsOdo && (
          <View style={{ marginTop: 18 }}>
            <AuthField
              label="Current Mileage *"
              value={odometer}
              onChangeText={(v) => set({ odometer: v.replace(/[^\d,]/g, '') })}
              Icon={Gauge}
              placeholder="0"
              hint="Used as your baseline odometer."
              keyboardType="number-pad"
              trailing={
                <Text className="text-sm text-fg-2 font-medium" style={{ paddingHorizontal: 4 }}>
                  km
                </Text>
              }
            />
          </View>
        )}

        <View style={{ flex: 1 }} />

        <View style={{ marginTop: 24 }}>
          <PrimaryAuthButton
            label="Continue"
            TrailingIcon={ArrowRight}
            onPress={() => router.push('/(auth)/add-car/baseline')}
            disabled={!canContinue}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
