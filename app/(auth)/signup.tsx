import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Link, router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../lib/supabase";

const schema = z
  .object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

function getPasswordStrength(password: string): {
  label: string;
  color: string;
  width: string;
} {
  if (password.length === 0)
    return { label: "", color: "bg-slate-700", width: "w-0" };
  if (password.length < 6)
    return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (password.length < 8)
    return { label: "Fair", color: "bg-amber-500", width: "w-2/4" };
  if (/[A-Z]/.test(password) && /[0-9]/.test(password))
    return { label: "Strong", color: "bg-emerald-500", width: "w-full" };
  return { label: "Good", color: "bg-blue-500", width: "w-3/4" };
}

export default function SignUpScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");
  const strength = getPasswordStrength(passwordValue);

  async function onSubmit(values: FormValues) {
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName },
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    }
    // On success: auth state change triggers root layout redirect
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-4 py-12">
            {/* Header */}
            <View className="mb-10">
              <Text className="mb-2 text-3xl font-bold text-slate-100">
                Create account
              </Text>
              <Text className="text-base text-slate-400">
                Join AutoMate and track your car's health
              </Text>
            </View>

            {/* Form */}
            <Controller
              control={control}
              name="fullName"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error: fieldError },
              }) => (
                <Input
                  label="Full Name *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error: fieldError },
              }) => (
                <Input
                  label="Email *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  returnKeyType="next"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error: fieldError },
              }) => (
                <View>
                  <Input
                    label="Password *"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
                    returnKeyType="next"
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-8 h-12 justify-center"
                  >
                    <Text className="text-sm text-slate-400">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                  {/* Password strength bar */}
                  {passwordValue.length > 0 ? (
                    <View className="mb-2 -mt-4">
                      <View className="h-1 w-full overflow-hidden rounded-full bg-slate-700">
                        <View
                          className={`h-full ${strength.width} ${strength.color} rounded-full`}
                        />
                      </View>
                      {strength.label ? (
                        <Text className="mt-1 text-xs text-slate-400">
                          {strength.label}
                        </Text>
                      ) : null}
                    </View>
                  ) : null}
                </View>
              )}
            />

            <Controller
              control={control}
              name="confirmPassword"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error: fieldError },
              }) => (
                <Input
                  label="Confirm Password *"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={fieldError?.message}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
              )}
            />

            {error ? (
              <Text className="mb-4 text-sm text-red-500">{error}</Text>
            ) : null}

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              className="mb-6"
            >
              Create Account
            </Button>

            {/* Sign in link */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-slate-400">
                Already have an account?
              </Text>
              <Link href="/(auth)/login">
                <Text className="text-sm font-medium text-amber-400">
                  Log in
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
