import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

// Mock data - will be replaced with real data
const mockMaintenanceHistory = [
  {
    id: '1',
    type: 'oil',
    typeName: 'Oil Change',
    carName: '2021 Toyota Camry',
    date: new Date('2024-12-01'),
    mileage: 44000,
    cost: 75,
    provider: 'Quick Lube',
    color: '#FBBF24',
  },
  {
    id: '2',
    type: 'tires',
    typeName: 'Tire Rotation',
    carName: '2021 Toyota Camry',
    date: new Date('2024-11-15'),
    mileage: 42500,
    cost: 25,
    provider: 'Discount Tire',
    color: '#9CA3AF',
  },
  {
    id: '3',
    type: 'brakes',
    typeName: 'Brake Pad Replacement',
    carName: '2020 Honda Accord',
    date: new Date('2024-10-20'),
    mileage: 58000,
    cost: 350,
    provider: 'Honda Dealership',
    color: '#F87171',
  },
  {
    id: '4',
    type: 'filters',
    typeName: 'Air Filter Replacement',
    carName: '2021 Toyota Camry',
    date: new Date('2024-09-10'),
    mileage: 40000,
    cost: 45,
    provider: 'Self',
    color: '#34D399',
  },
  {
    id: '5',
    type: 'oil',
    typeName: 'Oil Change',
    carName: '2021 Toyota Camry',
    date: new Date('2024-06-15'),
    mileage: 39000,
    cost: 70,
    provider: 'Quick Lube',
    color: '#FBBF24',
  },
];

type SortType = 'date' | 'cost' | 'type';

const getIconForType = (type: string): keyof typeof Ionicons.glyphMap => {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    oil: 'water-outline',
    tires: 'ellipse-outline',
    battery: 'battery-half-outline',
    brakes: 'disc-outline',
    filters: 'funnel-outline',
    fluids: 'beaker-outline',
    inspection: 'clipboard-outline',
  };
  return icons[type] || 'build-outline';
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function MaintenanceHistoryScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('date');

  const filteredData = mockMaintenanceHistory.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      item.typeName.toLowerCase().includes(query) ||
      item.carName.toLowerCase().includes(query) ||
      item.provider.toLowerCase().includes(query)
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.date.getTime() - a.date.getTime();
      case 'cost':
        return b.cost - a.cost;
      case 'type':
        return a.typeName.localeCompare(b.typeName);
      default:
        return 0;
    }
  });

  // Calculate totals
  const totalCost = filteredData.reduce((sum, item) => sum + item.cost, 0);
  const totalRecords = filteredData.length;

  const styles = createStyles(theme);

  const renderItem = ({ item }: { item: typeof mockMaintenanceHistory[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/maintenance/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={getIconForType(item.type)} size={24} color={item.color} />
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.typeName}>{item.typeName}</Text>
        <Text style={styles.carName}>{item.carName}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color={theme.textMuted} />
            <Text style={styles.metaText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="speedometer-outline" size={12} color={theme.textMuted} />
            <Text style={styles.metaText}>{item.mileage.toLocaleString()} km</Text>
          </View>
        </View>
      </View>

      {/* Cost */}
      <View style={styles.costContainer}>
        <Text style={styles.costText}>${item.cost}</Text>
        <Text style={styles.providerText}>{item.provider}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
        <Ionicons name="document-text-outline" size={24} color={theme.primary} />
        <Text style={styles.statValue}>{totalRecords}</Text>
        <Text style={styles.statLabel}>Records</Text>
      </View>
      <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
        <Ionicons name="wallet-outline" size={24} color={theme.success} />
        <Text style={styles.statValue}>${totalCost}</Text>
        <Text style={styles.statLabel}>Total Spent</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('maintenance.history')}</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search-outline" size={20} color={theme.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search maintenance..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        {(['date', 'cost', 'type'] as SortType[]).map((option) => (
          <TouchableOpacity
            key={option}
            style={[styles.sortOption, sortBy === option && styles.sortOptionActive]}
            onPress={() => setSortBy(option)}
          >
            <Text 
              style={[styles.sortOptionText, sortBy === option && styles.sortOptionTextActive]}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color={theme.textMuted} />
            <Text style={styles.emptyTitle}>No maintenance history</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No results match your search.' : 'Start tracking your maintenance to build history.'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    filterButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    searchContainer: {
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
    },
    searchInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      gap: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      height: 48,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    sortContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.md,
      gap: Spacing.sm,
    },
    sortLabel: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    sortOption: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.sm,
    },
    sortOptionActive: {
      backgroundColor: theme.primary + '20',
    },
    sortOptionText: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    sortOptionTextActive: {
      color: theme.primary,
      fontWeight: '600',
    },
    listContent: {
      padding: Spacing.lg,
      flexGrow: 1,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    statCard: {
      flex: 1,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statValue: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    statLabel: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.md,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContent: {
      flex: 1,
    },
    typeName: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    carName: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
      marginBottom: Spacing.xs,
    },
    metaRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    metaText: {
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
    },
    costContainer: {
      alignItems: 'flex-end',
    },
    costText: {
      fontSize: FontSizes.lg,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    providerText: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xxl * 2,
    },
    emptyTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    emptyText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
