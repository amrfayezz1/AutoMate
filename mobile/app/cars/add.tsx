import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

// Car makes data
const CAR_MAKES = [
  'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia', 'Chevrolet', 'Ford',
  'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen', 'Mazda', 'Mitsubishi',
  'Suzuki', 'Peugeot', 'Renault', 'Fiat', 'Jeep', 'Land Rover', 'Other'
];

// Generate years (current year back to 1990)
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 }, (_, i) => CURRENT_YEAR - i);

type Step = 1 | 2 | 3 | 4;

export default function AddCarScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    plateNumber: '',
    mileage: '',
    maintenanceMode: 'mileage' as 'time' | 'mileage',
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.make && formData.model && formData.year && formData.plateNumber;
      case 2:
        return formData.mileage && parseInt(formData.mileage) > 0;
      case 3:
        return true; // Mode selection always has a default
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
    } else {
      // Save car and navigate
      console.log('Saving car:', formData);
      router.replace('/(tabs)/home');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    } else {
      router.back();
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
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cars.addCar')}</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{step}/4</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(step / 4) * 100}%` }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Car Details</Text>
            <Text style={styles.stepDescription}>Enter your car's basic information</Text>

            {/* Make */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('cars.make')}</Text>
              <View style={styles.selectInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Select make..."
                  placeholderTextColor={theme.textMuted}
                  value={formData.make}
                  onChangeText={(v) => updateField('make', v)}
                />
                <Ionicons name="chevron-down" size={20} color={theme.textMuted} />
              </View>
            </View>

            {/* Model */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('cars.model')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Corolla, Civic..."
                placeholderTextColor={theme.textMuted}
                value={formData.model}
                onChangeText={(v) => updateField('model', v)}
              />
            </View>

            {/* Year */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('cars.year')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 2020"
                placeholderTextColor={theme.textMuted}
                value={formData.year}
                onChangeText={(v) => updateField('year', v)}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            {/* Plate Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('cars.plateNumber')}</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., ABC 123"
                placeholderTextColor={theme.textMuted}
                value={formData.plateNumber}
                onChangeText={(v) => updateField('plateNumber', v)}
                autoCapitalize="characters"
              />
            </View>
          </View>
        )}

        {/* Step 2: Mileage */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Current Mileage</Text>
            <Text style={styles.stepDescription}>
              Enter your car's current odometer reading
            </Text>

            <View style={styles.mileageInputContainer}>
              <TextInput
                style={styles.mileageInput}
                placeholder="0"
                placeholderTextColor={theme.textMuted}
                value={formData.mileage}
                onChangeText={(v) => updateField('mileage', v.replace(/[^0-9]/g, ''))}
                keyboardType="number-pad"
              />
              <Text style={styles.mileageUnit}>km</Text>
            </View>

            <Text style={styles.mileageHint}>
              This helps us calculate when your next maintenance is due
            </Text>
          </View>
        )}

        {/* Step 3: Maintenance Mode */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Maintenance Mode</Text>
            <Text style={styles.stepDescription}>
              How do you prefer to track maintenance?
            </Text>

            <TouchableOpacity
              style={[
                styles.modeCard,
                formData.maintenanceMode === 'mileage' && styles.modeCardActive,
              ]}
              onPress={() => updateField('maintenanceMode', 'mileage')}
            >
              <View style={styles.modeIconContainer}>
                <Ionicons
                  name="speedometer"
                  size={28}
                  color={formData.maintenanceMode === 'mileage' ? theme.primary : theme.textMuted}
                />
              </View>
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>{t('cars.mileageBased')}</Text>
                <Text style={styles.modeDescription}>
                  Get reminders based on kilometers driven
                </Text>
              </View>
              <View style={[
                styles.radioOuter,
                formData.maintenanceMode === 'mileage' && styles.radioOuterActive,
              ]}>
                {formData.maintenanceMode === 'mileage' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeCard,
                formData.maintenanceMode === 'time' && styles.modeCardActive,
              ]}
              onPress={() => updateField('maintenanceMode', 'time')}
            >
              <View style={styles.modeIconContainer}>
                <Ionicons
                  name="calendar"
                  size={28}
                  color={formData.maintenanceMode === 'time' ? theme.primary : theme.textMuted}
                />
              </View>
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>{t('cars.timeBased')}</Text>
                <Text style={styles.modeDescription}>
                  Get reminders based on days/months
                </Text>
              </View>
              <View style={[
                styles.radioOuter,
                formData.maintenanceMode === 'time' && styles.radioOuterActive,
              ]}>
                {formData.maintenanceMode === 'time' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Initial Maintenance (Optional) */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Recent Maintenance</Text>
            <Text style={styles.stepDescription}>
              Add any recent maintenance to set your baseline (optional)
            </Text>

            <View style={styles.skipNotice}>
              <Ionicons name="information-circle" size={20} color={theme.info} />
              <Text style={styles.skipNoticeText}>
                You can skip this and add maintenance later
              </Text>
            </View>

            {/* Quick add maintenance items */}
            {['Oil Change', 'Tire Rotation', 'Battery Check'].map((item) => (
              <TouchableOpacity key={item} style={styles.maintenanceItem}>
                <View style={styles.maintenanceItemLeft}>
                  <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                  <Text style={styles.maintenanceItemText}>{item}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { paddingBottom: insets.bottom + Spacing.md }]}>
        {step === 4 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => router.replace('/(tabs)/home')}
          >
            <Text style={styles.skipButtonText}>{t('common.skip')}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextButtonText}>
            {step === 4 ? t('common.done') : t('common.next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
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
    },
    backButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    stepIndicator: {
      backgroundColor: theme.surfaceAlt,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    stepText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.border,
      marginHorizontal: Spacing.lg,
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.xxl,
    },
    stepContent: {
      gap: Spacing.lg,
    },
    stepTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    stepDescription: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      marginBottom: Spacing.md,
    },
    inputContainer: {
      gap: Spacing.xs,
    },
    label: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    textInput: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      height: 52,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    selectInput: {
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
      height: 52,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    mileageInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.md,
      marginVertical: Spacing.xl,
    },
    mileageInput: {
      fontSize: 48,
      fontWeight: '700',
      color: theme.textPrimary,
      textAlign: 'center',
      minWidth: 200,
    },
    mileageUnit: {
      fontSize: FontSizes.xxl,
      color: theme.textMuted,
    },
    mileageHint: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
      textAlign: 'center',
    },
    modeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      borderWidth: 2,
      borderColor: theme.border,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    modeCardActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    modeIconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modeContent: {
      flex: 1,
    },
    modeTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    modeDescription: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    radioOuter: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioOuterActive: {
      borderColor: theme.primary,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.primary,
    },
    skipNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      backgroundColor: theme.info + '15',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
    },
    skipNoticeText: {
      flex: 1,
      fontSize: FontSizes.sm,
      color: theme.info,
    },
    maintenanceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.lg,
    },
    maintenanceItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    maintenanceItemText: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    bottomActions: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.lg,
      paddingTop: Spacing.md,
      gap: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    skipButton: {
      flex: 1,
      height: 52,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
    },
    skipButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    nextButton: {
      flex: 2,
      flexDirection: 'row',
      height: 52,
      backgroundColor: theme.primary,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    nextButtonDisabled: {
      opacity: 0.5,
    },
    nextButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
