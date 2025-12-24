import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

// Mock user data
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 234 567 8900',
  avatar: null,
};

export default function EditProfileScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(mockUserData.name);
  const [email, setEmail] = useState(mockUserData.email);
  const [phone, setPhone] = useState(mockUserData.phone);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Save to backend
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.profile')}</Text>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && { opacity: 0.5 }]}
          onPress={handleSave}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="person" size={48} color={theme.primary} />
          </View>
          <View style={[styles.editAvatarBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text style={styles.changePhotoText}>Change Photo</Text>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('auth.name')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your full name"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('auth.email')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor={theme.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('auth.phone')}</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color={theme.textMuted} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 234 567 8900"
                placeholderTextColor={theme.textMuted}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Change Password */}
        <TouchableOpacity style={styles.changePasswordButton}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.primary} />
          <Text style={[styles.changePasswordText, { color: theme.primary }]}>
            Change Password
          </Text>
          <Ionicons name="chevron-forward" size={20} color={theme.primary} />
        </TouchableOpacity>
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
    saveButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
    },
    saveButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.primary,
    },
    content: {
      padding: Spacing.lg,
    },
    avatarContainer: {
      alignSelf: 'center',
      marginBottom: Spacing.sm,
      position: 'relative',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editAvatarBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.background,
    },
    changePhotoText: {
      fontSize: FontSizes.sm,
      color: theme.primary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
    form: {
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    inputContainer: {
      gap: Spacing.xs,
    },
    inputLabel: {
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
    changePasswordButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.sm,
    },
    changePasswordText: {
      flex: 1,
      fontSize: FontSizes.md,
      fontWeight: '500',
    },
  });
