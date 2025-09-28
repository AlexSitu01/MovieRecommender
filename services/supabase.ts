import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native';

export const supaBaseConfig = {
    supabaseUrl: 'https://zfzkxbblphcqsicpmedw.supabase.co',
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
}

export const getSupabase = () => {
    if (!supaBaseConfig.supabaseKey) {
        throw new Error('Supabase key is missing');
    }
    const storage =
        Platform.OS === 'web'
            ? (typeof window !== 'undefined' ? window.localStorage : undefined)
            : AsyncStorage

    const supabase = createClient(
        supaBaseConfig.supabaseUrl,
        supaBaseConfig.supabaseKey,
        {
            auth: {
                storage: storage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: Platform.OS === 'web',
            },
        }
    );
    return supabase;
}

export const supabase = getSupabase();