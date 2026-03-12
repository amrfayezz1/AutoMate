import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../../stores/authStore";
import { Modal } from "../../../components/ui/Modal";

interface SettingsRowProps {
  label: string;
  onPress: () => void;
  destructive?: boolean;
  value?: string;
}

function SettingsRow({
  label,
  onPress,
  destructive = false,
  value,
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-4 active:bg-slate-700/50"
    >
      <Text
        className={`text-base ${destructive ? "text-red-500" : "text-slate-100"}`}
      >
        {label}
      </Text>
      <View className="flex-row items-center gap-2">
        {value ? <Text className="text-sm text-slate-400">{value}</Text> : null}
        {!destructive ? <Text className="text-slate-500">›</Text> : null}
      </View>
    </Pressable>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text className="px-4 pt-6 pb-2 text-xs font-medium uppercase tracking-widest text-slate-500">
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const { user } = useAuthStore();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
    setShowSignOutModal(false);
    // Auth state change will redirect to login
  }

  return (
    <View className="flex-1 bg-slate-950">
      <View className="px-4 pt-14 pb-4">
        <Text className="text-2xl font-bold text-slate-100">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Account */}
        <SectionHeader title="Account" />
        <View className="mx-4 rounded-xl border border-slate-600 bg-slate-800 overflow-hidden">
          <SettingsRow
            label="Profile"
            onPress={() => router.push("/(tabs)/settings/profile")}
            value={user?.email ?? ""}
          />
          <View className="h-px bg-slate-600 mx-4" />
          <SettingsRow
            label="My Cars"
            onPress={() => router.push("/(tabs)/settings/cars/index")}
          />
        </View>

        {/* Preferences */}
        <SectionHeader title="Preferences" />
        <View className="mx-4 rounded-xl border border-slate-600 bg-slate-800 overflow-hidden">
          <SettingsRow
            label="Notifications"
            onPress={() => router.push("/(tabs)/settings/notifications")}
          />
          <View className="h-px bg-slate-600 mx-4" />
          <SettingsRow
            label="Language & Theme"
            onPress={() => router.push("/(tabs)/settings/language")}
          />
        </View>

        {/* Danger zone */}
        <SectionHeader title="Account Actions" />
        <View className="mx-4 rounded-xl border border-slate-600 bg-slate-800 overflow-hidden mb-8">
          <SettingsRow
            label="Sign Out"
            onPress={() => setShowSignOutModal(true)}
            destructive
          />
        </View>
      </ScrollView>

      <Modal
        visible={showSignOutModal}
        title="Sign Out"
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleSignOut}
        confirmLabel="Sign Out"
        confirmLoading={signingOut}
        destructive
      >
        <Text className="text-base text-slate-400">
          Are you sure you want to sign out of AutoMate?
        </Text>
      </Modal>
    </View>
  );
}
