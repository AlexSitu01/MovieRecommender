import { Redirect, Slot, SplashScreen, Stack } from "expo-router";
import "./global.css";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
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
        <Slot/>
      </WatchHistoryProvider>
    </SessionProvider>
  )
}

