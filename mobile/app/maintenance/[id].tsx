import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

export default function MaintenanceDetailScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock data
  const maintenance = {
    id,
    type: 'oil',
    typeName: 'Oil Change',
    date: '2024-12-20',
    mileage: 45000,
    cost: 500,
    provider: 'Toyota Service Center',
    notes: 'Full synthetic oil, filter replaced',
    nextDue: {
      date: '2025-03-20',
      mileage: 50000,
    },
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Record',
      'Are you sure you want to delete this maintenance record?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maintenance Details</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Card */}
        <View style={styles.typeCard}>
          <View style={[styles.typeIcon, { backgroundColor: theme.maintenance.oil + '20' }]}>
            <Ionicons name="water" size={32} color={theme.maintenance.oil} />
          </View>
          <Text style={styles.typeName}>{maintenance.typeName}</Text>
          <Text style={styles.typeDate}>{maintenance.date}</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="calendar-outline" size={18} color={theme.textMuted} />
              <Text style={styles.detailLabelText}>{t('maintenance.date')}</Text>
            </View>
            <Text style={styles.detailValue}>{maintenance.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="speedometer-outline" size={18} color={theme.textMuted} />
              <Text style={styles.detailLabelText}>{t('cars.mileage')}</Text>
            </View>
            <Text style={styles.detailValue}>{maintenance.mileage.toLocaleString()} km</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="cash-outline" size={18} color={theme.textMuted} />
              <Text style={styles.detailLabelText}>{t('maintenance.cost')}</Text>
            </View>
            <Text style={styles.detailValue}>EGP {maintenance.cost.toLocaleString()}</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="business-outline" size={18} color={theme.textMuted} />
              <Text style={styles.detailLabelText}>{t('maintenance.provider')}</Text>
            </View>
            <Text style={styles.detailValue}>{maintenance.provider}</Text>
          </View>
        </View>

        {/* Notes */}
        {maintenance.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('maintenance.notes')}</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{maintenance.notes}</Text>
            </View>
          </View>
        )}

        {/* Next Due */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('maintenance.nextDue')}</Text>
          <View style={styles.nextDueCard}>
            <View style={styles.nextDueRow}>
              <Ionicons name="calendar" size={20} color={theme.warning} />
              <Text style={styles.nextDueText}>{maintenance.nextDue.date}</Text>
            </View>
            <View style={styles.nextDueRow}>
              <Ionicons name="speedometer" size={20} color={theme.warning} />
              <Text style={styles.nextDueText}>{maintenance.nextDue.mileage.toLocaleString()} km</Text>
            </View>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.critical} />
          <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
        </TouchableOpacity>
      </ScrollView>
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
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    editButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    typeCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    typeIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    typeName: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    typeDate: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: theme.textMuted,
      textTransform: 'uppercase',
      marginBottom: Spacing.sm,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.surface,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    detailLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    detailLabelText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    detailValue: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    notesCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    notesText: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    nextDueCard: {
      backgroundColor: theme.warning + '15',
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: theme.warning + '30',
      gap: Spacing.sm,
    },
    nextDueRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    nextDueText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.warning,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      marginTop: Spacing.xl,
    },
    deleteButtonText: {
      fontSize: FontSizes.md,
      color: theme.critical,
    },
  });
