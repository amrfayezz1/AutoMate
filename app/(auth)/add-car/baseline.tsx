import { queryKeys } from '@/constants/queryKeys';
import { fetchMaintenanceTypes, type MaintenanceType } from '@/lib/services/maintenance';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Check,
  Circle,
  Disc,
  Droplets,
  Eye,
  Filter,
  Flame,
  Gauge,
  Settings as SettingsIcon,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/auth/BackButton';
import { Checkbox } from '@/components/auth/Checkbox';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { Stepper } from '@/components/auth/Stepper';
import { DateField } from '@/components/ui/DateField';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCarStore } from '@/lib/stores/carStore';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';
import { supabase } from '@/lib/supabase';

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench,
  Gauge,
  Circle,
  Disc,
  Droplets,
  Eye,
  Filter,
  Flame,
  Wind,
  Zap,
  Settings: SettingsIcon,
};

function formatDateLong(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function ServiceRow({
  type,
  checked,
  date,
  mileage,
  expanded,
  onToggle,
  onExpand,
  onChangeDate,
  onChangeMileage,
}: {
  type: MaintenanceType;
  checked: boolean;
  date: string | null;
  mileage: number | null;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onChangeDate: (iso: string | null) => void;
  onChangeMileage: (n: number | null) => void;
}) {
  const Icon = ICON_MAP[type.icon] ?? Wrench;
  const sel = checked;

  return (
    <View
      className={`${sel ? 'bg-brand-20 border-brand' : 'bg-surface-2 border-surface-3'}`}
      style={{
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
      }}
    >
      <Pressable
        onPress={() => {
          onToggle();
          if (!sel) onExpand();
        }}
        className="flex-row items-center active:opacity-95"
        style={{ gap: 12 }}
      >
        <View
          className="items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: type.color + '33',
          }}
        >
          <Icon size={18} color={type.color} strokeWidth={2.25} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text className="text-base text-fg-1 font-medium">{type.name}</Text>
          {sel ? (
            <Text className="text-xs text-fg-2 font-sans" style={{ marginTop: 3 }}>
              {date ? formatDateLong(date) : 'Add date'} ·{' '}
              {mileage !== null ? `${mileage.toLocaleString('en-US')} km` : 'Add mileage'}
            </Text>
          ) : (
            <Text className="text-xs text-fg-muted font-sans" style={{ marginTop: 3 }}>
              Tap if recently completed
            </Text>
          )}
        </View>
        <Checkbox checked={sel} onChange={onToggle} />
      </Pressable>

      {sel && expanded && (
        <View style={{ gap: 10 }}>
          <DateField value={date} onChange={onChangeDate} placeholder="Service date" clearable />
          <View
            className="bg-surface-1 border border-surface-3 flex-row items-center px-4"
            style={{ height: 56, borderRadius: 16 }}
          >
            <Gauge size={18} color="#A1A7B3" strokeWidth={1.6} />
            <TextInput
              value={mileage !== null ? mileage.toString() : ''}
              onChangeText={(v) => {
                const cleaned = v.replace(/[^\d]/g, '');
                onChangeMileage(cleaned ? parseInt(cleaned, 10) : null);
              }}
              keyboardType="number-pad"
              placeholder="Mileage at service"
              placeholderTextColor="#6B7280"
              className="flex-1 text-base font-medium text-fg-1 font-sans"
              style={{ marginLeft: 12 }}
            />
            <Text className="text-sm text-fg-2 font-medium">km</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export default function AddCarBaselineScreen() {
  const router = useRouter();
  const session = useAuthStore((s) => s.session);
  const setActiveCarId = useCarStore((s) => s.setActiveCarId);

  const { make, model, year, plate, trackingMode, odometer, baseline, toggleBaseline, updateBaseline } =
    useOnboardingStore();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: types = [], isLoading } = useQuery({
    queryKey: queryKeys.maintenanceTypes.all,
    queryFn: fetchMaintenanceTypes,
  });

  const checkedCount = useMemo(
    () => Object.values(baseline).filter((v) => v.checked).length,
    [baseline],
  );

  const handleFinish = async () => {
    if (!session) {
      setError('Not authenticated.');
      return;
    }
    setError(null);
    setSubmitting(true);

    const odoNumber =
      trackingMode === 'time'
        ? 0
        : parseInt(odometer.replace(/[^\d]/g, ''), 10) || 0;

    const { data: carRow, error: carErr } = await supabase
      .from('cars')
      .insert({
        user_id: session.user.id,
        make: make.trim(),
        model: model.trim(),
        year: parseInt(year, 10),
        plate_number: plate.trim(),
        current_odometer: odoNumber,
        tracking_mode: trackingMode,
      })
      .select()
      .single();

    if (carErr || !carRow) {
      setSubmitting(false);
      setError(carErr?.message ?? 'Could not create car.');
      return;
    }

    const records = Object.entries(baseline)
      .filter(([, v]) => v.checked && v.date)
      .map(([typeId, v]) => ({
        user_id: session.user.id,
        car_id: carRow.id,
        type_id: typeId,
        serviced_at: v.date as string,
        mileage_at_service: v.mileage,
        cost: null,
        provider_name: null,
        notes: null,
        photo_url: null,
        next_due_date: null,
        next_due_km: null,
      }));

    if (records.length > 0) {
      const { error: recErr } = await supabase.from('maintenance_records').insert(records);
      if (recErr) {
        setSubmitting(false);
        setError(recErr.message);
        return;
      }
    }

    setActiveCarId(carRow.id);
    setSubmitting(false);
    router.replace('/(auth)/all-set');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 }}
      >
        <View className="flex-row items-center justify-between">
          <BackButton onPress={() => router.back()} />
          <Stepper step={2} total={3} />
          <View style={{ width: 44 }} />
        </View>

        <View style={{ marginTop: 20, gap: 6 }}>
          <Text
            className="text-xs text-brand font-medium"
            style={{ letterSpacing: 1.5, textTransform: 'uppercase' }}
          >
            Step 3 Of 3
          </Text>
          <Text
            className="text-fg-1 font-medium"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            What's Already Been Done?
          </Text>
          <Text className="text-sm text-fg-2 font-sans">
            Tap any service you remember. Reminders fire from the right date, not from today.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          style={{ marginTop: 18, flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading && (
            <Text className="text-sm text-fg-2 font-sans text-center">Loading services…</Text>
          )}
          {types.map((t) => {
            const entry = baseline[t.id] ?? { checked: false, date: null, mileage: null };
            return (
              <ServiceRow
                key={t.id}
                type={t}
                checked={entry.checked}
                date={entry.date}
                mileage={entry.mileage}
                expanded={expandedId === t.id}
                onToggle={() => toggleBaseline(t.id)}
                onExpand={() => setExpandedId(t.id)}
                onChangeDate={(iso) => updateBaseline(t.id, { date: iso })}
                onChangeMileage={(n) => updateBaseline(t.id, { mileage: n })}
              />
            );
          })}
        </ScrollView>

        {error && (
          <Text className="text-danger text-sm font-medium" style={{ marginVertical: 8 }}>
            {error}
          </Text>
        )}

        <View
          className="bg-success-20 border border-success flex-row items-center"
          style={{
            marginTop: 12,
            marginBottom: 12,
            padding: 12,
            borderRadius: 12,
            gap: 10,
          }}
        >
          <View
            className="bg-success-30 items-center justify-center"
            style={{ width: 28, height: 28, borderRadius: 14 }}
          >
            <Check size={14} color="#2EC4B6" strokeWidth={2.4} />
          </View>
          <Text className="flex-1 text-sm text-fg-1 font-sans">
            <Text className="font-medium">{checkedCount} services seeded</Text>
            <Text className="text-fg-2"> · auto-fills the rest from factory intervals.</Text>
          </Text>
        </View>

        <PrimaryAuthButton
          label="Save And Finish"
          TrailingIcon={ArrowRight}
          onPress={handleFinish}
          loading={submitting}
        />
      </View>
    </SafeAreaView>
  );
}
