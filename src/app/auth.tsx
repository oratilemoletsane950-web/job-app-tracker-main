import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/services/auth-context";
import { useRouter } from "expo-router";
import { Button } from "expo-router/react-navigation";
import React from "react";
import { useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";

export interface AuthScreenProps {
    mode: 'signIn' | 'signUp';
}


export const AuthScreen : React.FC<AuthScreenProps> = ({ mode }: AuthScreenProps) => {
    const router = useRouter();
    const [signIn, signUp] = useAuth();
    const [isSignUp, setIsSignUp] = useState(mode === "signUp");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return <KeyboardAvoidingView>
        <ScrollView>
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
                        />
                        <Text>Password</Text>
                        <Input
                            placeholder="••••••••"
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                </CardContent>
                <Button>
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>
            </Card>
        </ScrollView>
    </KeyboardAvoidingView>
}