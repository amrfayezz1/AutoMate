import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { supabase } from "../../../lib/supabase";
import { useAuthStore } from "../../../stores/authStore";
import { useCarStore } from "../../../stores/carStore";
import type { TrackingMode } from "../../../types/app.types";

interface BaselineItem {
  id: string;
  name: string;
  color: string;
  lastDate: string;
  lastKm: string;
}

const BASELINE_TYPES: Array<{ id: string; name: string; color: string }> = [
  { id: "oil-change", name: "Oil Change", color: "#F59E0B" },
  { id: "tires", name: "Tires", color: "#6B7280" },
  { id: "battery", name: "Battery", color: "#3B82F6" },
  { id: "brakes", name: "Brakes", color: "#EF4444" },
  { id: "air-filter", name: "Air Filter", color: "#10B981" },
];

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View className="flex-row items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${i < current ? "w-6 bg-amber-400" : "w-2 bg-slate-600"}`}
        />
      ))}
    </View>
  );
}

export default function AddCarStep2Screen() {
  const params = useLocalSearchParams<{
    make: string;
    model: string;
    year: string;
    plateNumber: string;
    currentOdometer: string;
  }>();

  const { user } = useAuthStore();
  const { setActiveCarId } = useCarStore();

  const [trackingMode, setTrackingMode] = useState<TrackingMode>("both");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<BaselineItem[]>(
    BASELINE_TYPES.map((t) => ({ ...t, lastDate: "", lastKm: "" })),
  );

  function updateItem(id: string, field: "lastDate" | "lastKm", value: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  async function finish() {
    if (!user) return;
    setError(null);
    setLoading(true);

    // Insert car
    const { data: car, error: carError } = await supabase
      .from("cars")
      .insert({
        user_id: user.id,
        make: params.make,
        model: params.model,
        year: Number(params.year),
        plate_number: params.plateNumber,
        current_odometer: Number(params.currentOdometer),
        tracking_mode: trackingMode,
      })
      .select()
      .single();

    if (carError || !car) {
      setError(carError?.message ?? "Failed to create car");
      setLoading(false);
      return;
    }

    // Insert baseline maintenance records for filled items
    const baselineRecords = items
      .filter((item) => item.lastDate || item.lastKm)
      .map((item) => ({
        car_id: car.id,
        user_id: user.id,
        type_id: item.id,
        serviced_at: item.lastDate || new Date().toISOString().split("T")[0],
        mileage_at_service: item.lastKm
          ? Number(item.lastKm)
          : Number(params.currentOdometer),
      }));

    if (baselineRecords.length > 0) {
      await supabase.from("maintenance_records").insert(baselineRecords);
    }

    setActiveCarId(car.id);
    setLoading(false);
    router.replace("/(tabs)");
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-4 pt-16">
          <ProgressDots current={2} total={2} />

          <View className="mb-8">
            <Text className="mb-1 text-2xl font-bold text-slate-100">
              Tracking Preferences
            </Text>
            <Text className="text-sm text-slate-400">
              Choose how you want to track maintenance
            </Text>
          </View>

          {/* Tracking mode toggle */}
          <View className="mb-8 rounded-xl border border-slate-600 bg-slate-800 p-4">
            {(["time", "mileage", "both"] as TrackingMode[]).map((mode) => (
              <Pressable
                key={mode}
                onPress={() => setTrackingMode(mode)}
                className={`mb-2 flex-row items-center justify-between rounded-lg p-3 ${
                  trackingMode === mode ? "bg-amber-400/10" : ""
                }`}
              >
                <View>
                  <Text className="text-sm font-medium text-slate-100 capitalize">
                    {mode}
                  </Text>
                  <Text className="text-xs text-slate-400">
                    {mode === "time" && "Remind by calendar dates"}
                    {mode === "mileage" && "Remind by km driven"}
                    {mode === "both" && "Whichever comes first"}
                  </Text>
                </View>
                <View
                  className={`h-5 w-5 rounded-full border-2 items-center justify-center ${
                    trackingMode === mode
                      ? "border-amber-400"
                      : "border-slate-600"
                  }`}
                >
                  {trackingMode === mode ? (
                    <View className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  ) : null}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Baseline data */}
          <Text className="mb-2 text-base font-semibold text-slate-100">
            Last Service Dates{" "}
            <Text className="font-normal text-slate-400">(optional)</Text>
          </Text>
          <Text className="mb-4 text-xs text-slate-400">
            This helps us calculate when you're next due. Skip if unsure.
          </Text>

          {items.map((item) => (
            <View
              key={item.id}
              className="mb-4 rounded-xl border border-slate-600 bg-slate-800 p-4"
            >
              <View className="mb-3 flex-row items-center gap-3">
                <View
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Text className="text-sm font-medium text-slate-100">
                  {item.name}
                </Text>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label="Last done date"
                    placeholder="YYYY-MM-DD"
                    value={item.lastDate}
                    onChangeText={(v) => updateItem(item.id, "lastDate", v)}
                    keyboardType="numbers-and-punctuation"
                    className="mb-0"
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label="At mileage (km)"
                    placeholder="e.g. 40000"
                    value={item.lastKm}
                    onChangeText={(v) => updateItem(item.id, "lastKm", v)}
                    keyboardType="number-pad"
                    className="mb-0"
                  />
                </View>
              </View>
            </View>
          ))}

          {error ? (
            <Text className="mb-4 text-sm text-red-500">{error}</Text>
          ) : null}

          <Button onPress={finish} loading={loading} className="mb-3">
            Finish Setup
          </Button>
          <Button variant="ghost" onPress={finish} disabled={loading}>
            All done, skip rest
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
