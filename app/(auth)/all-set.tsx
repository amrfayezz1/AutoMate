import { queryKeys } from '@/constants/queryKeys';
import { fetchCarById } from '@/lib/services/cars';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { ArrowRight, Check, Droplets } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { useCarStore } from '@/lib/stores/carStore';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';

export default function AllSetScreen() {
  const router = useRouter();
  const activeCarId = useCarStore((s) => s.activeCarId);
  const baseline = useOnboardingStore((s) => s.baseline);
  const reset = useOnboardingStore((s) => s.reset);

  const seededCount = Object.values(baseline).filter((v) => v.checked).length;

  const { data: car } = useQuery({
    queryKey: activeCarId ? queryKeys.cars.byId(activeCarId) : ['cars', 'pending'],
    queryFn: () => fetchCarById(activeCarId!),
    enabled: !!activeCarId,
  });

  const handleGoToGarage = () => {
    reset();
    router.replace('/(tabs)/');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View
        style={{ flex: 1, paddingHorizontal: 28, paddingTop: 24, paddingBottom: 28 }}
      >
        <View className="items-center justify-center" style={{ height: 280 }}>
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
              style={{ width: 120, height: 120, borderRadius: 60 }}
            >
              <Check size={60} color="#FFFFFF" strokeWidth={2.6} />
            </View>
          </View>
        </View>

        <View style={{ gap: 12 }}>
          <Text
            className="text-fg-1 font-medium text-center"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            You're All Set.
          </Text>
          <Text className="text-base text-fg-2 font-sans text-center">
            {car ? `${car.make} ${car.model}` : 'Your car'} is in your garage with{' '}
            {seededCount} {seededCount === 1 ? 'service' : 'services'} seeded.
          </Text>
        </View>

        <View
          className="bg-surface-2 border border-surface-3"
          style={{
            marginTop: 24,
            padding: 16,
            borderRadius: 18,
            gap: 14,
          }}
        >
          <View className="flex-row items-center" style={{ gap: 12 }}>
            <View
              className="bg-warn-20 items-center justify-center"
              style={{ width: 44, height: 44, borderRadius: 14 }}
            >
              <Droplets size={20} color="#FF9F1C" strokeWidth={2.25} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                className="text-xs text-warn font-medium"
                style={{ letterSpacing: 1, textTransform: 'uppercase' }}
              >
                Next Due
              </Text>
              <Text className="text-base text-fg-1 font-medium" style={{ marginTop: 2 }}>
                Oil Change
              </Text>
            </View>
            <View>
              <Text
                className="text-base text-fg-1 font-medium text-right"
                style={{ fontVariant: ['tabular-nums' as const] }}
              >
                Auto-Set
              </Text>
              <Text className="text-xs text-fg-2 font-sans text-right">
                From factory interval
              </Text>
            </View>
          </View>

          <View className="bg-surface-3" style={{ height: 1 }} />

          <View className="flex-row justify-between">
            <View>
              <Text className="text-xs text-fg-2 font-sans">Garage</Text>
              <Text className="text-sm text-fg-1 font-medium" style={{ marginTop: 3 }}>
                1 Car
              </Text>
            </View>
            <View>
              <Text className="text-xs text-fg-2 font-sans">Seeded</Text>
              <Text className="text-sm text-fg-1 font-medium" style={{ marginTop: 3 }}>
                {seededCount} {seededCount === 1 ? 'Service' : 'Services'}
              </Text>
            </View>
            <View>
              <Text className="text-xs text-fg-2 font-sans">Reminders</Text>
              <Text
                className="text-sm text-success font-medium"
                style={{ marginTop: 3 }}
              >
                Active
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ gap: 12 }}>
          <PrimaryAuthButton
            label="Take Me To My Garage"
            TrailingIcon={ArrowRight}
            onPress={handleGoToGarage}
          />
          <Pressable
            onPress={() => {
              reset();
              router.replace('/(auth)/add-car/vehicle');
            }}
            className="items-center active:opacity-95"
            style={{ paddingVertical: 8 }}
            hitSlop={8}
          >
            <Text className="text-sm text-fg-2 font-medium">Add Another Car</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
