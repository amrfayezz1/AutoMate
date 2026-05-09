import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import { Alert, Image, Pressable, Text, View } from 'react-native';

interface PhotoFieldProps {
  /** Local file URI (from picker) OR remote URL (resolved signed URL). null = empty. */
  value: string | null;
  onChange: (localUri: string | null) => void;
}

export function PhotoField({ value, onChange }: PhotoFieldProps) {
  async function handlePick() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        'Permission needed',
        'Allow photo library access to attach an image.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onChange(result.assets[0].uri);
    }
  }

  if (value) {
    return (
      <View className="relative">
        <Image
          source={{ uri: value }}
          className="w-full h-48 rounded-card bg-surface-1"
          resizeMode="cover"
        />
        <Pressable
          onPress={() => onChange(null)}
          hitSlop={8}
          className="absolute top-2 right-2 bg-black/60 rounded-pill w-8 h-8 items-center justify-center active:opacity-95"
          accessibilityLabel="Remove photo"
        >
          <X size={18} strokeWidth={2.25} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePick}
      className="bg-surface-1 border-[1.6px] border-dashed border-surface-4 rounded-card py-8 flex-row items-center justify-center gap-3 active:opacity-95"
    >
      <Camera size={20} strokeWidth={2.25} color="#A1A7B3" />
      <Text className="text-base font-medium text-fg-2">Add Photo</Text>
    </Pressable>
  );
}
