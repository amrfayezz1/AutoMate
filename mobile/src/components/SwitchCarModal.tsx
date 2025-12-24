import React from 'react';
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
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { height } = Dimensions.get('window');

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  rating?: string;
}

interface SwitchCarModalProps {
  visible: boolean;
  onClose: () => void;
  cars: Car[];
  selectedCarId?: string;
  onSelectCar: (car: Car) => void;
  onAddCar: () => void;
}

const getRatingColor = (rating: string | undefined, theme: any) => {
  switch (rating) {
    case 'A':
      return theme.rating.excellent;
    case 'B':
    case 'C':
      return theme.rating.fair;
    case 'D':
    case 'F':
      return theme.rating.critical;
    default:
      return theme.textMuted;
  }
};

export function SwitchCarModal({
  visible,
  onClose,
  cars,
  selectedCarId,
  onSelectCar,
  onAddCar,
}: SwitchCarModalProps) {
  const { theme } = useTheme();

  const renderCarItem = ({ item }: { item: Car }) => {
    const isSelected = item.id === selectedCarId;

    return (
      <TouchableOpacity
        style={[
          styles.carItem,
          { 
            backgroundColor: isSelected ? theme.primary + '10' : theme.surface,
            borderColor: isSelected ? theme.primary : theme.border,
          },
        ]}
        onPress={() => {
          onSelectCar(item);
          onClose();
        }}
        activeOpacity={0.7}
      >
        {/* Car Icon */}
        <View style={[styles.carIcon, { backgroundColor: theme.primary + '15' }]}>
          <Ionicons name="car-sport" size={28} color={theme.primary} />
        </View>

        {/* Car Info */}
        <View style={styles.carInfo}>
          <Text style={[styles.carName, { color: theme.textPrimary }]}>
            {item.year} {item.make} {item.model}
          </Text>
          <Text style={[styles.plateNumber, { color: theme.textMuted }]}>
            {item.plateNumber}
          </Text>
        </View>

        {/* Rating Badge */}
        {item.rating && (
          <View 
            style={[
              styles.ratingBadge, 
              { backgroundColor: getRatingColor(item.rating, theme) + '20' }
            ]}
          >
            <Text 
              style={[
                styles.ratingText, 
                { color: getRatingColor(item.rating, theme) }
              ]}
            >
              {item.rating}
            </Text>
          </View>
        )}

        {/* Check mark for selected */}
        {isSelected && (
          <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
        )}
      </TouchableOpacity>
    );
  };

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
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Select Car
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Cars List */}
          <FlatList
            data={cars}
            keyExtractor={(item) => item.id}
            renderItem={renderCarItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          />

          {/* Add Car Button */}
          <TouchableOpacity
            style={[styles.addCarButton, { borderColor: theme.primary }]}
            onPress={() => {
              onClose();
              onAddCar();
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
            <Text style={[styles.addCarText, { color: theme.primary }]}>
              Add New Car
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: height * 0.7,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingBottom: Spacing.xl,
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
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  carIcon: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carInfo: {
    flex: 1,
  },
  carName: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    marginBottom: 2,
  },
  plateNumber: {
    fontSize: FontSizes.sm,
  },
  ratingBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  addCarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  addCarText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
});
