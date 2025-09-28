import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const supaBaseConfig = {
    supabaseUrl: 'https://zfzkxbblphcqsicpmedw.supabase.co',
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
}

export const getSupabase = () => {
    if (!supaBaseConfig.supabaseKey) {
        throw new Error('Supabase key is missing');
    }

    const supabase = createClient(
        supaBaseConfig.supabaseUrl,
        supaBaseConfig.supabaseKey,
        {
            auth: {
                storage: AsyncStorage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: false,
            },
        }
    );
    return supabase;
}

export const supabase = getSupabase();