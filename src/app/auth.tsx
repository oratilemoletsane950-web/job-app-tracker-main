import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/services/auth-context";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export interface AuthScreenProps {
    mode: 'signIn' | 'signUp';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ mode }) => {
    const router = useRouter();
    const { signin, signup } = useAuth();
    const isSignUp = mode === "signUp";
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentError, setCurrentError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setCurrentError(null);
        setIsSubmitting(true);

        try {
            if (isSignUp) {
                await signup(email.trim(), password);
            } else {
                await signin(email.trim(), password);
            }
            router.replace("/dashboard");
        } catch (error) {
            setCurrentError(error instanceof Error ? error.message : "Unable to authenticate. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
    >
        <ScrollView
            contentContainerClassName="flex-grow justify-center p-4"
            keyboardShouldPersistTaps="handled"
        >
            <Card>
                <CardHeader>
                    <CardTitle>
                        {isSignUp ? "Create an Account" : "Sign In"}
                    </CardTitle>
                    <CardDescription>
                        {isSignUp ? "Start tracking your job applications." : "Welcome back! Please sign in to continue."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <View>
                        <Text>Email Address</Text>
                        <Input
                            placeholder="example@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                        <Text>Password</Text>
                        <Input
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete={isSignUp ? "new-password" : "current-password"}
                        />
                        {currentError ? <Text accessibilityRole="alert">{currentError}</Text> : null}
                    </View>
                </CardContent>
                <Button onPress={handleSubmit} disabled={isSubmitting}>
                    <Text>{isSubmitting ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}</Text>
                </Button>
            </Card>
        </ScrollView>
    </KeyboardAvoidingView>

}