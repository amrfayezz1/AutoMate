import React from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

const schema = z.object({
  make: z.string().min(1, "Required"),
  model: z.string().min(1, "Required"),
  year: z
    .string()
    .regex(/^\d{4}$/, "Enter a valid year")
    .refine(
      (y) => Number(y) >= 1990 && Number(y) <= new Date().getFullYear() + 1,
      {
        message: `Year must be between 1990 and ${new Date().getFullYear() + 1}`,
      },
    ),
  plateNumber: z.string().min(1, "Required"),
  currentOdometer: z
    .string()
    .regex(/^\d+$/, "Enter a valid number")
    .refine((v) => Number(v) >= 0, { message: "Must be 0 or more" }),
});

type FormValues = z.infer<typeof schema>;

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

export default function AddCarStep1Screen() {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      make: "",
      model: "",
      year: "",
      plateNumber: "",
      currentOdometer: "",
    },
  });

  function onSubmit(values: FormValues) {
    // Pass data as params to step 2
    router.push({
      pathname: "/(onboarding)/setup/step2",
      params: {
        make: values.make,
        model: values.model,
        year: values.year,
        plateNumber: values.plateNumber,
        currentOdometer: values.currentOdometer,
      },
    });
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-950"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-4 pt-16 pb-8">
          <ProgressDots current={1} total={2} />

          <View className="mb-8">
            <Text className="mb-1 text-2xl font-bold text-slate-100">
              Car Details
            </Text>
            <Text className="text-sm text-slate-400">
              Tell us about your vehicle
            </Text>
          </View>

          <Controller
            control={control}
            name="make"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error: fieldError },
            }) => (
              <Input
                label="Make *"
                placeholder="e.g. Toyota"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldError?.message}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="model"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error: fieldError },
            }) => (
              <Input
                label="Model *"
                placeholder="e.g. Camry"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldError?.message}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="year"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error: fieldError },
            }) => (
              <Input
                label="Year *"
                placeholder="e.g. 2020"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldError?.message}
                keyboardType="number-pad"
                returnKeyType="next"
                maxLength={4}
              />
            )}
          />

          <Controller
            control={control}
            name="plateNumber"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error: fieldError },
            }) => (
              <Input
                label="Plate Number *"
                placeholder="e.g. ABC-1234"
                value={value}
                onChangeText={(t) => onChange(t.toUpperCase())}
                onBlur={onBlur}
                error={fieldError?.message}
                autoCapitalize="characters"
                returnKeyType="next"
              />
            )}
          />

          <Controller
            control={control}
            name="currentOdometer"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error: fieldError },
            }) => (
              <Input
                label="Current Odometer (km) *"
                placeholder="e.g. 45000"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldError?.message}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
            )}
          />

          <View className="flex-1" />
          <Button onPress={handleSubmit(onSubmit)}>Next</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
