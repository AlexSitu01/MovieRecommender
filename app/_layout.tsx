import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionProvider, useSession } from "@/services/Auth";
import { SplashScreenController } from "@/services/splash";

export default function RootLayout() {
  return (
    <SessionProvider>
      <SplashScreenController />
      <RootNavigator />
    </SessionProvider>
  )
}

function RootNavigator() {
  const { session } = useSession()

  return (
    <SafeAreaView className="flex-1 bg-[#020212]">
      <StatusBar hidden={false} />

      <Stack>
        <Stack.Protected guard={!!session}>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="movies/[id]"
            options={{ headerShown: false }}
          />
        </Stack.Protected>
        <Stack.Protected guard ={!session}>
          <Stack.Screen
            name="sign-in"
            options={{headerShown: false}}
          />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  )
}