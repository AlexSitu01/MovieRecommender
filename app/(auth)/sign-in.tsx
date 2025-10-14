import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router';
import { useSession } from '@/services/Auth';

const SignIn = () => {
  const { signIn, session } = useSession();

  if (session) {
    return (
      <Redirect href="/(app)/(tabs)" />
    )
  }
return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text
      onPress={() => {
        signIn("situalex123@gmail.com", "123456");
        // Navigate after signing in. You may want to tweak this to ensure sign-in is successful before navigating.
        router.push('/(app)/(tabs)');
      }}>
      Sign In
    </Text>
  </View>
)
}

export default SignIn