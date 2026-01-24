import { View, Text } from 'react-native';

export default function GarageScreen() {
    return (
        <View className="flex-1 bg-background p-6 pt-12">
            <Text className="text-3xl font-bold text-primary mb-6">My Garage</Text>

            <View className="bg-card p-6 rounded-xl border border-border items-center justify-center h-48">
                <Text className="text-muted-foreground">No cars added yet.</Text>
                {/* TODO: Add Car Button */}
            </View>
        </View>
    );
}
