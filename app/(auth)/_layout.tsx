import { Stack, Redirect, router } from "expo-router";
import { useSession } from "@/services/Auth";
import { useEffect } from "react";

export default function AuthLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/(app)/(tabs)");
    }
  }, [session, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
