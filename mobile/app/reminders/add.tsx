import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const REMINDER_TYPES = [
  { id: 'oil', icon: 'water', label: 'Oil Change' },
  { id: 'tires', icon: 'ellipse-outline', label: 'Tire Rotation' },
  { id: 'inspection', icon: 'search', label: 'Inspection' },
  { id: 'insurance', icon: 'shield-checkmark', label: 'Insurance' },
  { id: 'license', icon: 'card', label: 'License' },
  { id: 'custom', icon: 'add-circle', label: 'Custom' },
];

export default function AddReminderScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedType, setSelectedType] = useState('');
  const [reminderMode, setReminderMode] = useState<'time' | 'mileage'>('time');
  const [formData, setFormData] = useState({
    title: '',
    dueDate: '',
    dueMileage: '',
    notifyDaysBefore: '7',
    notifyKmBefore: '500',
    pushEnabled: true,
    whatsappEnabled: false,
    notes: '',
  });

  const updateField = (field: keyof typeof formData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log('Saving reminder:', { type: selectedType, mode: reminderMode, ...formData });
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
        <Text style={styles.headerTitle}>{t('reminders.addReminder')}</Text>
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
        {/* Reminder Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Type</Text>
          <View style={styles.typesGrid}>
            {REMINDER_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[styles.typeCard, isSelected && styles.typeCardSelected]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={isSelected ? theme.primary : theme.textMuted}
                  />
                  <Text style={[styles.typeLabel, isSelected && styles.typeLabelSelected]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedType && (
          <>
            {/* Reminder Mode */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Remind Based On</Text>
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[styles.modeButton, reminderMode === 'time' && styles.modeButtonActive]}
                  onPress={() => setReminderMode('time')}
                >
                  <Ionicons
                    name="calendar"
                    size={20}
                    color={reminderMode === 'time' ? '#FFF' : theme.textSecondary}
                  />
                  <Text style={[
                    styles.modeButtonText,
                    reminderMode === 'time' && styles.modeButtonTextActive,
                  ]}>
                    Time
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modeButton, reminderMode === 'mileage' && styles.modeButtonActive]}
                  onPress={() => setReminderMode('mileage')}
                >
                  <Ionicons
                    name="speedometer"
                    size={20}
                    color={reminderMode === 'mileage' ? '#FFF' : theme.textSecondary}
                  />
                  <Text style={[
                    styles.modeButtonText,
                    reminderMode === 'mileage' && styles.modeButtonTextActive,
                  ]}>
                    Mileage
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* When to Remind */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>When to Remind</Text>
              
              {reminderMode === 'time' ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Due Date</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="calendar-outline" size={20} color={theme.textMuted} />
                      <TextInput
                        style={styles.input}
                        value={formData.dueDate}
                        onChangeText={(v) => updateField('dueDate', v)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor={theme.textMuted}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Notify Before</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={formData.notifyDaysBefore}
                        onChangeText={(v) => updateField('notifyDaysBefore', v)}
                        keyboardType="number-pad"
                        maxLength={3}
                      />
                      <Text style={styles.unitText}>days</Text>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Due at Mileage</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons name="speedometer-outline" size={20} color={theme.textMuted} />
                      <TextInput
                        style={styles.input}
                        value={formData.dueMileage}
                        onChangeText={(v) => updateField('dueMileage', v.replace(/[^0-9]/g, ''))}
                        placeholder="50000"
                        placeholderTextColor={theme.textMuted}
                        keyboardType="number-pad"
                      />
                      <Text style={styles.unitText}>km</Text>
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Notify Before</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        value={formData.notifyKmBefore}
                        onChangeText={(v) => updateField('notifyKmBefore', v)}
                        keyboardType="number-pad"
                        maxLength={5}
                      />
                      <Text style={styles.unitText}>km</Text>
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Notification Channels */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notification Channels</Text>
              
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabel}>
                  <Ionicons name="notifications" size={20} color={theme.primary} />
                  <Text style={styles.toggleLabelText}>Push Notifications</Text>
                </View>
                <Switch
                  value={formData.pushEnabled}
                  onValueChange={(v) => updateField('pushEnabled', v)}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor="#FFF"
                />
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleLabel}>
                  <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  <View>
                    <Text style={styles.toggleLabelText}>WhatsApp</Text>
                    <Text style={styles.toggleLabelHint}>Premium feature</Text>
                  </View>
                </View>
                <Switch
                  value={formData.whatsappEnabled}
                  onValueChange={(v) => updateField('whatsappEnabled', v)}
                  trackColor={{ false: theme.border, true: '#25D366' }}
                  thumbColor="#FFF"
                  disabled
                />
              </View>
            </View>

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes (Optional)</Text>
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
          </>
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
      gap: Spacing.sm,
    },
    typeCard: {
      width: '31%',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      alignItems: 'center',
      gap: Spacing.xs,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    typeCardSelected: {
      borderColor: theme.primary,
      backgroundColor: theme.primary + '10',
    },
    typeLabel: {
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    typeLabelSelected: {
      color: theme.primary,
      fontWeight: '500',
    },
    modeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.xs,
    },
    modeButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
    },
    modeButtonActive: {
      backgroundColor: theme.primary,
    },
    modeButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textSecondary,
    },
    modeButtonTextActive: {
      color: '#FFF',
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
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    toggleLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    toggleLabelText: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    toggleLabelHint: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
  });
