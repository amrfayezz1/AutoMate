import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { EmptyState } from '@/components/EmptyState';

type TabType = 'all' | 'time' | 'mileage';

export default function RemindersScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const handleAddReminder = () => {
    router.push('/reminders/add');
  };

  const tabs: { id: TabType; labelKey: string }[] = [
    { id: 'all', labelKey: 'common.all' },
    { id: 'time', labelKey: 'common.timeBased' },
    { id: 'mileage', labelKey: 'common.mileageBased' },
  ];

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('reminders.title')}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State */}
        <View style={styles.emptyStateContainer}>
          <EmptyState
            icon="notifications-off-outline"
            title={t('reminders.noReminders')}
            description={t('reminders.noRemindersDescription')}
            actionLabel={t('reminders.addReminder')}
            onAction={handleAddReminder}
          />
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.8}
        onPress={handleAddReminder}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: 100,
    },
    header: {
      paddingVertical: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.xxxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    tabs: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xs,
      marginBottom: Spacing.xl,
    },
    tab: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: 'center',
      borderRadius: BorderRadius.md,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    tabTextActive: {
      color: '#FFF',
    },
    emptyStateContainer: {
      flex: 1,
      minHeight: 400,
    },
    fab: {
      position: 'absolute',
      right: Spacing.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  });
