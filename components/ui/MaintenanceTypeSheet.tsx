import { queryKeys } from '@/constants/queryKeys';
import {
  fetchMaintenanceTypes,
  type MaintenanceType,
} from '@/lib/services/maintenance';
import { useQuery } from '@tanstack/react-query';
import {
  Circle,
  Disc,
  Droplets,
  Eye,
  Filter,
  Flame,
  Gauge,
  Search,
  Settings as SettingsIcon,
  Wind,
  Wrench,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Skeleton } from './Skeleton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ICON_MAP: Record<string, LucideIcon> = {
  Wrench, Gauge, Circle, Disc, Droplets, Eye, Filter, Flame, Wind, Zap,
  Settings: SettingsIcon,
};

interface MaintenanceTypeSheetProps {
  visible: boolean;
  selectedTypeId: string | null;
  onClose: () => void;
  onSelect: (type: MaintenanceType) => void;
}

function TypeRow({
  type,
  onPress,
}: {
  type: MaintenanceType;
  onPress: () => void;
}) {
  const Icon = ICON_MAP[type.icon] ?? Wrench;
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 bg-surface-2 rounded-card px-4 py-3 active:opacity-95"
    >
      <View className="bg-surface-4 rounded-pill w-11 h-11 items-center justify-center shrink-0">
        <Icon size={20} strokeWidth={2.25} color={type.color} />
      </View>
      <Text className="text-base font-medium text-fg-1">{type.name}</Text>
    </Pressable>
  );
}

export function MaintenanceTypeSheet({
  visible,
  onClose,
  onSelect,
}: MaintenanceTypeSheetProps) {
  const [search, setSearch] = useState('');

  const { data: types = [], isLoading } = useQuery({
    queryKey: queryKeys.maintenanceTypes.all,
    queryFn: fetchMaintenanceTypes,
    enabled: visible,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return types;
    return types.filter((t) => t.name.toLowerCase().includes(q));
  }, [types, search]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapHeight={SCREEN_HEIGHT * 0.8}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
          <Text className="text-xl font-medium text-fg-1">Select Type</Text>
          <Pressable
            onPress={onClose}
            className="bg-surface-4 rounded-pill w-9 h-9 items-center justify-center active:opacity-95"
            accessibilityLabel="Close"
          >
            <X size={18} strokeWidth={2.25} color="#E6E8EC" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="px-4 pb-4">
          <View className="bg-surface-1 rounded-pill flex-row items-center gap-2 px-4 py-3">
            <Search size={20} strokeWidth={2.25} color="#6B7280" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search"
              placeholderTextColor="#6B7280"
              className="flex-1 text-base font-sans text-fg-1"
            />
          </View>
        </View>

        {/* List */}
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isLoading ? (
            <>
              <Skeleton height={68} />
              <Skeleton height={68} />
              <Skeleton height={68} />
            </>
          ) : filtered.length === 0 ? (
            <View className="bg-surface-2 rounded-card p-4">
              <Text className="text-sm font-sans text-fg-muted">
                {search.trim() ? 'No matching types.' : 'No maintenance types available.'}
              </Text>
            </View>
          ) : (
            filtered.map((type) => (
              <TypeRow
                key={type.id}
                type={type}
                onPress={() => {
                  onSelect(type);
                  setSearch('');
                  onClose();
                }}
              />
            ))
          )}
        </ScrollView>
      </View>
    </BottomSheet>
  );
}
