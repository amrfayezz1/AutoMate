import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

export default function NotificationSettingsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: false,
    whatsappEnabled: true,
    maintenanceReminders: true,
    documentExpiry: true,
    weeklyReport: false,
    promotions: false,
    reminderDays: 3, // days before due
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const styles = createStyles(theme);

  const renderSwitch = (
    label: string,
    description: string,
    key: keyof typeof settings,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.settingItem}>
      <View style={[styles.settingIcon, { backgroundColor: theme.primary + '15' }]}>
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[key] as boolean}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: theme.border, true: theme.primary + '80' }}
        thumbColor={settings[key] ? theme.primary : theme.textMuted}
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.notifications')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Channels Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Channels</Text>
          {renderSwitch(
            'Push Notifications',
            'Receive alerts on your device',
            'pushEnabled',
            'notifications-outline'
          )}
          {renderSwitch(
            'Email Notifications',
            'Get updates via email',
            'emailEnabled',
            'mail-outline'
          )}
          {renderSwitch(
            'WhatsApp Notifications',
            'Receive reminders via WhatsApp',
            'whatsappEnabled',
            'logo-whatsapp'
          )}
        </View>

        {/* Types Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Types</Text>
          {renderSwitch(
            'Maintenance Reminders',
            'Get notified before services are due',
            'maintenanceReminders',
            'construct-outline'
          )}
          {renderSwitch(
            'Document Expiry',
            'Alerts for expiring documents',
            'documentExpiry',
            'document-text-outline'
          )}
          {renderSwitch(
            'Weekly Report',
            'Summary of your car activity',
            'weeklyReport',
            'bar-chart-outline'
          )}
          {renderSwitch(
            'Promotions',
            'Special offers and updates',
            'promotions',
            'gift-outline'
          )}
        </View>

        {/* Timing Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Timing</Text>
          <Text style={styles.timingDescription}>
            How many days before a due date should we remind you?
          </Text>
          <View style={styles.timingOptions}>
            {[1, 3, 7, 14].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.timingOption,
                  settings.reminderDays === days && styles.timingOptionActive,
                ]}
                onPress={() => setSettings((prev) => ({ ...prev, reminderDays: days }))}
              >
                <Text
                  style={[
                    styles.timingOptionText,
                    settings.reminderDays === days && styles.timingOptionTextActive,
                  ]}
                >
                  {days} {days === 1 ? 'day' : 'days'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    content: {
      padding: Spacing.lg,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
      gap: Spacing.md,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingContent: {
      flex: 1,
    },
    settingLabel: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
    timingDescription: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
      marginBottom: Spacing.md,
    },
    timingOptions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    timingOption: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: 'center',
    },
    timingOptionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '15',
    },
    timingOptionText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    timingOptionTextActive: {
      color: theme.primary,
    },
  });
