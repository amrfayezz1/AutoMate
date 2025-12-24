import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { width } = Dimensions.get('window');

export default function LoginOptionsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.lg }]}>
      {/* Logo & Branding */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>AutoMate</Text>
        <Text style={styles.subtitle}>{t('onboarding.welcome')}</Text>
      </View>

      {/* Login Options */}
      <View style={styles.optionsContainer}>
        {/* Email Login Button */}
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Ionicons name="mail" size={22} color="#FFF" />
            <Text style={styles.primaryButtonText}>{t('auth.continueWithEmail')}</Text>
          </TouchableOpacity>
        </Link>

        {/* Phone Login Button */}
        <Link href="/(auth)/phone-login" asChild>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
            <Ionicons name="phone-portrait" size={22} color={theme.textPrimary} />
            <Text style={styles.secondaryButtonText}>{t('auth.continueWithPhone')}</Text>
          </TouchableOpacity>
        </Link>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('auth.or')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Login Options (future) */}
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Ionicons name="logo-google" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
            <Ionicons name="logo-apple" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>{t('auth.dontHaveAccount')}</Text>
        <Link href="/(auth)/register" asChild>
          <TouchableOpacity>
            <Text style={styles.signupLink}>{t('auth.signup')}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Terms */}
      <Text style={styles.termsText}>
        By continuing, you agree to our{' '}
        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
        <Text style={styles.termsLink}>Privacy Policy</Text>
      </Text>
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
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    logo: {
      width: width * 0.28,
      height: width * 0.28,
      borderRadius: width * 0.06,
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.xxxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    optionsContainer: {
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
    secondaryButton: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      height: 56,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    secondaryButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing.lg,
      gap: Spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.divider,
    },
    dividerText: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.lg,
    },
    socialButton: {
      width: 56,
      height: 56,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 'auto',
      gap: Spacing.xs,
    },
    signupText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    signupLink: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.primary,
    },
    termsText: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: Spacing.lg,
      lineHeight: 18,
    },
    termsLink: {
      color: theme.primary,
    },
  });
