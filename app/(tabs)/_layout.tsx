import { TabBar } from '@/components/ui/TabBar';
import { Toast } from '@/components/ui/Toast';
import { Tabs, useRouter } from 'expo-router';
import { useState } from 'react';

export default function TabsLayout() {
  const router = useRouter();
  const [comingSoonVisible, setComingSoonVisible] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false }}
        tabBar={(props) => {
          const routeToTab: Record<string, 'Home' | 'Maintenance' | 'Settings'> = {
            index: 'Home',
            maintenance: 'Maintenance',
            settings: 'Settings',
          };
          const activeRoute = props.state.routes[props.state.index].name;
          const activeTab = routeToTab[activeRoute] ?? 'Home';

          return (
            <TabBar
              activeTab={activeTab}
              onTabPress={(tab) => {
                const tabToRoute: Record<string, string> = {
                  Home: '/(tabs)/',
                  Maintenance: '/(tabs)/maintenance',
                  Settings: '/(tabs)/settings',
                };
                router.navigate(tabToRoute[tab] as any);
              }}
              onDisabledTabPress={() => setComingSoonVisible(true)}
            />
          );
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="maintenance" />
        <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>

      <Toast
        message="Coming soon"
        type="info"
        visible={comingSoonVisible}
        onHide={() => setComingSoonVisible(false)}
        duration={1800}
      />
    </>
  );
}
