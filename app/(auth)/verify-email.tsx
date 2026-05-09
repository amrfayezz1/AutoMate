import { useRouter } from 'expo-router';
import { ArrowRight, Mail } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '@/components/auth/BackButton';
import { PrimaryAuthButton } from '@/components/auth/PrimaryAuthButton';
import { useAuthStore } from '@/lib/stores/authStore';
import { supabase } from '@/lib/supabase';

const LENGTH = 6;
const RESEND_SECONDS = 42;

export default function VerifyEmailScreen() {
  const router = useRouter();
  const email = useAuthStore((s) => s.pendingEmail) ?? '';

  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''));
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const code = digits.join('');
  const complete = code.length === LENGTH;

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, LENGTH);
    const next = Array(LENGTH).fill('');
    for (let i = 0; i < cleaned.length; i++) next[i] = cleaned[i];
    setDigits(next);
    setActiveIdx(Math.min(cleaned.length, LENGTH - 1));
  };

  const handleVerify = async () => {
    if (!complete || !email) return;
    setError(null);
    setLoading(true);
    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace('/(auth)/garage-welcome');
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || !email) return;
    setError(null);
    const { error: err } = await supabase.auth.resend({ email, type: 'signup' });
    if (err) {
      setError(err.message);
      return;
    }
    setSecondsLeft(RESEND_SECONDS);
  };

  const formatTimer = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = (secondsLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 }}
      >
        <BackButton onPress={() => router.back()} />

        <View
          className="items-center justify-center"
          style={{ marginTop: 24, height: 140 }}
        >
          <View
            className="bg-surface-2 border border-surface-3 items-center justify-center"
            style={{ width: 96, height: 72, borderRadius: 14 }}
          >
            <Mail size={36} color="#A1A7B3" strokeWidth={1.5} />
            <View
              className="bg-brand absolute"
              style={{
                top: -10,
                right: -12,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <Text
                className="text-fg-on-brand font-medium"
                style={{ fontSize: 11, letterSpacing: 1.5 }}
              >
                OTP
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 8, gap: 10 }}>
          <Text
            className="text-fg-1 font-medium text-center"
            style={{ fontSize: 24, lineHeight: 32, letterSpacing: -0.4 }}
          >
            Check Your Inbox
          </Text>
          <Text className="text-base text-fg-2 font-sans text-center">
            We sent a 6-digit code to{' '}
            <Text className="text-fg-1 font-medium">{email || 'your email'}</Text>.
          </Text>
        </View>

        <Pressable
          onPress={() => inputRef.current?.focus()}
          className="flex-row justify-between"
          style={{ marginTop: 28, gap: 8 }}
        >
          {digits.map((d, i) => (
            <View
              key={i}
              className={`bg-surface-1 items-center justify-center ${
                i === activeIdx ? 'border-brand' : 'border-surface-3'
              }`}
              style={{
                flex: 1,
                height: 60,
                borderRadius: 14,
                borderWidth: 1,
              }}
            >
              <Text
                className="text-fg-1 font-medium"
                style={{ fontSize: 24, letterSpacing: -0.5 }}
              >
                {d}
              </Text>
            </View>
          ))}
        </Pressable>

        <TextInput
          ref={inputRef}
          autoFocus
          value={code}
          onChangeText={handleChange}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          maxLength={LENGTH}
          className="font-sans"
          style={{
            position: 'absolute',
            opacity: 0,
            height: 1,
            width: 1,
          }}
        />

        <View style={{ marginTop: 18 }} className="items-center">
          <Text className="text-sm text-fg-2 font-medium">
            Didn't get it?{' '}
            <Pressable onPress={handleResend} disabled={secondsLeft > 0} hitSlop={8}>
              <Text
                className={`text-sm font-medium ${secondsLeft > 0 ? 'text-fg-muted' : 'text-brand'}`}
              >
                {secondsLeft > 0 ? `Resend in ${formatTimer()}` : 'Resend'}
              </Text>
            </Pressable>
          </Text>
        </View>

        {error && (
          <Text className="text-danger text-sm font-medium text-center" style={{ marginTop: 16 }}>
            {error}
          </Text>
        )}

        <View style={{ flex: 1 }} />

        <PrimaryAuthButton
          label="Verify"
          TrailingIcon={ArrowRight}
          onPress={handleVerify}
          loading={loading}
          disabled={!complete}
        />
      </View>
    </SafeAreaView>
  );
}
