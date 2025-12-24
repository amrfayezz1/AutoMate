import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  illustration?: React.ReactNode;
}

export function EmptyState({
  icon = 'file-tray-outline',
  title,
  description,
  actionLabel,
  onAction,
  illustration,
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {illustration ? (
        illustration
      ) : (
        <View style={[styles.iconContainer, { backgroundColor: theme.surfaceAlt }]}>
          <Ionicons name={icon} size={64} color={theme.textMuted} />
        </View>
      )}

      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>

      {description && (
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {description}
        </Text>
      )}

      {actionLabel && onAction && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={onAction}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Preset empty states for common scenarios
export function NoCarsEmpty({ onAddCar }: { onAddCar: () => void }) {
  return (
    <EmptyState
      icon="car-outline"
      title="No cars yet"
      description="Add your first car to start tracking maintenance and documents."
      actionLabel="Add Car"
      onAction={onAddCar}
    />
  );
}

export function NoMaintenanceEmpty({ onAddMaintenance }: { onAddMaintenance: () => void }) {
  return (
    <EmptyState
      icon="construct-outline"
      title="No maintenance records"
      description="Start tracking your car's maintenance history."
      actionLabel="Add Maintenance"
      onAction={onAddMaintenance}
    />
  );
}

export function NoRemindersEmpty({ onAddReminder }: { onAddReminder: () => void }) {
  return (
    <EmptyState
      icon="notifications-outline"
      title="No reminders set"
      description="Set up reminders to never miss a maintenance schedule."
      actionLabel="Add Reminder"
      onAction={onAddReminder}
    />
  );
}

export function NoDocumentsEmpty({ onAddDocument }: { onAddDocument: () => void }) {
  return (
    <EmptyState
      icon="document-text-outline"
      title="No documents"
      description="Store your car's important documents like license, insurance, and inspection records."
      actionLabel="Add Document"
      onAction={onAddDocument}
    />
  );
}

export function NoSearchResultsEmpty({ searchTerm }: { searchTerm: string }) {
  return (
    <EmptyState
      icon="search-outline"
      title="No results found"
      description={`We couldn't find anything matching "${searchTerm}". Try a different search term.`}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
  },
  actionButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFF',
  },
});
