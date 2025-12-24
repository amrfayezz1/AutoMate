import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { width } = Dimensions.get('window');

// Mock data - will be replaced with real data
const mockUpcomingMaintenance = [
  {
    id: '1',
    type: 'oil',
    typeName: 'Oil Change',
    carName: '2021 Toyota Camry',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    dueMileage: 45500,
    currentMileage: 45000,
    status: 'upcoming',
    color: '#FBBF24',
  },
  {
    id: '2',
    type: 'tires',
    typeName: 'Tire Rotation',
    carName: '2021 Toyota Camry',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks
    dueMileage: 50000,
    currentMileage: 45000,
    status: 'upcoming',
    color: '#9CA3AF',
  },
  {
    id: '3',
    type: 'brakes',
    typeName: 'Brake Inspection',
    carName: '2020 Honda Accord',
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    dueMileage: 60000,
    currentMileage: 62000,
    status: 'overdue',
    color: '#F87171',
  },
  {
    id: '4',
    type: 'filters',
    typeName: 'Air Filter',
    carName: '2021 Toyota Camry',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month
    dueMileage: 55000,
    currentMileage: 45000,
    status: 'upcoming',
    color: '#34D399',
  },
];

type FilterType = 'all' | 'overdue' | 'upcoming';

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

const getDaysUntil = (date: Date): number => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function MaintenanceDueScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredData = mockUpcomingMaintenance.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  // Sort by most urgent first
  const sortedData = [...filteredData].sort((a, b) => {
    const daysA = getDaysUntil(a.dueDate);
    const daysB = getDaysUntil(b.dueDate);
    return daysA - daysB;
  });

  const overdueCount = mockUpcomingMaintenance.filter((i) => i.status === 'overdue').length;
  const upcomingCount = mockUpcomingMaintenance.filter((i) => i.status === 'upcoming').length;

  const styles = createStyles(theme);

  const renderItem = ({ item }: { item: typeof mockUpcomingMaintenance[0] }) => {
    const daysUntil = getDaysUntil(item.dueDate);
    const isOverdue = daysUntil < 0;
    const kmRemaining = item.dueMileage - item.currentMileage;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          isOverdue && { borderLeftColor: theme.critical, borderLeftWidth: 4 },
        ]}
        onPress={() => router.push(`/maintenance/${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={getIconForType(item.type)} size={28} color={item.color} />
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <Text style={styles.typeName}>{item.typeName}</Text>
          <Text style={styles.carName}>{item.carName}</Text>
          
          <View style={styles.dueInfo}>
            {/* Time */}
            <View style={styles.dueItem}>
              <Ionicons 
                name="calendar-outline" 
                size={14} 
                color={isOverdue ? theme.critical : theme.textMuted} 
              />
              <Text 
                style={[
                  styles.dueText, 
                  isOverdue && { color: theme.critical, fontWeight: '600' }
                ]}
              >
                {isOverdue 
                  ? `Overdue by ${Math.abs(daysUntil)} days` 
                  : daysUntil === 0 
                    ? 'Due today'
                    : `Due in ${daysUntil} days`
                }
              </Text>
            </View>

            {/* Mileage */}
            {kmRemaining > 0 && (
              <View style={styles.dueItem}>
                <Ionicons name="speedometer-outline" size={14} color={theme.textMuted} />
                <Text style={styles.dueText}>
                  {kmRemaining.toLocaleString()} km remaining
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.headerTitle}>Maintenance Due</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({mockUpcomingMaintenance.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab, 
            filter === 'overdue' && styles.filterTabActive,
            overdueCount > 0 && { borderColor: theme.critical },
          ]}
          onPress={() => setFilter('overdue')}
        >
          <Text 
            style={[
              styles.filterText, 
              filter === 'overdue' && styles.filterTextActive,
              overdueCount > 0 && filter !== 'overdue' && { color: theme.critical },
            ]}
          >
            Overdue ({overdueCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.filterTabActive]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>
            Upcoming ({upcomingCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={theme.success} />
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptyText}>No maintenance due at the moment.</Text>
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
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
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
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      gap: Spacing.sm,
    },
    filterTab: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterTabActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    filterTextActive: {
      color: '#FFF',
    },
    listContent: {
      padding: Spacing.lg,
      flexGrow: 1,
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
      width: 56,
      height: 56,
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
    dueInfo: {
      gap: Spacing.xs,
    },
    dueItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    dueText: {
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xxl * 2,
    },
    emptyTitle: {
      fontSize: FontSizes.xl,
      fontWeight: '600',
      color: theme.textPrimary,
      marginTop: Spacing.md,
      marginBottom: Spacing.xs,
    },
    emptyText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
  });
