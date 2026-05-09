import { CarSwitcher } from '@/components/ui/CarSwitcher';
import { ErrorState } from '@/components/ui/ErrorState';
import { NextDueSheet } from '@/components/ui/NextDueSheet';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { UpdateMileageSheet } from '@/components/ui/UpdateMileageSheet';
import { queryKeys } from '@/constants/queryKeys';
import { fetchCars } from '@/lib/services/cars';
import {
  fetchMonthlySpend,
  fetchNextDue,
  fetchRecentActivity,
  type ActivityItem,
  type MonthlySpend,
  type NextDueItem,
  type SpendItem,
} from '@/lib/services/maintenance';
import { useCarStore } from '@/lib/stores/carStore';
import { useOnboardingStore } from '@/lib/stores/onboardingStore';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import {
  ChevronDown,
  Circle,
  Disc,
  Droplets,
  Eye,
  Filter,
  Flame,
  Gauge,
  MoreHorizontal,
  Pencil,
  Route,
  Settings,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';

// Maps icon name strings stored in maintenance_types.icon → Lucide components.
// Add new entries here when new maintenance types are introduced.
const ICON_MAP: Record<string, LucideIcon> = {
  Wrench, Gauge, Circle, Disc, Droplets, Eye, Filter, Flame, Route, Settings, Wind, Zap,
};
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Helpers ─────────────────────────────────────────────

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return '1 week ago';
  if (weeks < 4) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

function formatCurrency(value: number): string {
  return `${value.toFixed(2)} LE`;
}

function formatKm(value: number): string {
  return `${value.toLocaleString('en-US')} km`;
}

// ─── Sub-components ──────────────────────────────────────

function NextDueCard({
  item,
  onPress,
}: {
  item: NextDueItem;
  onPress: () => void;
}) {
  const Icon = ICON_MAP[item.iconName] ?? Wrench;
  return (
    <Pressable
      onPress={onPress}
      className="bg-warn-20 border-[1.5px] border-warn rounded-card p-4 gap-4 active:opacity-95"
    >
      <View className="flex-row items-center gap-3">
        <View className="bg-warn-30 rounded-pill w-12 h-12 items-center justify-center">
          <Icon size={20} strokeWidth={2.25} color={item.iconColor} />
        </View>
        <View className="gap-0.5">
          <Text className="text-sm font-sans text-fg-2">Next Due</Text>
          <Text className="text-lg font-medium text-fg-1">{item.typeName}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1">
        <Gauge size={20} strokeWidth={2.25} color="#FF9F1C" />
        {item.kmLeft != null ? (
          <Text className="text-base font-sans">
            <Text className="text-warn font-medium">{formatKm(item.kmLeft)}</Text>
            <Text className="text-fg-2"> left</Text>
          </Text>
        ) : item.daysLeft != null ? (
          <Text className="text-base font-sans">
            <Text className="text-warn font-medium">{item.daysLeft} days</Text>
            <Text className="text-fg-2"> left</Text>
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function ActivityRow({ item }: { item: ActivityItem }) {
  const Icon = ICON_MAP[item.iconName] ?? Wrench;
  return (
    <View className="bg-surface-2 rounded-card p-4 flex-row items-center gap-4">
      <View className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center shrink-0">
        <Icon size={16} strokeWidth={2.25} color={item.iconColor} />
      </View>
      <View className="gap-1 flex-1">
        <Text className="text-base font-sans text-fg-1" numberOfLines={1}>
          {item.label}
        </Text>
        <Text className="text-sm font-sans text-fg-2">
          {formatRelativeTime(item.occurredAt)}
        </Text>
      </View>
    </View>
  );
}

function SpendRow({ item, isFirst }: { item: SpendItem; isFirst: boolean }) {
  return (
    <View
      className={`flex-row items-center justify-between py-3 ${
        isFirst ? '' : 'border-t border-surface-4'
      }`}
    >
      <Text className="text-base font-sans text-fg-2">{item.typeName}</Text>
      <Text className="text-base font-sans text-fg-1">{formatCurrency(item.cost)}</Text>
    </View>
  );
}

function MonthlySpendCard({ spend }: { spend: MonthlySpend }) {
  return (
    <View className="bg-surface-2 rounded-card p-6 gap-6">
      <View className="flex-row items-center gap-3">
        <View className="bg-brand-30 rounded-pill w-12 h-12 items-center justify-center">
          <Text className="text-brand text-lg font-medium">LE</Text>
        </View>
        <View className="gap-0.5">
          <Text className="text-sm font-sans text-fg-2">Total This Month</Text>
          <Text className="text-2xl font-medium text-fg-1">
            {formatCurrency(spend.total)}
          </Text>
        </View>
      </View>
      {spend.items.length > 0 && (
        <View>
          {spend.items.map((item, i) => (
            <SpendRow key={i} item={item} isFirst={i === 0} />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Screen ──────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { activeCarId, setActiveCarId } = useCarStore();
  const resetOnboarding = useOnboardingStore((s) => s.reset);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [nextDueSheetOpen, setNextDueSheetOpen] = useState(false);
  const [mileageSheetOpen, setMileageSheetOpen] = useState(false);

  const { data: cars = [], isLoading: carsLoading } = useQuery({
    queryKey: queryKeys.cars.all,
    queryFn: fetchCars,
  });

  // Auto-select first car
  useEffect(() => {
    if (!activeCarId && cars.length > 0) {
      setActiveCarId(cars[0].id);
    }
  }, [cars, activeCarId, setActiveCarId]);

  const activeCar = cars.find((c) => c.id === activeCarId) ?? null;

  const { data: nextDue, isLoading: nextDueLoading } = useQuery({
    queryKey: [...queryKeys.cars.byId(activeCarId ?? ''), 'nextDue'],
    queryFn: () => fetchNextDue(activeCarId!, activeCar!.current_odometer),
    enabled: !!activeCarId && !!activeCar,
  });

  const { data: activity = [], isLoading: activityLoading } = useQuery({
    queryKey: [...queryKeys.cars.byId(activeCarId ?? ''), 'activity'],
    queryFn: () => fetchRecentActivity(activeCarId!),
    enabled: !!activeCarId,
  });

  const { data: monthlySpend, isLoading: spendLoading } = useQuery({
    queryKey: [...queryKeys.cars.byId(activeCarId ?? ''), 'monthlySpend'],
    queryFn: () => fetchMonthlySpend(activeCarId!),
    enabled: !!activeCarId,
  });

  if (!carsLoading && cars.length === 0) {
    return (
      <ErrorState
        title="No cars yet"
        description="Add your first car to get started."
      />
    );
  }

  return (
    <>
      <ScrollView
        className="flex-1 bg-surface-0"
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 120,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Car header ── */}
        <Pressable
          className="flex-row items-center gap-2 active:opacity-95"
          onPress={() => setSwitcherOpen(true)}
        >
          <View>
            <Text className="text-xl font-medium text-fg-1">
              {activeCar ? `${activeCar.make} ${activeCar.model}` : '—'}
            </Text>
            <Text className="text-sm font-sans text-fg-2">
              {activeCar?.plate_number ?? '—'}
            </Text>
          </View>
          <ChevronDown size={20} strokeWidth={2.25} color="#A1A7B3" />
        </Pressable>

        {/* ── Mileage card ── */}
        <View className="bg-surface-4 rounded-card p-4 flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-xs font-sans text-fg-2">Current Mileage</Text>
            <Text className="text-base font-sans text-fg-1">
              {activeCar ? formatKm(activeCar.current_odometer) : '—'}
            </Text>
          </View>
          <Pressable
            className="bg-brand rounded-pill w-8 h-8 items-center justify-center active:opacity-95"
            onPress={() => setMileageSheetOpen(true)}
          >
            <Pencil size={14} strokeWidth={2.25} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* ── Next Due ── */}
        {nextDueLoading ? (
          <SkeletonCard />
        ) : nextDue ? (
          <NextDueCard
            item={nextDue}
            onPress={() => setNextDueSheetOpen(true)}
          />
        ) : null}

        {/* ── CTAs ── */}
        <View className="flex-row gap-4">
          <Pressable
            className="flex-1 bg-surface-2 rounded-card p-4 items-center gap-2 active:opacity-95"
            onPress={() => setMileageSheetOpen(true)}
          >
            <View className="bg-brand-30 rounded-pill w-12 h-12 items-center justify-center">
              <Gauge size={20} strokeWidth={2.25} color="#3A86FF" />
            </View>
            <Text className="text-sm font-medium text-fg-1 text-center">
              Update{'\n'}Mileage
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-surface-2 rounded-card p-4 items-center gap-2 active:opacity-95"
            onPress={() => router.push('/maintenance/log')}
          >
            <View className="bg-brand-30 rounded-pill w-12 h-12 items-center justify-center">
              <Route size={20} strokeWidth={2.25} color="#3A86FF" />
            </View>
            <Text className="text-sm font-medium text-fg-1 text-center">
              Log{'\n'}Maintenance
            </Text>
          </Pressable>

          <Pressable
            className="flex-1 bg-surface-2 rounded-card p-4 items-center gap-2 active:opacity-95"
            onPress={() => router.push('/(tabs)/maintenance')}
          >
            <View className="bg-brand-30 rounded-pill w-12 h-12 items-center justify-center">
              <MoreHorizontal size={20} strokeWidth={2.25} color="#3A86FF" />
            </View>
            <Text className="text-sm font-medium text-fg-1 text-center">
              View{'\n'}All
            </Text>
          </Pressable>
        </View>

        {/* ── Recent Activity ── */}
        <View className="gap-2">
          <Text className="text-lg font-medium text-fg-1">Recent Activity</Text>
          {activityLoading ? (
            <SkeletonCard />
          ) : activity.length === 0 ? (
            <View className="bg-surface-2 rounded-card p-4">
              <Text className="text-sm font-sans text-fg-muted">
                No maintenance recorded yet.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {activity.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>

        {/* ── Monthly Spend ── */}
        <View className="gap-2">
          <Text className="text-lg font-medium text-fg-1">Monthly Spend Summary</Text>
          {spendLoading ? (
            <SkeletonCard />
          ) : monthlySpend ? (
            <MonthlySpendCard spend={monthlySpend} />
          ) : null}
        </View>
      </ScrollView>

      <CarSwitcher
        visible={switcherOpen}
        onClose={() => setSwitcherOpen(false)}
        onAddCar={() => {
          setSwitcherOpen(false);
          resetOnboarding();
          router.push('/(auth)/add-car/vehicle');
        }}
      />

      <NextDueSheet
        visible={nextDueSheetOpen}
        item={nextDue ?? null}
        carId={activeCarId}
        currentOdometer={activeCar?.current_odometer ?? null}
        onClose={() => setNextDueSheetOpen(false)}
      />

      <UpdateMileageSheet
        visible={mileageSheetOpen}
        carId={activeCarId}
        currentOdometer={activeCar?.current_odometer ?? null}
        onClose={() => setMileageSheetOpen(false)}
      />
    </>
  );
}
