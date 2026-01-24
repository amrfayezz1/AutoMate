import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function SettingsScreen() {
    const signOut = useAuthStore((state) => state.signOut);

    return (
        <View className="flex-1 bg-background p-6 pt-12">
            <Text className="text-3xl font-bold text-primary mb-6">Settings</Text>

            <TouchableOpacity
                className="bg-destructive p-4 rounded-lg items-center"
                onPress={signOut}
            >
                <Text className="text-destructive-foreground font-bold">Sign Out</Text>
            </TouchableOpacity>
        </View>
    );
}
