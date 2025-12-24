import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { verifyOtp, signInWithPhone } from '@/lib/supabase';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const digits = value.split('').slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = digit;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      Alert.alert('Invalid OTP', 'Please enter the complete verification code');
      return;
    }
    
    if (!phone) {
      Alert.alert('Error', 'Phone number not found');
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await verifyOtp(phone, otpString);
      if (error) Alert.alert('Verification Failed', error.message);
      else if (data.session) router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !phone) return;
    try {
      await signInWithPhone(phone);
      setResendTimer(60);
      Alert.alert('OTP Sent', 'A new verification code has been sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP');
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + Spacing.lg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={40} color={theme.primary} />
        </View>
        <Text style={styles.title}>{t('auth.otp')}</Text>
        <Text style={styles.subtitle}>
          Enter the {OTP_LENGTH}-digit code sent to{'\n'}
          <Text style={styles.phoneText}>{phone}</Text>
        </Text>
      </View>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={OTP_LENGTH}
            selectTextOnFocus
          />
        ))}
      </View>

      {/* Resend */}
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code?</Text>
        <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
          <Text style={[styles.resendLink, resendTimer > 0 && styles.resendLinkDisabled]}>
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : t('auth.resendOtp')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Verify Button */}
      <TouchableOpacity
        style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled]}
        onPress={handleVerify}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
    phoneText: {
      color: theme.textPrimary,
      fontWeight: '600',
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    otpInput: {
      width: 48,
      height: 56,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      textAlign: 'center',
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    otpInputFilled: {
      borderColor: theme.primary,
    },
    resendContainer: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
      gap: Spacing.xs,
    },
    resendText: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    resendLink: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: theme.primary,
    },
    resendLinkDisabled: {
      color: theme.textMuted,
    },
    verifyButton: {
      backgroundColor: theme.primary,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    verifyButtonDisabled: {
      opacity: 0.7,
    },
    verifyButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
  });
