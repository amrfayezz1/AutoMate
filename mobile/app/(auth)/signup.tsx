import { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { supabase } from '../../src/lib/supabase';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            Alert.alert(error.message);
        } else {
            Alert.alert('check your inbox for email verification!');
        }
        setLoading(false);
    }

    return (
        <View className="flex-1 bg-background justify-center px-6">
            <View className="mb-10">
                <Text className="text-4xl font-bold text-primary mb-2">Create Account</Text>
                <Text className="text-muted-foreground text-lg">Start tracking your maintenance</Text>
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-muted-foreground mb-2">Email</Text>
                    <TextInput
                        className="bg-input text-foreground p-4 rounded-lg"
                        placeholder="email@address.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                    />
                </View>

                <View>
                    <Text className="text-muted-foreground mb-2">Password</Text>
                    <TextInput
                        className="bg-input text-foreground p-4 rounded-lg"
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    className="bg-primary p-4 rounded-lg items-center mt-4"
                    onPress={signUpWithEmail}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-primary-foreground font-bold text-lg">Sign Up</Text>
                    )}
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                    <Text className="text-muted-foreground">Already have an account? </Text>
                    <Link href="/(auth)/login" asChild>
                        <TouchableOpacity>
                            <Text className="text-primary font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </View>
    );
}
