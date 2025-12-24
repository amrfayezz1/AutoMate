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
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const DOCUMENT_TYPES = [
  { id: 'license', icon: 'card', labelKey: 'documents.license' },
  { id: 'insurance', icon: 'shield-checkmark', labelKey: 'documents.insurance' },
  { id: 'inspection', icon: 'clipboard', labelKey: 'documents.inspection' },
];

export default function AddDocumentScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { type: preselectedType } = useLocalSearchParams<{ type?: string }>();

  const [selectedType, setSelectedType] = useState(preselectedType || '');
  const [formData, setFormData] = useState({
    title: '',
    expiryDate: '',
    notes: '',
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving document:', { type: selectedType, ...formData });
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
        <Text style={styles.headerTitle}>{t('documents.addDocument')}</Text>
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
        {/* Document Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Type</Text>
          <View style={styles.typesRow}>
            {DOCUMENT_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    isSelected && styles.typeCardSelected,
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={28}
                    color={isSelected ? theme.primary : theme.textMuted}
                  />
                  <Text style={[
                    styles.typeLabel,
                    isSelected && styles.typeLabelSelected,
                  ]}>
                    {t(type.labelKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Form */}
        {selectedType && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Document Details</Text>

            {/* Title */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Title</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(v) => updateField('title', v)}
                  placeholder="e.g., Vehicle License 2025"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            {/* Expiry Date */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Expiry Date</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={20} color={theme.textMuted} />
                <TextInput
                  style={styles.input}
                  value={formData.expiryDate}
                  onChangeText={(v) => updateField('expiryDate', v)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.textMuted}
                />
              </View>
            </View>

            {/* Upload */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Upload Document</Text>
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="cloud-upload-outline" size={32} color={theme.textMuted} />
                <Text style={styles.uploadText}>Tap to upload image or PDF</Text>
                <Text style={styles.uploadHint}>Max 5MB</Text>
              </TouchableOpacity>
            </View>

            {/* Notes */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('maintenance.notes')}</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.notes}
                  onChangeText={(v) => updateField('notes', v)}
                  placeholder="Add any notes..."
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
    typesRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    typeCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      alignItems: 'center',
      gap: Spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeCardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    typeLabel: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    typeLabelSelected: {
      color: theme.primary,
      fontWeight: '500',
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
    uploadButton: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      borderWidth: 2,
      borderColor: theme.border,
      borderStyle: 'dashed',
      padding: Spacing.xl,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    uploadText: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    uploadHint: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
  });
