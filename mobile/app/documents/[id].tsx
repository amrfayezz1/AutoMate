import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

export default function DocumentDetailScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Mock data
  const document = {
    id,
    type: 'license',
    title: 'Vehicle License',
    expiryDate: '2025-06-15',
    isExpired: false,
    daysUntilExpiry: 180,
    notes: 'Renewed at Nasr City traffic department',
    createdAt: '2024-06-15',
  };

  const getStatusColor = () => {
    if (document.isExpired) return theme.critical;
    if (document.daysUntilExpiry <= 30) return theme.warning;
    return theme.success;
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const statusColor = getStatusColor();
  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Details</Text>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Preview */}
        <View style={styles.previewCard}>
          <View style={[styles.previewIcon, { backgroundColor: statusColor + '20' }]}>
            <Ionicons name="card" size={48} color={statusColor} />
          </View>
          <Text style={styles.documentTitle}>{document.title}</Text>
          
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {document.isExpired ? 'Expired' : 'Active'}
            </Text>
          </View>
        </View>

        {/* Expiry Card */}
        <View style={[styles.expiryCard, { borderColor: statusColor + '40' }]}>
          <Ionicons name="calendar" size={24} color={statusColor} />
          <View style={styles.expiryInfo}>
            <Text style={styles.expiryLabel}>
              {document.isExpired ? 'Expired on' : 'Expires on'}
            </Text>
            <Text style={[styles.expiryDate, { color: statusColor }]}>
              {document.expiryDate}
            </Text>
          </View>
          <Text style={[styles.daysText, { color: statusColor }]}>
            {document.isExpired
              ? `${Math.abs(document.daysUntilExpiry)} days ago`
              : `${document.daysUntilExpiry} days left`}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{t(`documents.${document.type}`)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Added on</Text>
            <Text style={styles.detailValue}>{document.createdAt}</Text>
          </View>
        </View>

        {/* Notes */}
        {document.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{document.notes}</Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={theme.textPrimary} />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color={theme.textPrimary} />
            <Text style={styles.actionButtonText}>Download</Text>
          </TouchableOpacity>
        </View>

        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color={theme.critical} />
          <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
        </TouchableOpacity>
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
    previewCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xxl,
      padding: Spacing.xl,
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    previewIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    documentTitle: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
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
    expiryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      gap: Spacing.md,
    },
    expiryInfo: {
      flex: 1,
    },
    expiryLabel: {
      fontSize: FontSizes.sm,
      color: theme.textSecondary,
    },
    expiryDate: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
    },
    daysText: {
      fontSize: FontSizes.sm,
      fontWeight: '500',
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
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.surface,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
    },
    detailLabel: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
    },
    detailValue: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    notesCard: {
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    notesText: {
      fontSize: FontSizes.md,
      color: theme.textPrimary,
      lineHeight: 24,
    },
    actionsSection: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.lg,
      padding: Spacing.md,
    },
    actionButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
    },
    deleteButtonText: {
      fontSize: FontSizes.md,
      color: theme.critical,
    },
  });
