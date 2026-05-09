import { House, Route, Settings } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Tab = 'Home' | 'Maintenance' | 'Settings';

type TabBarProps = {
  activeTab: Tab;
  onTabPress: (tab: Tab) => void;
  onDisabledTabPress?: (tab: Tab) => void;
};

type TabItem = {
  key: Tab;
  label: string;
  Icon: typeof House;
  disabled?: boolean;
};

const TABS: TabItem[] = [
  { key: 'Home', label: 'Home', Icon: House },
  { key: 'Maintenance', label: 'Maintenance', Icon: Route },
  { key: 'Settings', label: 'Settings', Icon: Settings, disabled: true },
];

export function TabBar({ activeTab, onTabPress, onDisabledTabPress }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ bottom: Math.max(insets.bottom, 32) }}
      className="absolute left-4 right-4 items-center"
      pointerEvents="box-none"
    >
      <View className="flex-row items-center justify-between bg-surface-3/90 rounded-pill px-6 py-3 w-full">
        {TABS.map(({ key, label, Icon, disabled }) => {
          const active = activeTab === key;
          return (
            <Pressable
              key={key}
              onPress={() => {
                if (disabled) {
                  onDisabledTabPress?.(key);
                  return;
                }
                onTabPress(key);
              }}
              className="items-center gap-1 w-[50px] active:opacity-95"
              style={disabled ? { opacity: 0.5 } : undefined}
              accessibilityRole="tab"
              accessibilityState={{ selected: active, disabled }}
            >
              <Icon
                size={24}
                strokeWidth={2.25}
                color={active ? '#3A86FF' : '#A1A7B3'}
                fill={active ? '#3A86FF' : 'transparent'}
              />
              <Text
                className="text-xs font-medium text-center"
                style={active ? { color: '#3A86FF' } : { color: '#A1A7B3' }}
                numberOfLines={1}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
