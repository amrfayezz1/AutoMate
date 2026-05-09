import { useRouter } from 'expo-router';
import { ArrowRight, Car, Hash } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/auth/AuthField';
import { BackButton } from '@/components/auth/BackButton';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { Stepper } from '@/components/auth/Stepper';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';

export default function AddCarVehicleScreen() {
  const router = useRouter();
  const { make, model, year, plate, set } = useOnboardingStore();

  const yearNum = parseInt(year, 10);
  const yearValid = !Number.isNaN(yearNum) && yearNum >= 1886 && yearNum <= new Date().getFullYear() + 1;
  const canContinue =
    make.trim().length > 0 &&
    model.trim().length > 0 &&
    yearValid &&
    plate.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <BackButton onPress={() => router.back()} />
          <Stepper step={0} total={3} />
          <View style={{ width: 44 }} />
        </View>

        <View style={{ marginTop: 24, gap: 6 }}>
          <Text
            className="text-xs text-brand font-medium"
            style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}
          >
            Step 1 Of 3
          </Text>
          <Text
            className="text-fg-1 font-medium"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            What Are You Driving?
          </Text>
          <Text className="text-sm text-fg-2 font-sans">
            We use this to suggest service intervals.
          </Text>
        </View>

        {(make || model) && (
          <View
            className="bg-brand-20 border border-brand flex-row items-center"
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 16,
              gap: 14,
            }}
          >
            <View
              className="bg-brand-30 items-center justify-center"
              style={{ width: 56, height: 56, borderRadius: 14 }}
            >
              <Car size={28} color="#3A86FF" strokeWidth={1.6} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text className="text-base text-fg-1 font-medium" numberOfLines={1}>
                {make} {model}
              </Text>
              <Text className="text-xs text-fg-2 font-sans" style={{ marginTop: 2 }}>
                {year ? year : '—'} · {plate || '—'}
              </Text>
            </View>
            <View
              className="bg-brand-30"
              style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 }}
            >
              <Text className="text-xs text-brand font-medium">Primary</Text>
            </View>
          </View>
        )}

        <View style={{ marginTop: 18, gap: 14 }}>
          <AuthField
            label="Make *"
            value={make}
            onChangeText={(v) => set({ make: v })}
            Icon={Car}
            placeholder="e.g. Toyota"
            autoCapitalize="words"
          />
          <View className="flex-row" style={{ gap: 12 }}>
            <View style={{ flex: 1 }}>
              <AuthField
                label="Model *"
                value={model}
                onChangeText={(v) => set({ model: v })}
                placeholder="e.g. Corolla"
                autoCapitalize="words"
              />
            </View>
            <View style={{ width: 110 }}>
              <AuthField
                label="Year *"
                value={year}
                onChangeText={(v) => set({ year: v.replace(/\D/g, '').slice(0, 4) })}
                placeholder="2024"
                keyboardType="number-pad"
              />
            </View>
          </View>
          <AuthField
            label="License Plate *"
            value={plate}
            onChangeText={(v) => set({ plate: v })}
            Icon={Hash}
            placeholder="ABC 1234"
            hint="Used on receipts and reminders."
            autoCapitalize="characters"
          />
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ marginTop: 24 }}>
          <PrimaryAuthButton
            label="Continue"
            TrailingIcon={ArrowRight}
            onPress={() => router.push('/(auth)/add-car/tracking')}
            disabled={!canContinue}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
