import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toast } from '@/components/ui/Toast';
import { queryKeys } from '@/constants/queryKeys';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UpdateMileageSheetProps {
  visible: boolean;
  carId: string | null;
  currentOdometer: number | null;
  onClose: () => void;
}

export function UpdateMileageSheet({
  visible,
  carId,
  currentOdometer,
  onClose,
}: UpdateMileageSheetProps) {
  const insets = useSafeAreaInsets();
  const qc = useQueryClient();
  const snapHeight = SCREEN_HEIGHT * 0.5;
  const translateY = useRef(new Animated.Value(snapHeight)).current;

  const [reading, setReading] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (visible) {
      setReading('');
      setError(null);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: snapHeight,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, snapHeight, translateY]);

  async function handleSubmit() {
    if (!carId) return;

    const value = Number(reading.replace(/,/g, '').trim());
    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter a valid mileage');
      return;
    }
    if (currentOdometer != null && value < currentOdometer) {
      setError(`Must be at least ${currentOdometer.toLocaleString('en-US')} km`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error: logError } = await supabase.from('odometer_logs').insert({
        car_id: carId,
        user_id: session.user.id,
        reading: value,
      });
      if (logError) throw logError;

      const { error: carError } = await supabase
        .from('cars')
        .update({ current_odometer: value })
        .eq('id', carId);
      if (carError) throw carError;

      qc.invalidateQueries({ queryKey: queryKeys.cars.all });
      qc.invalidateQueries({ queryKey: queryKeys.cars.byId(carId) });
      qc.invalidateQueries({ queryKey: queryKeys.odometer.all(carId) });

      setToast({ message: 'Mileage updated', type: 'success' });
      setTimeout(onClose, 400);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to update mileage';
      setError(message);
      setToast({ message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <Pressable className="flex-1 bg-black/50" onPress={onClose} />
        <Animated.View
          style={[{ transform: [{ translateY }], height: snapHeight }]}
          className="absolute bottom-0 left-0 right-0 bg-surface-3 rounded-t-sheet"
        >
          <View className="items-center pt-3 pb-1">
            <View className="w-10 h-1 rounded-pill bg-surface-4" />
          </View>

          <View className="flex-row items-center justify-between px-5 py-3 border-b border-surface-4">
            <Text className="text-fg-1 text-lg font-medium font-sans">Update Mileage</Text>
            <Pressable onPress={onClose} className="p-1 active:opacity-95">
              <Text className="text-fg-2 text-base">✕</Text>
            </Pressable>
          </View>

          <View
            style={{ paddingBottom: insets.bottom + 16 }}
            className="flex-1 px-5 pt-4 gap-4"
          >
            {currentOdometer != null && (
              <Text className="text-sm font-sans text-fg-2">
                Current reading: {currentOdometer.toLocaleString('en-US')} km
              </Text>
            )}

            <Input
              label="New Mileage *"
              placeholder="45230"
              keyboardType="number-pad"
              value={reading}
              onChangeText={(t) => {
                setReading(t);
                if (error) setError(null);
              }}
              error={error ?? undefined}
              hint="Enter the latest odometer reading in kilometers."
            />

            <View className="mt-auto gap-2">
              <Button
                label="Save"
                onPress={handleSubmit}
                loading={submitting}
                disabled={!reading.trim() || !carId}
                fullWidth
              />
              <Button label="Cancel" variant="ghost" onPress={onClose} fullWidth />
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          visible={!!toast}
          onHide={() => setToast(null)}
        />
      )}
    </Modal>
  );
}
