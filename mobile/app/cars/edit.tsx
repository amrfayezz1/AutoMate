import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

// Mock car data - will be replaced with real data
const mockCarData = {
  id: '1',
  make: 'Toyota',
  model: 'Camry',
  year: '2021',
  plateNumber: 'ABC 123',
  mileage: '45000',
  maintenanceMode: 'mileage',
  color: 'White',
  vin: '1HGBH41JXMN109186',
};

export default function EditCarScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const [formData, setFormData] = useState(mockCarData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.make || !formData.model || !formData.year) {
      Alert.alert(t('common.error'), t('validation.required'));
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

  const handleDelete = () => {
    Alert.alert(
      t('cars.deleteCar'),
      t('cars.deleteCarConfirmation', { car: `${formData.make} ${formData.model}` }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            // TODO: Delete car
            router.replace('/cars' as any);
          },
        },
      ]
    );
  };

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cars.editCar')}</Text>
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
        {/* Car Image */}
        <TouchableOpacity style={styles.imageContainer}>
          <View style={[styles.imagePlaceholder, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="car-sport" size={60} color={theme.primary} />
          </View>
          <View style={[styles.editImageBadge, { backgroundColor: theme.primary }]}>
            <Ionicons name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('cars.basicInfo')}</Text>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{t('cars.make')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.make}
                onChangeText={(v) => updateField('make', v)}
                placeholder="e.g., Toyota"
                placeholderTextColor={theme.textMuted}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{t('cars.model')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.model}
                onChangeText={(v) => updateField('model', v)}
                placeholder="e.g., Camry"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{t('cars.year')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.year}
                onChangeText={(v) => updateField('year', v)}
                placeholder="e.g., 2021"
                placeholderTextColor={theme.textMuted}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>{t('cars.color')}</Text>
              <TextInput
                style={styles.input}
                value={formData.color}
                onChangeText={(v) => updateField('color', v)}
                placeholder="e.g., White"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('cars.plateNumber')}</Text>
            <TextInput
              style={styles.input}
              value={formData.plateNumber}
              onChangeText={(v) => updateField('plateNumber', v)}
              placeholder="e.g., ABC 123"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{t('cars.vinOptional')}</Text>
            <TextInput
              style={styles.input}
              value={formData.vin}
              onChangeText={(v) => updateField('vin', v)}
              placeholder="Vehicle Identification Number"
              placeholderTextColor={theme.textMuted}
              autoCapitalize="characters"
              maxLength={17}
            />
          </View>
        </View>

        {/* Maintenance Settings */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>{t('cars.maintenanceMode')}</Text>

          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeOption,
                formData.maintenanceMode === 'time' && styles.modeOptionActive,
              ]}
              onPress={() => updateField('maintenanceMode', 'time')}
            >
              <Ionicons
                name="calendar-outline"
                size={24}
                color={formData.maintenanceMode === 'time' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.modeText,
                  formData.maintenanceMode === 'time' && styles.modeTextActive,
                ]}
              >
                {t('cars.timeBased')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeOption,
                formData.maintenanceMode === 'mileage' && styles.modeOptionActive,
              ]}
              onPress={() => updateField('maintenanceMode', 'mileage')}
            >
              <Ionicons
                name="speedometer-outline"
                size={24}
                color={formData.maintenanceMode === 'mileage' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.modeText,
                  formData.maintenanceMode === 'mileage' && styles.modeTextActive,
                ]}
              >
                {t('cars.mileageBased')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={theme.critical} />
            <Text style={[styles.deleteButtonText, { color: theme.critical }]}>
              {t('cars.deleteCar')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    imageContainer: {
      alignSelf: 'center',
      marginBottom: Spacing.xl,
      position: 'relative',
    },
    imagePlaceholder: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editImageBadge: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: theme.background,
    },
    formSection: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    row: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    inputContainer: {
      marginBottom: Spacing.md,
    },
    inputLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
      marginBottom: Spacing.xs,
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
    modeContainer: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    modeOption: {
      flex: 1,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    modeOptionActive: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    modeText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textMuted,
    },
    modeTextActive: {
      color: theme.primary,
    },
    dangerSection: {
      marginTop: Spacing.xl,
      paddingTop: Spacing.xl,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.md,
      gap: Spacing.sm,
    },
    deleteButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
    },
  });
