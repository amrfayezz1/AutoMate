import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

// Mock data - will be replaced with real data from store/API
const mockCars = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2021,
    plateNumber: 'ABC 123',
    mileage: 45000,
    rating: 'A',
    nextMaintenance: 'Oil Change in 500 km',
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Accord',
    year: 2020,
    plateNumber: 'XYZ 789',
    mileage: 62000,
    rating: 'B',
    nextMaintenance: 'Tire Rotation in 2 weeks',
  },
];

type Car = typeof mockCars[0];

const getRatingColor = (rating: string, theme: any) => {
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

export default function MyCarsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [cars] = useState<Car[]>(mockCars);

  const handleCarPress = (car: Car) => {
    router.push(`/cars/${car.id}`);
  };

  const handleAddCar = () => {
    router.push('/cars/add');
  };

  const handleDeleteCar = (car: Car) => {
    Alert.alert(
      t('cars.deleteCar'),
      t('cars.deleteCarConfirmation', { car: `${car.year} ${car.make} ${car.model}` }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete
            console.log('Delete car:', car.id);
          }
        },
      ]
    );
  };

  const styles = createStyles(theme);

  const renderCarItem = ({ item }: { item: Car }) => (
    <TouchableOpacity
      style={styles.carCard}
      onPress={() => handleCarPress(item)}
      activeOpacity={0.7}
    >
      {/* Car Image Placeholder */}
      <View style={styles.carImageContainer}>
        <Ionicons name="car-sport" size={40} color={theme.primary} />
      </View>

      {/* Car Info */}
      <View style={styles.carInfo}>
        <View style={styles.carHeader}>
          <Text style={styles.carName}>
            {item.year} {item.make} {item.model}
          </Text>
          <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(item.rating, theme) + '20' }]}>
            <Text style={[styles.ratingText, { color: getRatingColor(item.rating, theme) }]}>
              {item.rating}
            </Text>
          </View>
        </View>

        <Text style={styles.plateNumber}>{item.plateNumber}</Text>

        <View style={styles.carStats}>
          <View style={styles.statItem}>
            <Ionicons name="speedometer-outline" size={16} color={theme.textMuted} />
            <Text style={styles.statText}>{item.mileage.toLocaleString()} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="construct-outline" size={16} color={theme.warning} />
            <Text style={styles.nextMaintenanceText}>{item.nextMaintenance}</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => handleDeleteCar(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="ellipsis-vertical" size={20} color={theme.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="car-outline" size={64} color={theme.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>{t('cars.noCars')}</Text>
      <Text style={styles.emptySubtitle}>{t('cars.noCarsDescription')}</Text>
      <TouchableOpacity 
        style={styles.addCarButton} 
        onPress={handleAddCar}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle" size={24} color="#FFF" />
        <Text style={styles.addCarButtonText}>{t('cars.addCar')}</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.headerTitle}>{t('cars.myCars')}</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={handleAddCar}
        >
          <Ionicons name="add" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Cars List */}
      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        renderItem={renderCarItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
      />
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
    addButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    listContent: {
      padding: Spacing.lg,
      flexGrow: 1,
    },
    carCard: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    carImageContainer: {
      width: 72,
      height: 72,
      borderRadius: BorderRadius.md,
      backgroundColor: theme.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    carInfo: {
      flex: 1,
    },
    carHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.xs,
    },
    carName: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    ratingBadge: {
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    ratingText: {
      fontSize: FontSizes.xs,
      fontWeight: '700',
    },
    plateNumber: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
      marginBottom: Spacing.sm,
    },
    carStats: {
      gap: Spacing.xs,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statText: {
      fontSize: FontSizes.xs,
      color: theme.textSecondary,
    },
    nextMaintenanceText: {
      fontSize: FontSizes.xs,
      color: theme.warning,
    },
    moreButton: {
      padding: Spacing.xs,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
    },
    emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.surfaceAlt,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    emptyTitle: {
      fontSize: FontSizes.xl,
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
    },
    emptySubtitle: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: Spacing.xl,
    },
    addCarButton: {
      flexDirection: 'row',
      backgroundColor: theme.primary,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    addCarButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
