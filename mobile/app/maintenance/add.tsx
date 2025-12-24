import { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { useToast } from '@/components/Toast';

const MAINTENANCE_TYPES = [
  { id: 'oil', icon: 'water', labelKey: 'maintenance.oil' },
  { id: 'tires', icon: 'ellipse-outline', labelKey: 'maintenance.tires' },
  { id: 'battery', icon: 'battery-half', labelKey: 'maintenance.battery' },
  { id: 'brakes', icon: 'disc', labelKey: 'maintenance.brakes' },
  { id: 'filters', icon: 'filter', labelKey: 'maintenance.filters' },
  { id: 'fluids', icon: 'beaker', labelKey: 'maintenance.fluids' },
  { id: 'inspection', icon: 'search', labelKey: 'maintenance.inspection' },
  { id: 'custom', icon: 'add-circle', labelKey: 'maintenance.custom' },
];

export default function AddMaintenanceScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { type: preselectedType } = useLocalSearchParams<{ type?: string }>();

  const [selectedType, setSelectedType] = useState(preselectedType || '');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    cost: '',
    provider: '',
    notes: '',
  });

  // Pre-select type from params
  useEffect(() => {
    if (preselectedType) {
      setSelectedType(preselectedType);
    }
  }, [preselectedType]);

  const getTypeColor = (typeId: string) => {
    const colors: Record<string, string> = {
      oil: theme.maintenance.oil,
      tires: theme.maintenance.tires,
      battery: theme.maintenance.battery,
      brakes: theme.maintenance.brakes,
      filters: theme.maintenance.filters,
      fluids: theme.maintenance.fluids,
      inspection: theme.info,
      custom: theme.maintenance.custom,
    };
    return colors[typeId] || theme.primary;
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!selectedType) {
      showToast('error', t('validation.selectType'));
      return false;
    }

    if (!formData.date) {
      showToast('error', t('validation.invalidDate'));
      return false;
    }

    if (!formData.mileage || isNaN(Number(formData.mileage))) {
      showToast('error', t('validation.invalidMileage'));
      return false;
    }

    if (formData.cost && isNaN(Number(formData.cost))) {
      showToast('error', t('validation.invalidCost'));
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    console.log('Saving maintenance:', { type: selectedType, ...formData });
    showToast('success', t('common.save') + '!');
    router.back();
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
        <Text style={styles.headerTitle}>{t('maintenance.addRecord')}</Text>
        <TouchableOpacity
          style={[styles.saveButton, !selectedType && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!selectedType}
        >
          <Text style={styles.saveButtonText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Maintenance Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('maintenance.types')}</Text>
          <View style={styles.typesGrid}>
            {MAINTENANCE_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              const color = getTypeColor(type.id);
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    isSelected && { borderColor: color, backgroundColor: color + '15' },
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <View style={[styles.typeIcon, { backgroundColor: color + '20' }]}>
                    <Ionicons name={type.icon as any} size={24} color={color} />
                  </View>
                  <Text style={[styles.typeLabel, isSelected && { color }]}>
                    {t(type.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Details Form */}
        {selectedType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('common.details')}</Text>

            {/* Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('maintenance.date')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color={theme.textMuted} />
                <TextInput
                  style={styles.input}
                  value={formData.date}
                  onChangeText={(v) => updateField('date', v)}
                  placeholder={t('placeholders.dateFormat')}
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            {/* Mileage */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('cars.mileage')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="speedometer-outline" size={20} color={theme.textMuted} />
                <TextInput
                  style={styles.input}
                  value={formData.mileage}
                  onChangeText={(v) => updateField('mileage', v.replace(/[^0-9]/g, ''))}
                  placeholder={t('placeholders.enterMileage')}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="number-pad"
                />
                <Text style={styles.unitText}>{t('common.km')}</Text>
              </View>
            </View>

            {/* Cost */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('maintenance.cost')}</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencyText}>{t('common.egp')}</Text>
                <TextInput
                  style={styles.input}
                  value={formData.cost}
                  onChangeText={(v) => updateField('cost', v.replace(/[^0-9.]/g, ''))}
                  placeholder={t('placeholders.enterCost')}
                  placeholderTextColor={theme.textMuted}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Provider */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('maintenance.provider')}</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="business-outline" size={20} color={theme.textMuted} />
                <TextInput
                  style={styles.input}
                  value={formData.provider}
                  onChangeText={(v) => updateField('provider', v)}
                  placeholder={t('placeholders.serviceCenterName')}
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('maintenance.notes')}</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(v) => updateField('notes', v)}
                  placeholder={t('placeholders.addNotes')}
                  placeholderTextColor={theme.textMuted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        )}
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
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    saveButton: {
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    saveButtonDisabled: {
      backgroundColor: theme.textMuted,
    },
    saveButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: '#FFF',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    typesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    typeCard: {
      width: '22%',
      aspectRatio: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.xs,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeIcon: {
      width: 44,
      height: 44,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    typeLabel: {
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    inputContainer: {
      gap: Spacing.xs,
      marginBottom: Spacing.md,
    },
    label: {
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
    textAreaWrapper: {
      alignItems: 'flex-start',
      paddingVertical: Spacing.sm,
    },
    input: {
      flex: 1,
      height: 52,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    textArea: {
      height: 80,
      paddingTop: Spacing.xs,
    },
    unitText: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    currencyText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
    },
  });
