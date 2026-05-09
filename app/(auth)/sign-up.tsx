import { useRouter } from 'expo-router';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthField } from '@/components/auth/AuthField';
import { BackButton } from '@/components/auth/BackButton';
import { Checkbox } from '@/components/auth/Checkbox';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { supabase } from '@/lib/supabase';

const STRENGTHS = [
  { label: 'Too Weak', color: '#E63946' },
  { label: 'Weak', color: '#E63946' },
  { label: 'Fair', color: '#FF9F1C' },
  { label: 'Good', color: '#2EC4B6' },
  { label: 'Strong', color: '#2EC4B6' },
];

export default function SignUpScreen() {
  const router = useRouter();
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const score = useMemo(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const strength = STRENGTHS[score];
  const canSubmit =
    agree && name.trim().length > 0 && email.trim().length > 0 && password.length >= 8;

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setPendingEmail(email.trim());
    if (data.session) {
      router.replace('/(auth)/garage-welcome');
    } else {
      router.push('/(auth)/verify-email');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between">
          <BackButton onPress={() => router.back()} />
          <Text className="text-sm font-medium text-fg-2">
            Step <Text className="text-fg-1">1</Text> / 2
          </Text>
        </View>

        <View style={{ marginTop: 24, gap: 8 }}>
          <Text
            className="text-fg-1 font-medium"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            Create Your Garage
          </Text>
          <Text className="text-base text-fg-2 font-sans">
            Add your first car right after this.
          </Text>
        </View>

        <View style={{ marginTop: 24, gap: 14 }}>
          <AuthField
            label="Full Name"
            value={name}
            onChangeText={setName}
            Icon={User}
            placeholder="Your name"
            autoCapitalize="words"
            textContentType="name"
          />
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
            placeholder="At least 8 characters"
            autoCapitalize="none"
            textContentType="newPassword"
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

          <View style={{ gap: 8 }}>
            <View className="flex-row" style={{ gap: 6 }}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 99,
                    backgroundColor: i < score ? strength.color : '#22262F',
                  }}
                />
              ))}
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs font-medium text-fg-2">Password Strength</Text>
              <Text className="text-xs font-medium" style={{ color: strength.color }}>
                {strength.label}
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row" style={{ marginTop: 18, gap: 12 }}>
          <Checkbox checked={agree} onChange={() => setAgree(!agree)} />
          <Text className="flex-1 text-sm text-fg-2 font-sans">
            I agree to the <Text className="text-fg-1 font-medium">Terms</Text> and acknowledge
            the <Text className="text-fg-1 font-medium">Privacy Policy</Text>.
          </Text>
        </View>

        {error && (
          <Text className="text-danger text-sm font-medium" style={{ marginTop: 12 }}>
            {error}
          </Text>
        )}

        <View style={{ flex: 1 }} />

        <View style={{ marginTop: 24, gap: 14 }}>
          <PrimaryAuthButton
            label="Continue"
            TrailingIcon={ArrowRight}
            onPress={handleSubmit}
            disabled={!canSubmit}
            loading={loading}
          />
          <View className="flex-row justify-center" style={{ gap: 4 }}>
            <Text className="text-sm text-fg-2 font-medium">Already have an account?</Text>
            <Pressable onPress={() => router.push('/(auth)/sign-in')} hitSlop={8}>
              <Text className="text-sm text-brand font-medium">Sign In</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
