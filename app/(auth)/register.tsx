import { View, Text, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router';
import { useSession } from '@/services/Auth';
import { isAuthApiError } from '@supabase/supabase-js';
import { updateUsername } from '@/services/supabase';

const Register = () => {
    const { signIn, session, signUp } = useSession();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    

    const handleSignUp = async () => {

        if (!email || !password || !confirmPassword) {
            setErrorMessage("All fields are required");
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long");
            return;
        }
        if (!email.includes('@')) {
            setErrorMessage("Invalid email address");
            return;
        }

        try {
            await signUp(email, password);
            router.replace('/sign-in');
        } catch (error) {
            if (isAuthApiError(error)) {
                if (error.message.includes("User already registered")) {
                    setErrorMessage("A User has already registered with this email");
                }
                else {
                    console.log("Uncaught Sign-up error:", error);
                }
            }
        }

    }


    return (
        <View className='bg-[#020212]' style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View className='flex flex-col justify-center items-center gap-y-4 w-full'>
                <TextInput
                    className='text-white border-2 border-white rounded-lg w-2/3 p-4'
                    placeholder='Email'
                    placeholderTextColor='#888888'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                    keyboardType='email-address'
                />
                <TextInput
                    className='text-white border-2 border-white rounded-lg w-2/3 p-4'
                    placeholder='Password'
                    placeholderTextColor='#888888'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    className='text-white border-2 border-white rounded-lg w-2/3 p-4'
                    placeholder='Confirm Password'
                    placeholderTextColor='#888888'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <TouchableOpacity className='mt-2' onPress={() => router.replace('/sign-in')}>
                    <Text className='text-blue-400'>Already have an account?</Text>
                </TouchableOpacity >

                <TouchableOpacity className='mt-2' onPress={handleSignUp}>
                    <Text className='text-xl border-4 border-blue-400 rounded-xl p-2 bg-blue-400'>
                        Sign Up
                    </Text>
                </TouchableOpacity>

                {errorMessage && <Text className='text-red-600'>{errorMessage}</Text>}
            </View>

            
            <TouchableOpacity
                className='my-20 absolute bottom-10'
                onPress={async () => {
                    try {
                        await signIn("situalex123@gmail.com", "123456");
                    } catch (error) {
                        console.error("Quick sign-in error:", error);
                    }
                }}
            >
                <Text className='text-white'>Quick Sign In (Demo)</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Register