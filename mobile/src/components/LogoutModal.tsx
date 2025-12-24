import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function LogoutConfirmationModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutConfirmationModalProps) {
  const { theme } = useTheme();

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: theme.warning + '20' }]}>
            <Ionicons name="log-out-outline" size={40} color={theme.warning} />
          </View>

          {/* Text */}
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Log Out?
          </Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Are you sure you want to log out of your account? You'll need to sign in again to access your data.
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
              disabled={isLoading}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton, { backgroundColor: theme.critical }]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <Text style={styles.confirmButtonText}>Logging out...</Text>
              ) : (
                <>
                  <Ionicons name="log-out-outline" size={20} color="#FFF" />
                  <Text style={styles.confirmButtonText}>Log Out</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: Spacing.lg,
    },
    modalContent: {
      width: '100%',
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      alignItems: 'center',
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      marginBottom: Spacing.sm,
    },
    message: {
      fontSize: FontSizes.md,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.xl,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.md,
      width: '100%',
    },
    actionButton: {
      flex: 1,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    cancelButton: {
      borderWidth: 1,
    },
    cancelButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
    },
    confirmButton: {},
    confirmButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
