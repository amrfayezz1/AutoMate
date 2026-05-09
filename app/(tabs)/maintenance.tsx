import { ErrorState } from '@/components/ui/ErrorState';
import { MaintenanceDetailsSheet } from '@/components/ui/MaintenanceDetailsSheet';
import { NextDueSheet } from '@/components/ui/NextDueSheet';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { queryKeys } from '@/constants/queryKeys';
import { fetchCars } from '@/lib/services/cars';
import {
  fetchHistory,
  fetchHistoryTypeFacets,
  fetchUpcoming,
  fetchUpcomingTypeFacets,
  type DateRangeFilter,
  type HistoryItem,
  type HistorySortOption,
  type MaintenanceStatus,
  type SortOption,
  type UpcomingItem,
} from '@/lib/services/maintenance';
import { useCarStore } from '@/lib/stores/carStore';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpDown,
  Check,
  ChevronRight,
  Circle,
  Disc,
  Droplets,
  Eye,
  Filter,
  Flame,
  Gauge,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench, Gauge, Circle, Disc, Droplets, Eye, Filter, Flame, Wind, Zap,
  Settings: SettingsIcon,
};

const statusStyle: Record<
  MaintenanceStatus,
  { card: string; badge: string; label: string }
> = {
  overdue: {
    card: 'bg-danger-20 border-[1.5px] border-danger',
    badge: 'bg-danger',
    label: 'Overdue',
  },
  urgent: {
    card: 'bg-warn-20 border-[1.5px] border-warn',
    badge: 'bg-warn',
    label: 'Urgent',
  },
  upcoming: {
    card: 'bg-brand-20 border-[1.5px] border-brand',
    badge: 'bg-brand',
    label: 'Upcoming',
  },
};

function formatDueDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return `Due: ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function formatHistoryDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDueKm(km: number | null): string | null {
  return km != null ? `${km.toLocaleString('en-US')} km` : null;
}

function convertToNextDueItem(item: UpcomingItem, currentOdometer: number): any {
  const kmLeft = item.nextDueKm != null ? item.nextDueKm - currentOdometer : null;
  const daysLeft = item.nextDueDate
    ? Math.ceil(
        (new Date(item.nextDueDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  return {
    sourceRecordId: item.id,
    typeId: item.typeId,
    typeName: item.typeName,
    iconName: item.iconName,
    iconColor: item.iconColor,
    kmLeft,
    daysLeft,
    nextDueKm: item.nextDueKm,
    nextDueDate: item.nextDueDate,
  };
}

function MaintenanceCard({
  item,
  onPress,
}: {
  item: UpcomingItem;
  onPress: (item: UpcomingItem) => void;
}) {
  const Icon = ICON_MAP[item.iconName] ?? Wrench;
  const styles = statusStyle[item.status];
  const dateStr = formatDueDate(item.nextDueDate);
  const kmStr = formatDueKm(item.nextDueKm);

  return (
    <Pressable
      onPress={() => onPress(item)}
      className={`flex-row items-center gap-4 p-3 rounded-card active:opacity-95 ${styles.card}`}
    >
      <View className="bg-surface-2 rounded-pill w-11 h-11 items-center justify-center shrink-0">
        <Icon size={20} strokeWidth={2.25} color={item.iconColor} />
      </View>

      <View className="flex-1 gap-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-base font-medium text-fg-1" numberOfLines={1}>
            {item.typeName}
          </Text>
          <View className={`px-2 py-0.5 rounded-pill ${styles.badge}`}>
            <Text className="text-xs font-medium text-fg-on-brand">
              {styles.label}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          {dateStr && (
            <Text className="text-sm font-medium text-fg-2">{dateStr}</Text>
          )}
          {dateStr && kmStr && (
            <Text className="text-sm font-medium text-fg-2">·</Text>
          )}
          {kmStr && (
            <Text className="text-sm font-medium text-fg-2">{kmStr}</Text>
          )}
        </View>
      </View>

      <ChevronRight size={20} strokeWidth={2.25} color="#A1A7B3" />
    </Pressable>
  );
}

function HistoryMaintenanceCard({
  item,
  onPress,
}: {
  item: HistoryItem;
  onPress: (item: HistoryItem) => void;
}) {
  const Icon = ICON_MAP[item.iconName] ?? Wrench;
  const dateStr = formatHistoryDate(item.servicedAt);
  const kmStr =
    item.mileageAtService != null
      ? `${item.mileageAtService.toLocaleString('en-US')} km`
      : null;
  const costStr = item.cost != null ? `${item.cost.toFixed(2)} LE` : null;

  return (
    <Pressable
      onPress={() => onPress(item)}
      className="flex-row items-center gap-4 p-2.5 rounded-card bg-surface-2 active:opacity-95"
    >
      <View className="bg-surface-4 rounded-pill w-11 h-11 items-center justify-center shrink-0">
        <Icon size={20} strokeWidth={2.25} color={item.iconColor} />
      </View>

      <View className="flex-1 gap-1">
        <Text className="text-base font-medium text-fg-1" numberOfLines={1}>
          {item.typeName}
        </Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-medium text-fg-2">{dateStr}</Text>
          {kmStr && (
            <>
              <Text className="text-sm font-medium text-fg-2">•</Text>
              <Text className="text-sm font-medium text-fg-2">{kmStr}</Text>
            </>
          )}
          {costStr && (
            <>
              <Text className="text-sm font-medium text-fg-2">•</Text>
              <Text className="text-sm font-medium text-fg-2">{costStr}</Text>
            </>
          )}
        </View>
      </View>

      <ChevronRight size={20} strokeWidth={2.25} color="#A1A7B3" />
    </Pressable>
  );
}

const DATE_RANGES: Array<{ value: DateRangeFilter; label: string }> = [
  { value: 'all', label: 'All Time' },
  { value: 'past_week', label: 'Past Week' },
  { value: 'past_month', label: 'Past Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: 'past_year', label: 'Past Year' },
];

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-3 py-1 rounded-pill active:opacity-95 ${
        active ? 'bg-brand' : 'bg-surface-1'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          active ? 'text-fg-on-brand' : 'text-fg-2'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function FilterPanel({
  typeId,
  dateRange,
  typeFacets,
  onTypeChange,
  onDateRangeChange,
}: {
  typeId: string | 'all';
  dateRange: DateRangeFilter;
  typeFacets: Array<{ id: string; name: string }>;
  onTypeChange: (typeId: string | 'all') => void;
  onDateRangeChange: (range: DateRangeFilter) => void;
}) {
  return (
    <View className="bg-surface-3 rounded-card p-4 gap-3">
      <View className="gap-2">
        <Text className="text-sm font-sans text-fg-2">Type</Text>
        <View className="flex-row flex-wrap gap-2">
          <Chip
            label="All"
            active={typeId === 'all'}
            onPress={() => onTypeChange('all')}
          />
          {typeFacets.map((t) => (
            <Chip
              key={t.id}
              label={t.name}
              active={typeId === t.id}
              onPress={() => onTypeChange(t.id)}
            />
          ))}
        </View>
      </View>

      <View className="gap-2">
        <Text className="text-sm font-sans text-fg-2">Date Range</Text>
        <View className="flex-row flex-wrap gap-2">
          {DATE_RANGES.map((r) => (
            <Chip
              key={r.value}
              label={r.label}
              active={dateRange === r.value}
              onPress={() => onDateRangeChange(r.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function SortMenu<T extends string>({
  visible,
  options,
  current,
  onSelect,
  onClose,
}: {
  visible: boolean;
  options: Array<{ value: T; label: string }>;
  current: T;
  onSelect: (sort: T) => void;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable className="flex-1" onPress={onClose}>
        <View
          style={{ top: insets.top + 64, right: 16 }}
          className="absolute w-56 bg-surface-3 rounded-card p-2"
        >
          <Text className="px-3 py-2 text-xs font-sans text-fg-2">Sort by</Text>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => {
                onSelect(opt.value);
                onClose();
              }}
              className="flex-row items-center justify-between px-3 py-2 rounded-card active:opacity-95"
            >
              <Text className="text-sm font-medium text-fg-1">{opt.label}</Text>
              {current === opt.value && (
                <Check size={16} strokeWidth={2.25} color="#3A86FF" />
              )}
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const UPCOMING_SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'urgent', label: 'Most Urgent' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
];

const HISTORY_SORT_OPTIONS: Array<{ value: HistorySortOption; label: string }> = [
  { value: 'date_desc', label: 'Date (Newest)' },
  { value: 'date_asc', label: 'Date (Oldest)' },
  { value: 'cost_desc', label: 'Cost (High to Low)' },
  { value: 'cost_asc', label: 'Cost (Low to High)' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
];

export default function MaintenanceScreen() {
  const insets = useSafeAreaInsets();
  const { activeCarId } = useCarStore();

  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming');
  const [typeId, setTypeId] = useState<string | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRangeFilter>('all');
  const [sort, setSort] = useState<SortOption>('urgent');
  const [historySort, setHistorySort] = useState<HistorySortOption>('date_desc');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [nextDueSheetItem, setNextDueSheetItem] = useState<any>(null);

  const { data: cars = [] } = useQuery({
    queryKey: queryKeys.cars.all,
    queryFn: fetchCars,
  });
  const activeCar = cars.find((c) => c.id === activeCarId) ?? null;

  const { data: upcoming = [], isLoading: upcomingLoading } = useQuery({
    queryKey: [
      ...queryKeys.cars.byId(activeCarId ?? ''),
      'upcoming',
      typeId,
      dateRange,
      sort,
    ],
    queryFn: () =>
      fetchUpcoming(activeCarId!, activeCar!.current_odometer, {
        typeId,
        dateRange,
        sort,
      }),
    enabled: !!activeCarId && !!activeCar && tab === 'upcoming',
  });

  const { data: history = [], isLoading: historyLoading } = useQuery({
    queryKey: [
      ...queryKeys.cars.byId(activeCarId ?? ''),
      'history',
      typeId,
      dateRange,
      historySort,
    ],
    queryFn: () =>
      fetchHistory(activeCarId!, { typeId, dateRange, sort: historySort }),
    enabled: !!activeCarId && tab === 'history',
  });

  const { data: upcomingTypeFacets = [] } = useQuery({
    queryKey: [...queryKeys.cars.byId(activeCarId ?? ''), 'upcomingFacets'],
    queryFn: () => fetchUpcomingTypeFacets(activeCarId!),
    enabled: !!activeCarId,
  });

  const { data: historyTypeFacets = [] } = useQuery({
    queryKey: [...queryKeys.cars.byId(activeCarId ?? ''), 'historyFacets'],
    queryFn: () => fetchHistoryTypeFacets(activeCarId!),
    enabled: !!activeCarId,
  });

  if (!activeCarId) {
    return (
      <ErrorState
        title="No active car"
        description="Select a car to view its maintenance schedule."
      />
    );
  }

  const typeFacets = tab === 'upcoming' ? upcomingTypeFacets : historyTypeFacets;

  return (
    <View className="flex-1 bg-surface-0">
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingBottom: 120,
          paddingHorizontal: 16,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-medium text-fg-1">Maintenance</Text>
          <Pressable
            onPress={() => setSortOpen(true)}
            className="bg-surface-2 rounded-pill w-10 h-10 items-center justify-center active:opacity-95"
          >
            <ArrowUpDown size={20} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setTab('upcoming')}
              className={`px-4 py-2 rounded-pill active:opacity-95 ${
                tab === 'upcoming' ? 'bg-brand' : 'bg-surface-2'
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  tab === 'upcoming' ? 'text-fg-on-brand' : 'text-fg-2'
                }`}
              >
                Upcoming
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setTab('history')}
              className={`px-4 py-2 rounded-pill active:opacity-95 ${
                tab === 'history' ? 'bg-brand' : 'bg-surface-2'
              }`}
            >
              <Text
                className={`text-base font-medium ${
                  tab === 'history' ? 'text-fg-on-brand' : 'text-fg-2'
                }`}
              >
                History
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => setFilterOpen((v) => !v)}
            className="bg-surface-2 rounded-pill w-10 h-10 items-center justify-center active:opacity-95"
          >
            <SlidersHorizontal size={20} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
        </View>

        {filterOpen && (
          <FilterPanel
            typeId={typeId}
            dateRange={dateRange}
            typeFacets={typeFacets}
            onTypeChange={setTypeId}
            onDateRangeChange={setDateRange}
          />
        )}

        {tab === 'upcoming' ? (
          upcomingLoading ? (
            <View className="gap-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </View>
          ) : upcoming.length === 0 ? (
            <View className="bg-surface-2 rounded-card p-4">
              <Text className="text-sm font-sans text-fg-muted">
                No upcoming maintenance.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {upcoming.map((item) => (
                <MaintenanceCard
                  key={item.id}
                  item={item}
                  onPress={(upcomingItem) =>
                    setNextDueSheetItem(
                      convertToNextDueItem(
                        upcomingItem,
                        activeCar!.current_odometer
                      )
                    )
                  }
                />
              ))}
            </View>
          )
        ) : historyLoading ? (
          <View className="gap-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </View>
        ) : history.length === 0 ? (
          <View className="bg-surface-2 rounded-card p-4">
            <Text className="text-sm font-sans text-fg-muted">
              No maintenance history.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {history.map((item) => (
              <HistoryMaintenanceCard
                key={item.id}
                item={item}
                onPress={(historyItem) => setSelectedRecordId(historyItem.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {tab === 'upcoming' ? (
        <SortMenu
          visible={sortOpen}
          options={UPCOMING_SORT_OPTIONS}
          current={sort}
          onSelect={setSort}
          onClose={() => setSortOpen(false)}
        />
      ) : (
        <SortMenu
          visible={sortOpen}
          options={HISTORY_SORT_OPTIONS}
          current={historySort}
          onSelect={setHistorySort}
          onClose={() => setSortOpen(false)}
        />
      )}

      <MaintenanceDetailsSheet
        visible={selectedRecordId !== null}
        recordId={selectedRecordId}
        carId={activeCarId}
        onClose={() => setSelectedRecordId(null)}
      />

      <NextDueSheet
        visible={nextDueSheetItem !== null}
        item={nextDueSheetItem}
        carId={activeCarId}
        currentOdometer={activeCar?.current_odometer ?? null}
        onClose={() => setNextDueSheetItem(null)}
      />
    </View>
  );
}
