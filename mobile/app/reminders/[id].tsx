import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

export default function ReminderDetailScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock data
  const reminder = {
    id,
    type: 'oil',
    title: 'Oil Change',
    mode: 'mileage',
    dueDate: null,
    dueMileage: 50000,
    currentMileage: 49500,
    notifyBefore: 500,
    pushEnabled: true,
    whatsappEnabled: false,
    isActive: true,
    carName: 'Toyota Corolla',
  };

  const kmRemaining = reminder.dueMileage - reminder.currentMileage;
  const getStatusColor = () => {
    if (kmRemaining <= 0) return theme.critical;
    if (kmRemaining <= reminder.notifyBefore) return theme.warning;
    return theme.success;
  };

  const handleToggleActive = (value: boolean) => {
    console.log('Toggle active:', value);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Reminder',
      'Are you sure you want to delete this reminder?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.delete'), style: 'destructive', onPress: () => router.back() },
      ]
    );
  };

  const statusColor = getStatusColor();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminder Details</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Reminder Card */}
        <View style={styles.reminderCard}>
          <View style={[styles.reminderIcon, { backgroundColor: theme.maintenance.oil + '20' }]}>
            <Ionicons name="water" size={36} color={theme.maintenance.oil} />
          </View>
          <Text style={styles.reminderTitle}>{reminder.title}</Text>
          <Text style={styles.reminderCar}>{reminder.carName}</Text>
          
          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {kmRemaining <= 0 ? 'Overdue' : kmRemaining <= reminder.notifyBefore ? 'Due Soon' : 'On Track'}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={[styles.progressValue, { color: statusColor }]}>
              {kmRemaining > 0 ? `${kmRemaining} km left` : `${Math.abs(kmRemaining)} km overdue`}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(100, (reminder.currentMileage / reminder.dueMileage) * 100)}%`,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
          <View style={styles.progressLegend}>
            <Text style={styles.progressLegendText}>{reminder.currentMileage.toLocaleString()} km</Text>
            <Text style={styles.progressLegendText}>{reminder.dueMileage.toLocaleString()} km</Text>
          </View>
        </View>

        {/* Toggle Active */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleTitle}>Active</Text>
            <Text style={styles.toggleSubtitle}>Receive notifications for this reminder</Text>
          </View>
          <Switch
            value={reminder.isActive}
            onValueChange={handleToggleActive}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFF"
          />
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="speedometer-outline" size={18} color={theme.textMuted} />
              <Text style={styles.detailLabelText}>Due at</Text>
            </View>
            <Text style={styles.detailValue}>{reminder.dueMileage.toLocaleString()} km</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailLabel}>
              <Ionicons name="notifications-outline" size={18} color={theme.textMuted} />
              <Text style={styles.detailLabelText}>Notify before</Text>
            </View>
            <Text style={styles.detailValue}>{reminder.notifyBefore} km</Text>
          </View>
        </View>

        {/* Notification Channels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.channelRow}>
            <View style={styles.channelInfo}>
              <Ionicons name="notifications" size={20} color={theme.primary} />
              <Text style={styles.channelText}>Push Notifications</Text>
            </View>
            <View style={[
              styles.channelBadge,
              { backgroundColor: reminder.pushEnabled ? theme.success + '20' : theme.textMuted + '20' }
            ]}>
              <Text style={[
                styles.channelBadgeText,
                { color: reminder.pushEnabled ? theme.success : theme.textMuted }
              ]}>
                {reminder.pushEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>

          <View style={styles.channelRow}>
            <View style={styles.channelInfo}>
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text style={styles.channelText}>WhatsApp</Text>
            </View>
            <View style={[styles.channelBadge, { backgroundColor: theme.textMuted + '20' }]}>
              <Text style={[styles.channelBadgeText, { color: theme.textMuted }]}>Premium</Text>
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
    reminderCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    reminderIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    reminderTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    reminderCar: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      marginBottom: Spacing.md,
    },
    statusBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    statusText: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
    },
    progressCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    progressLabel: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    progressValue: {
      fontSize: FontSizes.md,
      fontWeight: '600',
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressLegend: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.xs,
    },
    progressLegendText: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
    toggleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    toggleInfo: {
      flex: 1,
    },
    toggleTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    toggleSubtitle: {
      fontSize: FontSizes.sm,
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
    channelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    channelInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    channelText: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    channelBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    channelBadgeText: {
      fontSize: FontSizes.xs,
      fontWeight: '500',
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
