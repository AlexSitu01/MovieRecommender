import { View, Text, AppState, StyleSheet, Alert } from 'react-native'
import React, { Children, createContext, PropsWithChildren, use } from 'react'
import { supabase } from '@/services/supabase'
import { useStorageState } from '@/services/useStorageState'


AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

const AuthContext = createContext<{
    signIn: (email: string, password: string) => void;
    signUp: (email: string, password: string) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
}>({
    signIn: () => null,
    signUp: () => null,
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
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
            setSession(JSON.stringify(data.session));
        }
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        setSession(null)
        if (error) throw error;
    }

    const signUp = async (email: string, password: string) => {
        const {error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
    
        if (!session) Alert.alert('Please check your inbox for email verification!')
    }

    return (
        <AuthContext
            value={{
                signIn,
                signUp,
                signOut,
                session: sessionObj,
                isLoading
            }}
        >
            {children}
        </AuthContext>
    )
}


