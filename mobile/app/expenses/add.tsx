import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
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

const categories = [
  { id: 'fuel', label: 'Fuel', icon: 'flash-outline', color: '#FBBF24' },
  { id: 'parking', label: 'Parking', icon: 'car-outline', color: '#60A5FA' },
  { id: 'toll', label: 'Toll', icon: 'card-outline', color: '#34D399' },
  { id: 'wash', label: 'Car Wash', icon: 'water-outline', color: '#38BDF8' },
  { id: 'accessories', label: 'Accessories', icon: 'construct-outline', color: '#A78BFA' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-outline', color: '#9CA3AF' },
];

export default function AddExpenseScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !selectedCategory) {
      Alert.alert('Missing Fields', 'Please enter an amount and select a category.');
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
        <Text style={styles.headerTitle}>Add Expense</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Amount Input */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={theme.textMuted}
            autoFocus
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === cat.id && {
                    borderColor: cat.color,
                    backgroundColor: cat.color + '15',
                  },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + '20' }]}>
                  <Ionicons name={cat.icon as any} size={24} color={cat.color} />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === cat.id && { color: cat.color },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description (Optional)</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="e.g., Gas station, Highway toll..."
            placeholderTextColor={theme.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Receipt Upload */}
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="camera-outline" size={24} color={theme.primary} />
          <Text style={[styles.uploadText, { color: theme.primary }]}>
            Add Receipt Photo
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: amount && selectedCategory ? theme.primary : theme.surfaceAlt },
          ]}
          onPress={handleSave}
          disabled={!amount || !selectedCategory || isLoading}
        >
          <Ionicons name="checkmark-circle" size={24} color="#FFF" />
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Expense'}
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
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.xxl,
    },
    currencySymbol: {
      fontSize: 48,
      fontWeight: '300',
      color: theme.textMuted,
      marginRight: Spacing.xs,
    },
    amountInput: {
      fontSize: 64,
      fontWeight: '700',
      color: theme.textPrimary,
      minWidth: 150,
      textAlign: 'center',
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.md,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    categoryItem: {
      width: '31%',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: theme.border,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    categoryIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryLabel: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
    },
    descriptionInput: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.md,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
      height: 100,
    },
    uploadButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: theme.primary,
      gap: Spacing.sm,
    },
    uploadText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
    },
    footer: {
      padding: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    saveButton: {
      flexDirection: 'row',
      height: 56,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    saveButtonText: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: '#FFF',
    },
  });
