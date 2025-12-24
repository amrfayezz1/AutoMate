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
import { signUpWithEmail } from '@/lib/supabase';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!phone) newErrors.phone = 'Phone is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await signUpWithEmail(email, password, {
        full_name: name,
        phone: phone,
      });
      
      if (error) {
        Alert.alert('Registration Failed', error.message);
      } else {
        Alert.alert(
          'Success',
          'Account created! Please check your email to verify your account.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
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
          { paddingTop: insets.top + Spacing.lg, paddingBottom: insets.bottom + Spacing.lg }
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('auth.createAccount')}</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.name')}</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Ionicons name="person-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={theme.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

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
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.phone')}</Text>
            <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
              <Ionicons name="call-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="+20 1XX XXX XXXX"
                placeholderTextColor={theme.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
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

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={theme.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>{t('auth.signup')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>{t('auth.alreadyHaveAccount')}</Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={styles.loginLink}>{t('auth.login')}</Text>
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
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      marginBottom: Spacing.md,
    },
    header: {
      marginBottom: Spacing.xl,
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
    registerButton: {
      backgroundColor: theme.primary,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    registerButtonDisabled: {
      opacity: 0.7,
    },
    registerButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 'auto',
      paddingTop: Spacing.xl,
      gap: Spacing.xs,
    },
    loginText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    loginLink: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.primary,
    },
  });
