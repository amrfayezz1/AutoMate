import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

const { height } = Dimensions.get('window');

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback: string) => void;
}

const emojiRatings = [
  { emoji: '😞', label: 'Poor', value: 1 },
  { emoji: '😐', label: 'Okay', value: 2 },
  { emoji: '🙂', label: 'Good', value: 3 },
  { emoji: '😊', label: 'Great', value: 4 },
  { emoji: '🤩', label: 'Amazing', value: 5 },
];

export function FeedbackModal({
  visible,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const { theme } = useTheme();
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === null) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, feedback);
      // Reset
      setRating(null);
      setFeedback('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

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
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
              <Ionicons name="heart" size={32} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              How's AutoMate working for you?
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Your feedback helps us improve!
            </Text>
          </View>

          {/* Emoji Rating */}
          <View style={styles.ratingContainer}>
            {emojiRatings.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.ratingItem,
                  rating === item.value && {
                    backgroundColor: theme.primary + '15',
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setRating(item.value)}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text
                  style={[
                    styles.ratingLabel,
                    rating === item.value && { color: theme.primary },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback Text */}
          <View style={styles.feedbackContainer}>
            <Text style={[styles.feedbackLabel, { color: theme.textSecondary }]}>
              Any additional feedback? (Optional)
            </Text>
            <TextInput
              style={[
                styles.feedbackInput,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  color: theme.textPrimary,
                },
              ]}
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Tell us what you think..."
              placeholderTextColor={theme.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.skipButton]}
              onPress={onClose}
            >
              <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>
                Maybe Later
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.submitButton,
                { backgroundColor: rating !== null ? theme.primary : theme.surfaceAlt },
              ]}
              onPress={handleSubmit}
              disabled={rating === null || isSubmitting}
            >
              <Ionicons name="send" size={18} color="#FFF" />
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Sending...' : 'Submit'}
              </Text>
            </TouchableOpacity>
          </View>
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
      borderTopLeftRadius: BorderRadius.xxl,
      borderTopRightRadius: BorderRadius.xxl,
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.xxl,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    iconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    title: {
      fontSize: FontSizes.xl,
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: Spacing.xs,
    },
    subtitle: {
      fontSize: FontSizes.md,
      textAlign: 'center',
    },
    ratingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.xl,
    },
    ratingItem: {
      alignItems: 'center',
      padding: Spacing.sm,
      borderRadius: BorderRadius.lg,
      borderWidth: 2,
      borderColor: 'transparent',
      flex: 1,
      marginHorizontal: 2,
    },
    emoji: {
      fontSize: 28,
      marginBottom: Spacing.xs,
    },
    ratingLabel: {
      fontSize: FontSizes.xs,
      color: theme.textMuted,
    },
    feedbackContainer: {
      marginBottom: Spacing.xl,
    },
    feedbackLabel: {
      fontSize: FontSizes.sm,
      marginBottom: Spacing.sm,
    },
    feedbackInput: {
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      padding: Spacing.md,
      fontSize: FontSizes.md,
      height: 100,
    },
    actions: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    actionButton: {
      flex: 1,
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    skipButton: {},
    skipButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
    },
    submitButton: {},
    submitButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
