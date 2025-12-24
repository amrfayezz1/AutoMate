import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const supportOptions = [
  {
    id: 'email',
    title: 'Email Support',
    description: 'Get help via email',
    icon: 'mail-outline' as const,
    action: 'email',
    value: 'support@automate.app',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    description: 'Chat with us on WhatsApp',
    icon: 'logo-whatsapp' as const,
    action: 'whatsapp',
    value: '+1234567890',
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Frequently asked questions',
    icon: 'help-circle-outline' as const,
    action: 'faq',
    value: '',
  },
];

export default function SupportScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleAction = (option: typeof supportOptions[0]) => {
    switch (option.action) {
      case 'email':
        Linking.openURL(`mailto:${option.value}?subject=AutoMate Support`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${option.value.replace(/\D/g, '')}`);
        break;
      case 'faq':
        Alert.alert('FAQ', 'FAQ section coming soon!');
        break;
    }
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.support')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="chatbubbles" size={48} color={theme.primary} />
          </View>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroText}>
            Choose your preferred way to contact us. We're here to help!
          </Text>
        </View>

        {/* Support Options */}
        <View style={styles.optionsContainer}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={() => handleAction(option)}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name={option.icon} size={24} color={theme.primary} />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>App Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>2024.12.24</Text>
          </View>
        </View>

        {/* Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="document-text-outline" size={20} color={theme.textSecondary} />
            <Text style={styles.linkText}>{t('settings.privacyPolicy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="newspaper-outline" size={20} color={theme.textSecondary} />
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkItem}>
            <Ionicons name="star-outline" size={20} color={theme.textSecondary} />
            <Text style={styles.linkText}>Rate the App</Text>
          </TouchableOpacity>
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
    hero: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    heroIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    heroTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    heroText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    optionsContainer: {
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.md,
    },
    optionIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: 2,
    },
    optionDescription: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    infoSection: {
      backgroundColor: theme.surface,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
    },
    infoTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    infoLabel: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    infoValue: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    linksContainer: {
      gap: Spacing.sm,
    },
    linkItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      gap: Spacing.md,
    },
    linkText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
  });
