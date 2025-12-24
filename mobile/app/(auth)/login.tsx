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
import { Link, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { signInWithEmail } from '@/lib/supabase';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        Alert.alert('Login Failed', error.message);
      } else if (data.session) {
        router.replace('/(tabs)/home');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + Spacing.xxl, paddingBottom: insets.bottom + Spacing.lg }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="car-sport" size={48} color={theme.primary} />
          </View>
          <Text style={styles.title}>{t('onboarding.welcome')}</Text>
          <Text style={styles.subtitle}>{t('auth.login')}</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
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
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.password')}</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Forgot Password */}
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          </Link>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.loginButtonText}>{t('auth.login')}</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Phone Login */}
          <Link href="/(auth)/phone-login" asChild>
            <TouchableOpacity style={styles.phoneButton} activeOpacity={0.8}>
              <Ionicons name="phone-portrait-outline" size={20} color={theme.textPrimary} />
              <Text style={styles.phoneButtonText}>{t('auth.phoneLogin')}</Text>
            </TouchableOpacity>
          </Link>
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
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
    },
    logoContainer: {
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
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    form: {
      gap: Spacing.md,
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
    inputError: {
      borderColor: theme.critical,
    },
    input: {
      flex: 1,
      height: 52,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    errorText: {
      fontSize: FontSizes.xs,
      color: theme.critical,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
    },
    forgotPasswordText: {
      fontSize: FontSizes.sm,
      color: theme.primary,
    },
    loginButton: {
      backgroundColor: theme.primary,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    loginButtonDisabled: {
      opacity: 0.7,
    },
    loginButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
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
    phoneButton: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    phoneButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: Spacing.xl,
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
  });
