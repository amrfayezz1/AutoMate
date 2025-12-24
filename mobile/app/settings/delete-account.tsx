import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

export default function DeleteAccountScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const canDelete = password.length >= 6 && confirmText === 'DELETE';

  const handleDelete = async () => {
    if (!canDelete) return;

    Alert.alert(
      'Final Confirmation',
      'This will permanently delete your account and all associated data. This action CANNOT be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // TODO: Call delete account API
              await new Promise((resolve) => setTimeout(resolve, 1000));
              router.replace('/(auth)' as any);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
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
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings.deleteAccount')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Warning Icon */}
        <View style={[styles.warningIcon, { backgroundColor: theme.critical + '20' }]}>
          <Ionicons name="warning" size={48} color={theme.critical} />
        </View>

        {/* Warning Text */}
        <Text style={styles.warningTitle}>Delete Your Account</Text>
        <Text style={styles.warningText}>
          This action is permanent and cannot be undone. All your data will be permanently deleted, including:
        </Text>

        {/* What Gets Deleted */}
        <View style={styles.listContainer}>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color={theme.critical} />
            <Text style={styles.listText}>All your car profiles</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color={theme.critical} />
            <Text style={styles.listText}>Maintenance history and records</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color={theme.critical} />
            <Text style={styles.listText}>Documents and reminders</Text>
          </View>
          <View style={styles.listItem}>
            <Ionicons name="close-circle" size={20} color={theme.critical} />
            <Text style={styles.listText}>Expense tracking data</Text>
          </View>
        </View>

        {/* Note about shared cars */}
        <View style={[styles.noteContainer, { backgroundColor: theme.warning + '15' }]}>
          <Ionicons name="information-circle" size={20} color={theme.warning} />
          <Text style={styles.noteText}>
            Cars shared with other users will remain in their accounts.
          </Text>
        </View>

        {/* Confirmation Fields */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter your password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Your current password"
              placeholderTextColor={theme.textMuted}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Type "DELETE" to confirm</Text>
            <TextInput
              style={styles.input}
              value={confirmText}
              onChangeText={setConfirmText}
              placeholder="DELETE"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="characters"
            />
          </View>
        </View>
      </ScrollView>

      {/* Delete Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { backgroundColor: canDelete ? theme.critical : theme.surfaceAlt },
          ]}
          onPress={handleDelete}
          disabled={!canDelete || isLoading}
        >
          <Ionicons name="trash" size={20} color="#FFF" />
          <Text style={styles.deleteButtonText}>
            {isLoading ? 'Deleting...' : 'Permanently Delete Account'}
          </Text>
        </TouchableOpacity>
      </View>
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
    content: {
      padding: Spacing.lg,
    },
    warningIcon: {
      width: 96,
      height: 96,
      borderRadius: 48,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: Spacing.lg,
    },
    warningTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.critical,
      textAlign: 'center',
      marginBottom: Spacing.sm,
    },
    warningText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.lg,
    },
    listContainer: {
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      gap: Spacing.sm,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    listText: {
      fontSize: FontSizes.sm,
      color: theme.textPrimary,
    },
    noteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    noteText: {
      flex: 1,
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    form: {
      gap: Spacing.md,
    },
    inputContainer: {
      gap: Spacing.xs,
    },
    inputLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    input: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      height: 52,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    footer: {
      padding: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    deleteButton: {
      flexDirection: 'row',
      height: 56,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    deleteButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
