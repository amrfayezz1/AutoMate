import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  required: boolean;
  granted: boolean;
}

export default function PermissionsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'notifications',
      title: 'Push Notifications',
      description: 'Receive maintenance reminders and important alerts',
      icon: 'notifications-outline',
      required: true,
      granted: false,
    },
    {
      id: 'camera',
      title: 'Camera',
      description: 'Take photos of receipts and documents',
      icon: 'camera-outline',
      required: false,
      granted: false,
    },
    {
      id: 'photos',
      title: 'Photo Library',
      description: 'Upload existing photos for documents',
      icon: 'images-outline',
      required: false,
      granted: false,
    },
    {
      id: 'location',
      title: 'Location (Optional)',
      description: 'Find nearby service providers',
      icon: 'location-outline',
      required: false,
      granted: false,
    },
  ]);

  const handleRequestPermission = async (permissionId: string) => {
    // In a real app, this would use expo-permissions or similar
    Alert.alert(
      'Permission Request',
      'This would request the actual permission in a real implementation.',
      [
        {
          text: 'Deny',
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: () => {
            setPermissions((prev) =>
              prev.map((p) =>
                p.id === permissionId ? { ...p, granted: true } : p
              )
            );
          },
        },
      ]
    );
  };

  const handleContinue = () => {
    const requiredPermissions = permissions.filter((p) => p.required);
    const allRequiredGranted = requiredPermissions.every((p) => p.granted);

    if (!allRequiredGranted) {
      Alert.alert(
        'Permissions Required',
        'Please grant the required permissions to continue.',
        [{ text: 'OK' }]
      );
      return;
    }

    router.replace('/(tabs)/home');
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Permissions',
      'Some features may not work without these permissions. You can enable them later in Settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Skip Anyway', onPress: () => router.replace('/(tabs)/home') },
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="shield-checkmark" size={48} color={theme.primary} />
          </View>
          <Text style={styles.title}>Enable Permissions</Text>
          <Text style={styles.subtitle}>
            To give you the best experience, AutoMate needs a few permissions.
          </Text>
        </View>

        {/* Permissions List */}
        <View style={styles.permissionsList}>
          {permissions.map((permission) => (
            <View
              key={permission.id}
              style={[
                styles.permissionItem,
                permission.granted && styles.permissionItemGranted,
              ]}
            >
              <View style={[styles.permissionIcon, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons
                  name={permission.icon}
                  size={24}
                  color={permission.granted ? theme.success : theme.primary}
                />
              </View>
              <View style={styles.permissionContent}>
                <View style={styles.permissionHeader}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  {permission.required && (
                    <View style={[styles.requiredBadge, { backgroundColor: theme.critical + '20' }]}>
                      <Text style={[styles.requiredText, { color: theme.critical }]}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.permissionDescription}>{permission.description}</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  permission.granted
                    ? { backgroundColor: theme.success }
                    : { backgroundColor: theme.primary },
                ]}
                onPress={() => handleRequestPermission(permission.id)}
                disabled={permission.granted}
              >
                {permission.granted ? (
                  <Ionicons name="checkmark" size={18} color="#FFF" />
                ) : (
                  <Text style={styles.toggleButtonText}>Allow</Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Note */}
        <View style={[styles.noteContainer, { backgroundColor: theme.surfaceAlt }]}>
          <Ionicons name="information-circle" size={20} color={theme.textMuted} />
          <Text style={styles.noteText}>
            You can change these permissions anytime in your device settings.
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={[styles.skipButtonText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: theme.primary }]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: Spacing.lg,
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    iconContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: '700',
      color: theme.textPrimary,
      marginBottom: Spacing.sm,
    },
    subtitle: {
      fontSize: FontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    permissionsList: {
      gap: Spacing.sm,
      marginBottom: Spacing.lg,
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      gap: Spacing.md,
    },
    permissionItemGranted: {
      borderColor: theme.success + '50',
      backgroundColor: theme.success + '08',
    },
    permissionIcon: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    permissionContent: {
      flex: 1,
    },
    permissionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: 2,
    },
    permissionTitle: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: theme.textPrimary,
    },
    requiredBadge: {
      paddingHorizontal: Spacing.xs,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    requiredText: {
      fontSize: FontSizes.xs,
      fontWeight: '600',
    },
    permissionDescription: {
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    toggleButton: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.md,
      minWidth: 60,
      alignItems: 'center',
    },
    toggleButtonText: {
      fontSize: FontSizes.sm,
      fontWeight: '600',
      color: '#FFF',
    },
    noteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: Spacing.sm,
    },
    noteText: {
      flex: 1,
      fontSize: FontSizes.sm,
      color: theme.textMuted,
    },
    footer: {
      flexDirection: 'row',
      padding: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: Spacing.md,
    },
    skipButton: {
      paddingHorizontal: Spacing.xl,
      justifyContent: 'center',
    },
    skipButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '500',
    },
    continueButton: {
      flex: 1,
      flexDirection: 'row',
      height: 52,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    continueButtonText: {
      fontSize: FontSizes.md,
      fontWeight: '600',
      color: '#FFF',
    },
  });
