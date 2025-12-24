import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/lib/ThemeProvider';
import { Spacing, FontSizes, BorderRadius } from '@/lib/theme';

type DistanceUnit = 'km' | 'mi';
type CurrencyFormat = 'usd' | 'eur' | 'gbp' | 'aed' | 'sar';

export default function PreferencesScreen() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [preferences, setPreferences] = useState({
        distanceUnit: 'km' as DistanceUnit,
        currency: 'usd' as CurrencyFormat,
        autoCalculateNextDue: true,
        showCostInHistory: true,
        defaultMaintenanceMode: 'mileage' as 'time' | 'mileage',
    });

    const distanceUnits: { value: DistanceUnit; label: string }[] = [
        { value: 'km', label: 'Kilometers (km)' },
        { value: 'mi', label: 'Miles (mi)' },
    ];

    const currencies: { value: CurrencyFormat; label: string; symbol: string }[] = [
        { value: 'usd', label: 'US Dollar', symbol: '$' },
        { value: 'eur', label: 'Euro', symbol: '€' },
        { value: 'gbp', label: 'British Pound', symbol: '£' },
        { value: 'aed', label: 'UAE Dirham', symbol: 'د.إ' },
        { value: 'sar', label: 'Saudi Riyal', symbol: '﷼' },
    ];

    const updatePreference = <K extends keyof typeof preferences>(
        key: K,
        value: typeof preferences[K]
    ) => {
        setPreferences((prev) => ({ ...prev, [key]: value }));
        // TODO: Persist to storage
    };

    const styles = createStyles(theme);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings.preferences')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Units Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Units & Format</Text>

                    {/* Distance Unit */}
                    <View style={styles.optionGroup}>
                        <Text style={styles.optionLabel}>Distance Unit</Text>
                        <View style={styles.optionRow}>
                            {distanceUnits.map((unit) => (
                                <TouchableOpacity
                                    key={unit.value}
                                    style={[
                                        styles.optionButton,
                                        preferences.distanceUnit === unit.value && styles.optionButtonActive,
                                    ]}
                                    onPress={() => updatePreference('distanceUnit', unit.value)}
                                >
                                    <Text
                                        style={[
                                            styles.optionButtonText,
                                            preferences.distanceUnit === unit.value && styles.optionButtonTextActive,
                                        ]}
                                    >
                                        {unit.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Currency */}
                    <View style={styles.optionGroup}>
                        <Text style={styles.optionLabel}>Currency</Text>
                        <View style={styles.currencyGrid}>
                            {currencies.map((currency) => (
                                <TouchableOpacity
                                    key={currency.value}
                                    style={[
                                        styles.currencyButton,
                                        preferences.currency === currency.value && styles.currencyButtonActive,
                                    ]}
                                    onPress={() => updatePreference('currency', currency.value)}
                                >
                                    <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                                    <Text
                                        style={[
                                            styles.currencyLabel,
                                            preferences.currency === currency.value && styles.currencyLabelActive,
                                        ]}
                                    >
                                        {currency.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Behavior Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Behavior</Text>

                    <View style={styles.toggleItem}>
                        <View style={styles.toggleContent}>
                            <Text style={styles.toggleLabel}>Auto-calculate Next Due</Text>
                            <Text style={styles.toggleDescription}>
                                Automatically set next due date based on maintenance interval
                            </Text>
                        </View>
                        <Switch
                            value={preferences.autoCalculateNextDue}
                            onValueChange={(v) => updatePreference('autoCalculateNextDue', v)}
                            trackColor={{ false: theme.border, true: theme.primary + '80' }}
                            thumbColor={preferences.autoCalculateNextDue ? theme.primary : theme.textMuted}
                        />
                    </View>

                    <View style={styles.toggleItem}>
                        <View style={styles.toggleContent}>
                            <Text style={styles.toggleLabel}>Show Cost in History</Text>
                            <Text style={styles.toggleDescription}>
                                Display cost amounts in maintenance history list
                            </Text>
                        </View>
                        <Switch
                            value={preferences.showCostInHistory}
                            onValueChange={(v) => updatePreference('showCostInHistory', v)}
                            trackColor={{ false: theme.border, true: theme.primary + '80' }}
                            thumbColor={preferences.showCostInHistory ? theme.primary : theme.textMuted}
                        />
                    </View>
                </View>

                {/* Default Maintenance Mode */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Default Maintenance Mode</Text>
                    <Text style={styles.sectionDescription}>
                        Default mode for new cars
                    </Text>
                    <View style={styles.modeContainer}>
                        <TouchableOpacity
                            style={[
                                styles.modeOption,
                                preferences.defaultMaintenanceMode === 'time' && styles.modeOptionActive,
                            ]}
                            onPress={() => updatePreference('defaultMaintenanceMode', 'time')}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={24}
                                color={preferences.defaultMaintenanceMode === 'time' ? theme.primary : theme.textMuted}
                            />
                            <Text
                                style={[
                                    styles.modeText,
                                    preferences.defaultMaintenanceMode === 'time' && styles.modeTextActive,
                                ]}
                            >
                                {t('cars.timeBased')}
                            </Text>
                            <Text style={styles.modeDescription}>
                                Track by calendar dates
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.modeOption,
                                preferences.defaultMaintenanceMode === 'mileage' && styles.modeOptionActive,
                            ]}
                            onPress={() => updatePreference('defaultMaintenanceMode', 'mileage')}
                        >
                            <Ionicons
                                name="speedometer-outline"
                                size={24}
                                color={preferences.defaultMaintenanceMode === 'mileage' ? theme.primary : theme.textMuted}
                            />
                            <Text
                                style={[
                                    styles.modeText,
                                    preferences.defaultMaintenanceMode === 'mileage' && styles.modeTextActive,
                                ]}
                            >
                                {t('cars.mileageBased')}
                            </Text>
                            <Text style={styles.modeDescription}>
                                Track by odometer reading
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        content: {
            padding: Spacing.lg,
        },
        section: {
            marginBottom: Spacing.xl,
        },
        sectionTitle: {
            fontSize: FontSizes.md,
            fontWeight: '600',
            color: theme.textPrimary,
            marginBottom: Spacing.sm,
        },
        sectionDescription: {
            fontSize: FontSizes.sm,
            color: theme.textMuted,
            marginBottom: Spacing.md,
        },
        optionGroup: {
            marginBottom: Spacing.lg,
        },
        optionLabel: {
            fontSize: FontSizes.sm,
            fontWeight: '500',
            color: theme.textSecondary,
            marginBottom: Spacing.sm,
        },
        optionRow: {
            flexDirection: 'row',
            gap: Spacing.sm,
        },
        optionButton: {
            flex: 1,
            paddingVertical: Spacing.md,
            borderRadius: BorderRadius.lg,
            borderWidth: 2,
            borderColor: theme.border,
            alignItems: 'center',
        },
        optionButtonActive: {
            borderColor: theme.primary,
            backgroundColor: theme.primary + '15',
        },
        optionButtonText: {
            fontSize: FontSizes.sm,
            fontWeight: '500',
            color: theme.textSecondary,
        },
        optionButtonTextActive: {
            color: theme.primary,
        },
        currencyGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: Spacing.sm,
        },
        currencyButton: {
            width: '31%',
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            borderWidth: 2,
            borderColor: theme.border,
            alignItems: 'center',
        },
        currencyButtonActive: {
            borderColor: theme.primary,
            backgroundColor: theme.primary + '15',
        },
        currencySymbol: {
            fontSize: FontSizes.xl,
            fontWeight: '700',
            color: theme.textPrimary,
            marginBottom: Spacing.xs,
        },
        currencyLabel: {
            fontSize: FontSizes.xs,
            color: theme.textMuted,
            textAlign: 'center',
        },
        currencyLabelActive: {
            color: theme.primary,
        },
        toggleItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surface,
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            marginBottom: Spacing.sm,
            gap: Spacing.md,
        },
        toggleContent: {
            flex: 1,
        },
        toggleLabel: {
            fontSize: FontSizes.md,
            fontWeight: '500',
            color: theme.textPrimary,
            marginBottom: 2,
        },
        toggleDescription: {
            fontSize: FontSizes.xs,
            color: theme.textMuted,
        },
        modeContainer: {
            flexDirection: 'row',
            gap: Spacing.md,
        },
        modeOption: {
            flex: 1,
            padding: Spacing.md,
            borderRadius: BorderRadius.lg,
            borderWidth: 2,
            borderColor: theme.border,
            alignItems: 'center',
            gap: Spacing.xs,
        },
        modeOptionActive: {
            borderColor: theme.primary,
            backgroundColor: theme.primary + '10',
        },
        modeText: {
            fontSize: FontSizes.sm,
            fontWeight: '600',
            color: theme.textMuted,
        },
        modeTextActive: {
            color: theme.primary,
        },
        modeDescription: {
            fontSize: FontSizes.xs,
            color: theme.textMuted,
            textAlign: 'center',
        },
    });
