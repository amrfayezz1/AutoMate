import React from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, BorderRadius } from '@/lib/theme';

const { width } = Dimensions.get('window');

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ 
  width: skeletonWidth = '100%', 
  height = 20, 
  borderRadius = BorderRadius.md,
  style 
}: SkeletonProps) {
  const { theme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width: skeletonWidth,
          height,
          borderRadius,
          backgroundColor: theme.surfaceAlt,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Card Skeleton for list items
export function CardSkeleton() {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Skeleton width={72} height={72} borderRadius={BorderRadius.md} />
      <View style={styles.cardContent}>
        <Skeleton width="70%" height={18} style={{ marginBottom: Spacing.sm }} />
        <Skeleton width="40%" height={14} style={{ marginBottom: Spacing.sm }} />
        <Skeleton width="90%" height={12} />
      </View>
    </View>
  );
}

// List Skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View style={styles.listContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </View>
  );
}

// Home Dashboard Skeleton
export function HomeSkeleton() {
  const { theme } = useTheme();

  return (
    <View style={styles.homeContainer}>
      {/* Active Car Card */}
      <View style={[styles.bigCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.row}>
          <Skeleton width={60} height={60} borderRadius={BorderRadius.lg} />
          <View style={styles.flexFill}>
            <Skeleton width="60%" height={20} style={{ marginBottom: Spacing.sm }} />
            <Skeleton width="40%" height={14} />
          </View>
          <Skeleton width={40} height={28} borderRadius={BorderRadius.sm} />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Skeleton width={(width - Spacing.lg * 2 - Spacing.md * 2) / 3} height={80} borderRadius={BorderRadius.lg} />
        <Skeleton width={(width - Spacing.lg * 2 - Spacing.md * 2) / 3} height={80} borderRadius={BorderRadius.lg} />
        <Skeleton width={(width - Spacing.lg * 2 - Spacing.md * 2) / 3} height={80} borderRadius={BorderRadius.lg} />
      </View>

      {/* Recent Activity */}
      <Skeleton width="40%" height={18} style={{ marginBottom: Spacing.md }} />
      <ListSkeleton count={2} />
    </View>
  );
}

// Maintenance List Skeleton
export function MaintenanceListSkeleton() {
  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Skeleton width={80} height={36} borderRadius={BorderRadius.full} />
        <Skeleton width={80} height={36} borderRadius={BorderRadius.full} />
        <Skeleton width={80} height={36} borderRadius={BorderRadius.full} />
      </View>
      <ListSkeleton count={4} />
    </View>
  );
}

// Document Grid Skeleton
export function DocumentGridSkeleton() {
  const cardWidth = (width - Spacing.lg * 2 - Spacing.md) / 2;

  return (
    <View style={styles.grid}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton 
          key={index} 
          width={cardWidth} 
          height={120} 
          borderRadius={BorderRadius.lg} 
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },
  homeContainer: {
    padding: Spacing.lg,
  },
  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cardContent: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  listContainer: {
    gap: Spacing.md,
  },
  bigCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  flexFill: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  tabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    padding: Spacing.lg,
  },
});
