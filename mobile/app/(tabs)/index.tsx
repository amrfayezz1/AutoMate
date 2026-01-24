import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../src/store/authStore';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <View className="flex-1 bg-background p-6 pt-12">
      <Text className="text-3xl font-bold text-primary mb-6">Dashboard</Text>

      <View className="bg-card p-6 rounded-xl border border-border mb-6">
        <Text className="text-muted-foreground mb-2">Welcome back,</Text>
        <Text className="text-xl text-foreground font-semibold">{user?.email}</Text>
      </View>

      <View className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 mb-4">
        <Text className="text-destructive font-bold mb-1">Action Required</Text>
        <Text className="text-destructive-foreground">Oil Change Due in 50km</Text>
      </View>
    </View>
  );
}
