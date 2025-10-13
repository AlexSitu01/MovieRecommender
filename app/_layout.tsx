import { SplashScreen, Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SessionProvider, useSession } from "@/services/Auth";
import { SplashScreenController } from "@/services/splash";
import React from "react";
import { WatchHistoryContext, WatchHistoryProvider } from "@/services/useWatchHistory";

export default function RootLayout() {
  return (
    <SessionProvider>
      <WatchHistoryProvider>
        <SplashScreenController />
        <RootNavigator />
      </WatchHistoryProvider>
    </SessionProvider>
  )
}

function RootNavigator() {
  const { session } = useSession()

  return (
    <View className="flex-1">
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
        <Stack.Protected guard={!session}>
          <Stack.Screen
            name="sign-in"
            options={{ headerShown: false }}
          />
        </Stack.Protected>
      </Stack>
    </View>
  )
}