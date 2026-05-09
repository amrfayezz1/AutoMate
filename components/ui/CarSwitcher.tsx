import { fetchCars, type Car } from '@/lib/services/cars';
import { useCarStore } from '@/lib/stores/carStore';
import { queryKeys } from '@/constants/queryKeys';
import { useQuery } from '@tanstack/react-query';
import { Car as CarIcon, Check, Plus } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Skeleton } from './Skeleton';

interface CarSwitcherProps {
  visible: boolean;
  onClose: () => void;
  onAddCar: () => void;
}

function CarRow({
  car,
  active,
  onPress,
}: {
  car: Car;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-4 p-4 rounded-card active:opacity-95 ${
        active ? 'bg-brand-20 border border-brand' : 'bg-surface-2'
      }`}
    >
      <View
        className={`w-11 h-11 rounded-pill items-center justify-center shrink-0 ${
          active ? 'bg-brand' : 'bg-surface-4'
        }`}
      >
        <CarIcon
          size={20}
          strokeWidth={2.25}
          color={active ? '#FFFFFF' : '#A1A7B3'}
        />
      </View>

      <View className="flex-1 gap-0.5">
        <Text className="text-base font-medium text-fg-1" numberOfLines={1}>
          {car.make} {car.model}
        </Text>
        <Text className="text-sm font-sans text-fg-2" numberOfLines={1}>
          {car.plate_number}
        </Text>
      </View>

      {active && <Check size={20} strokeWidth={2.25} color="#3A86FF" />}
    </Pressable>
  );
}

export function CarSwitcher({ visible, onClose, onAddCar }: CarSwitcherProps) {
  const { activeCarId, setActiveCarId } = useCarStore();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: queryKeys.cars.all,
    queryFn: fetchCars,
    enabled: visible,
  });

  useEffect(() => {
    if (!activeCarId && cars.length > 0) {
      setActiveCarId(cars[0].id);
    }
  }, [cars, activeCarId, setActiveCarId]);

  function handleSelect(car: Car) {
    setActiveCarId(car.id);
    onClose();
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Switch Car">
      {/* BottomSheet owns horizontal padding via px-5 on its title row;
          we only add vertical breathing room here */}
      <View className="flex-1 px-4 pt-2 pb-4 gap-3">
        {isLoading ? (
          <>
            <Skeleton height={72} />
            <Skeleton height={72} />
          </>
        ) : cars.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-sm font-sans text-fg-muted">No cars added yet.</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
            className="flex-1"
          >
            {cars.map((car) => (
              <CarRow
                key={car.id}
                car={car}
                active={car.id === activeCarId}
                onPress={() => handleSelect(car)}
              />
            ))}
          </ScrollView>
        )}

        <Pressable
          onPress={onAddCar}
          className="flex-row items-center justify-center gap-3 bg-brand rounded-card py-4 active:opacity-95"
        >
          <Plus size={20} strokeWidth={2.25} color="#FFFFFF" />
          <Text className="text-base font-medium text-fg-on-brand">
            Add New Car
          </Text>
        </Pressable>
      </View>
    </BottomSheet>
  );
}
