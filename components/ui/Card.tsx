import { Pressable, PressableProps, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

interface PressableCardProps extends PressableProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated = false, className = '', ...props }: CardProps) {
  return (
    <View
      className={`rounded-2xl p-4 ${elevated ? 'bg-surface-elevated' : 'bg-surface'} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({ children, elevated = false, className = '', ...props }: PressableCardProps) {
  return (
    <Pressable
      className={`rounded-2xl p-4 active:opacity-80 ${elevated ? 'bg-surface-elevated' : 'bg-surface'} ${className}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}
