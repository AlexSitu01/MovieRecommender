import { View, Text, Image, ImageBackground, Pressable, Platform } from 'react-native'
import { Redirect, router, Tabs } from 'expo-router'
import { images } from '@/constants/images'
import { icons } from '@/constants/icons'
import { forwardRef, useEffect, useState } from 'react'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import { PlatformPressable } from '@react-navigation/elements'
import * as Haptics from 'expo-haptics';
import { useSession } from '@/services/Auth'
import { getCurrentUser } from '@/services/supabase'




const TabIcon = ({ focused, icon, title }: any) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-row w-full flex-1 min-w-32 min-h-24 justify-center items-center rounded-full overflow-hidden">
                <Ionicons name={icon} color='white' size={20} ></Ionicons>
            </ImageBackground>)
    }
    else {
        return (
            <View className='flex flex-row w-full flex-1 min-w-32 min-h-24 justify-center items-center rounded-full overflow-hidden'>
                <Ionicons name={icon} color='white' size={20}></Ionicons>
            </View>
        )
    }
}

const HapticTab = (props: BottomTabBarButtonProps) => {
    return (
        <PlatformPressable
            {...props}
            onPressIn={(ev) => {
                if (process.env.EXPO_OS === 'ios') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                props.onPress?.(ev);
            }} />
    )
}


const _layout = () => {
    const { session } = useSession()
    const [userID, setUserID] = useState<string | null>(null)

    useEffect(() => {
        const loadUser = async () => {
            const user = await getCurrentUser();
            setUserID(user?.id || null);
        }
        if (session) {
            loadUser()
        }
        else{
            router.replace("/sign-in");
        }
    }, [session])

    return (
        <Tabs
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    flex: 1,
                    justifyContent: 'center',
                    paddingTop: 22.5,
                },
                tabBarStyle: Platform.select({
                    ios: {
                        backgroundColor: "#0F0D23",
                        borderRadius: 50,
                        marginHorizontal: 20,
                        marginBottom: 36,
                        position: "absolute",
                        overflow: "hidden",
                        borderWidth: 1,
                        borderColor: "#0F0D23",
                    },
                    default: {}
                }),
                animation: 'none',
                lazy: false,
                tabBarButton: HapticTab,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon='home'
                            title="Home"
                        />
                    ),

                }}
            />

            <Tabs.Screen
                name='search'
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon='search'
                            title="Search"></TabIcon>
                    )
                }} />
            <Tabs.Screen
                name='saved'
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon='bookmark'
                            title="Save"
                        />
                    )
                }} />

            <Tabs.Screen
                name='profile'
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon='person'
                            title='profile'></TabIcon>
                    )
                }} />
            <Tabs.Screen
                name='profiles/[id]'
                options={{
                    href: null, // Prevents it from showing in tab bar
                    headerShown: false,
                }}
            />

        </Tabs>
    )
}

export default _layout

