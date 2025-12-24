import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { EmptyState } from '@/components/EmptyState';
import { UpdateMileageModal } from '@/components/UpdateMileageModal';

// Helper to get time-based greeting
function getGreeting(t: (key: string) => string): string {
  const hour = new Date().getHours();
  if (hour < 12) return t('common.goodMorning');
  if (hour < 18) return t('common.goodAfternoon');
  return t('common.goodEvening');
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showMileageModal, setShowMileageModal] = useState(false);

  // Mock data - will be replaced with real data from store
  const activeCar = {
    id: '1',
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    plateNumber: 'ABC 123',
    mileage: 45000,
    status: 'A',
  };

  const nextDueMaintenance = {
    type: 'oil',
    name: t('maintenance.oil'),
    daysUntil: 5,
    kmUntil: 150,
  };

  const handleAddMaintenance = () => {
    router.push('/maintenance/add');
  };

  const handleAddReminder = () => {
    router.push('/reminders/add');
  };

  const handleViewHistory = () => {
    router.push('/maintenance/history');
  };

  const handleMarkDone = () => {
    router.push('/maintenance/add');
  };

  const handleMileageUpdate = (newMileage: number) => {
    console.log('New mileage:', newMileage);
    setShowMileageModal(false);
  };

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
          <View>
            <Text style={styles.greeting}>{getGreeting(t)}</Text>
            <Text style={styles.title}>{t('home.title')}</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push('/reminders')}
          >
            <Ionicons name="notifications-outline" size={24} color={theme.textPrimary} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Active Car Card */}
        <TouchableOpacity
          style={styles.carCard}
          activeOpacity={0.8}
          onPress={() => router.push(`/cars/${activeCar.id}`)}
        >
          <View style={styles.carCardHeader}>
            <View style={styles.carInfo}>
              <View style={styles.carIconContainer}>
                <Ionicons name="car-sport" size={28} color={theme.primary} />
              </View>
              <View>
                <Text style={styles.carName}>{activeCar.make} {activeCar.model}</Text>
                <Text style={styles.carDetails}>{activeCar.year} • {activeCar.plateNumber}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: theme.rating.excellent + '20' }]}>
              <Text style={[styles.statusText, { color: theme.rating.excellent }]}>
                {activeCar.status}
              </Text>
            </View>
          </View>
          <View style={styles.carCardFooter}>
            <View style={styles.mileageContainer}>
              <Ionicons name="speedometer-outline" size={16} color={theme.textSecondary} />
              <Text style={styles.mileageText}>{activeCar.mileage.toLocaleString()} {t('common.km')}</Text>
            </View>
            <TouchableOpacity
              style={styles.updateMileageButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowMileageModal(true);
              }}
            >
              <Text style={styles.updateMileageText}>{t('common.update')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Next Due Card */}
        <TouchableOpacity
          style={styles.nextDueCard}
          activeOpacity={0.8}
          onPress={() => router.push('/maintenance/due')}
        >
          <View style={styles.nextDueHeader}>
            <Ionicons name="time-outline" size={20} color={theme.warning} />
            <Text style={styles.nextDueLabel}>{t('home.nextDue')}</Text>
          </View>
          <View style={styles.nextDueContent}>
            <View style={[styles.maintenanceIcon, { backgroundColor: theme.maintenance.oil + '20' }]}>
              <Ionicons name="water" size={24} color={theme.maintenance.oil} />
            </View>
            <View style={styles.nextDueInfo}>
              <Text style={styles.nextDueName}>{nextDueMaintenance.name}</Text>
              <Text style={styles.nextDueTime}>
                {t('home.dueIn', { days: nextDueMaintenance.daysUntil })} / {nextDueMaintenance.kmUntil} {t('common.km')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.markDoneButton}
              onPress={handleMarkDone}
            >
              <Ionicons name="checkmark" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleAddMaintenance}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons name="add" size={24} color={theme.primary} />
              </View>
              <Text style={styles.quickActionText}>{t('home.addMaintenance')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleAddReminder}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.warning + '20' }]}>
                <Ionicons name="notifications" size={24} color={theme.warning} />
              </View>
              <Text style={styles.quickActionText}>{t('home.addReminder')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard} onPress={handleViewHistory}>
              <View style={[styles.quickActionIcon, { backgroundColor: theme.success + '20' }]}>
                <Ionicons name="time" size={24} color={theme.success} />
              </View>
              <Text style={styles.quickActionText}>{t('home.viewHistory')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('home.recentActivity')}</Text>
          <View style={styles.emptyStateContainer}>
            <EmptyState
              icon="clipboard-outline"
              title={t('home.noActivity')}
              description={t('home.noActivityDescription')}
              actionLabel={t('home.addMaintenance')}
              onAction={handleAddMaintenance}
            />
          </View>
        </View>
      </ScrollView>

      {/* Update Mileage Modal */}
      <UpdateMileageModal
        visible={showMileageModal}
        onClose={() => setShowMileageModal(false)}
        onSave={handleMileageUpdate}
        currentMileage={activeCar.mileage}
        carName={`${activeCar.make} ${activeCar.model}`}
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: Spacing.lg,
    },
    greeting: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: FontSizes.xxxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    notificationButton: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notificationBadge: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.critical,
    },
    carCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    carCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    carInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    carIconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    carName: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    carDetails: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    statusBadge: {
      width: 36,
      height: 36,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusText: {
      fontSize: FontSizes.lg,
      fontWeight: '700',
    },
    carCardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
    },
    mileageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    mileageText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    updateMileageButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.primary + '20',
    },
    updateMileageText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.primary,
    },
    nextDueCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.warning + '40',
    },
    nextDueHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginBottom: Spacing.md,
    },
    nextDueLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.warning,
    },
    nextDueContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    maintenanceIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    nextDueInfo: {
      flex: 1,
    },
    nextDueName: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    nextDueTime: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    markDoneButton: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.success,
      justifyContent: 'center',
      alignItems: 'center',
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    quickActionsGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    quickActionCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.md,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    quickActionIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    quickActionText: {
      fontSize: FontSizes.xs,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
    },
    emptyStateContainer: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.md,
      minHeight: 200,
    },
  });
