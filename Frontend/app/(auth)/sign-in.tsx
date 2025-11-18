import { View, Text, TextInput, TouchableOpacity, Touchable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { router } from 'expo-router';
import { useSession } from '@/services/Auth';
import { AuthError, isAuthApiError } from '@supabase/supabase-js';

const SignIn = () => {
  const { signIn, session } = useSession();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("All fields are required");
      return;
    }
    if (!email.includes('@')) {
      setErrorMessage("Invalid email address");
      return;
    }

    try {
      await signIn(email, password);
      // Navigation will happen automatically via useEffect
    } catch (error) {
      console.log("Sign-in error:", error);
      if (isAuthApiError(error)) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Invalid email or password");
        }
        if (error.message.includes("Email not confirmed")) {
          setErrorMessage("Email not confirmed. Please check your inbox.");
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
        <TouchableOpacity className='mt-2' onPress={() => router.replace('/register')}>
          <Text className='text-blue-400'>Don't have an account?</Text>
        </TouchableOpacity >

        <TouchableOpacity className='mt-2' onPress={handleLogin}>
          <Text className='text-xl border-4 border-blue-400 rounded-xl p-2 bg-blue-400'>
            Log in
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

export default SignIn