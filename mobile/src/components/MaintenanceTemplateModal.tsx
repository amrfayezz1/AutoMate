import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius, Maintenance } from '@/lib/theme';

const { height } = Dimensions.get('window');

interface MaintenanceTemplate {
  id: string;
  name: string;
  type: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  intervalKm?: number;
  intervalMonths?: number;
  estimatedCost?: string;
  description?: string;
}

const templates: MaintenanceTemplate[] = [
  {
    id: 'oil-standard',
    name: 'Standard Oil Change',
    type: 'oil',
    icon: 'water-outline',
    color: Maintenance.oil,
    intervalKm: 5000,
    intervalMonths: 6,
    estimatedCost: '$30-$75',
    description: 'Conventional oil change with filter replacement',
  },
  {
    id: 'oil-synthetic',
    name: 'Full Synthetic Oil Change',
    type: 'oil',
    icon: 'water',
    color: Maintenance.oil,
    intervalKm: 10000,
    intervalMonths: 12,
    estimatedCost: '$65-$125',
    description: 'Synthetic oil for high-performance engines',
  },
  {
    id: 'tire-rotation',
    name: 'Tire Rotation',
    type: 'tires',
    icon: 'ellipse-outline',
    color: Maintenance.tires,
    intervalKm: 10000,
    intervalMonths: 6,
    estimatedCost: '$20-$50',
    description: 'Rotate tires for even wear',
  },
  {
    id: 'brake-inspection',
    name: 'Brake Inspection',
    type: 'brakes',
    icon: 'disc-outline',
    color: Maintenance.brakes,
    intervalKm: 20000,
    intervalMonths: 12,
    estimatedCost: '$50-$100',
    description: 'Inspect brake pads, rotors, and fluid',
  },
  {
    id: 'air-filter',
    name: 'Air Filter Replacement',
    type: 'filters',
    icon: 'funnel-outline',
    color: Maintenance.filters,
    intervalKm: 15000,
    intervalMonths: 12,
    estimatedCost: '$20-$50',
    description: 'Replace engine air filter',
  },
  {
    id: 'cabin-filter',
    name: 'Cabin Air Filter',
    type: 'filters',
    icon: 'leaf-outline',
    color: Maintenance.filters,
    intervalKm: 15000,
    intervalMonths: 12,
    estimatedCost: '$25-$60',
    description: 'Replace cabin air filter for clean interior air',
  },
];

interface MaintenanceTemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: MaintenanceTemplate) => void;
}

export function MaintenanceTemplateModal({
  visible,
  onClose,
  onSelect,
}: MaintenanceTemplateModalProps) {
  const { theme } = useTheme();

  const handleSelect = (template: MaintenanceTemplate) => {
    onSelect(template);
    onClose();
  };

  const renderItem = ({ item }: { item: MaintenanceTemplate }) => (
    <TouchableOpacity
      style={[styles.templateItem, { backgroundColor: theme.surface, borderColor: theme.border }]}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.templateIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <View style={styles.templateContent}>
        <Text style={[styles.templateName, { color: theme.textPrimary }]}>
          {item.name}
        </Text>
        <Text style={[styles.templateDescription, { color: theme.textMuted }]} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.templateMeta}>
          {item.intervalKm && (
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              Every {(item.intervalKm / 1000).toFixed(0)}k km
            </Text>
          )}
          {item.estimatedCost && (
            <Text style={[styles.metaText, { color: theme.success }]}>
              {item.estimatedCost}
            </Text>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
    </TouchableOpacity>
  );

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
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Choose a Template
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Select a preset to quickly add common maintenance types
          </Text>

          <FlatList
            data={templates}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          />
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
      maxHeight: height * 0.75,
      borderTopLeftRadius: BorderRadius.xxl,
      borderTopRightRadius: BorderRadius.xxl,
      paddingBottom: Spacing.xxl,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.xs,
    },
    title: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
    },
    subtitle: {
      fontSize: FontSizes.sm,
      paddingHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    listContent: {
      paddingHorizontal: Spacing.lg,
    },
    templateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      gap: Spacing.md,
    },
    templateIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    templateContent: {
      flex: 1,
    },
    templateName: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      marginBottom: 2,
    },
    templateDescription: {
      fontSize: FontSizes.xs,
      marginBottom: Spacing.xs,
    },
    templateMeta: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    metaText: {
      fontSize: FontSizes.xs,
    },
  });
