import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
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
});

type FormValues = z.infer<typeof schema>;

export default function ForgotPasswordScreen() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    setLoading(true);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: "automate://reset-password",
      },
    );
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
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
            {sent ? (
              // Success state
              <View className="items-center">
                <View className="mb-6 h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
                  <Text className="text-3xl">✉️</Text>
                </View>
                <Text className="mb-3 text-center text-2xl font-bold text-slate-100">
                  Check your inbox
                </Text>
                <Text className="mb-8 text-center text-base text-slate-400">
                  We've sent a password reset link to your email. It may take a
                  minute to arrive.
                </Text>
                <Button
                  variant="secondary"
                  onPress={() => router.replace("/(auth)/login")}
                  className="w-full"
                >
                  Back to Log In
                </Button>
              </View>
            ) : (
              <>
                {/* Header */}
                <View className="mb-10">
                  <Text className="mb-2 text-3xl font-bold text-slate-100">
                    Forgot password?
                  </Text>
                  <Text className="text-base text-slate-400">
                    Enter your email and we'll send you a reset link.
                  </Text>
                </View>

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
                  className="mb-4"
                >
                  Send Reset Link
                </Button>

                <Link href="/(auth)/login" className="self-center">
                  <Text className="text-sm text-slate-400">
                    Back to <Text className="text-amber-400">Log In</Text>
                  </Text>
                </Link>
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
