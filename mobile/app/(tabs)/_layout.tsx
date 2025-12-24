import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/lib/ThemeProvider';
import { FontSizes } from '@/lib/theme';

export default function TabsLayout() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 80,
          paddingTop: 8,
          paddingBottom: 24,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: FontSizes.xs,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: t('maintenance.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="construct" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: t('reminders.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings.title'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
