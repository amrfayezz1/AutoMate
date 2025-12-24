import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { height } = Dimensions.get('window');

interface SnoozeModalProps {
  visible: boolean;
  onClose: () => void;
  onSnooze: (duration: number, unit: 'days' | 'weeks') => void;
  reminderTitle?: string;
}

const snoozeOptions = [
  { label: '1 Day', value: 1, unit: 'days' as const },
  { label: '3 Days', value: 3, unit: 'days' as const },
  { label: '1 Week', value: 1, unit: 'weeks' as const },
  { label: '2 Weeks', value: 2, unit: 'weeks' as const },
  { label: '1 Month', value: 4, unit: 'weeks' as const },
];

export function SnoozeModal({
  visible,
  onClose,
  onSnooze,
  reminderTitle,
}: SnoozeModalProps) {
  const { theme } = useTheme();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleSnooze = () => {
    if (selectedOption === null) return;
    const option = snoozeOptions[selectedOption];
    onSnooze(option.value, option.unit);
    setSelectedOption(null);
    onClose();
  };

  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="time-outline" size={32} color={theme.warning} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Snooze Reminder
            </Text>
            {reminderTitle && (
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {reminderTitle}
              </Text>
            )}
          </View>

          {/* Snooze Options */}
          <View style={styles.optionsContainer}>
            {snoozeOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  { 
                    backgroundColor: selectedOption === index ? theme.primary + '15' : theme.surface,
                    borderColor: selectedOption === index ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setSelectedOption(index)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={selectedOption === index ? 'checkmark-circle' : 'ellipse-outline'} 
                  size={22} 
                  color={selectedOption === index ? theme.primary : theme.textMuted} 
                />
                <Text 
                  style={[
                    styles.optionText, 
                    { color: selectedOption === index ? theme.primary : theme.textPrimary }
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton, 
                styles.confirmButton, 
                { 
                  backgroundColor: selectedOption !== null ? theme.primary : theme.surfaceAlt,
                  opacity: selectedOption !== null ? 1 : 0.5,
                }
              ]}
              onPress={handleSnooze}
              disabled={selectedOption === null}
            >
              <Ionicons name="notifications-off-outline" size={20} color="#FFF" />
              <Text style={styles.confirmButtonText}>Snooze</Text>
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
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      borderTopLeftRadius: BorderRadius.xxl,
      borderTopRightRadius: BorderRadius.xxl,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    iconContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSizes.md,
      textAlign: 'center',
    },
    optionsContainer: {
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    optionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      gap: Spacing.md,
    },
    optionText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.md,
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
