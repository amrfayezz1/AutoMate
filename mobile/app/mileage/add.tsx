import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
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

export default function AddOdometerReadingScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [mileage, setMileage] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentMileage = 45000; // Mock - from car data

  const handleSave = async () => {
    const newMileage = parseInt(mileage, 10);

    if (isNaN(newMileage) || newMileage < 0) {
      Alert.alert('Invalid Input', 'Please enter a valid mileage value.');
      return;
    }

    if (newMileage < currentMileage) {
      Alert.alert('Invalid Mileage', 'New reading cannot be less than current odometer.');
      return;
    }

    // Check for spike (>20% increase)
    const increase = ((newMileage - currentMileage) / currentMileage) * 100;
    if (increase > 20) {
      Alert.alert(
        'Large Increase Detected',
        `You're adding ${(newMileage - currentMileage).toLocaleString()} km which is more than 20% increase. Are you sure this is correct?`,
        [
          { text: 'Edit', style: 'cancel' },
          { text: 'Confirm', onPress: () => saveReading(newMileage) },
        ]
      );
      return;
    }

    saveReading(newMileage);
  };

  const saveReading = async (value: number) => {
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
        <Text style={styles.headerTitle}>Add Reading</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
          <Ionicons name="speedometer" size={48} color={theme.primary} />
        </View>

        {/* Current Reading */}
        <View style={[styles.currentBox, { backgroundColor: theme.surfaceAlt }]}>
          <Text style={styles.currentLabel}>Current Odometer</Text>
          <Text style={styles.currentValue}>{currentMileage.toLocaleString()} km</Text>
        </View>

        {/* New Reading Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Odometer Reading</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={mileage}
              onChangeText={setMileage}
              keyboardType="number-pad"
              placeholder="Enter new mileage"
              placeholderTextColor={theme.textMuted}
              autoFocus
            />
            <Text style={styles.inputSuffix}>km</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g., After road trip"
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Difference Preview */}
        {mileage && parseInt(mileage, 10) > currentMileage && (
          <View style={[styles.diffPreview, { backgroundColor: theme.success + '15' }]}>
            <Ionicons name="add-circle-outline" size={20} color={theme.success} />
            <Text style={[styles.diffText, { color: theme.success }]}>
              +{(parseInt(mileage, 10) - currentMileage).toLocaleString()} km since last reading
            </Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: mileage ? theme.primary : theme.surfaceAlt },
          ]}
          onPress={handleSave}
          disabled={!mileage || isLoading}
        >
          {isLoading ? (
            <Text style={styles.saveButtonText}>Saving...</Text>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
              <Text style={styles.saveButtonText}>Save Reading</Text>
            </>
          )}
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
      flex: 1,
      padding: Spacing.lg,
    },
    iconContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: Spacing.xl,
    },
    currentBox: {
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    currentLabel: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
      marginBottom: Spacing.xs,
    },
    currentValue: {
      fontSize: FontSizes.xxxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    inputLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
      marginBottom: Spacing.sm,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
    },
    input: {
      flex: 1,
      height: 56,
      fontSize: FontSizes.xl,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    notesInput: {
      height: 80,
      fontSize: FontSizes.md,
      fontWeight: '400',
      paddingTop: Spacing.md,
      paddingHorizontal: Spacing.md,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    inputSuffix: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textMuted,
    },
    diffPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    diffText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
    },
    saveButton: {
      flexDirection: 'row',
      height: 56,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
      marginTop: 'auto',
    },
    saveButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
  });
