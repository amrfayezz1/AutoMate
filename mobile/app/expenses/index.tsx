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
const mockExpenseData = {
  totalThisMonth: 450,
  totalThisYear: 2850,
  byCategory: [
    { category: 'Oil & Fluids', amount: 280, color: '#FBBF24', icon: 'water-outline' },
    { category: 'Tires', amount: 500, color: '#9CA3AF', icon: 'ellipse-outline' },
    { category: 'Brakes', amount: 350, color: '#F87171', icon: 'disc-outline' },
    { category: 'Filters', amount: 120, color: '#34D399', icon: 'funnel-outline' },
    { category: 'Insurance', amount: 1200, color: '#60A5FA', icon: 'shield-outline' },
    { category: 'Other', amount: 400, color: '#A78BFA', icon: 'ellipsis-horizontal-outline' },
  ],
  monthlyTrend: [180, 220, 150, 320, 280, 450],
};

export default function ExpenseSummaryScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<'month' | 'year'>('year');

  const total = period === 'month' ? mockExpenseData.totalThisMonth : mockExpenseData.totalThisYear;

  const styles = createStyles(theme);

  const renderCategoryItem = ({ item }: { item: typeof mockExpenseData.byCategory[0] }) => {
    const percentage = Math.round((item.amount / mockExpenseData.totalThisYear) * 100);

    return (
      <View style={styles.categoryItem}>
        <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon as any} size={20} color={item.color} />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.category}</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${percentage}%`, backgroundColor: item.color },
              ]}
            />
          </View>
        </View>
        <View style={styles.categoryAmount}>
          <Text style={styles.amountText}>${item.amount}</Text>
          <Text style={styles.percentageText}>{percentage}%</Text>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Period Toggle */}
      <View style={styles.periodToggle}>
        <TouchableOpacity
          style={[styles.periodButton, period === 'month' && styles.periodButtonActive]}
          onPress={() => setPeriod('month')}
        >
          <Text style={[styles.periodText, period === 'month' && styles.periodTextActive]}>
            This Month
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, period === 'year' && styles.periodButtonActive]}
          onPress={() => setPeriod('year')}
        >
          <Text style={[styles.periodText, period === 'year' && styles.periodTextActive]}>
            This Year
          </Text>
        </TouchableOpacity>
      </View>

      {/* Total Card */}
      <View style={[styles.totalCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        <Text style={styles.totalPeriod}>
          {period === 'month' ? 'December 2024' : 'Year 2024'}
        </Text>
      </View>

      {/* Chart */}
      <View style={[styles.chartCard, { backgroundColor: theme.surface }]}>
        <Text style={styles.chartTitle}>Monthly Trend</Text>
        <View style={styles.chartContainer}>
          {mockExpenseData.monthlyTrend.map((value, idx) => (
            <View key={idx} style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (value / Math.max(...mockExpenseData.monthlyTrend)) * 100,
                    backgroundColor: idx === 5 ? theme.primary : theme.primary + '40',
                  },
                ]}
              />
              <Text style={styles.barLabel}>
                {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][idx]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Breakdown Title */}
      <Text style={styles.sectionTitle}>Breakdown by Category</Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Expense Summary</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/expenses/add' as any)}
        >
          <Ionicons name="add" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockExpenseData.byCategory}
        keyExtractor={(item) => item.category}
        renderItem={renderCategoryItem}
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
    periodToggle: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: 4,
      marginBottom: Spacing.lg,
    },
    periodButton: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      borderRadius: BorderRadius.md,
    },
    periodButtonActive: {
      backgroundColor: theme.primary,
    },
    periodText: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    periodTextActive: {
      color: '#FFF',
    },
    totalCard: {
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    totalLabel: {
      fontSize: FontSizes.sm,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: Spacing.xs,
    },
    totalAmount: {
      fontSize: 48,
      fontWeight: '700',
      color: '#FFF',
      marginBottom: Spacing.xs,
    },
    totalPeriod: {
      fontSize: FontSizes.sm,
      color: 'rgba(255,255,255,0.8)',
    },
    chartCard: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.xl,
      marginBottom: Spacing.lg,
    },
    chartTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    chartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 120,
    },
    barContainer: {
      alignItems: 'center',
      flex: 1,
    },
    bar: {
      width: '60%',
      borderRadius: BorderRadius.sm,
      marginBottom: Spacing.xs,
    },
    barLabel: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
    sectionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
      gap: Spacing.md,
    },
    categoryIcon: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.surfaceAlt,
      borderRadius: 3,
    },
    progressBar: {
      height: '100%',
      borderRadius: 3,
    },
    categoryAmount: {
      alignItems: 'flex-end',
    },
    amountText: {
      fontSize: FontSizes.md,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    percentageText: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
  });
