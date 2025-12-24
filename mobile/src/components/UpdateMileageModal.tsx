import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { height } = Dimensions.get('window');

interface UpdateMileageModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (mileage: number) => void;
  currentMileage: number;
  carName?: string;
}

export function UpdateMileageModal({
  visible,
  onClose,
  onSave,
  currentMileage,
  carName,
}: UpdateMileageModalProps) {
  const { theme } = useTheme();
  const [mileage, setMileage] = useState(currentMileage.toString());
  const [showSpikeWarning, setShowSpikeWarning] = useState(false);

  const handleSave = () => {
    const newMileage = parseInt(mileage, 10);
    
    if (isNaN(newMileage) || newMileage < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid mileage value.');
      return;
    }

    if (newMileage < currentMileage) {
      Alert.alert('Invalid Mileage', 'New mileage cannot be less than current mileage.');
      return;
    }

    // Check for spike (>20% increase)
    const increase = ((newMileage - currentMileage) / currentMileage) * 100;
    if (increase > 20) {
      setShowSpikeWarning(true);
      return;
    }

    onSave(newMileage);
    onClose();
  };

  const confirmSpikeAndSave = () => {
    const newMileage = parseInt(mileage, 10);
    setShowSpikeWarning(false);
    onSave(newMileage);
    onClose();
  };

  const styles = createStyles(theme);

  return (
    <>
      <Modal
        visible={visible && !showSpikeWarning}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.backdrop} onPress={onClose} />
          
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />

            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                <Ionicons name="speedometer" size={32} color={theme.primary} />
              </View>
              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Update Mileage
              </Text>
              {carName && (
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {carName}
                </Text>
              )}
            </View>

            {/* Current Mileage */}
            <View style={[styles.currentMileageBox, { backgroundColor: theme.surfaceAlt }]}>
              <Text style={[styles.currentLabel, { color: theme.textMuted }]}>
                Current Odometer
              </Text>
              <Text style={[styles.currentValue, { color: theme.textPrimary }]}>
                {currentMileage.toLocaleString()} km
              </Text>
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                New Odometer Reading
              </Text>
              <View style={[styles.inputWrapper, { borderColor: theme.border }]}>
                <TextInput
                  style={[styles.input, { color: theme.textPrimary }]}
                  value={mileage}
                  onChangeText={setMileage}
                  keyboardType="number-pad"
                  placeholder="Enter new mileage"
                  placeholderTextColor={theme.textMuted}
                />
                <Text style={[styles.inputSuffix, { color: theme.textMuted }]}>km</Text>
              </View>
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
                style={[styles.actionButton, styles.saveButton, { backgroundColor: theme.primary }]}
                onPress={handleSave}
              >
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Spike Warning Modal (#36) */}
      <Modal
        visible={showSpikeWarning}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSpikeWarning(false)}
      >
        <View style={styles.spikeOverlay}>
          <View style={[styles.spikeModal, { backgroundColor: theme.background }]}>
            <View style={[styles.warningIcon, { backgroundColor: theme.warning + '20' }]}>
              <Ionicons name="warning" size={40} color={theme.warning} />
            </View>
            
            <Text style={[styles.spikeTitle, { color: theme.textPrimary }]}>
              Large Mileage Increase
            </Text>
            
            <Text style={[styles.spikeText, { color: theme.textSecondary }]}>
              You're adding{' '}
              <Text style={{ fontWeight: '700', color: theme.textPrimary }}>
                {(parseInt(mileage, 10) - currentMileage).toLocaleString()} km
              </Text>
              {' '}which is more than 20% increase. Is this correct?
            </Text>

            <View style={styles.spikeActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => setShowSpikeWarning(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton, { backgroundColor: theme.warning }]}
                onPress={confirmSpikeAndSave}
              >
                <Text style={styles.saveButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
    },
    currentMileageBox: {
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    currentLabel: {
      fontSize: FontSizes.sm,
      marginBottom: Spacing.xs,
    },
    currentValue: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
    },
    inputContainer: {
      marginBottom: Spacing.xl,
    },
    inputLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      marginBottom: Spacing.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      paddingHorizontal: Spacing.md,
    },
    input: {
      flex: 1,
      height: 56,
      fontSize: FontSizes.xl,
      fontWeight: '600',
    },
    inputSuffix: {
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
    saveButton: {},
    saveButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
    spikeOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: Spacing.lg,
    },
    spikeModal: {
      width: '100%',
      borderRadius: BorderRadius.xl,
      padding: Spacing.xl,
      alignItems: 'center',
    },
    warningIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    spikeTitle: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      marginBottom: Spacing.sm,
    },
    spikeText: {
      fontSize: FontSizes.md,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: Spacing.xl,
    },
    spikeActions: {
      flexDirection: 'row',
      gap: Spacing.md,
      width: '100%',
    },
  });
