import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { EmptyState } from '@/components/EmptyState';

export default function MaintenanceScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const maintenanceTypes = [
    { id: 'oil', icon: 'water', color: theme.maintenance.oil, labelKey: 'maintenance.oil' },
    { id: 'tires', icon: 'ellipse-outline', color: theme.maintenance.tires, labelKey: 'maintenance.tires' },
    { id: 'battery', icon: 'battery-half', color: theme.maintenance.battery, labelKey: 'maintenance.battery' },
    { id: 'brakes', icon: 'disc', color: theme.maintenance.brakes, labelKey: 'maintenance.brakes' },
    { id: 'filters', icon: 'filter', color: theme.maintenance.filters, labelKey: 'maintenance.filters' },
    { id: 'fluids', icon: 'beaker', color: theme.maintenance.fluids, labelKey: 'maintenance.fluids' },
    { id: 'inspection', icon: 'search', color: theme.info, labelKey: 'maintenance.inspection' },
    { id: 'custom', icon: 'add-circle', color: theme.maintenance.custom, labelKey: 'maintenance.custom' },
  ];

  const handleTypePress = (typeId: string) => {
    router.push({ pathname: '/maintenance/add', params: { type: typeId } });
  };

  const handleAddMaintenance = () => {
    router.push('/maintenance/add');
  };

  const handleViewUpcoming = () => {
    router.push('/maintenance/due');
  };

  const handleViewHistory = () => {
    router.push('/maintenance/history');
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
          <Text style={styles.title}>{t('maintenance.title')}</Text>
        </View>

        {/* Maintenance Types Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('maintenance.types')}</Text>
          <View style={styles.typesGrid}>
            {maintenanceTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={styles.typeCard}
                activeOpacity={0.7}
                onPress={() => handleTypePress(type.id)}
              >
                <View style={[styles.typeIcon, { backgroundColor: type.color + '20' }]}>
                  <Ionicons name={type.icon as any} size={24} color={type.color} />
                </View>
                <Text style={styles.typeLabel}>{t(type.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleInline}>{t('maintenance.upcoming')}</Text>
            <TouchableOpacity onPress={handleViewUpcoming}>
              <Text style={styles.seeAllLink}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyStateContainer}>
            <EmptyState
              icon="calendar-outline"
              title={t('maintenance.noUpcoming')}
              description={t('maintenance.noUpcomingDescription')}
            />
          </View>
        </View>

        {/* History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleInline}>{t('maintenance.history')}</Text>
            <TouchableOpacity onPress={handleViewHistory}>
              <Text style={styles.seeAllLink}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyStateContainer}>
            <EmptyState
              icon="time-outline"
              title={t('maintenance.noHistory')}
              description={t('maintenance.noHistoryDescription')}
            />
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        activeOpacity={0.8}
        onPress={handleAddMaintenance}
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
    section: {
      marginBottom: Spacing.xl,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    sectionTitleInline: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    seeAllLink: {
      fontSize: FontSizes.sm,
      color: theme.primary,
      fontWeight: '500',
    },
    typesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    typeCard: {
      width: '22%',
      aspectRatio: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    typeIcon: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeLabel: {
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    emptyStateContainer: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      minHeight: 180,
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
