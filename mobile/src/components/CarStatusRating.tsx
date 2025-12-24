import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

type RatingLevel = 'A' | 'B' | 'C' | 'D' | 'F';

interface CarStatusRatingProps {
  rating: RatingLevel;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const ratingConfig: Record<RatingLevel, { label: string; stars: number; description: string }> = {
  A: { label: 'Excellent', stars: 5, description: 'All maintenance up to date' },
  B: { label: 'Good', stars: 4, description: 'Minor maintenance due soon' },
  C: { label: 'Fair', stars: 3, description: 'Some maintenance overdue' },
  D: { label: 'Poor', stars: 2, description: 'Multiple items overdue' },
  F: { label: 'Critical', stars: 1, description: 'Immediate attention needed' },
};

export function CarStatusRating({ rating, size = 'medium', showLabel = true }: CarStatusRatingProps) {
  const { theme } = useTheme();
  const config = ratingConfig[rating];

  const getColor = () => {
    switch (rating) {
      case 'A':
      case 'B':
        return theme.rating.excellent;
      case 'C':
        return theme.rating.fair;
      case 'D':
      case 'F':
        return theme.rating.critical;
      default:
        return theme.textMuted;
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { badge: 28, font: FontSizes.sm, star: 12 };
      case 'large':
        return { badge: 56, font: FontSizes.xxl, star: 20 };
      default:
        return { badge: 40, font: FontSizes.lg, star: 16 };
    }
  };

  const color = getColor();
  const sizes = getSizes();

  return (
    <View style={styles.container}>
      {/* Rating Badge */}
      <View
        style={[
          styles.badge,
          {
            width: sizes.badge,
            height: sizes.badge,
            borderRadius: sizes.badge / 2,
            backgroundColor: color + '20',
          },
        ]}
      >
        <Text style={[styles.ratingText, { fontSize: sizes.font, color }]}>
          {rating}
        </Text>
      </View>

      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>
            {config.label}
          </Text>
          {/* Star Rating */}
          <View style={styles.starsContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < config.stars ? 'star' : 'star-outline'}
                size={sizes.star}
                color={i < config.stars ? color : theme.textMuted}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

// Full Card Version
interface CarStatusCardProps {
  rating: RatingLevel;
  overdueCount?: number;
  upcomingCount?: number;
  onPress?: () => void;
}

export function CarStatusCard({ rating, overdueCount = 0, upcomingCount = 0, onPress }: CarStatusCardProps) {
  const { theme } = useTheme();
  const config = ratingConfig[rating];

  const getColor = () => {
    switch (rating) {
      case 'A':
      case 'B':
        return theme.rating.excellent;
      case 'C':
        return theme.rating.fair;
      default:
        return theme.rating.critical;
    }
  };

  const color = getColor();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <CarStatusRating rating={rating} size="large" showLabel={false} />
        <View style={styles.cardHeaderText}>
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Car Health: {config.label}
          </Text>
          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            {config.description}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: theme.critical }]} />
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            {overdueCount} Overdue
          </Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: theme.warning }]} />
          <Text style={[styles.statText, { color: theme.textSecondary }]}>
            {upcomingCount} Due Soon
          </Text>
        </View>
      </View>

      {/* Stars */}
      <View style={styles.fullStarsContainer}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Ionicons
            key={i}
            name={i < config.stars ? 'star' : 'star-outline'}
            size={24}
            color={i < config.stars ? color : theme.textMuted}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    fontWeight: '700',
  },
  labelContainer: {
    gap: 2,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: FontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: FontSizes.sm,
  },
  fullStarsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
});
