import { useRouter } from 'expo-router';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/auth/AuthField';
import { BackButton } from '@/components/auth/BackButton';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim());
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setSent(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => router.back()} />

        <View
          className="items-center justify-center"
          style={{ marginTop: 32, height: 120 }}
        >
          <View
            className="bg-brand-30 items-center justify-center"
            style={{ width: 72, height: 72, borderRadius: 24 }}
          >
            <Lock size={32} color="#3A86FF" strokeWidth={1.6} />
          </View>
        </View>

        <View style={{ marginTop: 8, gap: 10 }}>
          <Text
            className="text-fg-1 font-medium text-center"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            Forgot Password?
          </Text>
          <Text className="text-base text-fg-2 font-sans text-center">
            Enter the email tied to your account and we will send a reset link.
          </Text>
        </View>

        <View style={{ marginTop: 32 }}>
          <AuthField
            label="Email"
            value={email}
            onChangeText={setEmail}
            Icon={Mail}
            placeholder="you@domain.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
          />
        </View>

        {error && (
          <Text className="text-danger text-sm font-medium" style={{ marginTop: 16 }}>
            {error}
          </Text>
        )}
        {sent && (
          <Text className="text-success text-sm font-medium" style={{ marginTop: 16 }}>
            Reset link sent. Check your inbox.
          </Text>
        )}

        <View style={{ flex: 1 }} />

        <View style={{ marginTop: 24, gap: 14 }}>
          <PrimaryAuthButton
            label="Send Reset Link"
            TrailingIcon={ArrowRight}
            onPress={handleSubmit}
            loading={loading}
            disabled={email.trim().length === 0}
          />
          <View className="flex-row justify-center" style={{ gap: 4 }}>
            <Text className="text-sm text-fg-2 font-medium">Remembered it?</Text>
            <Pressable onPress={() => router.replace('/(auth)/sign-in')} hitSlop={8}>
              <Text className="text-sm text-brand font-medium">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
