import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  type?: 'network' | 'server' | 'notFound' | 'generic';
}

const errorConfig = {
  network: {
    icon: 'wifi-outline' as const,
    title: 'No Internet Connection',
    message: 'Please check your network connection and try again.',
  },
  server: {
    icon: 'server-outline' as const,
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again later.',
  },
  notFound: {
    icon: 'search-outline' as const,
    title: 'Not Found',
    message: 'The resource you are looking for could not be found.',
  },
  generic: {
    icon: 'alert-circle-outline' as const,
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again.',
  },
};

export function ErrorState({
  title,
  message,
  onRetry,
  retryLabel = 'Try Again',
  type = 'generic',
}: ErrorStateProps) {
  const { theme } = useTheme();
  const config = errorConfig[type];

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: theme.critical + '15' }]}>
        <Ionicons name={config.icon} size={64} color={theme.critical} />
      </View>

      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {title || config.title}
      </Text>

      <Text style={[styles.message, { color: theme.textSecondary }]}>
        {message || config.message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.primary }]}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={20} color="#FFF" />
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Preset error states
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState type="network" onRetry={onRetry} />;
}

export function ServerError({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState type="server" onRetry={onRetry} />;
}

export function NotFoundError({ message }: { message?: string }) {
  return <ErrorState type="notFound" message={message} />;
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
  message: {
    fontSize: FontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  retryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
    color: '#FFF',
  },
});
