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

// Mock data
const mockOdometerHistory = [
  { id: '1', date: new Date('2024-12-20'), mileage: 45000, source: 'manual' },
  { id: '2', date: new Date('2024-12-01'), mileage: 44000, source: 'maintenance' },
  { id: '3', date: new Date('2024-11-15'), mileage: 42500, source: 'manual' },
  { id: '4', date: new Date('2024-10-20'), mileage: 40000, source: 'maintenance' },
  { id: '5', date: new Date('2024-09-10'), mileage: 38000, source: 'manual' },
  { id: '6', date: new Date('2024-08-01'), mileage: 35000, source: 'maintenance' },
  { id: '7', date: new Date('2024-06-15'), mileage: 32000, source: 'manual' },
];

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function OdometerHistoryScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const currentMileage = mockOdometerHistory[0]?.mileage || 0;
  const avgMonthlyKm = Math.round(
    (mockOdometerHistory[0].mileage - mockOdometerHistory[mockOdometerHistory.length - 1].mileage) /
    6
  );

  const styles = createStyles(theme);

  const renderItem = ({ item, index }: { item: typeof mockOdometerHistory[0]; index: number }) => {
    const prevMileage = mockOdometerHistory[index + 1]?.mileage;
    const diff = prevMileage ? item.mileage - prevMileage : null;

    return (
      <View style={styles.historyItem}>
        {/* Timeline */}
        <View style={styles.timeline}>
          <View style={[styles.timelineDot, { backgroundColor: theme.primary }]} />
          {index < mockOdometerHistory.length - 1 && (
            <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
          )}
        </View>

        {/* Content */}
        <View style={styles.historyContent}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyMileage}>{item.mileage.toLocaleString()} km</Text>
            {diff && (
              <Text style={[styles.historyDiff, { color: theme.success }]}>
                +{diff.toLocaleString()} km
              </Text>
            )}
          </View>
          <View style={styles.historyMeta}>
            <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
            <View style={[styles.sourceBadge, { backgroundColor: theme.surfaceAlt }]}>
              <Ionicons
                name={item.source === 'manual' ? 'hand-left-outline' : 'construct-outline'}
                size={12}
                color={theme.textMuted}
              />
              <Text style={styles.sourceText}>
                {item.source === 'manual' ? 'Manual' : 'Service'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      {/* Chart Placeholder */}
      <View style={[styles.chartContainer, { backgroundColor: theme.surface }]}>
        <View style={styles.chartPlaceholder}>
          <Ionicons name="analytics-outline" size={48} color={theme.textMuted} />
          <Text style={[styles.chartPlaceholderText, { color: theme.textMuted }]}>
            Mileage Trend
          </Text>
        </View>
        {/* Simple bar representation */}
        <View style={styles.chartBars}>
          {mockOdometerHistory.slice(0, 6).reverse().map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.chartBar,
                {
                  height: (item.mileage / currentMileage) * 80,
                  backgroundColor: theme.primary + ((idx + 3) * 15).toString(16),
                },
              ]}
            />
          ))}
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="speedometer-outline" size={24} color={theme.primary} />
          <Text style={styles.statValue}>{currentMileage.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Current (km)</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
          <Ionicons name="trending-up-outline" size={24} color={theme.success} />
          <Text style={styles.statValue}>{avgMonthlyKm.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Avg/Month (km)</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>History</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Odometer Log</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/mileage/add' as any)}
        >
          <Ionicons name="add" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockOdometerHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
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
    addButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    listContent: {
      padding: Spacing.lg,
    },
    statsContainer: {
      marginBottom: Spacing.lg,
    },
    chartContainer: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.md,
    },
    chartPlaceholder: {
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    chartPlaceholderText: {
      fontSize: FontSizes.sm,
      marginTop: Spacing.xs,
    },
    chartBars: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      height: 80,
    },
    chartBar: {
      width: 30,
      borderRadius: BorderRadius.sm,
    },
    statsRow: {
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
    sectionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
    },
    historyItem: {
      flexDirection: 'row',
      marginBottom: Spacing.md,
    },
    timeline: {
      alignItems: 'center',
      width: 24,
      marginRight: Spacing.md,
    },
    timelineDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    timelineLine: {
      width: 2,
      flex: 1,
      marginTop: Spacing.xs,
    },
    historyContent: {
      flex: 1,
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    historyMileage: {
      fontSize: FontSizes.lg,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    historyDiff: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
    },
    historyMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    historyDate: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    sourceBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
      gap: 4,
    },
    sourceText: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
  });
