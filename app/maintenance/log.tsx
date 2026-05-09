import { Button } from '@/components/ui/Button';
import { DateField } from '@/components/ui/DateField';
import { ErrorState } from '@/components/ui/ErrorState';
import { MaintenanceTypeSheet } from '@/components/ui/MaintenanceTypeSheet';
import { PhotoField } from '@/components/ui/PhotoField';
import { Toast } from '@/components/ui/Toast';
import { queryKeys } from '@/constants/queryKeys';
import { fetchCars } from '@/lib/services/cars';
import {
  createMaintenanceRecord,
  type MaintenanceType,
} from '@/lib/services/maintenance';
import { uploadMaintenancePhoto } from '@/lib/services/storage';
import { useCarStore } from '@/lib/stores/carStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronRight,
  Circle,
  Disc,
  Droplets,
  Eye,
  FileText,
  Filter,
  Flame,
  Gauge,
  MapPin,
  Settings as SettingsIcon,
  Wind,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench, Gauge, Circle, Disc, Droplets, Eye, Filter, Flame, Wind, Zap,
  Settings: SettingsIcon,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function addDaysISO(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ─── Field shells ───────────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text className="text-sm font-medium text-fg-2">
      {label}
      {required && <Text className="text-danger"> *</Text>}
    </Text>
  );
}

function FieldShell({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px]">
      {children}
    </View>
  );
}

// ─── Screen ────────────────────────────────────────────────────────────────

export default function LogMaintenanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { activeCarId } = useCarStore();

  const { data: cars = [] } = useQuery({
    queryKey: queryKeys.cars.all,
    queryFn: fetchCars,
  });
  const activeCar = cars.find((c) => c.id === activeCarId) ?? null;

  const [selectedType, setSelectedType] = useState<MaintenanceType | null>(null);
  const [date, setDate] = useState<string>(todayISO());
  const [mileage, setMileage] = useState<string>('');
  const [cost, setCost] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [nextDueDate, setNextDueDate] = useState<string | null>(null);
  const [nextDueKm, setNextDueKm] = useState<string>('');
  const [typeSheetOpen, setTypeSheetOpen] = useState(false);
  const [errors, setErrors] = useState<{ type?: string; mileage?: string }>({});
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Auto-fill Next Due fields from the chosen type's default intervals.
  // Uses today + interval_days for the date, and current_odometer + interval_km for the km.
  function applyTypeDefaults(type: MaintenanceType) {
    if (type.default_interval_days != null) {
      setNextDueDate(addDaysISO(date, type.default_interval_days));
    } else {
      setNextDueDate(null);
    }
    if (type.default_interval_km != null && activeCar) {
      setNextDueKm(String(activeCar.current_odometer + type.default_interval_km));
    } else {
      setNextDueKm('');
    }
  }

  const mutation = useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      if (activeCarId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cars.byId(activeCarId) });
        queryClient.invalidateQueries({
          queryKey: queryKeys.maintenanceRecords.all(activeCarId),
        });
      }
      router.back();
    },
    onError: (err) => {
      setToast(err instanceof Error ? err.message : 'Failed to save');
      setSaving(false);
    },
  });

  if (!activeCarId) {
    return (
      <ErrorState
        title="No active car"
        description="Select a car before logging maintenance."
      />
    );
  }

  async function handleSave() {
    const nextErrors: typeof errors = {};
    if (!selectedType) nextErrors.type = 'Required';
    const mileageNum = mileage.trim() ? Number(mileage) : NaN;
    if (!mileage.trim() || Number.isNaN(mileageNum) || mileageNum < 0) {
      nextErrors.mileage = 'Required';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      let photoPath: string | null = null;
      if (photoUri) {
        photoPath = await uploadMaintenancePhoto(photoUri);
      }

      const costNum = cost.trim() ? Number(cost) : NaN;
      const nextKmNum = nextDueKm.trim() ? Number(nextDueKm) : NaN;

      mutation.mutate({
        carId: activeCarId!,
        typeId: selectedType!.id,
        servicedAt: date,
        mileageAtService: mileageNum,
        cost: Number.isFinite(costNum) ? costNum : null,
        providerName: provider.trim() || null,
        notes: notes.trim() || null,
        photoUrl: photoPath,
        nextDueDate: nextDueDate,
        nextDueKm: Number.isFinite(nextKmNum) && nextKmNum >= 0 ? nextKmNum : null,
      });
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to upload photo');
      setSaving(false);
    }
  }

  function clearNextDue() {
    setNextDueDate(null);
    setNextDueKm('');
  }

  const TypeIcon = selectedType ? (ICON_MAP[selectedType.icon] ?? Wrench) : null;
  const hasNextDue = nextDueDate !== null || nextDueKm.trim() !== '';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-surface-0"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 100,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            className="active:opacity-95"
            accessibilityLabel="Back"
            hitSlop={12}
          >
            <ArrowLeft size={24} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
          <Text className="text-xl font-medium text-fg-1">Log Maintenance</Text>
        </View>

        {/* Type */}
        <View className="gap-2">
          <FieldLabel label="Maintenance Type" required />
          <Pressable
            onPress={() => setTypeSheetOpen(true)}
            className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center justify-between active:opacity-95"
          >
            <View className="flex-row items-center gap-2.5 flex-1">
              {TypeIcon && selectedType ? (
                <TypeIcon size={20} strokeWidth={2.25} color={selectedType.color} />
              ) : null}
              <Text
                className={`text-base font-sans ${
                  selectedType ? 'text-fg-1' : 'text-fg-muted'
                }`}
              >
                {selectedType ? selectedType.name : 'Select type'}
              </Text>
            </View>
            <ChevronRight size={20} strokeWidth={2.25} color="#A1A7B3" />
          </Pressable>
          {errors.type && (
            <Text className="text-xs font-sans text-danger">{errors.type}</Text>
          )}
        </View>

        {/* Date */}
        <View className="gap-2">
          <FieldLabel label="Date" required />
          <DateField value={date} onChange={(v) => v && setDate(v)} />
        </View>

        {/* Mileage */}
        <View className="gap-2">
          <FieldLabel label="Mileage at Service" required />
          <FieldShell>
            <Gauge size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={mileage}
              onChangeText={setMileage}
              placeholder="45230"
              placeholderTextColor="#6B7280"
              keyboardType="number-pad"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </FieldShell>
          {errors.mileage && (
            <Text className="text-xs font-sans text-danger">{errors.mileage}</Text>
          )}
        </View>

        {/* Cost */}
        <View className="gap-2">
          <FieldLabel label="Cost (optional)" />
          <FieldShell>
            <Text className="text-base font-medium text-fg-2 w-5 text-center">£</Text>
            <TextInput
              value={cost}
              onChangeText={setCost}
              placeholder="75.00"
              placeholderTextColor="#6B7280"
              keyboardType="decimal-pad"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </FieldShell>
        </View>

        {/* Provider */}
        <View className="gap-2">
          <FieldLabel label="Provider/Shop (optional)" />
          <FieldShell>
            <MapPin size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={provider}
              onChangeText={setProvider}
              placeholder="Quick Lube Center"
              placeholderTextColor="#6B7280"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </FieldShell>
        </View>

        {/* Notes */}
        <View className="gap-2">
          <FieldLabel label="Notes (optional)" />
          <View className="bg-surface-1 rounded-card p-4 flex-row items-start gap-2.5 min-h-[120px]">
            <FileText size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Additional details..."
              placeholderTextColor="#6B7280"
              multiline
              textAlignVertical="top"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </View>
        </View>

        {/* Photo */}
        <View className="gap-2">
          <FieldLabel label="Photo (optional)" />
          <PhotoField value={photoUri} onChange={setPhotoUri} />
        </View>

        {/* Next Due */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <FieldLabel label="Next Due (optional)" />
            {hasNextDue && (
              <Pressable
                onPress={clearNextDue}
                hitSlop={8}
                className="flex-row items-center gap-1 active:opacity-95"
                accessibilityLabel="Clear next due"
              >
                <X size={14} strokeWidth={2.25} color="#A1A7B3" />
                <Text className="text-xs font-medium text-fg-2">Clear</Text>
              </Pressable>
            )}
          </View>
          <DateField
            value={nextDueDate}
            onChange={setNextDueDate}
            placeholder="No reminder date"
            clearable
          />
          <FieldShell>
            <Gauge size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={nextDueKm}
              onChangeText={setNextDueKm}
              placeholder="No reminder km"
              placeholderTextColor="#6B7280"
              keyboardType="number-pad"
              className="flex-1 text-base font-sans text-fg-1"
            />
            {nextDueKm.trim() !== '' && (
              <Pressable
                onPress={() => setNextDueKm('')}
                hitSlop={8}
                className="active:opacity-95"
              >
                <X size={18} strokeWidth={2.25} color="#A1A7B3" />
              </Pressable>
            )}
          </FieldShell>
          <Text className="text-xs font-sans text-fg-muted">
            Defaults are filled from the type. Clear either field to skip that reminder.
          </Text>
        </View>

        {/* Save */}
        <View className="pt-4">
          <Button
            label="Save"
            onPress={handleSave}
            loading={saving || mutation.isPending}
            fullWidth
            size="lg"
          />
        </View>
      </ScrollView>

      <MaintenanceTypeSheet
        visible={typeSheetOpen}
        selectedTypeId={selectedType?.id ?? null}
        onClose={() => setTypeSheetOpen(false)}
        onSelect={(t) => {
          setSelectedType(t);
          setErrors((e) => ({ ...e, type: undefined }));
          applyTypeDefaults(t);
        }}
      />

      <Toast
        message={toast ?? ''}
        type="error"
        visible={toast !== null}
        onHide={() => setToast(null)}
      />
    </KeyboardAvoidingView>
  );
}
