import { queryKeys } from '@/constants/queryKeys';
import {
  deleteMaintenanceRecord,
  fetchMaintenanceRecord,
  updateMaintenanceRecord,
  type MaintenanceRecordDetail,
  type MaintenanceType,
} from '@/lib/services/maintenance';
import {
  deleteMaintenancePhoto,
  getMaintenancePhotoUrl,
  uploadMaintenancePhoto,
} from '@/lib/services/storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Toast } from './Toast';
import {
  Calendar,
  Camera,
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
  Pencil,
  Settings as SettingsIcon,
  Trash2,
  Wind,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { DateField } from './DateField';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { MaintenanceTypeSheet } from './MaintenanceTypeSheet';
import { PhotoField } from './PhotoField';
import { Skeleton } from './Skeleton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench, Gauge, Circle, Disc, Droplets, Eye, Filter, Flame, Wind, Zap,
  Settings: SettingsIcon,
};

interface MaintenanceDetailsSheetProps {
  visible: boolean;
  recordId: string | null;
  /** Used to invalidate per-car queries after update/delete */
  carId: string | null;
  onClose: () => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function isOverdueDate(iso: string | null): boolean {
  if (!iso) return false;
  const due = new Date(iso);
  due.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
}

// ─── Read-only field row ────────────────────────────────────────────────────

function FieldRow({
  label,
  Icon,
  value,
  placeholder,
  iconColor,
}: {
  label: string;
  Icon: LucideIcon;
  value: string | null;
  placeholder?: string;
  iconColor?: string;
}) {
  const showValue = value != null && value !== '';
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-fg-2">{label}</Text>
      <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5">
        <Icon
          size={20}
          strokeWidth={2.25}
          color={iconColor ?? (showValue ? '#A1A7B3' : '#6B7280')}
        />
        <Text
          className={`text-base font-sans ${
            showValue ? 'text-fg-1' : 'text-fg-muted'
          }`}
        >
          {showValue ? value : placeholder ?? ''}
        </Text>
      </View>
    </View>
  );
}

// ─── Read body ──────────────────────────────────────────────────────────────

function ReadBody({
  record,
  photoUrl,
  onEdit,
  onDelete,
  onClose,
}: {
  record: MaintenanceRecordDetail;
  photoUrl: string | null;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const TypeIcon = ICON_MAP[record.iconName] ?? Wrench;
  const dateOverdue = isOverdueDate(record.nextDueDate);
  const overdueLabel = record.nextDueDate
    ? `Overdue since ${formatDateShort(record.nextDueDate)}`
    : null;

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text className="text-xl font-medium text-fg-1">Maintenance Details</Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onDelete}
            className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
            accessibilityLabel="Delete maintenance"
          >
            <Trash2 size={18} strokeWidth={2.25} color="#E63946" />
          </Pressable>
          <Pressable
            onPress={onEdit}
            className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
            accessibilityLabel="Edit maintenance"
          >
            <Pencil size={18} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
          <Pressable
            onPress={onClose}
            className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
            accessibilityLabel="Close"
          >
            <X size={18} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
        </View>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
        showsVerticalScrollIndicator={false}
      >
        <FieldRow
          label="Maintenance Type"
          Icon={TypeIcon}
          value={record.typeName}
          iconColor={record.iconColor}
        />

        <View className="gap-1.5">
          <FieldRow
            label="Date"
            Icon={Calendar}
            value={formatDateShort(record.servicedAt)}
          />
          {dateOverdue && overdueLabel && (
            <Text className="text-base font-medium text-danger">
              {overdueLabel}
            </Text>
          )}
        </View>

        <FieldRow
          label="Mileage at Service"
          Icon={Gauge}
          value={
            record.mileageAtService != null
              ? record.mileageAtService.toLocaleString('en-US')
              : null
          }
          placeholder="—"
        />

        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Cost (optional)</Text>
          <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5">
            <Text className="text-base font-medium text-fg-2 w-5 text-center">£</Text>
            <Text className="text-base font-sans text-fg-1">
              {record.cost != null ? record.cost.toFixed(2) : '0'}
            </Text>
          </View>
        </View>

        <FieldRow
          label="Provider/Shop (optional)"
          Icon={MapPin}
          value={record.providerName}
          placeholder="No Location Entered"
        />

        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Notes (optional)</Text>
          <View className="bg-surface-1 rounded-card p-4 min-h-[104px]">
            <View className="flex-row items-start gap-2.5">
              <FileText size={20} strokeWidth={2.25} color={record.notes ? '#A1A7B3' : '#6B7280'} />
              <Text
                className={`flex-1 text-base font-sans ${
                  record.notes ? 'text-fg-1' : 'text-fg-muted'
                }`}
              >
                {record.notes || 'No Notes Added'}
              </Text>
            </View>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Photo (optional)</Text>
          {photoUrl ? (
            <Image
              source={{ uri: photoUrl }}
              className="w-full h-48 rounded-card bg-surface-1"
              resizeMode="cover"
            />
          ) : (
            <View className="bg-surface-1 border-[1.6px] border-dashed border-surface-4 rounded-card py-8 flex-row items-center justify-center gap-3">
              <Camera size={20} strokeWidth={2.25} color="#A1A7B3" />
              <Text className="text-base font-medium text-fg-2">No Photo</Text>
            </View>
          )}
        </View>

        {/* Next Due (read-only display when set) */}
        {(record.nextDueDate || record.nextDueKm != null) && (
          <View className="gap-2">
            <Text className="text-sm font-medium text-fg-2">Next Due</Text>
            <View className="gap-2">
              {record.nextDueDate && (
                <FieldRow
                  label=""
                  Icon={Calendar}
                  value={formatDateShort(record.nextDueDate)}
                />
              )}
              {record.nextDueKm != null && (
                <FieldRow
                  label=""
                  Icon={Gauge}
                  value={`${record.nextDueKm.toLocaleString('en-US')} km`}
                />
              )}
            </View>
          </View>
        )}

        {dateOverdue && overdueLabel && (
          <View className="items-center pt-2">
            <Text className="text-base font-medium text-danger">
              {overdueLabel}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Edit body ──────────────────────────────────────────────────────────────

function EditBody({
  record,
  initialPhotoUrl,
  carId,
  onCancel,
  onSaved,
  onError,
}: {
  record: MaintenanceRecordDetail;
  initialPhotoUrl: string | null;
  carId: string | null;
  onCancel: () => void;
  onSaved: () => void;
  onError: (msg: string) => void;
}) {
  const queryClient = useQueryClient();

  const [selectedType, setSelectedType] = useState<MaintenanceType | null>({
    id: record.typeId,
    name: record.typeName,
    icon: record.iconName,
    color: record.iconColor,
    is_default: false,
    default_interval_days: null,
    default_interval_km: null,
    sort_order: 0,
    user_id: null,
  });
  const [date, setDate] = useState<string>(record.servicedAt);
  const [mileage, setMileage] = useState<string>(
    record.mileageAtService != null ? String(record.mileageAtService) : ''
  );
  const [cost, setCost] = useState<string>(
    record.cost != null ? String(record.cost) : ''
  );
  const [provider, setProvider] = useState<string>(record.providerName ?? '');
  const [notes, setNotes] = useState<string>(record.notes ?? '');
  const [nextDueDate, setNextDueDate] = useState<string | null>(record.nextDueDate);
  const [nextDueKm, setNextDueKm] = useState<string>(
    record.nextDueKm != null ? String(record.nextDueKm) : ''
  );
  // Photo state: separates remote (already-uploaded) vs new local pick.
  // - photoUri = currently displayed image (signed remote URL OR new local file:// URI)
  // - newLocalUri = a freshly picked file that needs upload on save
  // - removed = user cleared the photo, existing one should be deleted on save
  const [photoUri, setPhotoUri] = useState<string | null>(initialPhotoUrl);
  const [newLocalUri, setNewLocalUri] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [typeSheetOpen, setTypeSheetOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  function handlePhotoChange(uri: string | null) {
    if (uri === null) {
      setPhotoUri(null);
      setNewLocalUri(null);
      if (record.photoUrl) setRemoved(true);
    } else {
      setPhotoUri(uri);
      setNewLocalUri(uri);
      setRemoved(false);
    }
  }

  async function handleSave() {
    if (!selectedType) {
      onError('Maintenance type is required');
      return;
    }
    const mileageNum = mileage.trim() ? Number(mileage) : NaN;
    if (!mileage.trim() || Number.isNaN(mileageNum) || mileageNum < 0) {
      onError('Mileage is required');
      return;
    }

    setSaving(true);
    try {
      // Decide photo path: keep existing, replace, or clear
      let finalPhotoPath: string | null = record.photoUrl;
      if (newLocalUri) {
        finalPhotoPath = await uploadMaintenancePhoto(newLocalUri);
        if (record.photoUrl) {
          // Best-effort delete of the old file. Do not fail save if cleanup fails.
          deleteMaintenancePhoto(record.photoUrl).catch(() => {});
        }
      } else if (removed && record.photoUrl) {
        deleteMaintenancePhoto(record.photoUrl).catch(() => {});
        finalPhotoPath = null;
      }

      const costNum = cost.trim() ? Number(cost) : NaN;
      const nextKmNum = nextDueKm.trim() ? Number(nextDueKm) : NaN;

      await updateMaintenanceRecord(record.id, {
        typeId: selectedType.id,
        servicedAt: date,
        mileageAtService: mileageNum,
        cost: Number.isFinite(costNum) ? costNum : null,
        providerName: provider.trim() || null,
        notes: notes.trim() || null,
        photoUrl: finalPhotoPath,
        nextDueDate,
        nextDueKm:
          Number.isFinite(nextKmNum) && nextKmNum >= 0 ? nextKmNum : null,
      });

      if (carId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cars.byId(carId) });
        queryClient.invalidateQueries({
          queryKey: queryKeys.maintenanceRecords.all(carId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.maintenanceRecords.all(''), record.id],
      });
      onSaved();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to save changes');
      setSaving(false);
    }
  }

  const TypeIcon = selectedType ? (ICON_MAP[selectedType.icon] ?? Wrench) : null;
  const hasNextDue = nextDueDate !== null || nextDueKm.trim() !== '';

  return (
    <View className="flex-1">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
        <Text className="text-xl font-medium text-fg-1">Edit Maintenance</Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            onPress={onDelete}
            className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
            accessibilityLabel="Delete maintenance"
            disabled={saving}
          >
            <Trash2 size={18} strokeWidth={2.25} color="#E63946" />
          </Pressable>
          <Pressable
            onPress={onCancel}
            className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
            accessibilityLabel="Cancel edit"
            disabled={saving}
          >
            <X size={18} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
        </View>
      </View>

      {/* Form */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Maintenance Type</Text>
          <Pressable
            onPress={() => setTypeSheetOpen(true)}
            className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center justify-between active:opacity-95"
          >
            <View className="flex-row items-center gap-2.5 flex-1">
              {TypeIcon && selectedType ? (
                <TypeIcon size={20} strokeWidth={2.25} color={selectedType.color} />
              ) : null}
              <Text className="text-base font-sans text-fg-1">
                {selectedType?.name ?? 'Select type'}
              </Text>
            </View>
            <ChevronRight size={20} strokeWidth={2.25} color="#A1A7B3" />
          </Pressable>
        </View>

        {/* Date */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Date</Text>
          <DateField value={date} onChange={(v) => v && setDate(v)} />
        </View>

        {/* Mileage */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Mileage at Service</Text>
          <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px]">
            <Gauge size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={mileage}
              onChangeText={setMileage}
              keyboardType="number-pad"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </View>
        </View>

        {/* Cost */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Cost (optional)</Text>
          <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px]">
            <Text className="text-base font-medium text-fg-2 w-5 text-center">£</Text>
            <TextInput
              value={cost}
              onChangeText={setCost}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor="#6B7280"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </View>
        </View>

        {/* Provider */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Provider/Shop (optional)</Text>
          <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px]">
            <MapPin size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={provider}
              onChangeText={setProvider}
              placeholder="No Location Entered"
              placeholderTextColor="#6B7280"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </View>
        </View>

        {/* Notes */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Notes (optional)</Text>
          <View className="bg-surface-1 rounded-card p-4 flex-row items-start gap-2.5 min-h-[104px]">
            <FileText size={20} strokeWidth={2.25} color="#A1A7B3" />
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="No Notes Added"
              placeholderTextColor="#6B7280"
              multiline
              textAlignVertical="top"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </View>
        </View>

        {/* Photo */}
        <View className="gap-2">
          <Text className="text-sm font-medium text-fg-2">Photo (optional)</Text>
          <PhotoField value={photoUri} onChange={handlePhotoChange} />
        </View>

        {/* Next Due */}
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-fg-2">Next Due (optional)</Text>
            {hasNextDue && (
              <Pressable
                onPress={() => {
                  setNextDueDate(null);
                  setNextDueKm('');
                }}
                hitSlop={8}
                className="flex-row items-center gap-1 active:opacity-95"
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
          <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px]">
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
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 pt-4">
          <View className="flex-1">
            <Button
              label="Cancel"
              onPress={onCancel}
              variant="secondary"
              size="lg"
              fullWidth
              disabled={saving}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Save"
              onPress={handleSave}
              loading={saving}
              size="lg"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>

      <MaintenanceTypeSheet
        visible={typeSheetOpen}
        selectedTypeId={selectedType?.id ?? null}
        onClose={() => setTypeSheetOpen(false)}
        onSelect={(t) => setSelectedType(t)}
      />
    </View>
  );
}

// ─── Sheet ──────────────────────────────────────────────────────────────────

export function MaintenanceDetailsSheet({
  visible,
  recordId,
  carId,
  onClose,
}: MaintenanceDetailsSheetProps) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Reset edit mode whenever the sheet opens with a different record
  useEffect(() => {
    if (!visible) setEditing(false);
  }, [visible]);

  const { data: record, isLoading } = useQuery({
    queryKey: recordId
      ? [...queryKeys.maintenanceRecords.all(''), recordId]
      : ['maintenance-record', 'none'],
    queryFn: () => fetchMaintenanceRecord(recordId!),
    enabled: visible && !!recordId,
  });

  // Resolve a signed URL for the stored photo path
  const { data: photoUrl } = useQuery({
    queryKey: record?.photoUrl ? ['photo-url', record.photoUrl] : ['photo-url', 'none'],
    queryFn: () => getMaintenancePhotoUrl(record!.photoUrl!),
    enabled: !!record?.photoUrl,
    staleTime: 30 * 60 * 1000, // signed URLs last 1h, refresh after 30m
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMaintenanceRecord,
    onSuccess: () => {
      // Best-effort photo cleanup; database row is already gone.
      if (record?.photoUrl) {
        deleteMaintenancePhoto(record.photoUrl).catch(() => {});
      }
      if (carId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cars.byId(carId) });
        queryClient.invalidateQueries({
          queryKey: queryKeys.maintenanceRecords.all(carId),
        });
      }
      setSuccessToast(`"${record?.typeName}" deleted successfully.`);
      setTimeout(() => onClose(), 1500);
    },
    onError: (err) => {
      setErrorToast(err instanceof Error ? err.message : 'Failed to delete');
    },
  });

  function handleDeletePress() {
    setDeleteConfirmOpen(true);
  }

  function handleConfirmDelete() {
    if (record) {
      deleteMutation.mutate(record.id);
    }
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapHeight={SCREEN_HEIGHT * 0.9}
    >
      {isLoading || !record ? (
        <View className="px-4 pt-4 gap-3">
          <Skeleton height={28} width="60%" />
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={56} />
          <Skeleton height={104} />
        </View>
      ) : editing ? (
        <EditBody
          record={record}
          initialPhotoUrl={photoUrl ?? null}
          carId={carId}
          onCancel={() => setEditing(false)}
          onSaved={() => setEditing(false)}
          onError={(msg) => setErrorToast(msg)}
        />
      ) : (
        <ReadBody
          record={record}
          photoUrl={photoUrl ?? null}
          onEdit={() => setEditing(true)}
          onDelete={handleDeletePress}
          onClose={onClose}
        />
      )}

      {errorToast && (
        <View className="absolute top-4 left-4 right-4 bg-danger-20 border border-danger rounded-card px-4 py-3">
          <Pressable onPress={() => setErrorToast(null)}>
            <Text className="text-sm font-medium text-danger">{errorToast}</Text>
          </Pressable>
        </View>
      )}

      {record && (
        <DeleteConfirmationModal
          visible={deleteConfirmOpen}
          title="Delete Maintenance?"
          message='Are you sure you want to delete {itemName}? This action cannot be undone.'
          itemName={record.typeName}
          onCancel={() => setDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          loading={deleteMutation.isPending}
        />
      )}

      <Toast
        visible={successToast !== null}
        type="success"
        message={successToast ?? ''}
        onHide={() => setSuccessToast(null)}
        duration={3000}
      />
    </BottomSheet>
  );
}
