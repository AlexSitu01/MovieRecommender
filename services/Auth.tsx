import { View, Text, AppState, StyleSheet } from 'react-native'
import React, { Children, createContext, PropsWithChildren, use } from 'react'
import { supabase } from '@/services/supabase'
import { Button, Input } from '@rneui/themed'
import { useStorageState } from '@/services/useStorageState'


AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

const AuthContext = createContext<{
    signIn: (email:string, password:string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false
})

export function useSession() {
    const value = use(AuthContext)
    if (!value) {
        throw new Error("useSession mus be wrapped in a <SessionProvider>")
    }
    return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
    const [[isLoading, session], setSession] = useStorageState('session');

    const sessionObj = session ? JSON.parse(session) : null;

    const signIn = async (email: string, password: string) => {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});
        if (error) throw error;
        if (data.session){
            setSession(JSON.stringify(data.session));
        }
    }

    const signOut = async () => {
        await supabase.auth.signOut();
        setSession(null)
    }


    return (
        <AuthContext
            value={{
                signIn,
                signOut,
                session: sessionObj,
                isLoading
            }}
        >
            {children}
        </AuthContext>
    )
}


