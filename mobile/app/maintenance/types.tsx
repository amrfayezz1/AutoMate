import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius, Maintenance } from '@/lib/theme';

// Predefined maintenance types with intervals
const maintenanceTypes = [
  {
    id: 'oil',
    icon: 'water-outline',
    color: Maintenance.oil,
    name: 'Oil Change',
    defaultInterval: { km: 5000, months: 6 },
  },
  {
    id: 'tires',
    icon: 'ellipse-outline',
    color: Maintenance.tires,
    name: 'Tire Service',
    defaultInterval: { km: 10000, months: 12 },
  },
  {
    id: 'battery',
    icon: 'battery-half-outline',
    color: Maintenance.battery,
    name: 'Battery',
    defaultInterval: { km: null, months: 36 },
  },
  {
    id: 'brakes',
    icon: 'disc-outline',
    color: Maintenance.brakes,
    name: 'Brakes',
    defaultInterval: { km: 30000, months: 24 },
  },
  {
    id: 'filters',
    icon: 'funnel-outline',
    color: Maintenance.filters,
    name: 'Air/Cabin Filters',
    defaultInterval: { km: 15000, months: 12 },
  },
  {
    id: 'fluids',
    icon: 'beaker-outline',
    color: Maintenance.fluids,
    name: 'Fluids Check',
    defaultInterval: { km: 10000, months: 6 },
  },
  {
    id: 'inspection',
    icon: 'clipboard-outline',
    color: Maintenance.inspection,
    name: 'General Inspection',
    defaultInterval: { km: null, months: 12 },
  },
];

export default function MaintenanceTypesScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('build-outline');

  const availableIcons = [
    'build-outline', 'car-outline', 'cog-outline', 'flash-outline',
    'thermometer-outline', 'snow-outline', 'speedometer-outline', 'key-outline',
  ];

  const handleTypePress = (type: typeof maintenanceTypes[0]) => {
    // Navigate to add maintenance with pre-selected type
    router.push({
      pathname: '/maintenance/add',
      params: { type: type.id, typeName: type.name },
    });
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    
    // Navigate to add maintenance with custom type
    router.push({
      pathname: '/maintenance/add',
      params: { type: 'custom', typeName: customName, icon: selectedIcon },
    });
    
    setShowAddCustom(false);
    setCustomName('');
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('maintenance.types')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Maintenance Types Grid */}
        <View style={styles.grid}>
          {maintenanceTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={styles.typeCard}
              onPress={() => handleTypePress(type)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: type.color + '20' }]}>
                <Ionicons name={type.icon as any} size={32} color={type.color} />
              </View>
              <Text style={styles.typeName}>{type.name}</Text>
              {type.defaultInterval.km && (
                <Text style={styles.intervalText}>
                  Every {(type.defaultInterval.km / 1000).toFixed(0)}k km
                </Text>
              )}
              {type.defaultInterval.months && (
                <Text style={styles.intervalText}>
                  or {type.defaultInterval.months} months
                </Text>
              )}
            </TouchableOpacity>
          ))}

          {/* Add Custom Type */}
          <TouchableOpacity
            style={[styles.typeCard, styles.addCustomCard]}
            onPress={() => setShowAddCustom(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="add" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.typeName, { color: theme.primary }]}>
              Add Custom
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Custom Modal */}
      <Modal
        visible={showAddCustom}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddCustom(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: theme.border }]} />
            
            <Text style={styles.modalTitle}>Add Custom Type</Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Timing Belt"
                placeholderTextColor={theme.textMuted}
                value={customName}
                onChangeText={setCustomName}
              />
            </View>

            {/* Icon Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Icon</Text>
              <View style={styles.iconGrid}>
                {availableIcons.map((icon) => (
                  <TouchableOpacity
                    key={icon}
                    style={[
                      styles.iconOption,
                      { 
                        borderColor: selectedIcon === icon ? theme.primary : theme.border,
                        backgroundColor: selectedIcon === icon ? theme.primary + '15' : theme.surface,
                      },
                    ]}
                    onPress={() => setSelectedIcon(icon)}
                  >
                    <Ionicons 
                      name={icon as any} 
                      size={24} 
                      color={selectedIcon === icon ? theme.primary : theme.textMuted} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.border }]}
                onPress={() => setShowAddCustom(false)}
              >
                <Text style={[styles.cancelButtonText, { color: theme.textSecondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton, { backgroundColor: theme.primary }]}
                onPress={handleAddCustom}
              >
                <Text style={styles.confirmButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    content: {
      padding: Spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    typeCard: {
      width: '47%',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
    },
    addCustomCard: {
      borderStyle: 'dashed',
      borderColor: theme.primary,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    typeName: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    intervalText: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      borderTopLeftRadius: BorderRadius.xxl,
      borderTopRightRadius: BorderRadius.xxl,
      padding: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginBottom: Spacing.lg,
    },
    modalTitle: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.lg,
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
    textInput: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.md,
      fontSize: FontSizes.md,
      color: theme.textPrimary,
    },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    iconOption: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalActions: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginTop: Spacing.md,
    },
    modalButton: {
      flex: 1,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
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
