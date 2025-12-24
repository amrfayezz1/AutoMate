import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { useAppStore } from '@/stores/appStore';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'en' | 'ar';

const languages = [
  { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

export default function LanguageThemeScreen() {
  const { t, i18n } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();
  const { themeMode, setThemeMode, setLanguage } = useAppStore();
  const insets = useSafeAreaInsets();

  const currentLanguage = i18n.language as Language;

  const handleLanguageChange = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.language')} & {t('settings.theme')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Language Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <View style={styles.optionsContainer}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.optionItem,
                  currentLanguage === lang.code && styles.optionItemActive,
                ]}
                onPress={() => handleLanguageChange(lang.code)}
              >
                <Text style={styles.optionFlag}>{lang.flag}</Text>
                <View style={styles.optionContent}>
                  <Text style={styles.optionLabel}>{lang.name}</Text>
                  <Text style={styles.optionSubtitle}>{lang.nativeName}</Text>
                </View>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          <View style={styles.themeGrid}>
            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'light' && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <View style={[styles.themePreview, styles.lightPreview]}>
                <Ionicons name="sunny" size={32} color="#FBBF24" />
              </View>
              <Text style={styles.themeLabel}>{t('settings.lightMode')}</Text>
              {themeMode === 'light' && (
                <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'dark' && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <View style={[styles.themePreview, styles.darkPreview]}>
                <Ionicons name="moon" size={32} color="#60A5FA" />
              </View>
              <Text style={styles.themeLabel}>{t('settings.darkMode')}</Text>
              {themeMode === 'dark' && (
                <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOption,
                themeMode === 'system' && styles.themeOptionActive,
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <View style={[styles.themePreview, styles.systemPreview]}>
                <Ionicons name="phone-portrait" size={32} color={theme.textSecondary} />
              </View>
              <Text style={styles.themeLabel}>{t('settings.systemMode')}</Text>
              {themeMode === 'system' && (
                <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                  <Ionicons name="checkmark" size={14} color="#FFF" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preview</Text>
          <View style={[styles.previewCard, { backgroundColor: theme.surface }]}>
            <View style={[styles.previewHeader, { backgroundColor: theme.primary }]}>
              <Text style={styles.previewHeaderText}>AutoMate</Text>
            </View>
            <View style={styles.previewContent}>
              <Text style={[styles.previewTitle, { color: theme.textPrimary }]}>
                {t('home.title')}
              </Text>
              <Text style={[styles.previewText, { color: theme.textSecondary }]}>
                {t('onboarding.slide1Description')}
              </Text>
            </View>
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
      fontSize: FontSizes.lg,
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
    optionsContainer: {
      gap: Spacing.sm,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      gap: Spacing.md,
    },
    optionItemActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    optionFlag: {
      fontSize: 28,
    },
    optionContent: {
      flex: 1,
    },
    optionLabel: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    optionSubtitle: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    themeGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      position: 'relative',
    },
    themeOptionActive: {
      borderColor: theme.primary,
    },
    themePreview: {
      width: 64,
      height: 64,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    lightPreview: {
      backgroundColor: '#F9FAFB',
    },
    darkPreview: {
      backgroundColor: '#1F2937',
    },
    systemPreview: {
      backgroundColor: theme.surfaceAlt,
    },
    themeLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textPrimary,
      textAlign: 'center',
    },
    checkBadge: {
      position: 'absolute',
      top: Spacing.sm,
      right: Spacing.sm,
      width: 20,
      height: 20,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewCard: {
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    previewHeader: {
      padding: Spacing.md,
      alignItems: 'center',
    },
    previewHeaderText: {
      color: '#FFF',
      fontWeight: '700',
      fontSize: FontSizes.md,
    },
    previewContent: {
      padding: Spacing.md,
    },
    previewTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      marginBottom: Spacing.xs,
    },
    previewText: {
      fontSize: FontSizes.sm,
      lineHeight: 20,
    },
  });
