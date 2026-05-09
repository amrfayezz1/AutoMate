import { View } from 'react-native';

interface StepperProps {
  step: number;
  total: number;
}

export function Stepper({ step, total }: StepperProps) {
  return (
    <View className="flex-row items-center" style={{ gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={i <= step ? 'bg-brand' : 'bg-surface-3'}
          style={{
            height: 4,
            borderRadius: 99,
            width: i === step ? 28 : 18,
          }}
        />
      ))}
    </View>
  );
}
