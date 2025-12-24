import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { width } = Dimensions.get('window');

export default function AddFirstCarPromptScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const handleAddCar = () => {
    router.push('/cars/add');
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.lg }]}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.carIconWrapper}>
          <Ionicons name="car-sport" size={80} color={theme.primary} />
          <View style={styles.plusBadge}>
            <Ionicons name="add" size={24} color="#FFF" />
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{t('cars.addFirstCar')}</Text>
        <Text style={styles.subtitle}>
          {t('cars.addFirstCarDescription')}
        </Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="notifications" size={20} color={theme.primary} />
            </View>
            <Text style={styles.featureText}>{t('cars.featureReminders')}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="document-text" size={20} color={theme.primary} />
            </View>
            <Text style={styles.featureText}>{t('cars.featureDocuments')}</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="analytics" size={20} color={theme.primary} />
            </View>
            <Text style={styles.featureText}>{t('cars.featureTracking')}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={handleAddCar}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle" size={24} color="#FFF" />
          <Text style={styles.primaryButtonText}>{t('cars.addCar')}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>{t('common.skipForNow')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.lg,
    },
    illustrationContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    carIconWrapper: {
      width: 140,
      height: 140,
      borderRadius: BorderRadius.xxl,
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    plusBadge: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.background,
    },
    content: {
      flex: 1,
      alignItems: 'center',
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.xl,
    },
    featuresList: {
      width: '100%',
      gap: Spacing.md,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    featureIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureText: {
      flex: 1,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    actions: {
      gap: Spacing.md,
    },
    primaryButton: {
      flexDirection: 'row',
      backgroundColor: theme.primary,
      height: 56,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    primaryButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
    skipButton: {
      height: 48,
      justifyContent: 'center',
      alignItems: 'center',
    },
    skipButtonText: {
      fontSize: FontSizes.md,
      color: theme.textMuted,
    },
  });
