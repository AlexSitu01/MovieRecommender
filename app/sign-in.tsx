import { View, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { useSession } from '@/services/Auth';

const SignIn = () => {
    const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          signIn("situalex123@gmail.com", "123456");
          // Navigate after signing in. You may want to tweak this to ensure sign-in is successful before navigating.
          router.push('/(tabs)/profile');
        }}>
        Sign In
      </Text>
    </View>
  )
}

export default SignIn