import { Stack, Redirect } from "expo-router";
import { useSession } from "@/services/Auth";

export default function AuthLayout() {
  const { session, isLoading } = useSession();

  if (isLoading) return null;

  if (session) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
