import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';
import { UpdateMileageModal } from '@/components/UpdateMileageModal';

export default function CarProfileScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showMileageModal, setShowMileageModal] = useState(false);

  // Mock data - will be replaced with real data
  const car = {
    id,
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    plateNumber: 'ABC 123',
    mileage: 45000,
    status: 'A',
    maintenanceMode: 'mileage',
  };

  const handleEditCar = () => {
    // Pass id as query parameter to edit screen
    router.push({ pathname: '/cars/edit' as any, params: { id } });
  };

  const handleUpdateMileage = (newMileage: number) => {
    console.log('New mileage:', newMileage);
    setShowMileageModal(false);
  };

  const handleDeleteCar = () => {
    Alert.alert(
      t('cars.deleteCar'),
      t('cars.deleteCarConfirmation', { car: `${car.make} ${car.model}` }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'), style: 'destructive', onPress: () => {
            console.log('Delete car:', id);
            router.back();
          }
        },
      ]
    );
  };

  const handleMaintenancePress = () => {
    router.push('/maintenance/due');
  };

  const handleDocumentsPress = () => {
    router.push('/documents');
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('cars.carDetails')}</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditCar}
        >
          <Ionicons name="create-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Car Card */}
        <View style={styles.carCard}>
          <View style={styles.carIconContainer}>
            <Ionicons name="car-sport" size={48} color={theme.primary} />
          </View>
          <Text style={styles.carName}>{car.make} {car.model}</Text>
          <Text style={styles.carDetails}>{car.year} • {car.plateNumber}</Text>

          {/* Status Badge */}
          <View style={[styles.statusBadge, { backgroundColor: theme.rating.excellent + '20' }]}>
            <Text style={[styles.statusText, { color: theme.rating.excellent }]}>
              {t('common.status')}: {car.status}
            </Text>
          </View>
        </View>

        {/* Mileage Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="speedometer-outline" size={20} color={theme.textSecondary} />
            <Text style={styles.infoCardTitle}>{t('cars.mileage')}</Text>
          </View>
          <View style={styles.infoCardContent}>
            <Text style={styles.mileageValue}>{car.mileage.toLocaleString()}</Text>
            <Text style={styles.mileageUnit}>{t('common.km')}</Text>
          </View>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => setShowMileageModal(true)}
          >
            <Ionicons name="add" size={16} color={theme.primary} />
            <Text style={styles.updateButtonText}>{t('cars.updateMileage')}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/maintenance/history')}>
            <Ionicons name="construct" size={24} color={theme.primary} />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>{t('home.totalServices')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/maintenance/due')}>
            <Ionicons name="time" size={24} color={theme.warning} />
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>{t('home.upcoming')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/documents')}>
            <Ionicons name="document-text" size={24} color={theme.info} />
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>{t('home.documents')}</Text>
          </TouchableOpacity>
        </View>

        {/* Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('maintenance.title')}</Text>
          <TouchableOpacity style={styles.sectionItem} onPress={handleMaintenancePress}>
            <View style={styles.sectionItemLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.maintenance.oil + '20' }]}>
                <Ionicons name="water" size={20} color={theme.maintenance.oil} />
              </View>
              <View>
                <Text style={styles.sectionItemTitle}>{t('maintenance.oil')}</Text>
                <Text style={styles.sectionItemSubtitle}>{t('home.dueInKm', { km: 500 })}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('documents.title')}</Text>
          <TouchableOpacity style={styles.sectionItem} onPress={handleDocumentsPress}>
            <View style={styles.sectionItemLeft}>
              <View style={[styles.sectionIcon, { backgroundColor: theme.info + '20' }]}>
                <Ionicons name="card" size={20} color={theme.info} />
              </View>
              <View>
                <Text style={styles.sectionItemTitle}>{t('documents.license')}</Text>
                <Text style={styles.sectionItemSubtitle}>{t('documents.expiresOn', { date: 'Dec 2025' })}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCar}>
          <Ionicons name="trash-outline" size={20} color={theme.critical} />
          <Text style={styles.deleteButtonText}>{t('cars.deleteCar')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Update Mileage Modal */}
      <UpdateMileageModal
        visible={showMileageModal}
        onClose={() => setShowMileageModal(false)}
        onSave={handleUpdateMileage}
        currentMileage={car.mileage}
        carName={`${car.make} ${car.model}`}
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
    editButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    carCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    carIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    carName: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    carDetails: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      marginBottom: Spacing.md,
    },
    statusBadge: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    statusText: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
    },
    infoCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    infoCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    infoCardTitle: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    infoCardContent: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: Spacing.xs,
      marginBottom: Spacing.md,
    },
    mileageValue: {
      fontSize: FontSizes.xxxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    mileageUnit: {
      fontSize: FontSizes.lg,
      color: theme.textMuted,
    },
    updateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.xs,
      backgroundColor: theme.primary + '15',
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
    },
    updateButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
      color: theme.primary,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.lg,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.md,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statValue: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
    },
    statLabel: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
      textAlign: 'center',
    },
    section: {
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: theme.textMuted,
      textTransform: 'uppercase',
      marginBottom: Spacing.sm,
    },
    sectionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
    },
    sectionItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    sectionIcon: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionItemTitle: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    sectionItemSubtitle: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
      marginTop: Spacing.xl,
    },
    deleteButtonText: {
      fontSize: FontSizes.md,
      color: theme.critical,
    },
  });
