import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

interface DocumentItem {
  id: string;
  type: 'license' | 'insurance' | 'inspection';
  title: string;
  expiryDate: string;
  isExpired: boolean;
  daysUntilExpiry: number;
}

const mockDocuments: DocumentItem[] = [
  {
    id: '1',
    type: 'license',
    title: 'Vehicle License',
    expiryDate: '2025-06-15',
    isExpired: false,
    daysUntilExpiry: 180,
  },
  {
    id: '2',
    type: 'insurance',
    title: 'Comprehensive Insurance',
    expiryDate: '2025-01-20',
    isExpired: false,
    daysUntilExpiry: 27,
  },
  {
    id: '3',
    type: 'inspection',
    title: 'Safety Inspection',
    expiryDate: '2024-12-01',
    isExpired: true,
    daysUntilExpiry: -23,
  },
];

export default function DocumentsScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const getDocumentIcon = (type: string) => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
      license: 'card',
      insurance: 'shield-checkmark',
      inspection: 'clipboard',
    };
    return icons[type] || 'document';
  };

  const getStatusColor = (doc: DocumentItem) => {
    if (doc.isExpired) return theme.critical;
    if (doc.daysUntilExpiry <= 30) return theme.warning;
    return theme.success;
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('documents.title')}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/documents/add')}
        >
          <Ionicons name="add" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Add Cards */}
        <View style={styles.quickAddGrid}>
          {['license', 'insurance', 'inspection'].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.quickAddCard}
              onPress={() => router.push(`/documents/add?type=${type}`)}
            >
              <Ionicons
                name={getDocumentIcon(type)}
                size={28}
                color={theme.primary}
              />
              <Text style={styles.quickAddText}>
                {t(`documents.${type}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Documents List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('documents.title')}</Text>

          {mockDocuments.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={64} color={theme.textMuted} />
              <Text style={styles.emptyStateTitle}>{t('documents.noDocuments')}</Text>
              <Text style={styles.emptyStateSubtitle}>
                {t('documents.noDocumentsDescription')}
              </Text>
            </View>
          ) : (
            <View style={styles.documentsList}>
              {mockDocuments.map((doc) => {
                const statusColor = getStatusColor(doc);
                return (
                  <TouchableOpacity
                    key={doc.id}
                    style={styles.documentCard}
                    onPress={() => router.push(`/documents/${doc.id}`)}
                  >
                    <View style={[styles.documentIcon, { backgroundColor: statusColor + '20' }]}>
                      <Ionicons
                        name={getDocumentIcon(doc.type)}
                        size={24}
                        color={statusColor}
                      />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentTitle}>{doc.title}</Text>
                      <Text style={[styles.documentExpiry, { color: statusColor }]}>
                        {doc.isExpired
                          ? t('documents.expired')
                          : t('documents.expiresOn', { date: doc.expiryDate })}
                      </Text>
                    </View>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
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
    addButton: {
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
    quickAddGrid: {
      flexDirection: 'row',
      gap: Spacing.md,
      marginBottom: Spacing.xl,
    },
    quickAddCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      alignItems: 'center',
      gap: Spacing.sm,
    },
    quickAddText: {
      fontSize: FontSizes.xs,
      fontWeight: '500',
      color: theme.textSecondary,
      textAlign: 'center',
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
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing.xxl * 2,
    },
    emptyStateTitle: {
      fontSize: FontSizes.lg,
      fontWeight: '600',
      color: theme.textSecondary,
      marginTop: Spacing.md,
    },
    emptyStateSubtitle: {
      fontSize: FontSizes.md,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: Spacing.xs,
    },
    documentsList: {
      gap: Spacing.md,
    },
    documentCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      gap: Spacing.md,
    },
    documentIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    documentInfo: {
      flex: 1,
    },
    documentTitle: {
      fontSize: FontSizes.md,
      fontWeight: '500',
      color: theme.textPrimary,
    },
    documentExpiry: {
      fontSize: FontSizes.sm,
      marginTop: 2,
    },
    statusDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  });
