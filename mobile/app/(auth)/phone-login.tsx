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
import { signInWithPhone } from '@/lib/supabase';

export default function PhoneLoginScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }
    
    setIsLoading(true);
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+20${phone}`;
      const { error } = await signInWithPhone(formattedPhone);
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        router.push({
          pathname: '/(auth)/otp',
          params: { phone: formattedPhone },
        });
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
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait" size={40} color={theme.primary} />
          </View>
          <Text style={styles.title}>{t('auth.phoneLogin')}</Text>
          <Text style={styles.subtitle}>
            We'll send you a one-time verification code to your phone number.
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('auth.phone')}</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇪🇬 +20</Text>
              </View>
              <View style={styles.phoneInputWrapper}>
                <TextInput
                  style={styles.phoneInput}
                  placeholder="1XX XXX XXXX"
                  placeholderTextColor={theme.textMuted}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSendOtp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.sendButtonText}>Send OTP</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </>
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
    backButton: {
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
    phoneInputRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    countryCode: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      justifyContent: 'center',
      height: 52,
    },
    countryCodeText: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    phoneInputWrapper: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
    },
    phoneInput: {
      flex: 1,
      height: 52,
      fontSize: FontSizes.lg,
      color: theme.textPrimary,
      letterSpacing: 1,
    },
    sendButton: {
      backgroundColor: theme.primary,
      height: 52,
      borderRadius: BorderRadius.lg,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    sendButtonDisabled: {
      opacity: 0.7,
    },
    sendButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
  });
