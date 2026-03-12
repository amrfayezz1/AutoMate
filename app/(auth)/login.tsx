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

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    }
    // Auth state change handled in root layout — no manual redirect needed
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
                Welcome back
              </Text>
              <Text className="text-base text-slate-400">
                Sign in to your AutoMate account
              </Text>
            </View>

            {/* Form */}
            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error: fieldError },
              }) => (
                <Input
                  label="Email"
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
                    label="Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={fieldError?.message}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                  <Pressable
                    onPress={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-8 h-12 justify-center"
                  >
                    <Text className="text-sm text-slate-400">
                      {showPassword ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
              )}
            />

            <Link href="/(auth)/forgot-password" className="mb-6 self-end">
              <Text className="text-sm text-amber-400">Forgot password?</Text>
            </Link>

            {error ? (
              <Text className="mb-4 text-sm text-red-500">{error}</Text>
            ) : null}

            <Button
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              className="mb-4"
            >
              Log In
            </Button>

            {/* OAuth */}
            <Button variant="secondary" className="mb-3" onPress={() => {}}>
              Continue with Google
            </Button>
            {Platform.OS === "ios" ? (
              <Button variant="secondary" className="mb-6" onPress={() => {}}>
                Continue with Apple
              </Button>
            ) : null}

            {/* Sign up link */}
            <View className="flex-row justify-center gap-1">
              <Text className="text-sm text-slate-400">
                Don't have an account?
              </Text>
              <Link href="/(auth)/signup">
                <Text className="text-sm font-medium text-amber-400">
                  Sign up
                </Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
