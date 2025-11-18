import { View, Text, AppState, StyleSheet, Alert } from 'react-native'
import React, { Children, createContext, PropsWithChildren, use, useEffect } from 'react'
import { supabase } from '@/services/supabase'
import { useStorageState } from '@/services/useStorageState'
import { Session } from '@supabase/supabase-js'


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
    session?: Session | null;
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

     // Add token refresh effect
    useEffect(() => {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth event:', event);
                
                if (session) {
                    // Update session whenever it changes (including refresh)
                    setSession(JSON.stringify(session));
                } else if (event === 'SIGNED_OUT') {
                    setSession(null);
                }
            }
        );

        // Initial session check and refresh if needed
        const refreshSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
                console.error('Error getting session:', error);
                return;
            }

            if (session) {
                setSession(JSON.stringify(session));
            }
        };

        refreshSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

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


