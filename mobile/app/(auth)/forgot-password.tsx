import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { resetPassword } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) Alert.alert('Error', error.message);
      else setIsSuccess(true);
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme);

  if (isSuccess) {
    return (
      <View style={[styles.container, styles.successContainer, { paddingTop: insets.top }]}>
        <View style={styles.successContent}>
          <View style={styles.successIcon}>
            <Ionicons name="mail" size={48} color={theme.success} />
          </View>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successText}>
            We've sent a password reset link to {email}
          </Text>
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.navBack} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={40} color={theme.primary} />
          </View>
          <Text style={styles.title}>{t('auth.forgotPassword')}</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.resetButtonText}>{t('auth.resetPassword')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing.lg,
    },
    navBack: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: BorderRadius.xl,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      gap: Spacing.lg,
    },
    inputContainer: {
      gap: Spacing.xs,
    },
    label: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      gap: Spacing.sm,
    },
    input: {
      flex: 1,
      height: 52,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    resetButton: {
      backgroundColor: theme.primary,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    resetButtonDisabled: {
      opacity: 0.7,
    },
    resetButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
    successContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    successContent: {
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    successIcon: {
      width: 80,
      height: 80,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.success + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    successTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
    },
    successText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.xxl,
    },
    backToLoginButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    backToLoginText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
