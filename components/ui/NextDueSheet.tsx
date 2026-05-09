import { queryKeys } from "@/constants/queryKeys";
import {
  createMaintenanceRecord,
  type NextDueItem,
} from "@/lib/services/maintenance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Circle,
  Disc,
  Droplets,
  Eye,
  Filter,
  Flame,
  Gauge,
  Pencil,
  Settings as SettingsIcon,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Button } from "./Button";
import { MaintenanceDetailsSheet } from "./MaintenanceDetailsSheet";

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

interface NextDueSheetProps {
  visible: boolean;
  item: NextDueItem | null;
  /** Active car id (for the new maintenance record + cache invalidation) */
  carId: string | null;
  /** Current odometer reading (used as the new record's mileage_at_service) */
  currentOdometer: number | null;
  onClose: () => void;
  onError?: (message: string) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function statusLine(item: NextDueItem): { text: string; color: string } {
  const { kmLeft, daysLeft } = item;
  const km = kmLeft;
  const days = daysLeft;

  if ((km != null && km < 0) || (days != null && days < 0)) {
    if (km != null && km < 0) {
      return {
        text: `Overdue by ${Math.abs(km).toLocaleString("en-US")} km`,
        color: "#E63946",
      };
    }
    return { text: `Overdue by ${Math.abs(days!)} days`, color: "#E63946" };
  }

  // Both could be set — prefer whichever is more urgent (smaller delta)
  const showKm = km != null && (days == null || km / 500 <= days / 7);
  if (showKm && km != null) {
    const color = km <= 500 ? "#FF9F1C" : "#3A86FF";
    return { text: `Due in ${km.toLocaleString("en-US")} km`, color };
  }
  if (days != null) {
    const color = days <= 7 ? "#FF9F1C" : "#3A86FF";
    return { text: `Due in ${days} days`, color };
  }
  return { text: "", color: "#A1A7B3" };
}

// ─── Field row (read-only) ──────────────────────────────────────────────────

function ReadField({
  label,
  Icon,
  value,
  iconColor,
}: {
  label: string;
  Icon: LucideIcon;
  value: string;
  iconColor?: string;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-fg-2">{label}</Text>
      <View className="bg-surface-1 rounded-card px-4 py-4 flex-row items-center gap-2.5 min-h-[56px]">
        <Icon size={20} strokeWidth={2.25} color={iconColor ?? "#A1A7B3"} />
        <Text className="text-base font-sans text-fg-1">{value}</Text>
      </View>
    </View>
  );
}

// ─── Sheet ──────────────────────────────────────────────────────────────────

export function NextDueSheet({
  visible,
  item,
  carId,
  currentOdometer,
  onClose,
  onError,
}: NextDueSheetProps) {
  const queryClient = useQueryClient();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      if (carId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cars.byId(carId) });
        queryClient.invalidateQueries({
          queryKey: queryKeys.maintenanceRecords.all(carId),
        });
      }
      onClose();
    },
    onError: (err) => {
      onError?.(
        err instanceof Error ? err.message : "Failed to mark as complete",
      );
    },
  });

  if (!item) return null;

  const TypeIcon = ICON_MAP[item.iconName] ?? Wrench;
  const status = statusLine(item);

  // The "Date" field shows today (when the user is marking it complete).
  // The "Mileage" field shows the car's current odometer.
  const dateText = formatDateShort(todayISO());
  const mileageText =
    currentOdometer != null ? currentOdometer.toLocaleString("en-US") : "—";

  function handleMarkComplete() {
    if (!carId || currentOdometer == null) return;
    mutation.mutate({
      carId,
      typeId: item!.typeId,
      servicedAt: todayISO(),
      mileageAtService: currentOdometer,
      cost: null,
      providerName: null,
      notes: null,
      photoUrl: null,
      // Leave next due empty here. User can add reminders later via Log Maintenance flow.
      nextDueDate: null,
      nextDueKm: null,
    });
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        className="flex-1 bg-black/50 items-center justify-center px-4"
      >
        <Pressable
          // Inner pressable absorbs taps so backdrop press doesn't close
          onPress={() => {}}
          className="bg-surface-3 rounded-sheet p-4 w-full max-w-[400px] gap-4"
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-medium text-fg-1">Next Due</Text>
            <Pressable
              onPress={() => setDetailsOpen(true)}
              className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
              accessibilityLabel="Edit maintenance record"
            >
              <Pencil size={18} strokeWidth={2.25} color="#E6E8EC" />
            </Pressable>
          </View>

          <ReadField
            label="Maintenance Type"
            Icon={TypeIcon}
            value={item.typeName}
            iconColor={item.iconColor}
          />

          <ReadField label="Date" Icon={Calendar} value={dateText} />

          <View className="gap-1.5">
            <ReadField
              label="Mileage at Service"
              Icon={Gauge}
              value={mileageText}
            />
            {status.text !== "" && (
              <Text
                className="text-base font-medium"
                style={{ color: status.color }}
              >
                {status.text}
              </Text>
            )}
          </View>

          <Button
            label="Mark As Complete"
            onPress={handleMarkComplete}
            loading={mutation.isPending}
            disabled={!carId || currentOdometer == null}
            fullWidth
          />
        </Pressable>
      </Pressable>

      <MaintenanceDetailsSheet
        visible={detailsOpen}
        recordId={item.sourceRecordId}
        carId={carId}
        onClose={() => setDetailsOpen(false)}
      />
    </Modal>
  );
}
