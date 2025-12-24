import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { useAuthStore } from '@/stores/authStore';
import { useAppStore } from '@/stores/appStore';

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showArrow?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  danger?: boolean;
  theme: any;
}

function SettingsItem({
  icon,
  iconColor,
  label,
  value,
  onPress,
  showArrow = true,
  toggle = false,
  toggleValue,
  onToggle,
  danger = false,
  theme,
}: SettingsItemProps) {
  const actualIconColor = iconColor || theme.textSecondary;
  
  return (
    <TouchableOpacity
      style={createItemStyles(theme).settingsItem}
      onPress={onPress}
      disabled={toggle}
      activeOpacity={0.7}
    >
      <View style={createItemStyles(theme).settingsItemLeft}>
        <View style={[createItemStyles(theme).settingsIcon, { backgroundColor: actualIconColor + '20' }]}>
          <Ionicons name={icon} size={20} color={actualIconColor} />
        </View>
        <Text style={[createItemStyles(theme).settingsLabel, danger && { color: theme.critical }]}>{label}</Text>
      </View>
      <View style={createItemStyles(theme).settingsItemRight}>
        {value && <Text style={createItemStyles(theme).settingsValue}>{value}</Text>}
        {toggle ? (
          <Switch
            value={toggleValue}
            onValueChange={onToggle}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFF"
          />
        ) : showArrow ? (
          <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const createItemStyles = (theme: any) =>
  StyleSheet.create({
    settingsItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    settingsItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    settingsIcon: {
      width: 36,
      height: 36,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    settingsLabel: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    settingsItemRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    settingsValue: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
  });

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const signOut = useAuthStore((state) => state.signOut);
  const { language, setLanguage } = useAppStore();

  const handleLogout = () => {
    Alert.alert(
      t('auth.logout'),
      'Are you sure you want to log out?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('settings.deleteAccount'),
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            Alert.alert('Feature coming soon');
          },
        },
      ]
    );
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
          <Text style={styles.title}>{t('settings.title')}</Text>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john@example.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="car"
              iconColor={theme.primary}
              label={t('settings.manageCars')}
              onPress={() => {}}
              theme={theme}
            />
            <SettingsItem
              icon="notifications"
              iconColor={theme.warning}
              label={t('settings.notifications')}
              onPress={() => {}}
              theme={theme}
            />
            <SettingsItem
              icon="language"
              iconColor={theme.info}
              label={t('settings.language')}
              value={language === 'ar' ? 'العربية' : 'English'}
              onPress={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              theme={theme}
            />
            <SettingsItem
              icon="moon"
              iconColor={isDark ? theme.warning : theme.textSecondary}
              label={t('settings.darkMode')}
              toggle
              toggleValue={isDark}
              onToggle={toggleTheme}
              theme={theme}
            />
          </View>
        </View>

        {/* Data & Storage */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Storage</Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="cloud-download"
              iconColor={theme.success}
              label={t('settings.exportData')}
              onPress={() => Alert.alert('Export', 'Data export will be available soon')}
              theme={theme}
            />
            <SettingsItem
              icon="sync"
              iconColor={theme.info}
              label="Sync Status"
              value="Up to date"
              showArrow={false}
              theme={theme}
            />
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="help-circle"
              iconColor={theme.textSecondary}
              label={t('settings.support')}
              onPress={() => {}}
              theme={theme}
            />
            <SettingsItem
              icon="document-text"
              iconColor={theme.textSecondary}
              label={t('settings.privacyPolicy')}
              onPress={() => {}}
              theme={theme}
            />
            <SettingsItem
              icon="information-circle"
              iconColor={theme.textSecondary}
              label={t('settings.about')}
              value="v1.0.0"
              showArrow={false}
              theme={theme}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon="log-out"
              iconColor={theme.warning}
              label={t('auth.logout')}
              onPress={handleLogout}
              showArrow={false}
              theme={theme}
            />
            <SettingsItem
              icon="trash"
              iconColor={theme.critical}
              label={t('settings.deleteAccount')}
              onPress={handleDeleteAccount}
              showArrow={false}
              danger
              theme={theme}
            />
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
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
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
    sectionTitle: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: Spacing.sm,
      paddingHorizontal: Spacing.xs,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    profileEmail: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    settingsGroup: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
    },
  });
