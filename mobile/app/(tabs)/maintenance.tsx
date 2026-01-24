import { View, Text } from 'react-native';

export default function MaintenanceScreen() {
    return (
        <View className="flex-1 bg-background p-6 pt-12">
            <Text className="text-3xl font-bold text-primary mb-6">Maintenance</Text>

            <View className="space-y-4">
                <View className="bg-card p-4 rounded-xl border border-border flex-row justify-between items-center">
                    <View>
                        <Text className="text-foreground font-semibold">Oil Change</Text>
                        <Text className="text-muted-foreground text-sm">Due: Oct 24, 2026</Text>
                    </View>
                    <View className="bg-secondary/20 px-3 py-1 rounded-full">
                        <Text className="text-secondary text-xs font-bold">Good</Text>
                    </View>
                </View>

                <View className="bg-card p-4 rounded-xl border border-border flex-row justify-between items-center">
                    <View>
                        <Text className="text-foreground font-semibold">Tire Rotation</Text>
                        <Text className="text-muted-foreground text-sm">Due: ASAP</Text>
                    </View>
                    <View className="bg-destructive/20 px-3 py-1 rounded-full">
                        <Text className="text-destructive text-xs font-bold">Overdue</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
