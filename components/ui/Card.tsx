import { Pressable, PressableProps, View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  /** surface-2 (default) → surface-3 (elevated) */
  elevated?: boolean;
}

interface PressableCardProps extends PressableProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export function Card({ children, elevated = false, className = '', ...props }: CardProps) {
  return (
    <View
      className={`rounded-card p-4 ${elevated ? 'bg-surface-3' : 'bg-surface-2'} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}

export function PressableCard({ children, elevated = false, className = '', ...props }: PressableCardProps) {
  return (
    <Pressable
      className={`rounded-card p-4 active:opacity-95 ${elevated ? 'bg-surface-3' : 'bg-surface-2'} ${className}`}
      {...props}
    >
      {children}
    </Pressable>
  );
}
