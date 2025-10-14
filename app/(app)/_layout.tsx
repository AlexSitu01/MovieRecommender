import { Stack, Redirect } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSession } from "@/services/Auth";
import { NavigationContainer } from "@react-navigation/native";

export default function AppLayout() {
    const { session, isLoading } = useSession();

    if (isLoading) return null; // Let SplashScreenController handle loading

    if (!session) {
        // Only redirect once — not inside a persistent parent layout
        return <Redirect href="/sign-in" />;
    }

    return (
        <View className="flex-1">
            <StatusBar hidden={false} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="movies/[id]" />
                <Stack.Screen name="movies/rating"
                    options={{
                        presentation: 'transparentModal'
                    }} />
            </Stack>
        </View>


    );
}
