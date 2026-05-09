import { useRouter } from 'expo-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/auth/AuthField';
import { BackButton } from '@/components/auth/BackButton';
import { Checkbox } from '@/components/auth/Checkbox';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={() => router.back()} />

        <View style={{ marginTop: 32, gap: 8 }}>
          <Text
            className="text-fg-1 font-medium"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            Welcome Back
          </Text>
          <Text className="text-base text-fg-2 font-sans">
            Sign in to keep your garage in sync.
          </Text>
        </View>

        <View style={{ marginTop: 32, gap: 18 }}>
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
          <AuthField
            label="Password"
            value={password}
            onChangeText={setPassword}
            Icon={Lock}
            secureTextEntry={!showPw}
            placeholder="••••••••"
            autoCapitalize="none"
            textContentType="password"
            trailing={
              <Pressable onPress={() => setShowPw(!showPw)} hitSlop={8}>
                {showPw ? (
                  <EyeOff size={18} color="#A1A7B3" strokeWidth={1.6} />
                ) : (
                  <Eye size={18} color="#A1A7B3" strokeWidth={1.6} />
                )}
              </Pressable>
            }
          />

          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => setRemember(!remember)}
              className="flex-row items-center"
              style={{ gap: 10 }}
              hitSlop={8}
            >
              <Checkbox checked={remember} onChange={() => setRemember(!remember)} />
              <Text className="text-sm font-medium text-fg-2">Remember Me</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/(auth)/forgot-password')} hitSlop={8}>
              <Text className="text-sm text-brand font-medium">Forgot?</Text>
            </Pressable>
          </View>
        </View>

        {error && (
          <Text className="text-danger text-sm font-medium" style={{ marginTop: 16 }}>
            {error}
          </Text>
        )}

        <View style={{ flex: 1 }} />

        <View style={{ marginTop: 24, gap: 18 }}>
          <PrimaryAuthButton
            label="Sign In"
            TrailingIcon={ArrowRight}
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={loading}
          />
          <View className="flex-row justify-center" style={{ gap: 4 }}>
            <Text className="text-sm text-fg-2 font-medium">New to AutoMate?</Text>
            <Pressable onPress={() => router.push('/(auth)/sign-up')} hitSlop={8}>
              <Text className="text-sm text-brand font-medium">Create Account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
