import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    return (
        <View className="flex-1 bg-background justify-center items-center">
            <ActivityIndicator size="large" color="#3B82F6" />
        </View>
    );
}
